// models/medicalknowledge.js

module.exports = (sequelize, DataTypes) => {
    const MedicalKnowledge = sequelize.define('MedicalKnowledge', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        term: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        definition: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        symptoms: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        treatment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'MedicalKnowledges',
        timestamps: true
    });

    return MedicalKnowledge;
};
