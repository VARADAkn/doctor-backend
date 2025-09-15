const { models } = require('../models');
const Patient = models.Patient;

// CREATE
exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ all
exports.getPatients = async (_req, res) => {
  try {
    const data = await Patient.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ one (using body.id instead of params)
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.body.id);
    if (!patient) return res.status(404).json({ error: "Not found" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE (using body.id)
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.body.id);
    if (!patient) return res.status(404).json({ error: "Not found" });
    await patient.update(req.body);
    res.json({ message: "Patient updated successfully", patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE (using body.id)
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.body.id);
    if (!patient) return res.status(404).json({ error: "Not found" });
    await patient.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
