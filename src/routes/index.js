const express = require('express');
const router = express.Router();

// Import individual route files
const doctorRoutes = require('./doctorroutes');
const patientRoutes = require('./patientroute');
const workspaceRoutes = require('./workspaceroute');
const taskRoutes = require('./taskroute');
const activityRoutes = require('./activityroute');

// Mount the routes on their base paths
router.use('/doctors', doctorRoutes);
router.use('/patients', patientRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/tasks', taskRoutes);
router.use('/activities', activityRoutes);

module.exports = router;

