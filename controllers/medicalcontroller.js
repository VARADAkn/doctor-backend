// controllers/medicalrecordcontroller.js
const db = require("../models");
const { MedicalRecord, Patient } = db;
const service = require('../services/genericservice');

exports.createMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await service.create(MedicalRecord, req.body);
    res.status(201).json(medicalRecord);
  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({ error: 'Failed to create medical record' });
  }
};

exports.getPatientMedicalRecords = async (req, res) => {
  try {
    const { patientId } = req.body;
    const medicalRecords = await MedicalRecord.findAll({
      where: { patientId },
      order: [['recordDate', 'DESC']],
      include: [{
        model: Patient,
        attributes: ['name']
      }]
    });
    res.json(medicalRecords);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ error: 'Failed to fetch medical records' });
  }
};

exports.updateMedicalRecord = async (req, res) => {
  try {
    const updated = await service.update(MedicalRecord, req.body.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Medical record not found' });
    res.json({ message: 'Medical record updated successfully', medicalRecord: updated });
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({ error: 'Failed to update medical record' });
  }
};

exports.deleteMedicalRecord = async (req, res) => {
  try {
    const deleted = await service.deleteById(MedicalRecord, req.body.id);
    if (!deleted) return res.status(404).json({ error: 'Medical record not found' });
    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({ error: 'Failed to delete medical record' });
  }
};