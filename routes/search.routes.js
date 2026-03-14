const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

// Middleware to check if user is authenticated (using session)
const authenticateUser = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    next();
};

// GET /api/search?query=...
router.get('/search', authenticateUser, searchController.searchMedicalTerm);

module.exports = router;
