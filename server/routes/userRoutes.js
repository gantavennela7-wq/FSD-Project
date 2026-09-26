const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, updatePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/update-password', protect, updatePassword);
router.put('/update-password', protect, updatePassword);

module.exports = router;
