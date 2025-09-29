const sequelize = require('../config/db');

// Import all models
const Doctor = require('./doctor');
const Patient = require('./patient');
const WorkSpace = require('./Workspace');
const WorkspaceDoctor = require('./workspace_doctor');
const Task = require('./task');
const Activity = require('./activity');

// Define Relationships

// Workspace <-> Patient (One-to-Many)
WorkSpace.hasMany(Patient, { foreignKey: 'workSpaceId' });
Patient.belongsTo(WorkSpace, { foreignKey: 'workSpaceId' });

// Workspace <-> Doctor (Many-to-Many)
WorkSpace.belongsToMany(Doctor, { through: WorkspaceDoctor, foreignKey: 'workSpaceId' });
Doctor.belongsToMany(WorkSpace, { through: WorkspaceDoctor, foreignKey: 'doctorId' });

// Task Relationships
Task.belongsTo(Patient, { foreignKey: 'patientId' });
Patient.hasMany(Task, { foreignKey: 'patientId' });

Task.belongsTo(Doctor, { foreignKey: 'doctorId' });
Doctor.hasMany(Task, { foreignKey: 'doctorId' });

Task.belongsTo(WorkSpace, { foreignKey: 'workSpaceId' });
WorkSpace.hasMany(Task, { foreignKey: 'workSpaceId' });

// Activity <-> Task (One-to-Many)
Activity.belongsTo(Task, { foreignKey: 'taskId' });
Task.hasMany(Activity, { foreignKey: 'taskId' });

module.exports = {
  sequelize,
  models: {
    Doctor,
    Patient,
    WorkSpace,
    WorkspaceDoctor,
    Task,
    Activity,
  }
};
