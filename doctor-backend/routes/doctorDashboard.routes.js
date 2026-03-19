const express = require('express');
const router = express.Router();
const { Doctor, WorkSpace, WorkspaceDoctor, Task, Patient, User, Sequelize } = require('../models');
const { Op } = require('sequelize');

// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  next();
};

// Get dashboard statistics
router.get('/doctor-dashboard/dashboard-stats', authenticateUser, async (req, res) => {
  try {
    const userId = req.session.userId;
    console.log(`[DoctorStats] Loading stats for userId: ${userId}`);

    // Find the doctor record for this user
    const doctor = await Doctor.findOne({ where: { userId: userId } });

    if (!doctor) {
      console.error(`[DoctorStats] No doctor profile found for userId: ${userId}`);
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const doctorId = doctor.id;
    console.log(`[DoctorStats] Found doctorId: ${doctorId}`);

    // Get assigned wards count
    const assignedWards = await WorkspaceDoctor.count({
      where: { doctorId: doctorId }
    });

    // Get tasks statistics (Case-insensitive)
    const totalTasks = await Task.count({ where: { assignedTo: doctorId } });

    // Simplified status counting for robustness across dialects
    const pendingTasks = await Task.count({
      where: {
        assignedTo: doctorId,
        status: {
          [Op.in]: ['pending', 'Pending', 'in progress', 'In Progress', 'IN PROGRESS', 'PENDING']
        }
      }
    });

    const completedTasks = await Task.count({
      where: {
        assignedTo: doctorId,
        status: {
          [Op.in]: ['completed', 'Completed', 'COMPLETED']
        }
      }
    });

    console.log(`[DoctorStats] Stats: Wards=${assignedWards}, Total=${totalTasks}, Pending=${pendingTasks}, Completed=${completedTasks}`);

    // Get user details for profile
    const user = await User.findByPk(userId);

    res.json({
      success: true,
      stats: {
        assignedWards: assignedWards || 0,
        totalTasks: totalTasks || 0,
        pendingTasks: pendingTasks || 0,
        completedTasks: completedTasks || 0
      },
      doctorProfile: {
        id: doctor.id,
        name: doctor.name,
        email: user?.email || 'Not provided',
        phone: user?.phone || 'Not provided',
        specialization: doctor.specialization,
        licenseNumber: doctor.licenceNumber,
        experience: doctor.yearOfExperience,
        bio: doctor.bio
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading dashboard statistics'
    });
  }
});

// Get assigned wards
router.get('/doctor-dashboard/assigned-wards', authenticateUser, async (req, res) => {
  try {
    const userId = req.session.userId;

    // Find the doctor record for this user
    const doctor = await Doctor.findOne({
      where: { userId: userId },
      include: [{
        model: WorkSpace,
        as: 'WorkSpaces',
        through: { attributes: [] }
      }]
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const workspaces = doctor.WorkSpaces || [];

    const wards = await Promise.all(workspaces.map(async (ws) => {
      // Get patient count for this workspace
      const patientCount = await Patient.count({
        where: { workSpaceId: ws.id }
      });

      // Get doctor count for this workspace
      const doctorCount = await WorkspaceDoctor.count({
        where: { workSpaceId: ws.id }
      });

      return {
        id: ws.id,
        name: ws.name,
        description: ws.description || 'No description available',
        patientCount: patientCount || 0,
        doctorCount: doctorCount || 1
      };
    }));

    res.json({
      success: true,
      wards: wards
    });
  } catch (error) {
    console.error('Assigned wards error:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading assigned wards'
    });
  }
});

// Get tasks
router.get('/doctor-dashboard/tasks', authenticateUser, async (req, res) => {
  try {
    const userId = req.session.userId;
    console.log(`[DoctorTasks] Loading tasks for userId: ${userId}`);

    // Find the doctor record for this user
    const doctor = await Doctor.findOne({ where: { userId: userId } });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const doctorId = doctor.id;

    const tasks = await Task.findAll({
      where: { assignedTo: doctorId },
      include: [
        {
          model: Patient,
          as: 'Patient',
          attributes: ['id', 'name'],
          include: [{
            model: WorkSpace,
            as: 'WorkSpace',
            attributes: ['id', 'name']
          }]
        }
      ],
      order: [['dueDate', 'ASC']]
    });

    console.log(`[DoctorTasks] Found ${tasks.length} tasks`);

    const formattedTasks = tasks.map(task => {
      let status = task.status || 'Pending';
      // Normalize casing for frontend consistency
      if (status.toLowerCase() === 'pending') status = 'Pending';
      else if (status.toLowerCase() === 'completed') status = 'Completed';
      else if (status.toLowerCase() === 'in progress') status = 'In Progress';

      return {
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority || 'Medium',
        status: status,
        dueDate: task.dueDate,
        workspace: task.Patient && task.Patient.WorkSpace ? { name: task.Patient.WorkSpace.name } : { name: 'No Ward' },
        patient: task.Patient ? { name: task.Patient.name } : { name: 'Unknown' }
      };
    });

    res.json({
      success: true,
      tasks: formattedTasks
    });
  } catch (error) {
    console.error('Tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading tasks'
    });
  }
});

// Update task status
router.put('/doctor-dashboard/tasks/:taskId/status', authenticateUser, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.session.userId;

    console.log(`[UpdateTask] TaskId: ${taskId}, New Status: ${status}, UserId: ${userId}`);

    // Find the doctor record for this user
    const doctor = await Doctor.findOne({ where: { userId: userId } });

    if (!doctor) {
      console.error(`[UpdateTask] Doctor profile not found for userId: ${userId}`);
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const doctorId = doctor.id;

    // Verify the task belongs to this doctor
    const task = await Task.findOne({
      where: { id: taskId, assignedTo: doctorId }
    });

    if (!task) {
      console.error(`[UpdateTask] Task ${taskId} not found or not assigned to doctor ${doctorId}`);
      return res.status(404).json({
        success: false,
        message: 'Task not found or unauthorized'
      });
    }

    const oldStatus = task.status;

    // Normalize status casing to match what frontend/stats expect
    // Simple normalization: if "completed" -> "Completed", if "pending" -> "Pending"
    let updatedStatus = status;
    if (status.toLowerCase() === 'completed') updatedStatus = 'Completed';
    if (status.toLowerCase() === 'pending') updatedStatus = 'Pending';
    if (status.toLowerCase() === 'in progress') updatedStatus = 'In Progress';

    task.status = updatedStatus;
    await task.save();

    console.log(`[UpdateTask] Status updated for task "${task.title}": ${oldStatus} -> ${updatedStatus}`);

    // Audit log commented out as controller is missing
    /*
    const { logActivity } = require('../controllers/auditlogcontroller');
    await logActivity({
      userId: userId,
      userRole: 'doctor',
      userName: doctor.name,
      action: 'UPDATE_TASK_STATUS',
      targetType: 'Task',
      targetId: task.id,
      targetName: task.title,
      details: `${doctor.name} changed task "${task.title}" status from "${oldStatus}" to "${status}"`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      status: 'SUCCESS',
    });
    */

    res.json({
      success: true,
      message: 'Task status updated successfully',
      newStatus: updatedStatus
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task status: ' + error.message
    });
  }
});

// Get patients in a specific ward
router.get('/doctor-dashboard/wards/:wardId/patients', authenticateUser, async (req, res) => {
  try {
    const { wardId } = req.params;
    const userId = req.session.userId;

    // Find the doctor record for this user
    const doctor = await Doctor.findOne({ where: { userId: userId } });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    // Verify the doctor is assigned to this ward
    const membership = await WorkspaceDoctor.findOne({
      where: { workSpaceId: wardId, doctorId: doctor.id }
    });

    if (!membership) {
      return res.status(403).json({ success: false, message: 'Access denied: You are not assigned to this ward' });
    }

    const patients = await Patient.findAll({
      where: { workSpaceId: wardId },
      include: [{
        model: Task,
        as: 'Tasks',
        where: { assignedTo: doctor.id },
        required: false
      }]
    });

    res.json({
      success: true,
      patients: patients
    });
  } catch (error) {
    console.error('Ward patients error:', error);
    res.status(500).json({ success: false, message: 'Error loading patients for this ward' });
  }
});

// Update doctor profile
router.put('/doctor-dashboard/profile', authenticateUser, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { name, specialization, phone, licenseNumber, experience, bio } = req.body;

    const doctor = await Doctor.findOne({ where: { userId: userId } });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    // Update Doctor details
    doctor.name = name || doctor.name;
    doctor.specialization = specialization || doctor.specialization;
    doctor.licenceNumber = licenseNumber || doctor.licenceNumber;
    doctor.yearOfExperience = experience || doctor.yearOfExperience;
    doctor.bio = bio || doctor.bio;
    await doctor.save();

    // Update User details (like phone/email if needed)
    const user = await User.findByPk(userId);
    if (user && phone) {
      user.phone = phone;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

module.exports = router;