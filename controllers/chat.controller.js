const db = require('../models');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.session.user.id; // Using session, based on server.js config

        if (!receiverId || !content) {
            return res.status(400).send({ message: "Content and Receiver are required" });
        }

        const message = await db.Message.create({
            senderId,
            receiverId,
            content
        });

        res.status(201).send({ success: true, message: "Message sent", data: message });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).send({ message: "Error sending message" });
    }
};

exports.getConversation = async (req, res) => {
    try {
        const currentUserId = req.session.user.id;
        const targetUserId = req.params.userId;

        const messages = await db.Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: currentUserId, receiverId: targetUserId },
                    { senderId: targetUserId, receiverId: currentUserId }
                ]
            },
            order: [['createdAt', 'ASC']],
            include: [
                { model: db.User, as: 'Sender', attributes: ['id', 'email', 'role'] }
            ]
        });

        res.status(200).send({ success: true, messages });
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).send({ message: "Error fetching conversation" });
    }
};

exports.getRecentChats = async (req, res) => {
    try {
        const currentUserId = req.session.user.id;

        // 1. Get all messages where user is sender or receiver, ordered by latest first
        const messages = await db.Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: currentUserId },
                    { receiverId: currentUserId }
                ]
            },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: db.User,
                    as: 'Sender',
                    attributes: ['id', 'email', 'role'],
                    include: [
                        { model: db.Doctor, as: 'doctorProfile', attributes: ['name'] },
                        { model: db.Patient, as: 'patientProfile', attributes: ['name'] }
                    ]
                },
                {
                    model: db.User,
                    as: 'Receiver',
                    attributes: ['id', 'email', 'role'],
                    include: [
                        { model: db.Doctor, as: 'doctorProfile', attributes: ['name'] },
                        { model: db.Patient, as: 'patientProfile', attributes: ['name'] }
                    ]
                }
            ]
        });

        const recentUsersMap = new Map();

        // 2. Iterate to find the latest message per conversation and count unreads
        for (const msg of messages) {
            const otherUser = msg.senderId === currentUserId ? msg.Receiver : msg.Sender;
            if (!otherUser) continue;

            if (!recentUsersMap.has(otherUser.id)) {
                let name = otherUser.email;
                if (otherUser.doctorProfile) name = otherUser.doctorProfile.name;
                else if (otherUser.patientProfile) name = otherUser.patientProfile.name;

                recentUsersMap.set(otherUser.id, {
                    user: {
                        id: otherUser.id,
                        email: otherUser.email,
                        role: otherUser.role,
                        name: name
                    },
                    lastMessage: msg.content,
                    lastMessageSenderId: msg.senderId,
                    time: msg.createdAt,
                    unreadCount: 0
                });
            }

            // Increment unread count if the message was sent TO current user and is NOT read
            if (msg.receiverId === currentUserId && !msg.read) {
                const entry = recentUsersMap.get(otherUser.id);
                entry.unreadCount += 1;
            }
        }

        const chats = Array.from(recentUsersMap.values()).sort((a, b) => new Date(b.time) - new Date(a.time));

        res.status(200).send({ success: true, chats });

    } catch (error) {
        console.error("Error fetching recent chats:", error);
        res.status(500).send({ message: "Error fetching recent chats" });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const { query, role } = req.query;

        const whereClause = {
            id: { [Op.ne]: req.session.user.id } // Exclude self
        };

        if (query) {
            whereClause.email = { [Op.iLike]: `%${query}%` };
        }

        if (role) {
            whereClause.role = role;
        }

        const users = await db.User.findAll({
            where: whereClause,
            attributes: ['id', 'email', 'role'],
            limit: 20,
            include: [
                { model: db.Doctor, as: 'doctorProfile', attributes: ['name', 'specialization'] },
                // Include Patient profile if needed, but primarily we care about names
                { model: db.Patient, as: 'patientProfile', attributes: ['name'] }
            ]
        });

        // Format result to include name from profile
        const formattedUsers = users.map(u => {
            let name = u.email;
            if (u.doctorProfile) name = u.doctorProfile.name;
            else if (u.patientProfile) name = u.patientProfile.name;

            return {
                id: u.id,
                email: u.email,
                role: u.role,
                name: name,
                specialization: u.doctorProfile ? u.doctorProfile.specialization : null
            };
        });

        res.status(200).send({ success: true, users: formattedUsers });
    } catch (error) {
        console.error("User search error:", error);
        res.status(500).send({ message: "Search failed" });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const count = await db.Message.count({
            where: {
                receiverId: userId,
                read: false
            }
        });

        let latestMessage = null;
        if (count > 0) {
            const msg = await db.Message.findOne({
                where: { receiverId: userId, read: false },
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: db.User,
                        as: 'Sender',
                        attributes: ['id', 'email', 'role'],
                        include: [
                            { model: db.Doctor, as: 'doctorProfile', attributes: ['name'] },
                            { model: db.Patient, as: 'patientProfile', attributes: ['name'] }
                        ]
                    }
                ]
            });

            if (msg && msg.Sender) {
                let name = msg.Sender.email;
                if (msg.Sender.doctorProfile) name = msg.Sender.doctorProfile.name;
                else if (msg.Sender.patientProfile) name = msg.Sender.patientProfile.name;

                latestMessage = {
                    senderId: msg.Sender.id,
                    senderName: name,
                    content: msg.content
                };
            }
        }

        res.status(200).send({ success: true, count, latestMessage });
    } catch (error) {
        console.error("Error getting unread count:", error);
        res.status(500).send({ message: "Error getting unread count" });
    }
};

exports.markMessagesAsRead = async (req, res) => {
    try {
        const currentUserId = req.session.user.id;
        const { senderId } = req.body;

        if (!senderId) {
            return res.status(400).send({ message: "Sender ID required" });
        }

        await db.Message.update(
            { read: true },
            {
                where: {
                    receiverId: currentUserId,
                    senderId: senderId,
                    read: false
                }
            }
        );

        res.status(200).send({ success: true });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).send({ message: "Error marking messages as read" });
    }
};
