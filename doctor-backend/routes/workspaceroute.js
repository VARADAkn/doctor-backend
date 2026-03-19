const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspacecontroller');
//const globalAudit = require('../middlewares/globalAudit');

//router.use(globalAudit('WARD'));

// Defines routes for /workspaces
router.post('/create', workspaceController.createWorkSpace);
router.post('/update', workspaceController.updateWorkSpace);
router.post('/get', workspaceController.getWorkSpaces);
router.post('/find', workspaceController.getWorkSpace);
router.post('/delete', workspaceController.deleteWorkSpace);
router.get('/:id/details', workspaceController.getWorkSpaceDetails);


module.exports = router;