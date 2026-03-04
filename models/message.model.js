module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        senderId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        receiverId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    });

    return Message;
};
