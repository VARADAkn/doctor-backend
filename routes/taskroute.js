const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskcontroller');

// Defines routes for /tasks

router.post('/create', taskController.createTask);
router.post('/update', taskController.updateTask);
router.post('/get', taskController.getTasks);
router.post('/find', taskController.getTask);
router.post('/delete', taskController.deleteTask);

module.exports = router;
