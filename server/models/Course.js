const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  moduleName: {
    type: String,
    default: 'Module 1: Fundamentals'
  },
  content: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: '15 mins'
  },
  order: {
    type: Number,
    default: 1
  }
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true
    },
    shortDescription: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Course description is required']
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    instructorName: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    duration: {
      type: String,
      required: [true, 'Duration is required']
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
    },
    prerequisites: {
      type: String,
      default: ''
    },
    learningObjectives: {
      type: String,
      default: ''
    },
    skills: [
      {
        type: String
      }
    ],
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    lessons: [lessonSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Course', courseSchema);
