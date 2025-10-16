module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      status: { type: DataTypes.STRING, defaultValue: "Pending" },
      priority: { type: DataTypes.STRING },
      dueDate: { type: DataTypes.DATE },
      assignedTo: {
        type: DataTypes.UUID,
        references: { model: "doctors", key: "id" },
      },
      patientId: {
        type: DataTypes.UUID,
        references: { model: "patients", key: "id" },
      },
      createdBy: { type: DataTypes.STRING },
    },
    {
      tableName: "tasks",
      timestamps: true,
    }
  );

  return Task;
};