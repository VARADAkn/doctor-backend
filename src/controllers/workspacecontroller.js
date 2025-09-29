const { models } = require('../models');
const WorkSpace = models.WorkSpace;

// CREATE a new workspace
exports.createWorkSpace = async (req, res) => {
  try {
    const workspace = await WorkSpace.create(req.body);
    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ all workspaces
exports.getWorkSpaces = async (_req, res) => {
  try {
    const workspaces = await WorkSpace.findAll();
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ one workspace by ID
exports.getWorkSpace = async (req, res) => {
  try {
    const workspace = await WorkSpace.findByPk(req.body.id);
    if (!workspace) return res.status(404).json({ error: "Workspace not found" });
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a workspace by ID
exports.updateWorkSpace = async (req, res) => {
  try {
    const workspace = await WorkSpace.findByPk(req.body.id);
    if (!workspace) return res.status(404).json({ error: "Workspace not found" });
    await workspace.update(req.body);
    res.json({ message: "Workspace updated successfully", workspace });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a workspace by ID
exports.deleteWorkSpace = async (req, res) => {
  try {
    const workspace = await WorkSpace.findByPk(req.body.id);
    if (!workspace) return res.status(404).json({ error: "Workspace not found" });
    await workspace.destroy();
    res.json({ message: "Workspace deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
