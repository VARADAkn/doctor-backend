const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Activity = sequelize.define(
  "Activity",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    instructions: { type: DataTypes.TEXT },
    priority: { type: DataTypes.STRING },
    reminder: { type: DataTypes.BOOLEAN, defaultValue: false },
    reminderTime: { type: DataTypes.DATE },
    notes: { type: DataTypes.TEXT },
    taskId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'tasks', key: 'id' } },
    patientId: { type: DataTypes.INTEGER, references: { model: 'patients', key: 'id' } },
    workSpaceId: { type: DataTypes.INTEGER, references: { model: 'workspaces', key: 'id' } },
    createdBy: { type: DataTypes.STRING },
  },
  {
    tableName: "activities",
    timestamps: true,
  }
);

module.exports = Activity;
