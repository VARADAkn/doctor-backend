const { models } = require('../models');
const service = require('../services/genericservice');

/**
 * Creates a new activity record.
 */
exports.createActivity = async (req, res) => {
  const activity = await service.create(Activity, req.body);
  res.status(201).json(activity);
};

/**
 * Retrieves all activity records.
 */
exports.getActivities = async (_req, res) => {
  const activities = await service.getAll(Activity);
  res.json(activities);
};

/**
 * Retrieves a single activity record by ID (from req.body.id).
 */
exports.getActivity = async (req, res) => {
  const activity = await service.getById(Activity, req.body.id);
  if (!activity) return res.status(404).json({ error: 'Activity not found' });
  res.json(activity);
};

/**
 * Updates an activity record by ID (from req.body.id).
 */
exports.updateActivity = async (req, res) => {
  const updated = await service.update(Activity, req.body.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Activity not found' });
  res.json({ message: 'Activity updated successfully', activity: updated });
};

/**
 * Deletes an activity record by ID (from req.body.id).
 */
exports.deleteActivity = async (req, res) => {
  const deleted = await service.deleteById(Activity, req.body.id);
  if (!deleted) return res.status(404).json({ error: 'Activity not found' });
  res.json({ message: 'Activity deleted successfully' });
};
