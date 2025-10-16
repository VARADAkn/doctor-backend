const { models } = require('../models');
const service = require('../services/genericservice');

/**
 * Creates a new workspace.
 */
exports.createWorkSpace = async (req, res) => {
  const workspace = await service.create(WorkSpace, req.body);
  res.status(201).json(workspace);
};

/**
 * Retrieves all workspaces.
 */
exports.getWorkSpaces = async (_req, res) => {
  const workspaces = await service.getAll(WorkSpace);
  res.json(workspaces);
};

/**
 * Retrieves a single workspace by ID.
 */
exports.getWorkSpace = async (req, res) => {
  const workspace = await service.getById(WorkSpace, req.params.id);
  if (!workspace) return res.status(404).json({ error: 'Workspace not found' });
  res.json(workspace);
};

/**
 * Updates a workspace by ID.
 */
exports.updateWorkSpace = async (req, res) => {
  const updated = await service.update(WorkSpace, req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Workspace not found' });
  res.json({ message: 'Workspace updated successfully', workspace: updated });
};

/**
 * Deletes a workspace by ID.
 */
exports.deleteWorkSpace = async (req, res) => {
  const deleted = await service.deleteById(WorkSpace, req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Workspace not found' });
  res.json({ message: 'Workspace deleted successfully' });
};
