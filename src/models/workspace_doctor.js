const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const WorkspaceDoctor = sequelize.define(
  "WorkspaceDoctor",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    workSpaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'workspaces', key: 'id' }
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'doctors', key: 'id' }
    },
    createdBy: { type: DataTypes.STRING },
  },
  {
    tableName: "workspace_doctors",
    timestamps: true,
  }
);

module.exports = WorkspaceDoctor;
