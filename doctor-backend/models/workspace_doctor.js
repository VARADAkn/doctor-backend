module.exports = (sequelize, DataTypes) => {
  const WorkspaceDoctor = sequelize.define(
    "WorkspaceDoctor",
    {
      workSpaceId: {
        type: DataTypes.UUID,
        references: {
          model: "workspaces",
          key: "id",
        },
        primaryKey: true,
      },
      doctorId: {
        type: DataTypes.UUID,
        references: {
          model: "doctors",
          key: "id",
        },
        primaryKey: true,
      },
    },
    {
      tableName: "workspace_doctors",
      timestamps: false,
    }
  );

  return WorkspaceDoctor;
};