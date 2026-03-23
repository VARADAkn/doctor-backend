const db = require('../models');
const { Task, WorkSpace, WorkspaceDoctor, Doctor, Patient } = db;
const { Op } = require('sequelize');

/**
 * Creates a new task.
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, patientId, workSpaceId } = req.body;
    const { userId, user } = req.session;

    if (user.role !== 'admin') {
      return res.status(403).json({ error: "Only admins can create tasks" });
    }

    let targetWardId = workSpaceId;

    // If workspace not provided → find automatically
    if (!targetWardId) {
      const wardMembership = await WorkspaceDoctor.findOne({
        include: [{
          model: WorkSpace,
          as: 'WorkSpace',
          where: { createdByAdminId: userId }
        }],
        where: { doctorId: assignedTo }
      });

      if (!wardMembership) {
        return res.status(400).json({
          error: "Doctor not assigned to any of your wards"
        });
      }

      targetWardId = wardMembership.workSpaceId;
    } else {
      // Validate workspace ownership
      const ward = await WorkSpace.findOne({
        where: { id: targetWardId, createdByAdminId: userId }
      });

      if (!ward) {
        return res.status(403).json({ error: "Access denied: Invalid ward" });
      }

      // Validate doctor in workspace
      const doctorInWard = await WorkspaceDoctor.findOne({
        where: { workSpaceId: targetWardId, doctorId: assignedTo }
      });

      if (!doctorInWard) {
        return res.status(400).json({
          error: "Doctor not part of this ward"
        });
      }
    }

    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      assignedTo,
      patientId: patientId || null,
      workSpaceId: targetWardId,
      createdByAdminId: userId,
      createdBy: user.name
    });

    return res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({ error: error.message });
  }
};


/**
 * Get tasks based on role
 */
exports.getTasks = async (req, res) => {
  try {
    const { userId, user } = req.session;
    const { role, profileId } = user;

    let query = {};

    if (role === 'admin') {
      query.where = { createdByAdminId: userId };
      query.include = [
        { model: Doctor, as: 'Doctor', attributes: ['id', 'name'] },
        { model: Patient, as: 'Patient', attributes: ['id', 'name'] },
        { model: WorkSpace, as: 'WorkSpace', attributes: ['id', 'name'] }
      ];
    } else if (role === 'doctor') {
      query.where = { assignedTo: profileId };
      query.include = [
        { model: Patient, as: 'Patient', attributes: ['id', 'name'] },
        { model: WorkSpace, as: 'WorkSpace', attributes: ['id', 'name'] }
      ];
    } else {
      return res.status(403).json({ error: "Unauthorized role" });
    }

    const tasks = await Task.findAll(query);
    return res.json(tasks);

  } catch (error) {
    console.error('Get tasks error:', error);
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
};


/**
 * Get single task
 */
exports.getTask = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId, user } = req.session;
    const { role, profileId } = user;

    const task = await Task.findByPk(id, {
      include: [
        { model: Doctor, as: 'Doctor' },
        { model: Patient, as: 'Patient' },
        { model: WorkSpace, as: 'WorkSpace' }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Access control
    if (
      (role === 'admin' && task.createdByAdminId !== userId) ||
      (role === 'doctor' && task.assignedTo !== profileId)
    ) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    return res.json(task);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


/**
 * Update task
 */
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId, user } = req.session;
    const { role, profileId } = user;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (role === 'admin') {
      if (task.createdByAdminId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      await task.update(req.body);

    } else if (role === 'doctor') {
      if (task.assignedTo !== profileId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      if (!req.body.status) {
        return res.status(400).json({
          error: "Doctors can only update status"
        });
      }

      await task.update({ status: req.body.status });
    }

    return res.json({ message: "Task updated", task });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


/**
 * Delete task
 */
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId, user } = req.session;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (user.role !== 'admin' || task.createdByAdminId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await task.destroy();

    return res.json({ message: "Task deleted successfully" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


/**
 * Search tasks
 */
exports.searchTasks = async (req, res) => {
  try {
    const { name } = req.body;
    const { userId, user } = req.session;
    const profileId = user.profileId;

    const tasks = await Task.findAll({
      where: {
        title: { [Op.iLike]: `%${name}%` },
        [Op.or]: [
          { createdByAdminId: userId },
          { assignedTo: profileId }
        ]
      }
    });

    return res.json(tasks);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};