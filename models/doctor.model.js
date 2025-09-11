module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define("Doctor", {
    id: {
  type: DataTypes.STRING,  
  primaryKey: true,
  allowNull: false
},

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specialization: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "doctor"
    }
  });

  return Doctor;
};
