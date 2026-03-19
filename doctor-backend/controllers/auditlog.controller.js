const { AuditLog, User } = require('../models');

/**
 * Get all audit logs with filters and pagination
 */
exports.getLogs = async (req, res, next) => {
    try {
        const { userId, role, action, entityType, limit = 50, offset = 0 } = req.query;

        const where = {};
        if (userId) where.userId = userId;
        if (role) where.role = role;
        if (action) where.action = action;
        if (entityType) where.entityType = entityType;

        const logs = await AuditLog.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['email', 'phone'],
                }
            ]
        });

        res.json({
            total: logs.count,
            logs: logs.rows,
            limit,
            offset
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get logs for a specific user
 */
exports.getUserLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog.findAll({
            where: { userId: req.params.userId },
            order: [['createdAt', 'DESC']],
            limit: 100
        });
        res.json(logs);
    } catch (err) {
        next(err);
    }
};
