const mongoose = require('mongoose');

const learningAttendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: String, // Format: YYYY-MM-DD (e.g. 2026-09-25)
      required: true,
      index: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    lessonId: {
      type: String,
      default: ''
    },
    activityType: {
      type: String,
      enum: ['lesson_started', 'lesson_completed', 'quiz_completed', 'course_activity'],
      default: 'lesson_started'
    },
    duration: {
      type: Number,
      default: 15 // Estimated minutes spent learning
    }
  },
  {
    timestamps: true
  }
);

// Guarantee only one attendance record per student per calendar day
learningAttendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('LearningAttendance', learningAttendanceSchema);
