// models/medicalrecord.js
module.exports = (sequelize, DataTypes) => {
  const MedicalRecord = sequelize.define(
    "MedicalRecord",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      patientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'patients',
          key: 'id',
        },
      },
      recordType: {
        type: DataTypes.ENUM('consultation', 'lab_result', 'prescription', 'surgery', 'vaccination', 'other'),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      diagnosis: DataTypes.TEXT,
      treatment: DataTypes.TEXT,
      medications: DataTypes.TEXT,
      vitalSigns: DataTypes.JSON, // { bp: '120/80', heartRate: 72, temperature: 98.6 }
      labResults: DataTypes.JSON, // { bloodSugar: 100, cholesterol: 180 }
      attachments: DataTypes.JSON, // File paths or URLs
      recordDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      nextFollowUp: DataTypes.DATE,
      createdBy: DataTypes.STRING,
    },
    {
      tableName: "medical_records",
      timestamps: true,
    }
  );

  return MedicalRecord;
};