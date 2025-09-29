const { models } = require('../models');
const Activity = models.Activity;

// CREATE a new activity
exports.createActivity = async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ all activities
exports.getActivities = async (_req, res) => {
  try {
    const activities = await Activity.findAll();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ one activity by ID
exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.body.id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE an activity by ID
exports.updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.body.id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    await activity.update(req.body);
    res.json({ message: "Activity updated successfully", activity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE an activity by ID
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.body.id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    await activity.destroy();
    res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
