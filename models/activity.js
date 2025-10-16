module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define(
    "Activity",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      instructions: { type: DataTypes.TEXT },
      priority: { type: DataTypes.STRING },
      reminder: { type: DataTypes.BOOLEAN, defaultValue: false },
      reminderTime: { type: DataTypes.DATE },
      notes: { type: DataTypes.TEXT },
      taskId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "tasks", key: "id" },
      },
      patientId: {
        type: DataTypes.UUID,
        references: { model: "patients", key: "id" },
      },
      workSpaceId: {
        type: DataTypes.UUID,
        references: { model: "workspaces", key: "id" },
      },
      createdBy: { type: DataTypes.STRING },
    },
    {
      tableName: "activities",
      timestamps: true,
    }
  );

  return Activity;
};