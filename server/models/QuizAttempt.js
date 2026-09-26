const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    score: {
      type: Number,
      required: true,
      default: 0
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 0
    },
    percentage: {
      type: Number,
      required: true,
      default: 0
    },
    passed: {
      type: Boolean,
      default: false
    },
    answers: [
      {
        questionIndex: Number,
        questionText: String,
        selectedOption: Number,
        correctOption: Number,
        isCorrect: Boolean,
        explanation: String
      }
    ],
    attemptedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

quizAttemptSchema.index({ student: 1, course: 1, attemptedAt: -1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
