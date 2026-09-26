const express = require('express');
const router = express.Router();
const { chatWithAI, askAIAssistant } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, chatWithAI);
router.post('/ask', protect, askAIAssistant);

module.exports = router;
