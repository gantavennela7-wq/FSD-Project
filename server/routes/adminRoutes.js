const express = require('express');
const router = express.Router();
const {
  getStudents,
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getAdminStats
} = require('../controllers/adminController');
const { getAdminAttendanceStats } = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);

router.get('/students', getStudents);
router.get('/stats', getAdminStats);
router.get('/attendance/stats', getAdminAttendanceStats);

// Faculty Management
router.route('/faculty')
  .get(getFaculty)
  .post(createFaculty);

router.route('/faculty/:id')
  .get(getFacultyById)
  .put(updateFaculty)
  .delete(deleteFaculty);

module.exports = router;
