const express = require('express');
const { sendMessage, getMessages, getChatThreads } = require('../controllers/messages');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/threads', getChatThreads);
router.get('/:itemId/:otherUserId', getMessages);

module.exports = router;
