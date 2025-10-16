const db = require("../models");
// Import the WorkSpace model from the database
const { WorkSpace } = db;
const service = require('../services/genericservice');

/**
 * Creates a new workspace.
 */
exports.createWorkSpace = async (req, res) => {
  try {
    const workspace = await service.create(WorkSpace, req.body);
    res.status(201).json(workspace);
  } catch (error) {
    console.error('Error creating workspace:', error);
    res.status(500).json({ error: 'Failed to create workspace' });
  }
};

/**
 * Retrieves all workspaces.
 */
exports.getWorkSpaces = async (_req, res) => {
  try {
    const workspaces = await service.getAll(WorkSpace);
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
    const workspace = await service.getById(WorkSpace, req.body.id);
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
// In update and delete functions, add ownership check
exports.updateWorkSpace = async (req, res) => {
  try {
    const workspace = await WorkSpace.findByPk(req.body.id);
    
    // Check if current user is the owner
    if (workspace.createdBy !== req.session.user.name) {
      return res.status(403).json({ error: 'You can only edit wards created by you' });
    }
    
    const updated = await service.update(WorkSpace, req.body.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Workspace not found' });
    res.json({ message: 'Workspace updated successfully', workspace: updated });
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
    const deleted = await service.deleteById(WorkSpace, req.body.id);
    if (!deleted) return res.status(404).json({ error: 'Workspace not found' });
    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error('Error deleting workspace:', error);
    res.status(500).json({ error: 'Failed to delete workspace' });
  }
};