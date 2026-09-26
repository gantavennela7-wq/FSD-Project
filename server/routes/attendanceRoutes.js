const express = require('express');
const router = express.Router();
const {
  recordActivity,
  getMyAttendanceStats,
  getStreak,
  getCalendar,
  getFacultyCourseAttendance,
  getAdminAttendanceStats
} = require('../controllers/attendanceController');
const { protect, faculty, admin, adminOrFaculty } = require('../middleware/auth');

// Student attendance routes
router.post('/activity', protect, recordActivity);
router.get('/me', protect, getMyAttendanceStats);
router.get('/streak', protect, getStreak);
router.get('/calendar', protect, getCalendar);

// Faculty & Admin attendance routes
router.get('/faculty/courses/:courseId', protect, adminOrFaculty, getFacultyCourseAttendance);
router.get('/admin/stats', protect, admin, getAdminAttendanceStats);

module.exports = router;
