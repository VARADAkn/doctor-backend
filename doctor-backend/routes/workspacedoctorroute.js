const express = require('express');
const router = express.Router();
const controller = require('../controllers/workspaceDoctorController');

router.post('/assign', controller.assignDoctorToWard);
router.post('/unassign', controller.unassignDoctorFromWard);

module.exports = router;
