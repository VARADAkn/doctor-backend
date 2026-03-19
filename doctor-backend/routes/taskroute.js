const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskcontroller');
const { isAdmin, isDoctor, isAuthenticated } = require('../middlewares/authSession');
//const { auditLogger } = require('../middlewares/auditLogger');
//const globalAudit = require('../middlewares/globalAudit');

//router.use(globalAudit('TASK'));


// Admin-only creation
router.post('/create', isAuthenticated, isAdmin, taskController.createTask);

// Role-based retrieval
router.post('/get', isAuthenticated, taskController.getTasks);

// Identity-based check
router.post('/find', isAuthenticated, taskController.getTask);

// Creator-only management
router.post('/update', isAuthenticated, taskController.updateTask);
router.post('/delete', isAuthenticated, taskController.deleteTask);

// Search
router.post('/search', isAuthenticated, taskController.searchTasks);

module.exports = router;
