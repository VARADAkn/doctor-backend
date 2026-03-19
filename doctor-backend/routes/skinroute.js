const express = require('express');
const router = express.Router();
const controller = require('../controllers/skincontroller');

router.get('/library', controller.getLibrary);
router.post('/search', controller.search);

module.exports = router;
