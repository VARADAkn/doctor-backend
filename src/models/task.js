const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Task = sequelize.define(
  "Task",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    patientId: { type: DataTypes.INTEGER, references: { model: 'patients', key: 'id' } },
    doctorId: { type: DataTypes.INTEGER, references: { model: 'doctors', key: 'id' } },
    workSpaceId: { type: DataTypes.INTEGER, references: { model: 'workspaces', key: 'id' } },
    createdBy: { type: DataTypes.STRING },
  },
  {
    tableName: "tasks",
    timestamps: true,
  }
);

module.exports = Task;
