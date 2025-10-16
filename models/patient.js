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
      dob: DataTypes.DATEONLY,
      age: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      bloodGroup: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      emergencyContact: DataTypes.STRING,
      emergencyPhone: DataTypes.STRING,
      // Medical fields
      medicalHistory: DataTypes.TEXT,
      allergies: DataTypes.TEXT,
      currentMedications: DataTypes.TEXT,
      chronicConditions: DataTypes.TEXT,
      lastVisit: DataTypes.DATE,
      nextAppointment: DataTypes.DATE,
      notes: DataTypes.TEXT,
      // Foreign keys
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