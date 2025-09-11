const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// 👇 disable user goes through the controller (not directly here)
router.put('/disable/:id', authController.disableUser);

module.exports = router;
