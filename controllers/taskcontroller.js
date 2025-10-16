const { models } = require('../models');
const service = require('../services/genericservice');

/**
 * Creates a new task.
 */
exports.createTask = async (req, res) => {
  const task = await service.create(Task, req.body);
  res.status(201).json(task);
};

/**
 * Retrieves all tasks.
 */
exports.getTasks = async (_req, res) => {
  const tasks = await service.getAll(Task);
  res.json(tasks);
};

/**
 * Retrieves a single task by ID.
 */
exports.getTask = async (req, res) => {
  const task = await service.getById(Task, req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
};

/**
 * Updates a task by ID.
 */
exports.updateTask = async (req, res) => {
  const updated = await service.update(Task, req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task updated successfully', task: updated });
};

/**
 * Deletes a task by ID.
 */
exports.deleteTask = async (req, res) => {
  const deleted = await service.deleteById(Task, req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted successfully' });
};
