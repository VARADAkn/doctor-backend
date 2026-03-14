require('dotenv').config();
const { MedicalKnowledge, sequelize } = require('./models');

async function verifyComprehensiveKnowledge() {
    console.log('\n--- Verifying Comprehensive Medical Knowledge ---');
    const termsToTest = ['Flu', 'Snake Bite', 'Paracetamol', 'Hypertension'];

    try {
        for (const term of termsToTest) {
            const result = await MedicalKnowledge.findOne({
                where: { term: term }
            });

            if (result) {
                console.log(`✅ Found term: ${term}`);
                console.log(`   Description Length: ${result.description.length} characters`);
                console.log(`   Sentence Count (approx): ${result.description.split('. ').length}`);
                console.log(`   Preview: ${result.description.substring(0, 100)}...`);
            } else {
                console.log(`❌ Term NOT found: ${term}`);
            }
        }
        process.exit(0);
    } catch (error) {
        console.error('Verification error:', error);
        process.exit(1);
    }
}

verifyComprehensiveKnowledge();
