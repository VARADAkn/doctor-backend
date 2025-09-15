const { models } = require('../models');
const WorkSpace = models.WorkSpace;

exports.createWorkSpace = async (req, res) => {
  try {
    const ws = await WorkSpace.create(req.body);
    res.json(ws);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWorkSpaces = async (req, res) => {
  try {
    const allWS = await WorkSpace.findAll();
    res.json(allWS);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWorkSpace = async (req, res) => {
  try {
    const { id } = req.body; 
    const ws = await WorkSpace.findByPk(id);
    res.json(ws);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateWorkSpace = async (req, res) => {
  try {
    const { id, data } = req.body; 
    await WorkSpace.update(data, { where: { id } });
    res.json({ message:"Workspace updated"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteWorkSpace = async (req, res) => {
  try {
    const { id } = req.body;
    await WorkSpace.destroy({ where: { id } });
    res.json({ message:"Workspace deleted"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
