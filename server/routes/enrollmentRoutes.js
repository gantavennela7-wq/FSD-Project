const express = require('express');
const router = express.Router();
const {
  createEnrollment,
  getMyEnrollments,
  getEnrollmentById,
  updateProgress
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createEnrollment);
router.get('/my', protect, getMyEnrollments);
router.get('/:id', protect, getEnrollmentById);
router.put('/:id/progress', protect, updateProgress);

module.exports = router;
