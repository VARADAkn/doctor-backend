const { SkinCondition } = require('../models');

// Fetch all conditions for frontend caching
exports.getLibrary = async (req, res) => {
    try {
        const conditions = await SkinCondition.findAll();
        console.log(`[SkinController] Serving library with ${conditions.length} entries.`);
        res.status(200).json(conditions);
    } catch (error) {
        console.error('[SkinController] Library fetch failed:', error);
        res.status(500).json({ error: 'Failed to fetch skin condition library' });
    }
};

// Search conditions by name or key
exports.search = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ error: 'Query is required' });

        const { Op } = require('sequelize');
        const conditions = await SkinCondition.findAll({
            where: {
                [Op.or]: [
                    { displayName: { [Op.iLike]: `%${query}%` } },
                    { key: { [Op.iLike]: `%${query}%` } },
                    { description: { [Op.iLike]: `%${query}%` } }
                ]
            }
        });
        res.status(200).json(conditions);
    } catch (error) {
        console.error('[SkinController] Search failed:', error);
        res.status(500).json({ error: 'Search failed' });
    }
};
