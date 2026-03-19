// models/appointment.js
module.exports = (sequelize, DataTypes) => {
    const Appointment = sequelize.define(
        "Appointment",
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
            doctorId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'doctors',
                    key: 'id',
                },
            },
            workSpaceId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'workspaces',
                    key: 'id',
                },
            },
            appointmentDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            appointmentTime: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            duration: {
                type: DataTypes.INTEGER, // in minutes
                defaultValue: 30,
            },
            status: {
                type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'processed'),
                defaultValue: 'pending',
            },
            reason: DataTypes.TEXT,
            notes: DataTypes.TEXT,
            type: {
                type: DataTypes.ENUM('consultation', 'follow-up', 'emergency', 'routine'),
                defaultValue: 'routine',
            },
        },
        {
            tableName: "appointments",
            timestamps: true,
        }
    );

    return Appointment;
};
