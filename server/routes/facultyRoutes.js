const express = require('express');
const router = express.Router();
const {
  getFacultyProfile,
  updateFacultyProfile,
  getFacultyDashboard,
  getFacultyCourses,
  createFacultyCourse,
  getFacultyCourseById,
  updateFacultyCourse,
  deleteFacultyCourse,
  getFacultyStudents,
  getFacultyCourseStudents,
  getFacultyCourseProgress,
  addFacultyLesson,
  updateFacultyLesson,
  deleteFacultyLesson
} = require('../controllers/facultyController');
const { getFacultyCourseAttendance } = require('../controllers/attendanceController');
const { protect, faculty } = require('../middleware/auth');

// All faculty routes are protected with JWT & Faculty role check
router.use(protect, faculty);

// Faculty Profile
router.route('/profile')
  .get(getFacultyProfile)
  .put(updateFacultyProfile);

// Faculty Dashboard Stats
router.get('/dashboard', getFacultyDashboard);

// Faculty Courses
router.route('/courses')
  .get(getFacultyCourses)
  .post(createFacultyCourse);

router.route('/courses/:id')
  .get(getFacultyCourseById)
  .put(updateFacultyCourse)
  .delete(deleteFacultyCourse);

// Faculty Lessons
router.post('/courses/:id/lessons', addFacultyLesson);
router.route('/courses/:id/lessons/:lessonId')
  .put(updateFacultyLesson)
  .delete(deleteFacultyLesson);

// Faculty Students
router.get('/students', getFacultyStudents);
router.get('/courses/:courseId/students', getFacultyCourseStudents);
router.get('/courses/:courseId/progress', getFacultyCourseProgress);
router.get('/courses/:courseId/attendance', getFacultyCourseAttendance);

module.exports = router;
