module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define("ChatRoom", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    workSpaceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "workspaces",
        key: "id"
      }
    }
  }, {
    tableName: "chat_rooms",
    timestamps: true
  });

  return ChatRoom;
};
