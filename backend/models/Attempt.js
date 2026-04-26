const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  answer: { type: String },
  is_correct: { type: Boolean, default: false }
}, { _id: false });

const attemptSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [answerSchema],
  score: { type: Number, default: 0 },
  time_taken: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);
