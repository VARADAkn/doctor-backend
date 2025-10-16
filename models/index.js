// models/index.js

const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.js'); // Corrected path assuming config is in the root

// ✅ Initialize Sequelize
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false, // disable logging for cleaner output
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ Import and INITIALIZE all models by calling their exported functions
db.User = require('./user.model.js')(sequelize, DataTypes); // ✅ ADD THIS
db.Doctor = require('./doctor.js')(sequelize, DataTypes);
db.Patient = require('./patient.js')(sequelize, DataTypes);
db.WorkSpace = require('./Workspace.js')(sequelize, DataTypes);
db.WorkspaceDoctor = require('./workspace_doctor.js')(sequelize, DataTypes);
db.Task = require('./task.js')(sequelize, DataTypes);
db.Activity = require('./activity.js')(sequelize, DataTypes);
// ✅ Define Relationships
db.User.hasOne(db.Doctor, { foreignKey: 'userId', as: 'doctorProfile' });
db.Doctor.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasOne(db.Patient, { foreignKey: 'userId', as: 'patientProfile' });
db.Patient.belongsTo(db.User, { foreignKey: 'userId' });
// Workspace <-> Patient (One-to-Many)
db.WorkSpace.hasMany(db.Patient, { foreignKey: 'workSpaceId' });
db.Patient.belongsTo(db.WorkSpace, { foreignKey: 'workSpaceId' });

// Workspace <-> Doctor (Many-to-Many)
db.WorkSpace.belongsToMany(db.Doctor, { through: db.WorkspaceDoctor, foreignKey: 'workSpaceId' });
db.Doctor.belongsToMany(db.WorkSpace, { through: db.WorkspaceDoctor, foreignKey: 'doctorId' });

// Task <-> Patient (One-to-Many)
db.Patient.hasMany(db.Task, { foreignKey: 'patientId' });
db.Task.belongsTo(db.Patient, { foreignKey: 'patientId' });

// Task <-> Doctor (One-to-Many, assuming a task is assigned to one doctor)
db.Doctor.hasMany(db.Task, { foreignKey: 'assignedTo' }); // Changed from doctorId to match your model
db.Task.belongsTo(db.Doctor, { foreignKey: 'assignedTo' }); // Changed from doctorId to match your model

// Task <-> Workspace (One-to-Many)
// Note: This relationship might be redundant if a task always belongs to a patient who is already in a workspace.
// But if a task can belong to a workspace directly, this is correct.
// db.WorkSpace.hasMany(db.Task, { foreignKey: 'workSpaceId' });
// db.Task.belongsTo(db.WorkSpace, { foreignKey: 'workSpaceId' });


// Activity <-> Task (One-to-Many)
db.Task.hasMany(db.Activity, { foreignKey: 'taskId' });
db.Activity.belongsTo(db.Task, { foreignKey: 'taskId' });


module.exports = db;