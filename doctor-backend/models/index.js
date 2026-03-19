// models/index.js

const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.js');

// ✅ Initialize Sequelize
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: console.log, // Enable logging for debuggingSQL errors
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ Import and INITIALIZE all models
db.User = require('./user.model.js')(sequelize, DataTypes);
db.Doctor = require('./doctor.js')(sequelize, DataTypes);
db.Patient = require('./patient.js')(sequelize, DataTypes);
db.WorkSpace = require('./Workspace.js')(sequelize, DataTypes);
db.WorkspaceDoctor = require('./workspace_doctor.js')(sequelize, DataTypes);
db.Task = require('./task.js')(sequelize, DataTypes);
db.Activity = require('./activity.js')(sequelize, DataTypes);
db.AuditLog = require('./auditlog.js')(sequelize, DataTypes);
db.MedicalKnowledge = require('./search.js')(sequelize, DataTypes);
db.Appointment = require('./appointment.js')(sequelize, DataTypes);
db.SkinCondition = require('./SkinCondition.js')(sequelize, DataTypes);
db.Message = require('./chat.js')(sequelize, DataTypes);
db.MedicalKnowledge = require('./search.js')(sequelize, DataTypes);

// User <-> Doctor (One-to-One)
db.User.hasOne(db.Doctor, { foreignKey: 'userId', as: 'doctorProfile' });
db.Doctor.belongsTo(db.User, { foreignKey: 'userId', as: 'User' });

// User <-> Patient (One-to-One)
db.User.hasOne(db.Patient, { foreignKey: 'userId', as: 'patientProfile' });
db.Patient.belongsTo(db.User, { foreignKey: 'userId', as: 'User' });

// Workspace <-> Patient (One-to-Many)
db.WorkSpace.hasMany(db.Patient, { foreignKey: 'workSpaceId', as: 'Patients' });
db.Patient.belongsTo(db.WorkSpace, { foreignKey: 'workSpaceId', as: 'WorkSpace' });

// Workspace <-> Doctor (Many-to-Many)
db.WorkSpace.belongsToMany(db.Doctor, {
  through: db.WorkspaceDoctor,
  foreignKey: "workSpaceId",
  as: 'Doctors'
});
db.Doctor.belongsToMany(db.WorkSpace, {
  through: db.WorkspaceDoctor,
  foreignKey: "doctorId",
  as: 'WorkSpaces'
});

// Join Table Associations
db.WorkspaceDoctor.belongsTo(db.WorkSpace, { foreignKey: 'workSpaceId', as: 'WorkSpace' });
db.WorkspaceDoctor.belongsTo(db.Doctor, { foreignKey: 'doctorId', as: 'Doctor' });

// Patient <-> Task (One-to-Many)
db.Patient.hasMany(db.Task, { foreignKey: 'patientId', as: 'Tasks' });
db.Task.belongsTo(db.Patient, { foreignKey: 'patientId', as: 'Patient' });

// Doctor <-> Task (One-to-Many)
db.Doctor.hasMany(db.Task, { foreignKey: 'assignedTo', as: 'AssignedTasks' });
db.Task.belongsTo(db.Doctor, { foreignKey: 'assignedTo', as: 'Doctor' });

// Workspace <-> Task (One-to-Many)
db.WorkSpace.hasMany(db.Task, { foreignKey: 'workSpaceId', as: 'Tasks' });
db.Task.belongsTo(db.WorkSpace, { foreignKey: 'workSpaceId', as: 'WorkSpace' });

// Task <-> Admin/User (One-to-Many)
db.User.hasMany(db.Task, { foreignKey: 'createdByAdminId', as: 'CreatedTasks' });
db.Task.belongsTo(db.User, { foreignKey: 'createdByAdminId', as: 'Creator' });

// Workspace <-> Admin/User (One-to-Many)
db.User.hasMany(db.WorkSpace, { foreignKey: 'createdByAdminId', as: 'CreatedWorkspaces' });
db.WorkSpace.belongsTo(db.User, { foreignKey: 'createdByAdminId', as: 'Creator' });

// Activity <-> Task (One-to-Many)
db.Task.hasMany(db.Activity, { foreignKey: 'taskId', as: 'Activities' });
db.Activity.belongsTo(db.Task, { foreignKey: 'taskId', as: 'Task' });



// Patient <-> Appointment (One-to-Many)
db.Patient.hasMany(db.Appointment, { foreignKey: 'patientId', as: 'Appointments' });
db.Appointment.belongsTo(db.Patient, { foreignKey: 'patientId', as: 'Patient' });

// Doctor <-> Appointment (One-to-Many)
db.Doctor.hasMany(db.Appointment, { foreignKey: 'doctorId', as: 'Appointments' });
db.Appointment.belongsTo(db.Doctor, { foreignKey: 'doctorId', as: 'Doctor' });

// Workspace <-> Appointment (One-to-Many)
db.WorkSpace.hasMany(db.Appointment, { foreignKey: 'workSpaceId', as: 'Appointments' });
db.Appointment.belongsTo(db.WorkSpace, { foreignKey: 'workSpaceId', as: 'WorkSpace' });


// User <-> AuditLog (One-to-Many)
db.User.hasMany(db.AuditLog, { foreignKey: 'userId', as: 'AuditLogs' });
db.AuditLog.belongsTo(db.User, { foreignKey: 'userId', as: 'User' });

// Message <-> User Associations (for Sender and Receiver)
db.User.hasMany(db.Message, { foreignKey: 'senderId', as: 'SentMessages' });
db.User.hasMany(db.Message, { foreignKey: 'receiverId', as: 'ReceivedMessages' });
db.Message.belongsTo(db.User, { foreignKey: 'senderId', as: 'Sender' });
db.Message.belongsTo(db.User, { foreignKey: 'receiverId', as: 'Receiver' });


module.exports = db;