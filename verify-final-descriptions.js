require('dotenv').config();
const { MedicalKnowledge, sequelize } = require('./models');

async function verifyUltimateKnowledge() {
    console.log('\n--- Verifying Ultimate Medical Knowledge ---');
    const termsToTest = ['Flu', 'Ischemia', 'Hypertension', 'Snake Bite'];

    try {
        for (const term of termsToTest) {
            const result = await MedicalKnowledge.findOne({
                where: { term: term }
            });

            if (result) {
                const sentenceCount = result.description.split('. ').length;
                console.log(`✅ Term: ${term}`);
                console.log(`   Sentence Count: ${sentenceCount}`);
                console.log(`   Detailed Enough: ${sentenceCount >= 10 ? 'YES' : 'NO'}`);
                if (sentenceCount < 10) {
                    console.log(`   ACTUAL SENTENCES: ${sentenceCount}`);
                }
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

verifyUltimateKnowledge();
