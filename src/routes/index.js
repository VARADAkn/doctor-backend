const express = require('express');
const router = express.Router();

// Import controllers
const doctorController = require('../controllers/doctorcontroller');
const patientController = require('../controllers/patientcontroller');
const workspaceController = require('../controllers/workspacecontroller');
const taskController = require('../controllers/taskcontroller');
const activityController = require('../controllers/activitycontroller');

// --- Doctor Routes ---
router.post('/doctors/create', doctorController.createDoctor);
router.post('/doctors/update', doctorController.updateDoctor);
router.post('/doctors/get', doctorController.getDoctors);
router.post('/doctors/find', doctorController.getDoctor);
router.post('/doctors/delete', doctorController.deleteDoctor);

// --- Patient Routes ---
router.post('/patients/create', patientController.createPatient);
router.post('/patients/update', patientController.updatePatient);
router.post('/patients/get', patientController.getPatients);
router.post('/patients/find', patientController.getPatient);
router.post('/patients/delete', patientController.deletePatient);

// --- Workspace Routes ---
router.post('/workspaces/create', workspaceController.createWorkSpace);
router.post('/workspaces/update', workspaceController.updateWorkSpace);
router.post('/workspaces/get', workspaceController.getWorkSpaces);
router.post('/workspaces/find', workspaceController.getWorkSpace);
router.post('/workspaces/delete', workspaceController.deleteWorkSpace);

// --- Task Routes ---
router.post('/tasks/create', taskController.createTask);
router.post('/tasks/update', taskController.updateTask);
router.post('/tasks/get', taskController.getTasks);
router.post('/tasks/find', taskController.getTask);
router.post('/tasks/delete', taskController.deleteTask);

// --- Activity Routes ---
router.post('/activities/create', activityController.createActivity);
router.post('/activities/update', activityController.updateActivity);
router.post('/activities/get', activityController.getActivities);
router.post('/activities/find', activityController.getActivity);
router.post('/activities/delete', activityController.deleteActivity);

module.exports = router;
