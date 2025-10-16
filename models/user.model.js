// models/user.model.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true, // Ensures the value is a valid email format
      },
    },
    phone: {
      type: DataTypes.STRING,
      unique: true, // Ensures no two users can have the same phone number
      allowNull: false, // This is required for your login logic
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('patient', 'doctor', 'admin'), // Restricts the role to only these values
      allowNull: false, // A user must have a role
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return User;
};