const { models } = require('../models');
const Task = models.Task;

// CREATE a new task
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ all tasks
exports.getTasks = async (_req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ one task by ID
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.body.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a task by ID
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.body.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    await task.update(req.body);
    res.json({ message: "Task updated successfully", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a task by ID
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.body.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    await task.destroy();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
