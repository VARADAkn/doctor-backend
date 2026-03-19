const db = require("../models");
const { Appointment, Patient, Doctor, User } = db;
const { Op } = require('sequelize');
const { logActivity } = require("../utils/auditLogger");

/**
 * Get all appointments for a patient
 */
exports.getPatientAppointments = async (req, res) => {
    try {
        let { patientId } = req.body;
        console.log('Fetching appointments for patientId:', patientId);

        if (!patientId) {
            return res.status(400).json({ error: "patientId is required" });
        }

        // Robustness: If the ID provided is actually a User ID, find the corresponding Patient ID
        const patientByUserId = await Patient.findOne({ where: { userId: patientId } });
        if (patientByUserId) {
            console.log(`Found patient ${patientByUserId.id} for userId ${patientId}`);
            patientId = patientByUserId.id;
        }

        const appointments = await Appointment.findAll({
            where: { patientId },
            include: [
                {
                    model: Doctor,
                    as: 'Doctor',
                    include: [{
                        model: User,
                        as: 'User',
                        attributes: ['email', 'phone']
                    }]
                }
            ],
            order: [['appointmentDate', 'DESC'], ['appointmentTime', 'DESC']]
        });

        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};

/**
 * Create a new appointment
 */
exports.createAppointment = async (req, res) => {
    try {
        let { patientId, doctorId, workSpaceId, appointmentDate, appointmentTime, type, reason } = req.body;

        if (!patientId || !doctorId || !appointmentDate || !appointmentTime) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Robustness: Resolve Patient ID if User ID was sent
        // Robustness: Resolve Patient ID if User ID was sent
        const patientByUserId = await Patient.findOne({ where: { userId: patientId } });
        if (patientByUserId) {
            console.log(`Resolved patientId ${patientByUserId.id} from userId ${patientId} (createAppointment)`);
            patientId = patientByUserId.id;
            // Ensure workspace matches patient if not explicitly provided
            if (!workSpaceId) workSpaceId = patientByUserId.workSpaceId;
        } else {
            // If resolution failed, check if patientId is already a valid Patient ID
            const validPatient = await Patient.findByPk(patientId);
            if (!validPatient) {
                console.error(`Invalid Patient ID: ${patientId}`);
                return res.status(400).json({
                    error: "Patient profile not found. Please ensure your profile is set up or try logging out and back in."
                });
            }
        }

        // Check if slot is available
        const existingAppointment = await Appointment.findOne({
            where: {
                doctorId,
                appointmentDate,
                appointmentTime,
                status: { [Op.ne]: 'cancelled' }
            }
        });

        if (existingAppointment) {
            return res.status(400).json({ error: "This time slot is already booked" });
        }

        const appointment = await Appointment.create({
            patientId,
            doctorId,
            workSpaceId: workSpaceId || null,
            appointmentDate,
            appointmentTime,
            type: type || 'routine',
            reason,
            status: 'pending'
        });

        res.status(201).json(appointment);

        // LOG ACTIVITY
        await logActivity(req, {
            action: 'CREATE_APPOINTMENT',
            entityType: 'APPOINTMENT',
            entityId: appointment.id,
            details: { doctorId, appointmentDate, appointmentTime, type }
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        // Provide more descriptive error if it's a validation error
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(500).json({ error: 'Failed to create appointment: ' + error.message });
    }
};

/**
 * Update appointment status
 */
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!id || !status) {
            return res.status(400).json({ error: "id and status are required" });
        }

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        appointment.status = status;
        await appointment.save();

        res.json({ message: 'Appointment status updated', appointment });

        // LOG ACTIVITY
        await logActivity(req, {
            action: 'UPDATE_APPOINTMENT_STATUS',
            entityType: 'APPOINTMENT',
            entityId: appointment.id,
            details: { newStatus: status }
        });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
};

/**
 * Get available time slots for a doctor on a specific date
 */
exports.getAvailableSlots = async (req, res) => {
    try {
        const { doctorId, date } = req.body;

        if (!doctorId || !date) {
            return res.status(400).json({ error: "doctorId and date are required" });
        }

        // Get all booked appointments for this doctor on this date
        const bookedAppointments = await Appointment.findAll({
            where: {
                doctorId,
                appointmentDate: date,
                status: { [Op.ne]: 'cancelled' }
            },
            attributes: ['appointmentTime']
        });

        const bookedTimes = bookedAppointments.map(apt => apt.appointmentTime);

        // Generate available slots (9 AM to 5 PM, 30-minute intervals)
        const allSlots = [];
        for (let hour = 9; hour < 17; hour++) {
            for (let minute of [0, 30]) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
                if (!bookedTimes.includes(time)) {
                    allSlots.push(time);
                }
            }
        }

        res.json({ availableSlots: allSlots });
    } catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).json({ error: 'Failed to fetch available slots' });
    }
};

/**
 * Get doctors available for appointments (from patient's workspace)
 */
exports.getAvailableDoctors = async (req, res) => {
    try {
        let { patientId } = req.body;
        console.log('Fetching available doctors for patientId:', patientId);

        if (!patientId) {
            return res.status(400).json({ error: "patientId is required" });
        }

        // Robustness: If the ID provided is actually a User ID, find the corresponding Patient ID
        const patientByUserId = await Patient.findOne({ where: { userId: patientId } });
        if (patientByUserId) {
            console.log(`Resolved patientId ${patientByUserId.id} from userId ${patientId}`);
            patientId = patientByUserId.id;
        }

        // Find patient's workspace
        const patient = await Patient.findByPk(patientId);

        if (!patient) {
            console.log('Patient not found for ID:', patientId);
            return res.json([]);
        }

        console.log(`Patient ${patient.id} is in workspace: ${patient.workSpaceId}`);

        if (!patient.workSpaceId) {
            console.log('Patient has no workspace assigned.');
            return res.json([]);
        }

        // Find doctors in the same workspace
        const workspaceDocs = await db.WorkspaceDoctor.findAll({
            where: { workSpaceId: patient.workSpaceId },
            include: [{
                model: Doctor,
                as: 'Doctor',
                include: [{
                    model: User,
                    as: 'User',
                    attributes: ['email', 'phone']
                }]
            }]
        });

        const doctors = workspaceDocs.map(wd => ({
            id: wd.Doctor.id,
            name: wd.Doctor.name,
            specialization: wd.Doctor.specialization || 'General Practitioner',
            experience: wd.Doctor.yearOfExperience || 0
        }));

        res.json(doctors);
    } catch (error) {
        console.error('Error fetching available doctors:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
};

/**
 * Get all appointments for a doctor
 */
exports.getDoctorAppointments = async (req, res) => {
    try {
        let { doctorId } = req.body;
        console.log('Fetching appointments for doctorId:', doctorId);

        if (!doctorId) {
            return res.status(400).json({ error: "doctorId is required" });
        }

        // Robustness: If the ID provided is actually a User ID, find the corresponding Doctor ID
        const doctorByUserId = await Doctor.findOne({ where: { userId: doctorId } });
        if (doctorByUserId) {
            console.log(`Found doctor ${doctorByUserId.id} for userId ${doctorId}`);
            doctorId = doctorByUserId.id;
        }

        const appointments = await Appointment.findAll({
            where: { doctorId },
            include: [
                {
                    model: Patient,
                    as: 'Patient',
                    include: [{
                        model: User,
                        as: 'User',
                        attributes: ['email', 'phone']
                    }]
                }
            ],
            order: [['appointmentDate', 'DESC'], ['appointmentTime', 'DESC']]
        });

        res.json(appointments);
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        res.status(500).json({ error: 'Failed to fetch doctor appointments' });
    }
};

/**
 * Get all appointments (for admin)
 */
exports.getAllAppointments = async (req, res) => {
    try {
        const { Patient, Doctor, User, WorkSpace } = db;
        const appointments = await Appointment.findAll({
            include: [
                {
                    model: Patient,
                    as: 'Patient',
                    include: [{
                        model: User,
                        as: 'User',
                        attributes: ['email']
                    }]
                },
                {
                    model: Doctor,
                    as: 'Doctor',
                    include: [{
                        model: User,
                        as: 'User',
                        attributes: ['email']
                    }]
                },
                {
                    model: WorkSpace,
                    as: 'WorkSpace',
                    attributes: ['name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(appointments);
    } catch (error) {
        console.error('Error fetching all appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};

/**
 * Doctor confirms an appointment
 */
exports.confirmAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Appointment ID is required" });
        }

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Prevent confirming past appointments
        const appointmentDateTime = new Date(`${appointment.appointmentDate} ${appointment.appointmentTime}`);
        if (appointmentDateTime < new Date()) {
            return res.status(400).json({ error: 'Cannot confirm past appointments' });
        }

        appointment.status = 'confirmed';
        if (notes) {
            appointment.notes = notes;
        }
        await appointment.save();

        // Fetch updated appointment with relations
        const updatedAppointment = await Appointment.findByPk(id, {
            include: [
                {
                    model: Patient,
                    as: 'Patient',
                    include: [{
                        model: User,
                        as: 'User',
                        attributes: ['email', 'phone']
                    }]
                }
            ]
        });

        res.json({ message: 'Appointment confirmed successfully', appointment: updatedAppointment });

        // LOG ACTIVITY
        await logActivity(req, {
            action: 'CONFIRM_APPOINTMENT',
            entityType: 'APPOINTMENT',
            entityId: id,
            details: { notes }
        });
    } catch (error) {
        console.error('Error confirming appointment:', error);
        res.status(500).json({ error: 'Failed to confirm appointment' });
    }
};

/**
 * Doctor cancels an appointment
 */
exports.cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancellationReason } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Appointment ID is required" });
        }

        if (!cancellationReason || cancellationReason.trim() === '') {
            return res.status(400).json({ error: 'Cancellation reason is required' });
        }

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        appointment.status = 'cancelled';
        appointment.cancellationReason = cancellationReason;
        await appointment.save();

        // Fetch updated appointment with relations
        const updatedAppointment = await Appointment.findByPk(id, {
            include: [
                {
                    model: Patient,
                    as: 'Patient',
                    include: [{
                        model: User,
                        as: 'User',
                        attributes: ['email', 'phone']
                    }]
                }
            ]
        });

        res.json({ message: 'Appointment cancelled successfully', appointment: updatedAppointment });

        // LOG ACTIVITY
        await logActivity(req, {
            action: 'CANCEL_APPOINTMENT',
            entityType: 'APPOINTMENT',
            entityId: id,
            details: { reason: cancellationReason }
        });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
};

/**
 * Doctor reschedules an appointment
 */
exports.rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { newDate, newTime, rescheduleReason } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Appointment ID is required" });
        }

        if (!newDate || !newTime) {
            return res.status(400).json({ error: 'New date and time are required' });
        }

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Check if new slot is not in the past
        const newDateTime = new Date(`${newDate} ${newTime}`);
        if (newDateTime < new Date()) {
            return res.status(400).json({ error: 'Cannot reschedule to a past date/time' });
        }

        // Check if new slot is available
        const existingAppointment = await Appointment.findOne({
            where: {
                doctorId: appointment.doctorId,
                appointmentDate: newDate,
                appointmentTime: newTime,
                status: { [Op.ne]: 'cancelled' },
                id: { [Op.ne]: id } // Exclude current appointment
            }
        });

        if (existingAppointment) {
            return res.status(400).json({ error: "The new time slot is already booked" });
        }

        // Store original date/time if not already stored
        if (!appointment.originalDateTime) {
            appointment.originalDateTime = `${appointment.appointmentDate} ${appointment.appointmentTime}`;
        }

        appointment.appointmentDate = newDate;
        appointment.appointmentTime = newTime;
        appointment.status = 'confirmed'; // Auto-confirm when rescheduling
        if (rescheduleReason) {
            appointment.notes = `Rescheduled: ${rescheduleReason}${appointment.notes ? '\n' + appointment.notes : ''}`;
        }
        await appointment.save();

        // Fetch updated appointment with relations
        const updatedAppointment = await Appointment.findByPk(id, {
            include: [
                {
                    model: Patient,
                    as: 'Patient',
                    include: [{
                        model: User,
                        as: 'User',
                        attributes: ['email', 'phone']
                    }]
                }
            ]
        });

        res.json({ message: 'Appointment rescheduled successfully', appointment: updatedAppointment });

        // LOG ACTIVITY
        await logActivity(req, {
            action: 'RESCHEDULE_APPOINTMENT',
            entityType: 'APPOINTMENT',
            entityId: id,
            details: { newDate, newTime, reason: rescheduleReason }
        });
    } catch (error) {
        console.error('Error rescheduling appointment:', error);
        res.status(500).json({ error: 'Failed to reschedule appointment' });
    }
};
