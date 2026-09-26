const express = require('express');
const router = express.Router();
const {
  getStudents,
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getAdminStats,
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserStatus
} = require('../controllers/adminController');
const { getAdminAttendanceStats } = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);

router.get('/students', getStudents);
router.get('/stats', getAdminStats);
router.get('/attendance/stats', getAdminAttendanceStats);

// User Management (Students & Faculty)
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.put('/users/:id/status', toggleUserStatus);

// Faculty Management
router.route('/faculty')
  .get(getFaculty)
  .post(createFaculty);

router.route('/faculty/:id')
  .get(getFacultyById)
  .put(updateFaculty)
  .delete(deleteFaculty);

module.exports = router;
