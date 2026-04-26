const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/quiz', require('./routes/quizRoutes'));

// Serve frontend HTML files
app.get('/quiz', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/quiz.html'));
});
app.get('/quiz.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/quiz.html'));
});
app.get('/results.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/results.html'));
});
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quiz_platform';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err.message));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
