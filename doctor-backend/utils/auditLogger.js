const { AuditLog } = require('../models');

/**
 * Utility to log user activities to the database.
 * 
 * @param {Object} req - The Express request object to extract user and metadata.
 * @param {Object} options - Log details.
 * @param {string} options.action - The action performed (e.g., 'LOGIN', 'CREATE_APPOINTMENT').
 * @param {string} [options.entityType] - Type of entity affected.
 * @param {string} [options.entityId] - ID of the entity affected.
 * @param {Object} [options.details] - Additional JSON data.
 */
const logActivity = async (req, { action, entityType, entityId, details }) => {
    try {
        const userId = req.session?.userId || req.user?.id || null;
        const role = req.session?.role || req.user?.role || null;
        const userEmail = req.session?.email || req.user?.email || null;

        await AuditLog.create({
            userId,
            userEmail,
            role,
            action,
            entityType,
            entityId,
            details,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
        });
    } catch (error) {
        console.error('FAILED TO WRITE AUDIT LOG:', error);
        // We don't want to crash the main request if logging fails, 
        // but in a production app, you might want to send this to a secondary log service.
    }
};

module.exports = { logActivity };
