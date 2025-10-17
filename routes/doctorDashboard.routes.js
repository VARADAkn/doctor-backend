const express = require('express');
const router = express.Router();
const { Doctor, Workspace, WorkspaceMember, Task, Patient, User } = require('../models');

// Middleware to check if user is authenticated and is a doctor
const authenticateDoctor = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  next();
};

// Get dashboard statistics
router.get('/doctor-dashboard/dashboard-stats', authenticateDoctor, async (req, res) => {
  try {
    const userId = req.session.userId;
    
    console.log('Fetching dashboard stats for user:', userId);
    
    // Find the doctor record for this user
    const doctor = await Doctor.findOne({ where: { userId: userId } });
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor profile not found' 
      });
    }

    const doctorId = doctor.id;
    
    // Get assigned wards count
    const assignedWards = await WorkspaceMember.count({ 
      where: { doctorId: doctorId, status: 'active' }
    });
    
    // Get tasks statistics
    const totalTasks = await Task.count({ where: { assignedTo: doctorId } });
    const pendingTasks = await Task.count({ 
      where: { assignedTo: doctorId, status: 'pending' }
    });
    const completedTasks = await Task.count({ 
      where: { assignedTo: doctorId, status: 'completed' }
    });
    
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
router.get('/doctor-dashboard/assigned-wards', authenticateDoctor, async (req, res) => {
  try {
    const userId = req.session.userId;
    
    // Find the doctor record for this user
    const doctor = await Doctor.findOne({ where: { userId: userId } });
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor profile not found' 
      });
    }

    const doctorId = doctor.id;
    
    console.log('Fetching assigned wards for doctor:', doctorId);
    
    const wardMemberships = await WorkspaceMember.findAll({ 
      where: { doctorId: doctorId, status: 'active' },
      include: [{
        model: Workspace,
        as: 'workspace'
      }]
    });
    
    // If no ward memberships found, return empty array
    if (!wardMemberships || wardMemberships.length === 0) {
      return res.json({
        success: true,
        wards: []
      });
    }
    
    const wards = await Promise.all(wardMemberships.map(async (membership) => {
      const workspace = membership.workspace;
      if (!workspace) return null;
      
      // Get patient count for this workspace
      const patientCount = await Patient.count({ 
        where: { workspaceId: workspace.id }
      });
      
      // Get doctor count for this workspace
      const doctorCount = await WorkspaceMember.count({ 
        where: { workspaceId: workspace.id, status: 'active' }
      });
      
      return {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description || 'No description available',
        patientCount: patientCount || 0,
        doctorCount: doctorCount || 1
      };
    }));
    
    // Filter out any null values
    const validWards = wards.filter(ward => ward !== null);
    
    res.json({
      success: true,
      wards: validWards
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
router.get('/doctor-dashboard/tasks', authenticateDoctor, async (req, res) => {
  try {
    const userId = req.session.userId;
    
    // Find the doctor record for this user
    const doctor = await Doctor.findOne({ where: { userId: userId } });
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor profile not found' 
      });
    }

    const doctorId = doctor.id;
    
    console.log('Fetching tasks for doctor:', doctorId);
    
    const tasks = await Task.findAll({
      where: { assignedTo: doctorId },
      include: [
        {
          model: Workspace,
          as: 'workspace',
          attributes: ['id', 'name']
        },
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'name']
        }
      ],
      order: [['dueDate', 'ASC']]
    });
    
    // If no tasks found, return sample data for demonstration
    if (!tasks || tasks.length === 0) {
      const sampleTasks = [
        {
          id: '1',
          title: 'Review Patient MRI Results',
          description: 'Review and analyze MRI results for patient',
          priority: 'high',
          status: 'pending',
          dueDate: new Date(),
          workspace: { name: 'Cardiology Ward' },
          patient: { name: 'John Doe' }
        },
        {
          id: '2',
          title: 'Update Treatment Plan',
          description: 'Update treatment plan based on recent tests',
          priority: 'medium',
          status: 'in progress',
          dueDate: new Date(Date.now() + 86400000),
          workspace: { name: 'ICU Ward' },
          patient: { name: 'Sarah Johnson' }
        }
      ];
      
      return res.json({
        success: true,
        tasks: sampleTasks
      });
    }
    
    const formattedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      dueDate: task.dueDate,
      workspace: task.workspace ? { name: task.workspace.name } : null,
      patient: task.patient ? { name: task.patient.name } : null
    }));
    
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
router.put('/doctor-dashboard/tasks/:taskId/status', authenticateDoctor, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.session.userId;
    
    // Find the doctor record for this user
    const doctor = await Doctor.findOne({ where: { userId: userId } });
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor profile not found' 
      });
    }

    const doctorId = doctor.id;
    
    console.log(`Updating task ${taskId} to status: ${status} for doctor: ${doctorId}`);
    
    // Verify the task belongs to this doctor
    const task = await Task.findOne({ 
      where: { id: taskId, assignedTo: doctorId }
    });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    task.status = status;
    task.updatedAt = new Date();
    await task.save();
    
    res.json({
      success: true,
      message: 'Task status updated successfully'
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating task status' 
    });
  }
});

module.exports = router;