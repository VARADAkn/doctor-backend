// controllers/doctorcontroller.js

// Correctly import the Doctor model by destructuring it from the db object
const { Doctor } = require('../models');
const service = require('../services/genericservice');

// Creates a new doctor record.
exports.createDoctor = async (req, res) => {
  const doctor = await service.create(Doctor, req.body);
  res.status(201).json(doctor);
};

// Retrieves all doctor records.
exports.getDoctors = async (_req, res) => {
  const doctors = await service.getAll(Doctor);
  res.json(doctors);
};

// Retrieves a single doctor by their ID from the URL parameters.
// Example URL: /api/doctors/some-uuid-1234
exports.getDoctor = async (req, res) => {
  const { id } = req.params; // Get ID from URL parameter
  const doctor = await service.getById(Doctor, id);

  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found' });
  }
  res.json(doctor);
};

// Updates a doctor by their ID from the URL parameters.
exports.updateDoctor = async (req, res) => {
  const { id } = req.params; // Get ID from URL parameter
  const [updatedRows] = await service.update(Doctor, id, req.body);

  if (updatedRows === 0) {
    return res.status(404).json({ error: 'Doctor not found or no changes were made.' });
  }
  
  const updatedDoctor = await service.getById(Doctor, id);
  res.json({ message: 'Doctor updated successfully.', data: updatedDoctor });
};

// Deletes a doctor by their ID from the URL parameters.
exports.deleteDoctor = async (req, res) => {
  const { id } = req.params; // Get ID from URL parameter
  const deletedRows = await service.deleteById(Doctor, id);

  if (deletedRows === 0) {
    return res.status(404).json({ error: 'Doctor not found.' });
  }
  
  res.json({ message: 'Doctor deleted successfully.' });
};