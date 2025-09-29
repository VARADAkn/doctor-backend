const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const WorkSpace = sequelize.define(
  "WorkSpace",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
  },
  {
    tableName: "workspaces",
    timestamps: true,
  }
);

module.exports = WorkSpace;
