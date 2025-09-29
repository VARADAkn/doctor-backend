const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Doctor = sequelize.define(
  "Doctor",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    licenceNumber: { type: DataTypes.STRING, unique: true },
    specification: { type: DataTypes.STRING },
    qualification: { type: DataTypes.STRING },
    yearOfExperience: { type: DataTypes.INTEGER },
    bio: { type: DataTypes.TEXT },
    nickName: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
  },
  {
    tableName: "doctors",
    timestamps: true,
  }
);

module.exports = Doctor;
