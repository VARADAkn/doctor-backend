require('dotenv').config();
const { MedicalKnowledge, sequelize } = require('./models');

async function verifyTermExist() {
    try {
        const term = 'Cataract';
        const result = await MedicalKnowledge.findOne({
            where: { term: term }
        });
        if (result) {
            console.log(`✅ SUCCESS: Found ${term} in database.`);
            console.log(`   Description: ${result.description.substring(0, 100)}...`);
        } else {
            console.log(`❌ FAILURE: ${term} not found in database.`);
            const allTerms = await MedicalKnowledge.findAll({ attributes: ['term'] });
            console.log('Available terms:', allTerms.map(t => t.term).join(', '));
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
verifyTermExist();
