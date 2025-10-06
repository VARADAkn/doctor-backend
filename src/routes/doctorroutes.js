const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorcontroller');


router.post('/create', doctorController.createDoctor);
router.post('/update', doctorController.updateDoctor);
router.post('/get', doctorController.getDoctors);
router.post('/find', doctorController.getDoctor);
router.post('/delete', doctorController.deleteDoctor);

module.exports = router;
