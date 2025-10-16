// models/patient.js
module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define(
    "Patient",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      // REMOVED: phoneNumber, email
      dob: DataTypes.DATEONLY, // Use DATEONLY for dates without time
      age: DataTypes.INTEGER, // Use INTEGER for age
      gender: DataTypes.STRING,
      bloodGroup: DataTypes.STRING,
      address: DataTypes.STRING,
      // ... (other medical fields)
      // ADDED: Foreign key to link to the User table
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      workSpaceId: {
        type: DataTypes.UUID,
        references: { model: "workspaces", key: "id" },
      },
      createdBy: DataTypes.STRING,
    },
    {
      tableName: "patients",
      timestamps: true,
    }
  );

  return Patient;
};