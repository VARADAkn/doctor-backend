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
  const { id } = req.body; // Get ID from body
  const doctor = await service.getById(Doctor, id);

  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found' });
  }
  res.json(doctor);
};

// Updates a doctor by their ID from the URL parameters.
exports.updateDoctor = async (req, res) => {
  const { id } = req.body; // Get ID from body
  const updatedRecord = await service.update(Doctor, id, req.body);

  if (!updatedRecord) {
    return res.status(404).json({ error: 'Doctor not found or no changes were made.' });
  }

  res.json({ message: 'Doctor updated successfully.', data: updatedRecord });
};

// Deletes a doctor by their ID from the URL parameters.
exports.deleteDoctor = async (req, res) => {
  const { id } = req.body; // Get ID from body
  const deletedRows = await service.deleteById(Doctor, id);

  if (deletedRows === 0) {
    return res.status(404).json({ error: 'Doctor not found.' });
  }

  res.json({ message: 'Doctor deleted successfully.' });
};

/**
 * Searches for doctors by name (case-insensitive, starts-with).
 */
exports.searchDoctors = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Search term 'name' is required" });
    }
    const doctors = await service.searchByName(Doctor, name);
    res.json(doctors);
  } catch (error) {
    console.error('Error searching doctors:', error);
    res.status(500).json({ error: error.message });
  }
};