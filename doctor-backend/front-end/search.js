// search.js - Offline Medical Knowledge Database
// This data is used when the internet is unavailable (offline fallback)

const OFFLINE_MEDICAL_DATA = [
    {
        term: 'Diabetes Mellitus',
        description: 'A disease that occurs when your blood glucose is too high.',
        definition: 'A chronic, metabolic disease characterized by elevated levels of blood glucose (or blood sugar), which leads over time to serious damage to the heart, blood vessels, eyes, kidneys and nerves.',
        symptoms: 'Increased thirst, frequent urination, unexplained weight loss, fatigue, blurred vision.',
        treatment: 'Insulin injections, dietary changes, regular exercise, blood sugar monitoring.',
        category: 'Endocrinology'
    },
    {
        term: 'Hypertension',
        description: 'High blood pressure.',
        definition: 'A condition in which the force of the blood against the artery walls is too high.',
        symptoms: 'Often shows no symptoms. Severe cases: headaches, shortness of breath, nosebleeds.',
        treatment: 'Reduced salt intake, healthy diet, physical activity, medication (ACE inhibitors, beta-blockers).',
        category: 'Cardiology'
    },
    {
        term: 'Osteoarthritis',
        description: 'Degenerative joint disease.',
        definition: 'The most common form of arthritis, affecting millions of people worldwide. It occurs when the protective cartilage that cushions the ends of the bones wears down over time.',
        symptoms: 'Pain, stiffness, tenderness, loss of flexibility, grating sensation, bone spurs.',
        treatment: 'Physical therapy, medications (pain relievers), injections, surgery in severe cases.',
        category: 'Joint Disease'
    },
    {
        term: 'Paracetamol',
        description: 'Common pain reliever and fever reducer.',
        definition: 'A common medication used to treat pain and fever. It is typically used for mild to moderate pain relief.',
        symptoms: 'N/A (Medication)',
        treatment: 'Used for fever and pain relief. Standard dosage: 500mg-1g every 4-6 hours. Maximum 4g per day.',
        category: 'Analgesics'
    },
    {
        term: 'Asthma',
        description: 'A condition in which your airways narrow and swell.',
        definition: 'A chronic respiratory condition that causes inflammation and narrowing of the bronchial tubes, leading to difficulty breathing.',
        symptoms: 'Shortness of breath, chest tightness, wheezing, coughing (especially at night or early morning).',
        treatment: 'Inhalers (bronchodilators, corticosteroids), avoiding triggers, long-term control medications.',
        category: 'Pulmonology'
    },
    {
        term: 'Malaria',
        description: 'A mosquito-borne infectious disease.',
        definition: 'A life-threatening disease caused by Plasmodium parasites transmitted through the bite of infected Anopheles mosquitoes.',
        symptoms: 'Fever, chills, headache, nausea, vomiting, muscle pain, fatigue, sweating.',
        treatment: 'Antimalarial medications (Chloroquine, Artemisinin-based combination therapies), prevention with mosquito nets and repellents.',
        category: 'Infectious Disease'
    },
    {
        term: 'Tuberculosis',
        description: 'A bacterial infection that mainly affects the lungs.',
        definition: 'An infectious disease caused by Mycobacterium tuberculosis. It mainly affects the lungs but can also affect other parts of the body.',
        symptoms: 'Persistent cough (3+ weeks), coughing blood, chest pain, weight loss, night sweats, fever, fatigue.',
        treatment: 'Combination antibiotic therapy (Isoniazid, Rifampicin, Pyrazinamide, Ethambutol) for 6-9 months.',
        category: 'Infectious Disease'
    },
    {
        term: 'COVID-19',
        description: 'A respiratory illness caused by the SARS-CoV-2 virus.',
        definition: 'An infectious disease caused by the SARS-CoV-2 coronavirus, first identified in 2019. It primarily affects the respiratory system.',
        symptoms: 'Fever, dry cough, tiredness, loss of taste or smell, sore throat, headache, body aches, difficulty breathing.',
        treatment: 'Rest, fluids, fever reducers, antiviral medications in severe cases, vaccination for prevention.',
        category: 'Infectious Disease'
    },
    {
        term: 'Cancer',
        description: 'A group of diseases involving abnormal cell growth.',
        definition: 'A disease in which abnormal cells divide uncontrollably and destroy body tissue. Cancer can start almost anywhere in the human body.',
        symptoms: 'Unexplained weight loss, fatigue, pain, skin changes, unusual bleeding, lumps, persistent cough.',
        treatment: 'Surgery, chemotherapy, radiation therapy, immunotherapy, targeted therapy, hormone therapy.',
        category: 'Oncology'
    },
    {
        term: 'Heart Disease',
        description: 'A range of conditions that affect the heart.',
        definition: 'Cardiovascular disease refers to conditions that involve narrowed or blocked blood vessels that can lead to heart attack, chest pain (angina), or stroke.',
        symptoms: 'Chest pain (angina), shortness of breath, pain in the neck/jaw/throat, numbness in legs/arms, irregular heartbeat.',
        treatment: 'Lifestyle changes, medications (statins, blood thinners), surgical procedures (angioplasty, bypass surgery).',
        category: 'Cardiology'
    },
    {
        term: 'Stroke',
        description: 'A medical emergency where blood supply to the brain is interrupted.',
        definition: 'A stroke occurs when the blood supply to part of your brain is interrupted or reduced, preventing brain tissue from getting oxygen and nutrients.',
        symptoms: 'Sudden numbness/weakness (face, arm, leg), confusion, trouble speaking, vision problems, severe headache, loss of balance.',
        treatment: 'Emergency treatment with clot-busting drugs (tPA), surgery, rehabilitation therapy, blood pressure management.',
        category: 'Neurology'
    },
    {
        term: 'Aspirin',
        description: 'A medication used to reduce pain, fever, and inflammation.',
        definition: 'A nonsteroidal anti-inflammatory drug (NSAID) used as an analgesic, antipyretic, and anti-inflammatory medication. Also used in low doses to prevent heart attacks and strokes.',
        symptoms: 'N/A (Medication)',
        treatment: 'Pain relief, fever reduction, anti-inflammatory. Low-dose aspirin used for cardiovascular prevention.',
        category: 'Analgesics'
    },
    {
        term: 'Ibuprofen',
        description: 'An NSAID used to relieve pain and reduce inflammation.',
        definition: 'A nonsteroidal anti-inflammatory drug used for treating pain, fever, and inflammation. Common brand names include Advil and Motrin.',
        symptoms: 'N/A (Medication)',
        treatment: 'Used for headaches, dental pain, menstrual cramps, muscle aches, arthritis. Standard dose: 200-400mg every 4-6 hours.',
        category: 'NSAIDs'
    },
    {
        term: 'Insulin',
        description: 'A hormone that regulates blood sugar levels.',
        definition: 'A peptide hormone produced by beta cells of the pancreatic islets. It regulates the metabolism of carbohydrates, fats, and protein by promoting the absorption of glucose.',
        symptoms: 'N/A (Medication/Hormone)',
        treatment: 'Used to manage Type 1 and Type 2 diabetes. Administered via injection or insulin pump.',
        category: 'Endocrinology'
    },
    {
        term: 'Pneumonia',
        description: 'An infection that inflames the air sacs in one or both lungs.',
        definition: 'An infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm, fever, chills, and difficulty breathing.',
        symptoms: 'Chest pain when breathing or coughing, confusion, cough with phlegm, fatigue, fever, sweating, chills, nausea, vomiting, diarrhea, shortness of breath.',
        treatment: 'Antibiotics (for bacterial pneumonia), antiviral medications, rest, fluids, fever reducers, oxygen therapy in severe cases.',
        category: 'Pulmonology'
    },
    {
        term: 'Migraine',
        description: 'A severe recurring headache, often accompanied by nausea and sensitivity to light.',
        definition: 'A neurological condition that causes intense, debilitating headaches, often on one side of the head. It is often accompanied by nausea, vomiting, and extreme sensitivity to light and sound.',
        symptoms: 'Throbbing or pulsating pain, nausea, vomiting, sensitivity to light/sound, aura (visual disturbances), tingling in face or hands.',
        treatment: 'Pain-relieving medications (triptans, NSAIDs), preventive medications (beta-blockers, antidepressants), lifestyle modifications, avoiding triggers.',
        category: 'Neurology'
    },
    {
        term: 'Flu',
        description: 'A common viral infection affecting the respiratory system.',
        definition: 'Influenza is a viral infection that attacks the respiratory system (nose, throat, and lungs). It is commonly called the flu.',
        symptoms: 'Fever, chills, muscle aches, cough, congestion, runny nose, headaches, fatigue, sore throat.',
        treatment: 'Rest, fluids, antiviral drugs (oseltamivir/Tamiflu), fever reducers, annual flu vaccination for prevention.',
        category: 'Infectious Disease'
    },
    {
        term: 'Allergy',
        description: 'An immune system response to a foreign substance.',
        definition: 'Allergies occur when your immune system reacts to a foreign substance such as pollen, bee venom, pet dander, or food that does not cause a reaction in most people.',
        symptoms: 'Sneezing, itching, runny nose, watery eyes, swelling, hives, rash, anaphylaxis (severe cases).',
        treatment: 'Antihistamines, decongestants, corticosteroids, immunotherapy (allergy shots), avoiding allergens, epinephrine (for anaphylaxis).',
        category: 'Immunology'
    },
    {
        term: 'Dengue',
        description: 'A mosquito-borne tropical disease.',
        definition: 'A mosquito-borne viral infection causing a severe flu-like illness. It is transmitted by Aedes mosquitoes, primarily Aedes aegypti.',
        symptoms: 'High fever, severe headache, pain behind the eyes, joint and muscle pain, fatigue, nausea, vomiting, skin rash, mild bleeding.',
        treatment: 'No specific treatment. Rest, hydration, pain relievers (acetaminophen), avoid aspirin/ibuprofen, hospitalization for severe cases.',
        category: 'Infectious Disease'
    },
    {
        term: 'Cholesterol',
        description: 'A waxy substance found in blood.',
        definition: 'A waxy, fat-like substance found in all cells of the body. High cholesterol can increase the risk of heart disease and stroke.',
        symptoms: 'No direct symptoms. Detected through blood tests. High levels lead to atherosclerosis and heart disease over time.',
        treatment: 'Statins (atorvastatin, rosuvastatin), healthy diet (low saturated fat), regular exercise, weight management.',
        category: 'Cardiology'
    },
    {
        term: 'Anemia',
        description: 'A condition where blood lacks enough healthy red blood cells.',
        definition: 'A condition in which you lack enough healthy red blood cells to carry adequate oxygen to your body tissues. It can make you feel tired and weak.',
        symptoms: 'Fatigue, weakness, pale skin, irregular heartbeats, shortness of breath, dizziness, cold hands and feet, headache.',
        treatment: 'Iron supplements, vitamin B12 supplements, folic acid, dietary changes (iron-rich foods), blood transfusions in severe cases.',
        category: 'Hematology'
    },
    {
        term: 'Atorvastatin',
        description: 'A statin medication used to lower cholesterol.',
        definition: 'A medication in the statin class used to prevent cardiovascular disease and treat abnormal lipid levels. Brand name: Lipitor.',
        symptoms: 'N/A (Medication)',
        treatment: 'Used to lower LDL cholesterol and triglycerides, and raise HDL cholesterol. Typical dose: 10-80mg once daily.',
        category: 'Statins'
    },
    {
        term: 'Antibiotic',
        description: 'A type of antimicrobial substance used against bacterial infections.',
        definition: 'Medications used to treat bacterial infections by killing bacteria or inhibiting their growth. They do not work against viral infections.',
        symptoms: 'N/A (Medication class)',
        treatment: 'Used for bacterial infections. Common types: Amoxicillin, Azithromycin, Ciprofloxacin. Must complete the full course as prescribed.',
        category: 'Pharmacology'
    },
    {
        term: 'Fracture',
        description: 'A break in a bone.',
        definition: 'A broken bone. Fractures can range from a thin crack to a complete break. Bone can fracture crosswise, lengthwise, in several places, or into many pieces.',
        symptoms: 'Intense pain, swelling, bruising, deformity, difficulty moving the affected area, numbness, tingling.',
        treatment: 'Immobilization (cast, splint), pain management, surgery (for complex fractures), physical therapy during recovery.',
        category: 'Orthopedics'
    },
    {
        term: 'HIV',
        description: 'Human Immunodeficiency Virus.',
        definition: 'A virus that attacks the immune system, specifically CD4 cells (T cells). If untreated, HIV reduces the number of CD4 cells, making the person more likely to get infections.',
        symptoms: 'Early: fever, chills, rash, night sweats, muscle aches, sore throat, fatigue, swollen lymph nodes, mouth ulcers. Later: rapid weight loss, chronic diarrhea, pneumonia.',
        treatment: 'Antiretroviral therapy (ART), no cure but manageable as a chronic condition with proper medication, PrEP for prevention.',
        category: 'Infectious Disease'
    },
    {
        term: 'Vaccination',
        description: 'Administration of a vaccine to develop immunity.',
        definition: 'The administration of a vaccine to help the immune system develop protection from a disease. Vaccines contain weakened or inactive parts of a particular organism.',
        symptoms: 'N/A (Preventive measure)',
        treatment: 'Preventive immunization against diseases such as measles, polio, tetanus, hepatitis, influenza, COVID-19, etc.',
        category: 'Immunology'
    },

    {
        term: 'Appendicitis',
        description: 'Inflammation of the appendix.',
        definition: 'A condition where the appendix becomes inflamed and filled with pus, causing pain.',
        symptoms: 'Abdominal pain (right side), nausea, vomiting, fever, loss of appetite.',
        treatment: 'Surgical removal (appendectomy), antibiotics.',
        category: 'Gastroenterology'
    },
    {
        term: 'Gastritis',
        description: 'Inflammation of stomach lining.',
        definition: 'A condition where the stomach lining becomes inflamed or irritated.',
        symptoms: 'Stomach pain, nausea, vomiting, bloating, indigestion.',
        treatment: 'Antacids, proton pump inhibitors, avoiding spicy food.',
        category: 'Gastroenterology'
    },
    {
        term: 'Ulcer',
        description: 'Open sore in stomach or intestine.',
        definition: 'A sore that develops on the lining of the stomach, small intestine, or esophagus.',
        symptoms: 'Burning stomach pain, bloating, heartburn, nausea.',
        treatment: 'Antibiotics (if H. pylori), acid-reducing medications.',
        category: 'Gastroenterology'
    },
    {
        term: 'Bronchitis',
        description: 'Inflammation of bronchial tubes.',
        definition: 'A respiratory condition where bronchial tubes become inflamed.',
        symptoms: 'Cough, mucus, fatigue, shortness of breath.',
        treatment: 'Rest, fluids, cough medicine, bronchodilators.',
        category: 'Pulmonology'
    },
    {
        term: 'Sinusitis',
        description: 'Inflammation of sinuses.',
        definition: 'Swelling of tissue lining the sinuses causing blockage.',
        symptoms: 'Facial pain, nasal congestion, headache, fever.',
        treatment: 'Decongestants, antibiotics, steam inhalation.',
        category: 'ENT'
    },
    {
        term: 'Conjunctivitis',
        description: 'Pink eye infection.',
        definition: 'Inflammation of the conjunctiva of the eye.',
        symptoms: 'Redness, itching, discharge, tearing.',
        treatment: 'Eye drops, antihistamines, antibiotics.',
        category: 'Ophthalmology'
    },
    {
        term: 'Epilepsy',
        description: 'Neurological disorder causing seizures.',
        definition: 'A disorder characterized by recurrent seizures due to abnormal brain activity.',
        symptoms: 'Seizures, confusion, staring spells.',
        treatment: 'Anti-epileptic drugs, surgery in severe cases.',
        category: 'Neurology'
    },
    {
        term: 'Parkinson’s Disease',
        description: 'Movement disorder.',
        definition: 'A progressive nervous system disorder affecting movement.',
        symptoms: 'Tremors, stiffness, slow movement.',
        treatment: 'Medications (Levodopa), therapy.',
        category: 'Neurology'
    },
    {
        term: 'Alzheimer’s Disease',
        description: 'Memory loss disorder.',
        definition: 'A progressive disease that destroys memory and cognitive function.',
        symptoms: 'Memory loss, confusion, difficulty thinking.',
        treatment: 'Medications, supportive care.',
        category: 'Neurology'
    },
    {
        term: 'Depression',
        description: 'Mood disorder.',
        definition: 'A mental health disorder characterized by persistent sadness.',
        symptoms: 'Low mood, loss of interest, fatigue.',
        treatment: 'Therapy, antidepressants.',
        category: 'Psychiatry'
    },
    {
        term: 'Anxiety',
        description: 'Excessive worry or fear.',
        definition: 'A mental condition characterized by feelings of worry or fear.',
        symptoms: 'Restlessness, rapid heartbeat, sweating.',
        treatment: 'Therapy, medication.',
        category: 'Psychiatry'
    },
    {
        term: 'Obesity',
        description: 'Excess body fat.',
        definition: 'A condition of abnormal or excessive fat accumulation.',
        symptoms: 'Weight gain, fatigue, breathing issues.',
        treatment: 'Diet, exercise, medication, surgery.',
        category: 'Endocrinology'
    },
    {
        term: 'Hypothyroidism',
        description: 'Underactive thyroid.',
        definition: 'A condition where thyroid gland produces less hormones.',
        symptoms: 'Fatigue, weight gain, cold sensitivity.',
        treatment: 'Thyroid hormone replacement.',
        category: 'Endocrinology'
    },
    {
        term: 'Hyperthyroidism',
        description: 'Overactive thyroid.',
        definition: 'Excess production of thyroid hormones.',
        symptoms: 'Weight loss, rapid heartbeat, sweating.',
        treatment: 'Medication, radioactive iodine.',
        category: 'Endocrinology'
    },
    {
        term: 'Kidney Stones',
        description: 'Hard deposits in kidneys.',
        definition: 'Solid masses made of crystals in the kidneys.',
        symptoms: 'Severe pain, nausea, blood in urine.',
        treatment: 'Pain relief, hydration, surgery.',
        category: 'Urology'
    },
    {
        term: 'Urinary Tract Infection',
        description: 'Infection in urinary system.',
        definition: 'Infection affecting kidneys, bladder, or urethra.',
        symptoms: 'Burning urination, frequent urge, cloudy urine.',
        treatment: 'Antibiotics, hydration.',
        category: 'Urology'
    },
    {
        term: 'Hepatitis',
        description: 'Liver inflammation.',
        definition: 'Inflammation of liver caused by viruses or toxins.',
        symptoms: 'Jaundice, fatigue, abdominal pain.',
        treatment: 'Antivirals, rest.',
        category: 'Hepatology'
    },
    {
        term: 'Cirrhosis',
        description: 'Liver scarring.',
        definition: 'Chronic liver damage leading to scarring.',
        symptoms: 'Fatigue, swelling, jaundice.',
        treatment: 'Lifestyle changes, transplant.',
        category: 'Hepatology'
    },
    {
        term: 'Leukemia',
        description: 'Blood cancer.',
        definition: 'Cancer of blood-forming tissues.',
        symptoms: 'Fatigue, infections, bleeding.',
        treatment: 'Chemotherapy, radiation.',
        category: 'Oncology'
    },
    {
        term: 'Lymphoma',
        description: 'Cancer of lymph system.',
        definition: 'Cancer affecting lymphocytes.',
        symptoms: 'Swollen lymph nodes, fever.',
        treatment: 'Chemotherapy, radiation.',
        category: 'Oncology'
    },

    // ---- Continue similar pattern ----
    {
        term: 'Measles',
        description: 'Viral infection with rash.',
        definition: 'Highly contagious viral disease.',
        symptoms: 'Fever, rash, cough.',
        treatment: 'Supportive care, vaccination prevention.',
        category: 'Infectious Disease'
    },
    {
        term: 'Chickenpox',
        description: 'Viral skin infection.',
        definition: 'Caused by varicella-zoster virus.',
        symptoms: 'Itchy rash, fever.',
        treatment: 'Antivirals, calamine lotion.',
        category: 'Infectious Disease'
    },
    {
        term: 'Typhoid',
        description: 'Bacterial infection.',
        definition: 'Caused by Salmonella typhi.',
        symptoms: 'High fever, weakness, stomach pain.',
        treatment: 'Antibiotics.',
        category: 'Infectious Disease'
    },
    {
        term: 'Rabies',
        description: 'Fatal viral disease.',
        definition: 'Spread through animal bites.',
        symptoms: 'Fever, confusion, paralysis.',
        treatment: 'Vaccination immediately after exposure.',
        category: 'Infectious Disease'
    },
    {
        term: 'Polio',
        description: 'Viral paralysis disease.',
        definition: 'Affects nervous system.',
        symptoms: 'Paralysis, weakness.',
        treatment: 'No cure, vaccination prevents.',
        category: 'Infectious Disease'
    },
    {
        term: 'Eczema',
        description: 'Skin inflammation.',
        definition: 'Condition causing itchy skin.',
        symptoms: 'Dry skin, rash.',
        treatment: 'Moisturizers, steroids.',
        category: 'Dermatology'
    },
    {
        term: 'Psoriasis',
        description: 'Autoimmune skin disease.',
        definition: 'Rapid skin cell growth causing scaling.',
        symptoms: 'Red patches, itching.',
        treatment: 'Topical therapy, phototherapy.',
        category: 'Dermatology'
    },
    {
        term: 'Acne',
        description: 'Skin condition.',
        definition: 'Occurs when hair follicles clog.',
        symptoms: 'Pimples, blackheads.',
        treatment: 'Topical creams, antibiotics.',
        category: 'Dermatology'
    },
    {
        term: 'Glaucoma',
        description: 'Eye pressure disease.',
        definition: 'Damage to optic nerve due to pressure.',
        symptoms: 'Vision loss.',
        treatment: 'Eye drops, surgery.',
        category: 'Ophthalmology'
    },
    {
        term: 'Cataract',
        description: 'Clouding of eye lens.',
        definition: 'Leads to vision impairment.',
        symptoms: 'Blurred vision.',
        treatment: 'Surgery.',
        category: 'Ophthalmology'
    },
    {
        term: 'Back Pain',
        description: 'Common musculoskeletal issue.',
        definition: 'Pain in the back muscles or spine.',
        symptoms: 'Stiffness, pain.',
        treatment: 'Rest, physiotherapy.',
        category: 'Orthopedics'
    },
    {
        term: 'Arthritis',
        description: 'Joint inflammation.',
        definition: 'Inflammation of joints.',
        symptoms: 'Pain, swelling.',
        treatment: 'Pain relievers, therapy.',
        category: 'Orthopedics'
    },
    {
        term: 'Sprain',
        description: 'Ligament injury.',
        definition: 'Stretching or tearing of ligaments.',
        symptoms: 'Pain, swelling.',
        treatment: 'Rest, ice, compression.',
        category: 'Orthopedics'
    },
    {
        term: 'Burn',
        description: 'Skin injury.',
        definition: 'Damage caused by heat or chemicals.',
        symptoms: 'Redness, pain.',
        treatment: 'Cooling, dressing.',
        category: 'Emergency'
    },
    {
        term: 'Dehydration',
        description: 'Loss of body fluids.',
        definition: 'Occurs when body loses more fluids than it takes in.',
        symptoms: 'Thirst, dizziness.',
        treatment: 'Oral fluids, IV fluids.',
        category: 'General Medicine'
    },

    {
        term: 'Sepsis',
        description: 'Life-threatening response to infection.',
        definition: 'A serious condition caused by the body’s extreme response to infection leading to organ failure.',
        symptoms: 'Fever, rapid heart rate, confusion, difficulty breathing.',
        treatment: 'IV antibiotics, fluids, intensive care.',
        category: 'Emergency'
    },
    {
        term: 'Meningitis',
        description: 'Inflammation of brain membranes.',
        definition: 'Inflammation of the meninges caused by infection.',
        symptoms: 'Stiff neck, fever, headache, sensitivity to light.',
        treatment: 'Antibiotics, antivirals, hospitalization.',
        category: 'Neurology'
    },
    {
        term: 'Vertigo',
        description: 'Spinning sensation.',
        definition: 'A feeling of dizziness where surroundings seem to spin.',
        symptoms: 'Dizziness, nausea, imbalance.',
        treatment: 'Medications, vestibular therapy.',
        category: 'Neurology'
    },
    {
        term: 'Insomnia',
        description: 'Sleep disorder.',
        definition: 'Difficulty falling or staying asleep.',
        symptoms: 'Poor sleep, fatigue, irritability.',
        treatment: 'Sleep hygiene, medication, therapy.',
        category: 'Psychiatry'
    },
    {
        term: 'Sleep Apnea',
        description: 'Breathing disorder during sleep.',
        definition: 'Repeated stopping and starting of breathing during sleep.',
        symptoms: 'Snoring, daytime sleepiness.',
        treatment: 'CPAP machine, lifestyle changes.',
        category: 'Pulmonology'
    },
    {
        term: 'Pancreatitis',
        description: 'Inflammation of pancreas.',
        definition: 'Condition where pancreas becomes inflamed.',
        symptoms: 'Severe abdominal pain, nausea.',
        treatment: 'Hospital care, fasting, fluids.',
        category: 'Gastroenterology'
    },
    {
        term: 'Gallstones',
        description: 'Hardened digestive fluid deposits.',
        definition: 'Solid particles forming in the gallbladder.',
        symptoms: 'Abdominal pain, nausea.',
        treatment: 'Surgery, medications.',
        category: 'Gastroenterology'
    },
    {
        term: 'GERD',
        description: 'Acid reflux disease.',
        definition: 'Chronic digestive disorder where stomach acid flows back.',
        symptoms: 'Heartburn, chest pain.',
        treatment: 'Antacids, lifestyle changes.',
        category: 'Gastroenterology'
    },
    {
        term: 'Hemorrhoids',
        description: 'Swollen veins in rectum.',
        definition: 'Inflamed veins in lower rectum or anus.',
        symptoms: 'Pain, bleeding.',
        treatment: 'Creams, surgery.',
        category: 'Gastroenterology'
    },
    {
        term: 'Celiac Disease',
        description: 'Gluten intolerance.',
        definition: 'Autoimmune disorder triggered by gluten.',
        symptoms: 'Diarrhea, bloating.',
        treatment: 'Gluten-free diet.',
        category: 'Gastroenterology'
    },
    {
        term: 'Multiple Sclerosis',
        description: 'Nerve disease.',
        definition: 'Immune system attacks protective covering of nerves.',
        symptoms: 'Numbness, weakness.',
        treatment: 'Immunotherapy.',
        category: 'Neurology'
    },
    {
        term: 'ALS',
        description: 'Motor neuron disease.',
        definition: 'Progressive neurodegenerative disease.',
        symptoms: 'Muscle weakness.',
        treatment: 'Supportive care.',
        category: 'Neurology'
    },
    {
        term: 'Gout',
        description: 'Joint inflammation due to uric acid.',
        definition: 'Form of arthritis caused by uric acid crystals.',
        symptoms: 'Severe joint pain.',
        treatment: 'Anti-inflammatory drugs.',
        category: 'Rheumatology'
    },
    {
        term: 'Lupus',
        description: 'Autoimmune disease.',
        definition: 'Body attacks its own tissues.',
        symptoms: 'Fatigue, joint pain.',
        treatment: 'Immunosuppressants.',
        category: 'Immunology'
    },
    {
        term: 'Sickle Cell Disease',
        description: 'Genetic blood disorder.',
        definition: 'Abnormal red blood cells.',
        symptoms: 'Pain, anemia.',
        treatment: 'Medications, transfusion.',
        category: 'Hematology'
    },
    {
        term: 'Thalassemia',
        description: 'Inherited blood disorder.',
        definition: 'Reduced hemoglobin production.',
        symptoms: 'Fatigue, weakness.',
        treatment: 'Transfusions.',
        category: 'Hematology'
    },
    {
        term: 'DVT',
        description: 'Deep vein thrombosis.',
        definition: 'Blood clot in deep veins.',
        symptoms: 'Leg pain, swelling.',
        treatment: 'Blood thinners.',
        category: 'Cardiology'
    },
    {
        term: 'Atherosclerosis',
        description: 'Artery narrowing.',
        definition: 'Build-up of fats in arteries.',
        symptoms: 'Chest pain.',
        treatment: 'Lifestyle changes, medication.',
        category: 'Cardiology'
    },
    {
        term: 'Arrhythmia',
        description: 'Irregular heartbeat.',
        definition: 'Abnormal heart rhythm.',
        symptoms: 'Palpitations.',
        treatment: 'Medication, pacemaker.',
        category: 'Cardiology'
    },
    {
        term: 'Endocarditis',
        description: 'Heart lining infection.',
        definition: 'Infection of inner heart lining.',
        symptoms: 'Fever, fatigue.',
        treatment: 'Antibiotics.',
        category: 'Cardiology'
    },
    {
        term: 'Prostate Cancer',
        description: 'Cancer in prostate gland.',
        definition: 'Growth of cancer cells in prostate.',
        symptoms: 'Urination problems.',
        treatment: 'Surgery, radiation.',
        category: 'Oncology'
    },
    {
        term: 'Breast Cancer',
        description: 'Cancer in breast tissue.',
        definition: 'Malignant tumor in breast cells.',
        symptoms: 'Lump, discharge.',
        treatment: 'Surgery, chemo.',
        category: 'Oncology'
    },
    {
        term: 'Ovarian Cancer',
        description: 'Cancer in ovaries.',
        definition: 'Abnormal cell growth in ovaries.',
        symptoms: 'Abdominal bloating.',
        treatment: 'Surgery, chemo.',
        category: 'Oncology'
    },
    {
        term: 'Testicular Cancer',
        description: 'Cancer in testicles.',
        definition: 'Cancer affecting male reproductive organs.',
        symptoms: 'Lump, pain.',
        treatment: 'Surgery.',
        category: 'Oncology'
    },
    {
        term: 'Fibromyalgia',
        description: 'Chronic pain disorder.',
        definition: 'Widespread musculoskeletal pain.',
        symptoms: 'Fatigue, pain.',
        treatment: 'Medication, therapy.',
        category: 'Rheumatology'
    },
    {
        term: 'Sciatica',
        description: 'Nerve pain.',
        definition: 'Pain along sciatic nerve.',
        symptoms: 'Leg pain.',
        treatment: 'Physiotherapy.',
        category: 'Neurology'
    },
    {
        term: 'Tonsillitis',
        description: 'Inflamed tonsils.',
        definition: 'Infection of tonsils.',
        symptoms: 'Sore throat.',
        treatment: 'Antibiotics.',
        category: 'ENT'
    },
    {
        term: 'Laryngitis',
        description: 'Voice box inflammation.',
        definition: 'Inflammation of larynx.',
        symptoms: 'Hoarseness.',
        treatment: 'Rest voice.',
        category: 'ENT'
    },
    {
        term: 'Otitis Media',
        description: 'Middle ear infection.',
        definition: 'Infection behind eardrum.',
        symptoms: 'Ear pain.',
        treatment: 'Antibiotics.',
        category: 'ENT'
    },
    {
        term: 'Hyperlipidemia',
        description: 'High fat in blood.',
        definition: 'Elevated cholesterol or triglycerides.',
        symptoms: 'None usually.',
        treatment: 'Statins, diet.',
        category: 'Cardiology'
    },
    {
        term: 'Hypotension',
        description: 'A condition in which blood pressure is abnormally low, leading to reduced blood flow to vital organs.',
        definition: 'Hypotension refers to a decrease in blood pressure below the normal range, which can result in inadequate perfusion of tissues and organs, potentially causing dizziness, fainting, or shock in severe cases.',
        symptoms: 'Dizziness, lightheadedness, fainting (syncope), blurred vision, fatigue, nausea, and in severe cases confusion or shock.',
        treatment: 'Treatment includes increasing fluid and salt intake, medications to raise blood pressure, treating underlying causes, and lifestyle modifications such as slow position changes.',
        category: 'Cardiology'
    },
    {
        term: 'Myocarditis',
        description: 'Inflammation of the heart muscle often caused by infections.',
        definition: 'Myocarditis is a condition characterized by inflammation of the myocardium (heart muscle), which can affect the heart’s electrical system and reduce its ability to pump effectively.',
        symptoms: 'Chest pain, fatigue, shortness of breath, irregular heartbeat, and in severe cases heart failure symptoms.',
        treatment: 'Treatment includes rest, medications to manage heart function, anti-inflammatory drugs, and treating the underlying infection if present.',
        category: 'Cardiology'
    },
    {
        term: 'Pericarditis',
        description: 'Inflammation of the sac surrounding the heart.',
        definition: 'Pericarditis is the inflammation of the pericardium, the thin sac-like membrane surrounding the heart, often causing sharp chest pain due to friction between its layers.',
        symptoms: 'Sharp chest pain that worsens with breathing, fever, fatigue, and palpitations.',
        treatment: 'Anti-inflammatory medications, pain relievers, rest, and in severe cases drainage of excess fluid.',
        category: 'Cardiology'
    },
    {
        term: 'Bronchiectasis',
        description: 'Chronic condition causing widened and damaged airways.',
        definition: 'Bronchiectasis is a long-term condition where the bronchial tubes become permanently widened, leading to mucus buildup and frequent infections.',
        symptoms: 'Chronic cough, production of large amounts of mucus, breathlessness, fatigue, and recurrent lung infections.',
        treatment: 'Airway clearance techniques, antibiotics, bronchodilators, and physiotherapy.',
        category: 'Pulmonology'
    },
    {
        term: 'Pleural Effusion',
        description: 'Accumulation of fluid around the lungs.',
        definition: 'Pleural effusion is a condition where excess fluid collects in the pleural space between the lungs and chest wall, impairing breathing.',
        symptoms: 'Shortness of breath, chest pain, dry cough, and reduced lung expansion.',
        treatment: 'Drainage of fluid, treating underlying cause such as infection or heart failure.',
        category: 'Pulmonology'
    },
    {
        term: 'Hepatomegaly',
        description: 'Abnormal enlargement of the liver.',
        definition: 'Hepatomegaly refers to an increase in liver size beyond normal limits, often indicating underlying liver disease or systemic conditions.',
        symptoms: 'Abdominal discomfort, fatigue, nausea, jaundice, and swelling in abdomen.',
        treatment: 'Treatment focuses on managing the underlying cause such as infections, fatty liver disease, or alcohol-related damage.',
        category: 'Hepatology'
    },
    {
        term: 'Splenomegaly',
        description: 'Enlargement of the spleen.',
        definition: 'Splenomegaly is the abnormal enlargement of the spleen, which may result from infections, liver diseases, or blood disorders.',
        symptoms: 'Pain or fullness in upper left abdomen, fatigue, anemia, frequent infections.',
        treatment: 'Treating underlying condition, in severe cases splenectomy.',
        category: 'Hematology'
    },
    {
        term: 'Cystitis',
        description: 'Inflammation of the bladder, usually due to infection.',
        definition: 'Cystitis is a urinary condition commonly caused by bacterial infection, leading to irritation and inflammation of the bladder lining.',
        symptoms: 'Burning sensation during urination, frequent urge to urinate, pelvic discomfort, cloudy urine.',
        treatment: 'Antibiotics, increased fluid intake, pain relief medications.',
        category: 'Urology'
    },
    {
        term: 'Nephritis',
        description: 'Inflammation of the kidneys.',
        definition: 'Nephritis is a condition involving inflammation of kidney tissues, which can impair kidney function and filtration.',
        symptoms: 'Swelling, high blood pressure, reduced urine output, blood in urine.',
        treatment: 'Medications to control inflammation, blood pressure management, and dietary changes.',
        category: 'Nephrology'
    },
    {
        term: 'Glomerulonephritis',
        description: 'Inflammation of kidney filtering units.',
        definition: 'Glomerulonephritis is a group of diseases that injure the part of the kidney that filters blood (glomeruli), leading to impaired kidney function.',
        symptoms: 'Blood in urine, protein in urine, swelling, high blood pressure.',
        treatment: 'Immunosuppressants, blood pressure control, dialysis if severe.',
        category: 'Nephrology'
    },
    {
        term: 'Dermatitis',
        description: 'Inflammation of the skin.',
        definition: 'Dermatitis refers to a group of skin conditions characterized by inflammation, redness, itching, and irritation.',
        symptoms: 'Red rash, itching, swelling, blisters or dry skin.',
        treatment: 'Topical creams, antihistamines, avoiding irritants.',
        category: 'Dermatology'
    },
    {
        term: 'Melanoma',
        description: 'Serious type of skin cancer.',
        definition: 'Melanoma is a malignant tumor arising from pigment-producing melanocytes and is the most dangerous form of skin cancer.',
        symptoms: 'New or changing moles, irregular borders, color changes, itching or bleeding.',
        treatment: 'Surgical removal, immunotherapy, chemotherapy in advanced cases.',
        category: 'Oncology'
    },
    {
        term: 'Aphasia',
        description: 'Loss of ability to communicate.',
        definition: 'Aphasia is a language disorder caused by brain damage, affecting the ability to speak, understand, read, or write.',
        symptoms: 'Difficulty speaking, understanding speech, reading or writing problems.',
        treatment: 'Speech therapy, rehabilitation.',
        category: 'Neurology'
    },
    {
        term: 'Ataxia',
        description: 'Loss of coordination.',
        definition: 'Ataxia is a neurological sign consisting of lack of voluntary coordination of muscle movements.',
        symptoms: 'Unsteady walking, poor coordination, slurred speech.',
        treatment: 'Physical therapy, treating underlying cause.',
        category: 'Neurology'
    },
    {
        term: 'Dysphagia',
        description: 'Difficulty swallowing.',
        definition: 'Dysphagia is a condition where a person has trouble swallowing food or liquids.',
        symptoms: 'Pain while swallowing, choking, coughing during meals.',
        treatment: 'Diet changes, therapy, treating underlying cause.',
        category: 'Gastroenterology'
    },
    {
        term: 'Alopecia',
        description: 'Hair loss condition.',
        definition: 'Alopecia refers to partial or complete loss of hair from the scalp or other parts of the body.',
        symptoms: 'Hair thinning, bald patches.',
        treatment: 'Medications, hair therapy, lifestyle changes.',
        category: 'Dermatology'
    },
    {
        term: 'Edema',
        description: 'Swelling caused by fluid retention.',
        definition: 'Edema is the accumulation of excess fluid in body tissues, leading to swelling.',
        symptoms: 'Swelling, tight skin, weight gain.',
        treatment: 'Diuretics, reducing salt intake.',
        category: 'General Medicine'
    }


];

/**
 * Search the offline medical knowledge database
 * @param {string} query - The search term
 * @returns {Array} - Matching medical records
 */
function offlineSearch(query) {
    if (!query || query.trim() === '') return [];

    const cleanQuery = query.trim().toLowerCase();

    // Search by term, description, definition, symptoms, treatment, and category
    const results = OFFLINE_MEDICAL_DATA.filter(item => {
        return (
            item.term.toLowerCase().includes(cleanQuery) ||
            item.description.toLowerCase().includes(cleanQuery) ||
            item.definition.toLowerCase().includes(cleanQuery) ||
            item.category.toLowerCase().includes(cleanQuery) ||
            (item.symptoms && item.symptoms.toLowerCase().includes(cleanQuery)) ||
            (item.treatment && item.treatment.toLowerCase().includes(cleanQuery))
        );
    });

    return results;
}
