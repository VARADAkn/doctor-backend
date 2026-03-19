// models/auditlog.js
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define(
    "AuditLog",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'user_id'
      },
      userEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'user_email'
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'entity_type'
      },
      entityId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'entity_id'
      },
      details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'ip_address'
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'user_agent'
      },
    },
    {
      tableName: "audit_logs",
      timestamps: true,
      updatedAt: false,
      underscored: true
    }
  );

  return AuditLog;
};
