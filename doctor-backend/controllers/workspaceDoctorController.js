const { Doctor, WorkSpace } = require('../models');


/**
 * Assign a doctor to a ward
 */
exports.assignDoctorToWard = async (req, res) => {
  try {
    const { doctorId, workSpaceId } = req.body;

    if (!doctorId || !workSpaceId) {
      return res.status(400).json({ error: 'doctorId and workSpaceId required' });
    }

    const doctor = await Doctor.findByPk(doctorId);
    const workspace = await WorkSpace.findByPk(workSpaceId);

    if (!doctor || !workspace) {
      return res.status(404).json({ error: 'Doctor or Ward not found' });
    }

    // Ownership check
    if (workspace.createdByAdminId !== req.session.userId) {
      return res.status(403).json({ error: 'Access denied: You can only assign doctors to wards created by you' });
    }

    await workspace.addDoctor(doctor);

    res.json({ message: 'Doctor assigned to ward successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Assignment failed' });
  }
};

/**
 * Remove a doctor from a ward
 */
exports.unassignDoctorFromWard = async (req, res) => {
  try {
    const { doctorId, workSpaceId } = req.body;

    if (!doctorId || !workSpaceId) {
      return res.status(400).json({ error: 'doctorId and workSpaceId required' });
    }

    const doctor = await Doctor.findByPk(doctorId);
    const workspace = await WorkSpace.findByPk(workSpaceId);

    if (!doctor || !workspace) {
      return res.status(404).json({ error: 'Doctor or Ward not found' });
    }

    // Ownership check
    if (workspace.createdByAdminId !== req.session.userId) {
      return res.status(403).json({ error: 'Access denied: You can only manage wards created by you' });
    }

    await workspace.removeDoctor(doctor);

    res.json({ message: 'Doctor removed from ward successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unassignment failed' });
  }
};
