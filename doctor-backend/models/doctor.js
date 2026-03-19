// models/doctor.js
module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define(
    "Doctor",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      // REMOVED: phoneNumber, email - These are now in the User model.
      licenceNumber: { type: DataTypes.STRING, unique: true },
      specialization: { type: DataTypes.STRING }, // Corrected spelling
      qualification: { type: DataTypes.STRING },
      yearOfExperience: { type: DataTypes.INTEGER },
      bio: { type: DataTypes.TEXT },
      // ADDED: Foreign key to link to the User table
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users', // This must match the table name for the User model
          key: 'id',
        },
      },
      createdBy: { type: DataTypes.STRING },
    },
    {
      tableName: "doctors",
      timestamps: true,
    }
  );

  return Doctor;
};