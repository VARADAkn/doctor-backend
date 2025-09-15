const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Patient = sequelize.define(
  "Patient",
  {
    id: { type: DataTypes.INTEGER,autoIncrement:true,primaryKey:true },
    companyId: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    dob: { type: DataTypes.STRING },
    age: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    bloodGroup: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    emergencyContactName: { type: DataTypes.STRING },
    emergencyContactNumber: { type: DataTypes.STRING },
    emergencyContactRelation: { type: DataTypes.STRING },
    medicalHistory: { type: DataTypes.TEXT },
    allergies: { type: DataTypes.TEXT },
    currentMedications: { type: DataTypes.TEXT },
    insuranceDetails: { type: DataTypes.TEXT },
    workSpaceId: { type: DataTypes.INTEGER}, // FK
    createdBy: { type: DataTypes.STRING },
  },
  {
    tableName: "patients",
    timestamps: true,
  }
);

module.exports = Patient;
