const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentcontroller');

router.post('/patient-appointments', appointmentController.getPatientAppointments);
router.post('/create', appointmentController.createAppointment);
router.post('/update-status', appointmentController.updateAppointmentStatus);
router.post('/available-slots', appointmentController.getAvailableSlots);
router.post('/available-doctors', appointmentController.getAvailableDoctors);
router.post('/doctor-appointments', appointmentController.getDoctorAppointments);
router.post('/all', appointmentController.getAllAppointments);

// Doctor actions on appointments
router.put('/confirm/:id', appointmentController.confirmAppointment);
router.put('/cancel/:id', appointmentController.cancelAppointment);
router.put('/reschedule/:id', appointmentController.rescheduleAppointment);

module.exports = router;
