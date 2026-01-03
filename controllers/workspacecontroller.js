const db = require("../models");
const { WorkSpace, Doctor, Patient } = db;


/**
 * Creates a new workspace.
 */
exports.createWorkSpace = async (req, res) => {
  try {
    console.log('--- Create Workspace Request ---');
    console.log('User in session:', req.session.user);
    console.log('Body:', req.body);

    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized: No active session. Please log in again.' });
    }

    const workspace = await WorkSpace.create({
      ...req.body,
      createdByAdminId: req.session.userId,
      createdBy: req.session.user.name || 'System'
    });
    console.log('Workspace created successfully:', workspace.id);
    res.status(201).json(workspace);
  } catch (error) {
    console.error('CRITICAL: Error creating workspace:', error);
    res.status(500).json({ error: 'Failed to create workspace: ' + error.message });
  }
};

/**
 * Retrieves all workspaces.
 */
exports.getWorkSpaces = async (_req, res) => {
  try {
    const workspaces = await WorkSpace.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(workspaces);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({ error: 'Failed to fetch workspaces' });
  }
};

/**
 * Retrieves a single workspace by ID.
 */
exports.getWorkSpace = async (req, res) => {
  try {
    const workspace = await WorkSpace.findByPk(req.body.id, {
      include: [
        {
          model: Doctor,
          as: 'Doctors',
          through: { attributes: [] }
        },
        {
          model: Patient,
          as: 'Patients'
        }
      ]
    });
    if (!workspace) return res.status(404).json({ error: 'Workspace not found' });
    res.json(workspace);
  } catch (error) {
    console.error('Error fetching workspace:', error);
    res.status(500).json({ error: 'Failed to fetch workspace' });
  }
};

/**
 * Updates a workspace by ID.
 */
exports.updateWorkSpace = async (req, res) => {
  try {
    const { id } = req.body;
    const workspace = await WorkSpace.findByPk(id);

    if (!workspace) return res.status(404).json({ error: 'Workspace not found' });

    // Ownership check: only the creator admin can edit
    if (workspace.createdByAdminId !== req.session.userId && workspace.createdBy !== req.session.user.name) {
      return res.status(403).json({ error: 'Access denied: You can only edit wards created by you' });
    }

    await workspace.update(req.body);
    res.json({ message: 'Workspace updated successfully', workspace });
  } catch (error) {
    console.error('Error updating workspace:', error);
    res.status(500).json({ error: 'Failed to update workspace' });
  }
};

/**
 * Deletes a workspace by ID.
 */
exports.deleteWorkSpace = async (req, res) => {
  try {
    const { id } = req.body;
    const workspace = await WorkSpace.findByPk(id);

    if (!workspace) return res.status(404).json({ error: 'Workspace not found' });

    // Ownership check
    if (workspace.createdByAdminId !== req.session.userId && workspace.createdBy !== req.session.user.name) {
      return res.status(403).json({ error: 'Access denied: You can only delete wards created by you' });
    }

    const wardName = workspace.name;
    const wardId = workspace.id;
    await workspace.destroy();
    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error('Error deleting workspace:', error);
    res.status(500).json({ error: 'Failed to delete workspace' });
  }
};

exports.getWorkSpaceDetails = async (req, res) => {
  try {
    const ward = await WorkSpace.findByPk(req.params.id, {
      include: [
        {
          model: Doctor,
          as: 'Doctors',
          through: { attributes: [] }
        },
        {
          model: Patient,
          as: 'Patients'
        }
      ]
    });

    if (!ward) return res.status(404).json({ error: "Ward not found" });
    res.json(ward);
  } catch (error) {
    console.error("Ward details error:", error);
    res.status(500).json({ error: "Failed to fetch ward details" });
  }
};
