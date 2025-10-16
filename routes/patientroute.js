const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientcontroller');


router.post('/create', patientController.createPatient);
router.post('/update', patientController.updatePatient);
router.post('/get', patientController.getPatients);
router.post('/find', patientController.getPatient);
router.post('/delete', patientController.deletePatient);

// New Search Route
router.post('/search', patientController.searchPatients);

module.exports = router;

