const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activitycontroller');


router.post('/create', activityController.createActivity);
router.post('/update', activityController.updateActivity);
router.post('/get', activityController.getActivities);
router.post('/find', activityController.getActivity);
router.post('/delete', activityController.deleteActivity);

module.exports = router;
