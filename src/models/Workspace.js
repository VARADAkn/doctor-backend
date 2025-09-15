const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const WorkSpace = sequelize.define(
  "WorkSpace",
  {
    id: { type: DataTypes.INTEGER,autoIncrement:true, primaryKey: true },
    companyId: { type: DataTypes.STRING },
    workSpaceId: { type: DataTypes.STRING, allowNull: false },
    doctorId: { type: DataTypes.STRING, allowNull: false },
    createdBy: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "workspaces",
    timestamps: true,
  }
);

module.exports = WorkSpace;
