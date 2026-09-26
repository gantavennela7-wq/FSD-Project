const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      default: 'Notification'
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['quiz', 'course', 'system', 'announcement', 'achievement', 'enrollment'],
      default: 'system'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    link: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
