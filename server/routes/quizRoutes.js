const express = require('express');
const router = express.Router();
const {
  getQuizByCourseId,
  submitQuizAttempt,
  getQuizAttempts,
  getMyQuizPerformance
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.get('/my-performance', protect, getMyQuizPerformance);
router.get('/course/:courseId', protect, getQuizByCourseId);
router.post('/course/:courseId/submit', protect, submitQuizAttempt);
router.get('/course/:courseId/attempts', protect, getQuizAttempts);

module.exports = router;
