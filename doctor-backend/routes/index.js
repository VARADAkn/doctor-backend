const express = require('express');
const router = express.Router();

// Import individual route files
const doctorRoutes = require('./doctorroute');
const patientRoutes = require('./patientroute');
const workspaceRoutes = require('./workspaceroute');
const taskRoutes = require('./taskroute');
const activityRoutes = require('./activityroute');
const workspaceDoctorRoutes = require('./workspacedoctorroute');
const appointmentRoutes = require('./appointmentroute');
const chatRoutes = require('./chatroute');


// Mount the routes on their base paths
router.use('/doctors', doctorRoutes);
router.use('/patients', patientRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/tasks', taskRoutes);
router.use('/activities', activityRoutes);
router.use('/workspace-doctors', workspaceDoctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/chat', chatRoutes);

//const auditLogRoutes = require('./auditlog.routes');
//router.use('/audit-logs', auditLogRoutes);


module.exports = router;

