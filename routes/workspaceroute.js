const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspacecontroller');

// Defines routes for /workspaces

router.post('/create', workspaceController.createWorkSpace);
router.post('/update', workspaceController.updateWorkSpace);
router.post('/get', workspaceController.getWorkSpaces);
router.post('/find', workspaceController.getWorkSpace);
router.post('/delete', workspaceController.deleteWorkSpace);


module.exports = router;
