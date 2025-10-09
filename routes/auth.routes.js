const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authSession = require('../middlewares/authSession');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);



router.put('/disable/:id', authSession, authController.disableUser);

module.exports = router;
