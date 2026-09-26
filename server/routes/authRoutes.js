const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/update-password', protect, updatePassword);
router.put('/update-password', protect, updatePassword);

module.exports = router;
