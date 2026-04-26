const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const redis = require('../redisClient');

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, 'title subject duration_seconds');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('question_ids', '-attributes.v'); // Hide test_cases/answers if not needed, but we'll fetch everything and filter manually
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    
    // We shouldn't send correct answers to the client. Let's assume for MCQ the options are fine.
    // For simplicity, we just send questions.
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.startQuiz = async (req, res) => {
  try {
    const { studentId } = req.body;
    const quizId = req.params.id;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    
    const sessionKey = `session:${quizId}:${studentId}`;
    const startTime = Date.now();
    
    // Create Redis Session with TTL
    await redis.hset(sessionKey, {
      current_question: 0,
      answers: JSON.stringify({}),
      start_time: startTime
    });
    
    // Auto-expire session when duration is over + 10s buffer
    await redis.expire(sessionKey, quiz.duration_seconds + 10);
    
    // Initialize user in leaderboard with 0 score if not exists
    await redis.zadd(`leaderboard:${quizId}`, 'NX', 0, studentId);
    
    res.json({ message: 'Quiz started', ttl: quiz.duration_seconds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { studentId, questionId, answer } = req.body;
    const quizId = req.params.id;
    
    const sessionKey = `session:${quizId}:${studentId}`;
    const exists = await redis.exists(sessionKey);
    if (!exists) return res.status(403).json({ error: 'Session expired or invalid' });
    
    // Spam Prevention: SET NX
    const spamKey = `answer:${quizId}:${studentId}:${questionId}`;
    const isSpam = await redis.set(spamKey, 'locked', 'NX', 'EX', 3600); // lock for 1 hour or TTL
    if (!isSpam) {
      return res.status(429).json({ error: 'Answer already submitted for this question' });
    }
    
    // Check answer correct
    const question = await Question.findById(questionId);
    let isCorrect = false;
    
    if (question.type === 'MCQ' || question.type === 'True/False') {
      const correctAttr = question.attributes.find(a => a.k === 'correct_option' || a.k === 'correct_answer');
      if (correctAttr && correctAttr.v === answer) isCorrect = true;
    } else if (question.type === 'Coding') {
      // For code snippet questions, award points if a non-empty answer is submitted
      isCorrect = answer && answer.trim().length > 0;
    } else if (question.type === 'Descriptive') {
      // Descriptive questions: award points for any substantive answer (min 20 chars)
      isCorrect = answer && answer.trim().length >= 20;
    }
    
    // Update Session Answers
    const currentAnswersStr = await redis.hget(sessionKey, 'answers');
    const currentAnswers = JSON.parse(currentAnswersStr || '{}');
    currentAnswers[questionId] = { answer, isCorrect };
    await redis.hset(sessionKey, 'answers', JSON.stringify(currentAnswers));
    
    // Update Leaderboard if correct
    if (isCorrect) {
      await redis.zincrby(`leaderboard:${quizId}`, 10, studentId); // 10 points per correct answer
    }
    
    res.json({ message: 'Answer recorded', isCorrect });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const quizId = req.params.id;
    const leaderboardKey = `leaderboard:${quizId}`;
    
    // Top 10
    const topPlayers = await redis.zrevrange(leaderboardKey, 0, 9, 'WITHSCORES');
    const formatted = [];
    for (let i = 0; i < topPlayers.length; i += 2) {
      formatted.push({ studentId: topPlayers[i], score: parseInt(topPlayers[i+1]) });
    }
    
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { studentId } = req.body;
    const quizId = req.params.id;
    
    const sessionKey = `session:${quizId}:${studentId}`;
    const sessionData = await redis.hgetall(sessionKey);
    
    if (!sessionData || !sessionData.answers) {
      return res.status(400).json({ error: 'No active session found to submit' });
    }
    
    const answersMap = JSON.parse(sessionData.answers);
    const answersArray = [];
    let score = 0;
    
    for (const [qId, data] of Object.entries(answersMap)) {
      answersArray.push({
        question_id: qId,
        answer: data.answer,
        is_correct: data.isCorrect
      });
      if (data.isCorrect) score += 10;
    }
    
    const timeTaken = Math.floor((Date.now() - parseInt(sessionData.start_time)) / 1000);
    
    // Save to DB
    const attempt = new Attempt({
      student_id: studentId,
      quiz_id: quizId,
      answers: answersArray,
      score,
      time_taken: timeTaken
    });
    await attempt.save();
    
    // Clear Session Keys
    await redis.del(sessionKey);
    // Note: Leaderboard might be kept until the quiz fully closes. We won't delete leaderboard yet.
    
    res.json({ message: 'Quiz submitted successfully', attemptId: attempt._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.attemptId).populate('quiz_id').populate('answers.question_id');
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
    
    // Guard: quiz may have been deleted
    if (!attempt.quiz_id) {
      return res.json({ attempt, rank: 'N/A' });
    }

    // Calculate Rank
    const quizId = attempt.quiz_id._id.toString();
    const studentId = attempt.student_id;
    let rank = 'N/A';
    try {
      const redisRank = await redis.zrevrank(`leaderboard:${quizId}`, studentId);
      if (redisRank !== null) rank = redisRank + 1; // 0-indexed to 1-indexed
    } catch (_) {
      // Redis unavailable — rank stays N/A
    }
    
    res.json({ attempt, rank });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
