const Notification = require('../models/Notification');
const Enrollment = require('../models/Enrollment');

// @desc    Get logged in user's notifications
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = async (req, res, next) => {
  try {
    let notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    // If no notifications exist yet, generate initial contextual notifications
    if (notifications.length === 0) {
      const enrollments = await Enrollment.find({ student: req.user._id }).populate('course', 'title');
      
      const seedNotifs = [
        {
          user: req.user._id,
          title: 'Welcome to EduVibe',
          message: 'Welcome to EduVibe LMS! Explore industry-aligned courses and start your learning journey.',
          type: 'system',
          isRead: false,
          link: '/courses'
        },
        {
          user: req.user._id,
          title: 'New Quiz Available',
          message: 'New interactive MCQs and course assessment quizzes have been added to your enrolled courses.',
          type: 'quiz',
          isRead: false,
          link: enrollments.length > 0 ? `/student/course/${enrollments[0].course?._id || enrollments[0]._id}` : '/courses'
        }
      ];

      if (enrollments.length > 0) {
        seedNotifs.push({
          user: req.user._id,
          title: 'Course Enrollment',
          message: `You are enrolled in ${enrollments[0].course?.title || 'your course'}. Complete all modules to earn your verified certificate.`,
          type: 'course',
          isRead: false,
          link: `/student/course/${enrollments[0].course?._id || enrollments[0]._id}`
        });
      }

      await Notification.insertMany(seedNotifs);
      notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    }

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false
    });

    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }

    notification.isRead = true;
    await notification.save();

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false
    });

    res.json({
      notification,
      unreadCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    res.json({
      notifications,
      unreadCount: 0,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a custom notification
// @route   POST /api/notifications
// @access  Private
const createNotification = async (req, res, next) => {
  try {
    const { userId, title, message, type, link } = req.body;

    const targetUser = userId || req.user._id;

    const notification = await Notification.create({
      user: targetUser,
      title: title || 'Notification',
      message,
      type: type || 'system',
      link: link || ''
    });

    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  createNotification
};
