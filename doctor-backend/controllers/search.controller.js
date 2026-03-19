const { Patient, MedicalKnowledge } = require('../models');
const { Op } = require('sequelize');
const axios = require('axios');

// Basic list of medical keywords for validation
// In a real app, this could be a call to a medical dictionary API or a more extensive regex.
const medicalKeywords = [
    'disease', 'treatment', 'medicine', 'drug', 'symptom', 'diagnosis', 'pain', 'fever', 'cough',
    'cancer', 'diabetes', 'heart', 'blood', 'infection', 'virus', 'bacteria', 'surgery', 'vaccine',
    'therapy', 'pill', 'tablet', 'dose', 'allergic', 'asthma', 'flu', 'covid', 'malaria', 'tb',
    'hiv', 'aids', 'hypertension', 'stroke', 'headache', 'fracture', 'scan', 'test', 'result',
    'doctor', 'nurse', 'hospital', 'clinic', 'patient', 'medical', 'health', 'condition',
    'paracetamol', 'aspirin', 'ibuprofen', 'antibiotic', 'insulin', 'vaccination', 'allergy',
    'pharmacy', 'prescription', 'sore', 'infection', 'injury', 'cardiac', 'respiratory',
    'chemotherapy', 'cancer', 'tumor', 'oncology', 'radiology', 'mri', 'ct scan', 'x-ray',
    'surgery', 'operation', 'pediatric', 'geriatric', 'psychiatry', 'neurology', 'dentist',
    'atorvastatin', 'statin', 'cholesterol', 'lipitor', 'medicine', 'pharma', 'pill'
];

exports.searchMedicalTerm = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ success: false, message: 'Search query is required' });
        }

        const cleanQuery = query.trim();
        const lowerQuery = cleanQuery.toLowerCase();

        // 1. Offline Search (Internal Knowledge Base)
        const offlineResults = await MedicalKnowledge.findAll({
            where: {
                term: { [Op.iLike]: `%${cleanQuery}%` }
            },
            limit: 5
        });

        // 2. Online Search (Wikipedia API)
        let onlineResults = null;
        try {
            const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(cleanQuery)}`;
            const response = await axios.get(wikiUrl, {
                timeout: 3000, // 3 seconds timeout
                headers: {
                    'User-Agent': 'MedicalSearchBot/1.0 (contact: admin@example.com)'
                }
            });

            if (response.data && response.data.query && response.data.query.pages) {
                const pages = response.data.query.pages;
                const pageId = Object.keys(pages)[0];

                if (pageId !== "-1") {
                    onlineResults = {
                        title: pages[pageId].title,
                        extract: pages[pageId].extract || "No description available.",
                        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(pages[pageId].title)}`
                    };
                }
            }
        } catch (wikiError) {
            console.error('Wikipedia search error:', wikiError.message);
        }

        // 3. Validation Logic Refined:
        // A term is medical if it exists in our DB, returns a Wiki result, OR matches our keyword list.
        const hasOffline = offlineResults && offlineResults.length > 0;
        const hasOnline = !!onlineResults;
        const matchesKeyword = medicalKeywords.some(keyword => lowerQuery.includes(keyword)) ||
            /itis$|osis$|pathic$|oma$|emia$/.test(lowerQuery);

        if (!hasOffline && !hasOnline && !matchesKeyword) {
            return res.json({
                success: true,
                isMedical: false,
                message: 'sorry this is not a medical term ..'
            });
        }

        res.json({
            success: true,
            isMedical: true,
            query: cleanQuery,
            offline: offlineResults,
            online: onlineResults
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ success: false, message: 'Internal server error during search' });
    }
};
