const sequelize = require('../config/db');

const WorkSpace = require('./Workspace');
const Patient = require('./patient');

// Relationships
WorkSpace.hasMany(Patient, { foreignKey: 'workSpaceId' });
Patient.belongsTo(WorkSpace, { foreignKey: 'workSpaceId' });

module.exports = {
  sequelize,
  models: { WorkSpace, Patient }
};
