const { models } = require('../models');
const Patient = models.Patient;
const service = require('../services/genericservice');

/**
 * Creates a new patient record.
 */
exports.createPatient = async (req, res) => {
  const patient = await service.create(Patient, req.body);
  res.status(201).json(patient);
};

/**
 * Retrieves all patient records.
 */
exports.getPatients = async (_req, res) => {
  const patients = await service.getAll(Patient);
  res.json(patients);
};

/**
 * Retrieves a single patient record by ID (from req.body.id).
 */
exports.getPatient = async (req, res) => {
  const patient = await service.getById(Patient, req.body.id);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  res.json(patient);
};

/**
 * Updates a patient record by ID (from req.body.id).
 */
exports.updatePatient = async (req, res) => {
  const updated = await service.update(Patient, req.body.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Patient not found' });
  res.json({ message: 'Patient updated successfully', patient: updated });
};

/**
 * Deletes a patient record by ID (from req.body.id).
 */
exports.deletePatient = async (req, res) => {
  const deleted = await service.deleteById(Patient, req.body.id);
  if (!deleted) return res.status(404).json({ error: 'Patient not found' });
  res.json({ message: 'Patient deleted successfully' });
};
