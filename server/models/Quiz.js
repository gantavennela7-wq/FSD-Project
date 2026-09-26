const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: [
    {
      type: String,
      required: true,
      trim: true
    }
  ],
  correctAnswer: {
    type: Number, // 0-based index of the correct option
    required: [true, 'Correct answer option index is required'],
    min: 0
  },
  explanation: {
    type: String,
    default: ''
  }
});

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true
    },
    description: {
      type: String,
      default: 'Test your understanding of core concepts and principles from this course.'
    },
    passingPercentage: {
      type: Number,
      default: 70,
      min: 0,
      max: 100
    },
    questions: [questionSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Quiz', quizSchema);
