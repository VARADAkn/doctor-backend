const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller.js');

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
};

router.post('/send', isAuthenticated, chatController.sendMessage);
router.get('/conversation/:userId', isAuthenticated, chatController.getConversation);
router.get('/recent', isAuthenticated, chatController.getRecentChats);
router.get('/users', isAuthenticated, chatController.searchUsers);

// New Routes
router.get('/unread-count', isAuthenticated, chatController.getUnreadCount);
router.put('/read', isAuthenticated, chatController.markMessagesAsRead);

module.exports = router;
