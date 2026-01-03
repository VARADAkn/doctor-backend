// routes/medicalrecordroute.js
const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalcontroller');


//const globalAudit = require('../middlewares/globalAudit');

//router.use(globalAudit('MEDICAL_RECORD'));

router.post('/create', medicalRecordController.createMedicalRecord);
router.post('/patient-records', medicalRecordController.getPatientMedicalRecords);
router.post('/update', medicalRecordController.updateMedicalRecord);
router.post('/delete', medicalRecordController.deleteMedicalRecord);

module.exports = router;