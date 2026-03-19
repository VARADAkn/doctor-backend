module.exports = (sequelize, DataTypes) => {
    const SkinCondition = sequelize.define('SkinCondition', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Unique identifier for matching (e.g., MEL, melanoma)'
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            comment: 'Malignant, Benign, etc.'
        },
        riskLevel: {
            type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
            defaultValue: 'Low'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        recommendedAction: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'skin_conditions',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['key']
            }
        ]
    });

    return SkinCondition;
};
