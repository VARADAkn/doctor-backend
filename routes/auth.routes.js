const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authSession = require('../middlewares/authSession');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);



router.put('/disable/:id', authSession.isAdmin, authController.disableUser);

// Add session check endpoint
router.get('/check-session', (req, res) => {
    if (req.session.userId) {
        res.json({
            success: true,
            message: 'Session is valid',
            user: { id: req.session.userId }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'No valid session'
        });
    }
});

module.exports = router;

