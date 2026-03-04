const db = require('../models');

/**
 * Get messages for a workspace chat
 */
exports.getWorkspaceMessages = async (req, res) => {
  const { workSpaceId } = req.params;

  const chatRoom = await db.ChatRoom.findOne({ where: { workSpaceId } });
  if (!chatRoom) return res.json([]);

  const messages = await db.Message.findAll({
    where: { chatRoomId: chatRoom.id },
    include: [{
      model: db.Doctor,
      attributes: ['id', 'name']
    }],
    order: [['createdAt', 'ASC']]
  });

  res.json(messages);
};

/**
 * Send a message in a workspace
 */
exports.sendMessage = async (req, res) => {
    const { workSpaceId, content } = req.body; // <-- use req.body here

    const chatRoom = await db.ChatRoom.findOne({ where: { workSpaceId } });
    if (!chatRoom) return res.status(404).json({ message: 'Chat room not found' });

    const doctorId = req.user?.doctorId; // assuming you have user in req
    const message = await db.Message.create({
        chatRoomId: chatRoom.id,
        senderDoctorId: doctorId,
        content
    });

    const doctor = await db.Doctor.findByPk(doctorId, { attributes: ['id', 'name'] });

    res.json({
        success: true,
        message: {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            doctor: doctor
        }
    });
};

