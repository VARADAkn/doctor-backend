const { models } = require('../models');
const Doctor = models.Doctor;
const service = require('../services/genericservice');

//Creates a new doctor record.
 
exports.createDoctor = async (req, res) => {
  const doctor = await service.create(Doctor, req.body);
  res.status(201).json(doctor);
};

// Retrieves all doctor records.

exports.getDoctors = async (_req, res) => {
  const doctors = await service.getAll(Doctor);
  res.json(doctors);
};

// Retrieves a single doctor record by ID (from req.body.id).
exports.getDoctor = async (req, res) => {
  const doctor = await service.getById(Doctor, req.body.id);
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  res.json(doctor);
};


 //Updates a doctor record by ID (from req.body.id).
 
exports.updateDoctor = async (req, res) => {
  const updated = await service.update(Doctor, req.body.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Doctor not found' });
  res.json({ message: 'Doctor updated successfully', doctor: updated });
};


  //Deletes a doctor record by ID (from req.body.id).
 
exports.deleteDoctor = async (req, res) => {
  const deleted = await service.deleteById(Doctor, req.body.id);
  if (!deleted) return res.status(404).json({ error: 'Doctor not found' });
  res.json({ message: 'Doctor deleted successfully' });
};
