const db = require("../models");
const { Patient, WorkSpace, MedicalRecord, User } = db;
const service = require('../services/genericservice');
const { logActivity } = require("../utils/auditLogger");

/**
 * Creates a new patient record.
 */
exports.createPatient = async (req, res) => {
  try {
    const patient = await service.create(Patient, req.body);
    res.status(201).json(patient);

    // LOG ACTIVITY
    await logActivity(req, {
      action: 'CREATE_PATIENT',
      entityType: 'PATIENT',
      entityId: patient.id,
      details: { name: patient.name }
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
};

/**
 * Retrieves all patient records.
 */
exports.getPatients = async (_req, res) => {
  try {
    const patients = await Patient.findAll({
      include: [{
        model: WorkSpace,
        as: 'WorkSpace',
        attributes: ['id', 'name']
      }]
    });
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

/**
 * Retrieves a single patient record by ID (from req.body.id).
 */
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.body.id, {
      include: [{
        model: WorkSpace,
        as: 'WorkSpace',
        attributes: ['id', 'name']
      }]
    });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
};

/**
 * Updates a patient record by ID (from req.body.id).
 */
exports.updatePatient = async (req, res) => {
  try {
    const updated = await service.update(Patient, req.body.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient updated successfully', patient: updated });

    // LOG ACTIVITY
    await logActivity(req, {
      action: 'UPDATE_PATIENT',
      entityType: 'PATIENT',
      entityId: req.body.id,
      details: { name: updated.name }
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Failed to update patient' });
  }
};

/**
 * Deletes a patient record by ID (from req.body.id).
 */
exports.deletePatient = async (req, res) => {
  try {
    const deleted = await service.deleteById(Patient, req.body.id);
    if (!deleted) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient deleted successfully' });

    // LOG ACTIVITY
    await logActivity(req, {
      action: 'DELETE_PATIENT',
      entityType: 'PATIENT',
      entityId: req.body.id
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
};

/**
 * Searches for patients by name (case-insensitive, starts-with).
 */
exports.searchPatients = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Search term 'name' is required" });
    }
    // This calls the search function from your generic service
    const patients = await service.searchByName(Patient, name);
    res.json(patients);
  } catch (error) {
    console.error('Error searching patients:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get patients by workspace ID
 */
exports.getPatientsByWorkspace = async (req, res) => {
  try {
    const { workSpaceId } = req.body;
    if (!workSpaceId) {
      return res.status(400).json({ error: "workSpaceId is required" });
    }

    const patients = await Patient.findAll({
      where: { workSpaceId }
    });

    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients by workspace:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

exports.assignPatientToWard = async (req, res) => {
  try {
    const { patientId, workSpaceId } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }

    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // If workSpaceId is provided (assigning/reassigning)
    if (workSpaceId) {
      const workspace = await WorkSpace.findByPk(workSpaceId);
      if (!workspace) {
        return res.status(404).json({ error: "Ward not found" });
      }

      // Ownership check for the target workspace
      if (workspace.createdByAdminId !== req.session.userId) {
        return res.status(403).json({ error: "Access denied: You can only assign patients to wards created by you" });
      }

      patient.workSpaceId = workSpaceId;
    } else {
      // Unassigning (workSpaceId is null or empty)
      // We might want to check if the user had rights to the CURRENT ward of the patient,
      // but simpler for now is to just allow unassigning if they are logged in as admin.
      // For now, let's keep it simple.
      patient.workSpaceId = null;
    }

    await patient.save();

    res.json({ message: workSpaceId ? "Patient assigned to ward successfully" : "Patient unassigned from ward successfully" });

    // LOG ACTIVITY
    await logActivity(req, {
      action: workSpaceId ? 'ASSIGN_PATIENT_WARD' : 'UNASSIGN_PATIENT_WARD',
      entityType: 'PATIENT',
      entityId: patientId,
      details: { workSpaceId }
    });
  } catch (error) {
    console.error("Assign patient error:", error);
    res.status(500).json({ error: "Failed to assign patient" });
  }
};

/**
 * Get Doctors assigned to the patient's workspace
 */
exports.getMyDoctors = async (req, res) => {
  try {
    const { patientId } = req.body;

    // 1. Find the Patient to get their WorkspaceID
    const patient = await Patient.findByPk(patientId);
    if (!patient || !patient.workSpaceId) {
      return res.json([]); // No workspace assigned = no assigned doctors
    }

    // 2. Find Doctors in that Workspace
    // Using the WorkspaceDoctor association defined in models/index.js
    const workspaceDocs = await db.WorkspaceDoctor.findAll({
      where: { workSpaceId: patient.workSpaceId },
      include: [{
        model: db.Doctor,
        as: 'Doctor',
        include: [{ model: db.User, as: 'User', attributes: ['email', 'phone'] }]
      }]
    });

    // 3. Format Response
    const doctors = workspaceDocs.map(wd => ({
      name: wd.Doctor.name,
      specialization: wd.Doctor.specialization,
      experience: wd.Doctor.yearOfExperience,
      phone: wd.Doctor.User?.phone,
      email: wd.Doctor.User?.email
    }));

    res.json(doctors);

  } catch (err) {
    console.error('Error fetching my doctors:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get patient profile by User ID
 */
exports.getPatientProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const patient = await Patient.findOne({
      where: { userId },
      include: [{
        model: WorkSpace,
        as: 'WorkSpace',
        attributes: ['id', 'name']
      }]
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found" });
    }

    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
