const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
  k: { type: String, required: true },
  v: { type: mongoose.Schema.Types.Mixed, required: true }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  question_text: { type: String, required: true },
  subject: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  type: { type: String, enum: ['MCQ', 'Coding', 'True/False', 'Descriptive'], required: true },
  attributes: [attributeSchema] // Attribute Pattern
});

module.exports = mongoose.model('Question', questionSchema);
