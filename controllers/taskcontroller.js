const db = require('../models');
const { Task, WorkSpace, WorkspaceDoctor, Doctor, Patient } = db;
const { Op } = require('sequelize');


/**
 * Creates a new task.
 * Restricted to: Admin who owns the ward.
 * Condition: Assigned doctor must be in a ward owned by the admin.
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, patientId, workSpaceId } = req.body;
    const adminId = req.session.userId;

    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admins can create tasks" });
    }

    let targetWardId = workSpaceId;

    // Discovery logic if workSpaceId is missing
    if (!targetWardId) {
      // Find a ward owned by this admin that contains this doctor
      const wardMembership = await WorkspaceDoctor.findOne({
        include: [{
          model: WorkSpace,
          as: 'WorkSpace',
          where: { createdByAdminId: adminId }
        }],
        where: { doctorId: assignedTo }
      });

      if (!wardMembership) {
        return res.status(400).json({ error: "The selected doctor is not assigned to any of your wards. Please assign the doctor to a ward first." });
      }
      targetWardId = wardMembership.workSpaceId;
    } else {
      // Verify provided ward belongs to admin
      const ward = await WorkSpace.findOne({
        where: { id: targetWardId, createdByAdminId: adminId }
      });
      if (!ward) {
        return res.status(403).json({ error: "Access denied: You do not own this ward" });
      }

      // Verify doctor is in that ward
      const doctorInWard = await WorkspaceDoctor.findOne({
        where: { workSpaceId: targetWardId, doctorId: assignedTo }
      });
      if (!doctorInWard) {
        return res.status(400).json({ error: "The assigned doctor is not part of this specific ward" });
      }
    }

    // Create the task
    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      assignedTo, // Doctor ID
      patientId: patientId || null,
      workSpaceId: targetWardId,
      createdByAdminId: adminId,
      createdBy: req.session.user.name
    });

    res.status(201).json({
      message: "Task created and assigned successfully",
      task
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves tasks based on user role.
 */
exports.getTasks = async (req, res) => {
  try {
    const userId = req.session.userId;
    const userRole = req.session.user.role;
    const profileId = req.session.user.profileId;

    let tasks;

    if (userRole === 'admin') {
      // Admins see tasks they created
      tasks = await Task.findAll({
        where: { createdByAdminId: userId },
        include: [
          { model: Doctor, as: 'Doctor', attributes: ['id', 'name'] },
          { model: Patient, as: 'Patient', attributes: ['id', 'name'] },
          { model: WorkSpace, as: 'WorkSpace', attributes: ['id', 'name'] }
        ]
      });
    } else if (userRole === 'doctor') {
      // Doctors see tasks assigned to them specifically
      tasks = await Task.findAll({
        where: { assignedTo: profileId },
        include: [
          { model: Patient, as: 'Patient', attributes: ['id', 'name'] },
          { model: WorkSpace, as: 'WorkSpace', attributes: ['id', 'name'] }
        ]
      });
    } else {
      return res.status(403).json({ error: "Role not authorized to view tasks" });
    }

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

/**
 * Retrieves a single task.
 */
exports.getTask = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.session.userId;
    const profileId = req.session.user.profileId;

    const task = await Task.findByPk(id, {
      include: [
        { model: Doctor, as: 'Doctor' },
        { model: Patient, as: 'Patient' },
        { model: WorkSpace, as: 'WorkSpace' }
      ]
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Access check
    if (req.session.user.role === 'admin' && task.createdByAdminId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to view this task' });
    }
    if (req.session.user.role === 'doctor' && task.assignedTo !== profileId) {
      return res.status(403).json({ error: 'Unauthorized to view this task' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Updates a task.
 */
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.session.userId;
    const userRole = req.session.user.role;
    const profileId = req.session.user.profileId;

    const task = await Task.findByPk(id);

    if (!task) return res.status(404).json({ error: "Task not found" });

    if (userRole === 'admin') {
      if (task.createdByAdminId !== userId) {
        return res.status(403).json({ error: "You cannot edit tasks created by other admins" });
      }
      await task.update(req.body);
    } else if (userRole === 'doctor') {
      if (task.assignedTo !== profileId) {
        return res.status(403).json({ error: "You can only update tasks assigned to you" });
      }
      if (req.body.status) {
        await task.update({ status: req.body.status });
      } else {
        return res.status(400).json({ error: "Doctors can only update task status" });
      }
    }

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes a task.
 */
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.session.userId;

    const task = await Task.findByPk(id);

    if (!task) return res.status(404).json({ error: "Task not found" });

    if (req.session.user.role !== 'admin' || task.createdByAdminId !== userId) {
      return res.status(403).json({ error: "Only the creator admin can delete this task" });
    }

    const taskTitle = task.title;
    const taskId = task.id;
    await task.destroy();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchTasks = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.session.userId;
    const profileId = req.session.user.profileId;

    const tasks = await Task.findAll({
      where: {
        title: { [Op.iLike]: `%${name}%` },
        [Op.or]: [
          { createdByAdminId: userId },
          { assignedTo: profileId }
        ]
      }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
