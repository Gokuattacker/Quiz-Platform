const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/quizController');

router.get('/', ctrl.getQuizzes);
router.get('/results/:attemptId', ctrl.getResults);  // Must be before /:id
router.get('/:id', ctrl.getQuiz);
router.post('/:id/start', ctrl.startQuiz);
router.post('/:id/answer', ctrl.submitAnswer);
router.get('/:id/leaderboard', ctrl.getLeaderboard);
router.post('/:id/submit', ctrl.submitQuiz);

module.exports = router;
