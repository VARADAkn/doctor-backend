const express = require('express');
const router = express.Router();

const workspaceController = require('../controllers/workspacecontroller');
const patientController = require('../controllers/patientcontroller');

router.post('/workspaces/create', workspaceController.createWorkSpace);
router.post('/workspaces/update', workspaceController.updateWorkSpace);
router.post('/workspaces/get', workspaceController.getWorkSpaces);   
router.post('/workspaces/find', workspaceController.getWorkSpace);   
router.post('/workspaces/delete', workspaceController.deleteWorkSpace);

router.post('/patients/create', patientController.createPatient);
router.post('/patients/update', patientController.updatePatient);
router.post('/patients/get', patientController.getPatients);   
router.post('/patients/find', patientController.getPatient);   
router.post('/patients/delete', patientController.deletePatient);

module.exports = router;
