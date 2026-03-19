const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientcontroller');
//const globalAudit = require('../middlewares/globalAudit');

//router.use(globalAudit('PATIENT'));

router.post('/create', patientController.createPatient);
router.post('/update', patientController.updatePatient);
router.post('/get', patientController.getPatients);
router.post('/find', patientController.getPatient);
router.post('/delete', patientController.deletePatient);

// New Search Route
router.post('/search', patientController.searchPatients);
router.post('/assign-ward', patientController.assignPatientToWard);
router.post('/my-doctors', patientController.getMyDoctors);
router.post('/profile', patientController.getPatientProfile);


module.exports = router;

