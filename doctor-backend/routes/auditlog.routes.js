const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditlog.controller');

// Middleware to ensure the user is an admin
const isAdmin = (req, res, next) => {
    const role = req.session?.user?.role || req.user?.role;
    if (role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: "Access denied. Admin only." });
};

// All audit log routes are admin-only
router.use(isAdmin);

router.get('/', auditLogController.getLogs);
router.get('/user/:userId', auditLogController.getUserLogs);

module.exports = router;
