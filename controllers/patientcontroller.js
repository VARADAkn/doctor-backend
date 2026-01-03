const db = require("../models");
const { Patient, WorkSpace, MedicalRecord, User } = db;
const service = require('../services/genericservice');

/**
 * Creates a new patient record.
 */
exports.createPatient = async (req, res) => {
  try {
    const patient = await service.create(Patient, req.body);
    res.status(201).json(patient);
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

    if (!patientId || !workSpaceId) {
      return res.status(400).json({ error: "patientId and workSpaceId required" });
    }

    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const workspace = await WorkSpace.findByPk(workSpaceId);
    if (!workspace) {
      return res.status(404).json({ error: "Ward not found" });
    }

    // Ownership check
    if (workspace.createdByAdminId !== req.session.userId) {
      return res.status(403).json({ error: "Access denied: You can only assign patients to wards created by you" });
    }

    patient.workSpaceId = workSpaceId;
    await patient.save();

    res.json({ message: "Patient assigned to ward successfully" });
  } catch (error) {
    console.error("Assign patient error:", error);
    res.status(500).json({ error: "Failed to assign patient" });
  }
};
