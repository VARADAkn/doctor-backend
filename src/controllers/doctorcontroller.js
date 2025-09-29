const { models } = require('../models');
const Doctor = models.Doctor;

// CREATE a new doctor
exports.createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ all doctors
exports.getDoctors = async (_req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ one doctor by ID
exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.body.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a doctor by ID
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.body.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    await doctor.update(req.body);
    res.json({ message: "Doctor updated successfully", doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a doctor by ID
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.body.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    await doctor.destroy();
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
