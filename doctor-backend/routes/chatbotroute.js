const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotcontroller');

router.post('/consult', chatbotController.chat);

module.exports = router;
