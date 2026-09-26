const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  createNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getUserNotifications);
router.put('/mark-all-read', markAllAsRead);
router.put('/:id/read', markAsRead);
router.post('/', createNotification);

module.exports = router;
