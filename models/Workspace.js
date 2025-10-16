module.exports = (sequelize, DataTypes) => {
  const WorkSpace = sequelize.define(
    "WorkSpace",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
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

  return WorkSpace;
};