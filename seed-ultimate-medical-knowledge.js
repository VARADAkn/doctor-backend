require('dotenv').config();
const { MedicalKnowledge, sequelize } = require('./models');

const ultimateKnowledgeData = [
    {
        term: 'Flu',
        description: 'The flu, or influenza, is an acute viral infection that primarily attacks the respiratory system, including the nose, throat, and lungs. While often confused with a common cold, flu symptoms are typically much more severe and develop far more rapidly. Common signs include a high fever, persistent cough, intense muscle aches, and extreme fatigue that can last for weeks. The virus is highly contagious and spreads through respiratory droplets released when an infected person coughs or sneezes. Most healthy individuals recover within a week, but the elderly and young children are at a much higher risk for complications like pneumonia. Preventive measures, such as annual vaccinations, are the most effective way to reduce the impact of the disease. Antiviral drugs can be prescribed by doctors to shorten the duration of the illness if started within the first 48 hours. Proper rest, hydration, and isolation from others are essential for a full recovery and to prevent further community transmission. Hand hygiene and wearing masks in crowded areas are also vital during the peak flu season. If symptoms like shortness of breath or persistent chest pain occur, immediate medical intervention is strictly necessary.',
        category: 'Condition'
    },
    {
        term: 'Fever',
        description: 'A fever is a temporary increase in body temperature, usually occurring in response to an infection or inflammatory condition. It is a critical part of the body\'s defense mechanism, as many viruses and bacteria cannot thrive at higher temperatures. In adults, a temperature above 100.4°F (38°C) is generally considered a fever, though individuals may react differently to different levels of heat. Common symptoms accompanying a fever include sweating, shivering, headaches, and general malaise or loss of appetite. Often, a fever is just one symptom of an underlying illness like the flu, a urinary tract infection, or even heat stroke. While uncomfortable, a moderate fever is rarely dangerous on its own for a healthy adult and often resolves without intervention. Over-the-counter medications like paracetamol or ibuprofen are effective at lowering the temperature and reducing associated aches. However, a very high fever (above 104°F) or one that persists for several days should always be evaluated by a healthcare professional. In children, a fever can sometimes trigger febrile seizures, which are frightening but usually harmless if monitored correctly. Staying hydrated is the most important supportive care, as high body heat can rapidly lead to debilitating dehydration.',
        category: 'Symptom'
    },
    {
        term: 'Common Cold',
        description: 'The common cold is a viral infection of the upper respiratory tract, primarily affecting the nose, sinuses, and throat. It is caused by over 200 different types of viruses, with rhinoviruses being the most frequent culprit globally. Unlike the flu, a cold usually starts gradually with a sore throat, runny nose, and sneezing, rarely causing high fevers. Most adults experience two to three colds per year, while children may have them even more frequently due to less developed immunity. There is currently no cure for the common cold, as antibiotics are ineffective against the viral causes of the infection. Treatment focuses strictly on symptom relief using decongestants, cough suppressants, and saline nasal sprays to improve comfort. Adequate rest and increased fluid intake are standard recommendations for allowing the immune system to fight the virus effectively. Most colds resolve completely within 7 to 10 days, although a lingering cough may persist for slightly longer. Complications such as secondary bacterial infections, like sinusitis or ear infections, can occasionally occur if symptoms worsen. Maintaining good hand hygiene and avoiding close contact with infected individuals remain the best strategies for prevention.',
        category: 'Condition'
    },
    {
        term: 'Snake Bite',
        description: 'A snake bite is an injury caused by the teeth of a snake, which may or may not involve the injection of venom. Venomous bites are medical emergencies that require immediate hospital treatment to prevent systemic toxicity or local tissue death. Symptoms of a venomous bite include severe pain, swelling, and discoloration at the site, along with potential nausea and dizziness. It is critical to keep the victim calm and localized to slow the spread of venom through the lymphatic system. Do not attempt to cut the wound, suck out the venom, or apply a tight tourniquet, as these actions often cause more harm. In a clinical setting, doctors will assess the bite to determine if anti-venom is required based on the species and symptoms. Identifying the snake\'s characteristics can be helpful, but one should never risk another bite to capture or kill the animal. Long-term complications can include permanent muscle damage, kidney failure, or even amputation if the venom causes extensive necrosis. Preventive measures include wearing thick boots and using a light when walking through tall grass or wooded areas at night. Most snake bites are non-venomous, but all should be treated with extreme caution until a professional diagnosis is made.',
        category: 'Injury'
    },
    {
        term: 'Paracetamol',
        description: 'Paracetamol, also known as acetaminophen, is one of the most widely used over-the-counter medications for pain relief and fever management. It is considered a first-line treatment for mild to moderate pain, including headaches, toothaches, and musculoskeletal aches. Structurally, it differs from non-steroidal anti-inflammatory drugs (NSAIDs) like ibuprofen because it has very little anti-inflammatory effect. It works primarily in the central nervous system to increase the pain threshold and regulate temperature through the hypothalamus. When used correctly, it is exceptionally safe for adults, children, and even pregnant women under medical guidance. However, the most significant danger of paracetamol is the potential for acute liver failure due to an overdose. Many multi-symptom cold and flu medications also contain paracetamol, leading to accidental double-dosing if labels aren\'t checked carefully. Because of the risk of permanent liver damage, the maximum daily recommended dose must never be exceeded under any circumstances. Alcohol consumption can also exacerbate the risk of paracetamol-induced toxicity, so caution is advised for regular drinkers. Despite these risks, it remains a cornerstone of modern medicine due to its high efficacy and relative safety profile.',
        category: 'Medication'
    },
    {
        term: 'Ischemia',
        description: 'Ischemia is a critical physiological state where blood flow to a specific tissue or organ is restricted, causing a shortage of oxygen. This restriction is often caused by a narrowing or complete blockage of the arteries due to plaque buildup or blood clots. Without a continuous supply of oxygenated blood, the affected tissues cannot perform essential metabolic functions and begin to die. Myocardial ischemia specifically affects the heart muscle and is a primary cause of chest pain or heart attacks. Cerebral ischemia occurs when blood flow to the brain is interrupted, frequently resulting in a debilitating stroke or transient ischemic attack. Symptoms vary widely depending on the organ involved but typically include sudden pain, numbness, or loss of motor function. Treatment strategies are focused on restoring blood flow as rapidly as possible through medications like thrombolytics or surgeries like angioplasty. If blood flow is not restored within a critical window, the resulting tissue damage (infarction) becomes permanent and irreversible. Long-term management involves controlling risk factors such as high cholesterol, hypertension, and smoking to prevent recurrence. Early recognition of ischemic symptoms is the single most important factor in improving patient outcomes and survival rates.',
        category: 'Condition'
    },
    {
        term: 'Hepatitis',
        description: 'Hepatitis is a clinical term referring to inflammation of the liver, an organ responsible for detoxifying blood and processing vital nutrients. While many factors can cause liver inflammation, including alcohol abuse and certain medications, viral infections are the most common cause. Hepatitis viruses are categorized from A to E, each having different modes of transmission and varying degrees of severity. Hepatitis A is typically acute and spread through contaminated food, while Hepatitis B and C can become chronic and life-threatening. Symptoms of liver inflammation often include jaundice (yellowing of the skin), dark urine, extreme fatigue, and abdominal tenderness. Chronic hepatitis can lead to severe complications such as cirrhosis, which is extensive scarring of the liver tissue, or liver cancer. Modern medicine now offers highly effective antiviral treatments that can cure Hepatitis C and keep Hepatitis B under control. Vaccines are also widely available and recommended for preventing Hepatitis A and B, significantly reducing global infection rates. If left untreated, the liver may eventually fail, necessitating a complex and high-risk liver transplant procedure. Regular screening is essential for individuals at high risk, as early-stage hepatitis often presents no obvious physical symptoms.',
        category: 'Condition'
    },
    {
        term: 'Hypertension',
        description: 'Hypertension, or high blood pressure, is a chronic medical condition where the force of the blood against the artery walls is too high. Over time, this persistent pressure damages the arteries and makes the heart work significantly harder to pump blood. It is frequently labeled the "silent killer" because most people do not experience any symptoms until severe complications arise. Long-term, uncontrolled hypertension is a primary risk factor for more serious events like heart attacks, kidney failure, and strokes. Diagnosis is made through repeated blood pressure measurements, with readings above 130/80 mmHg generally indicating the condition. Lifestyle changes, such as adopting a low-sodium diet and engaging in regular physical activity, are essential for effective management. If lifestyle changes are insufficient, doctors often prescribe medications like diuretics, ACE inhibitors, or beta-blockers. Monitoring blood pressure at home can help patients and doctors track the effectiveness of treatments and make necessary adjustments. Stress management and limiting alcohol and tobacco use are also vital for maintaining healthy blood pressure levels. Because it is a lifelong condition, consistent medical follow-up is necessary to prevent the development of life-altering cardiovascular diseases.',
        category: 'Condition'
    }
];

async function seedUltimateKnowledge() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        for (const data of ultimateKnowledgeData) {
            const [record, created] = await MedicalKnowledge.findOrCreate({
                where: { term: data.term },
                defaults: data
            });

            if (!created) {
                record.description = data.description;
                record.category = data.category;
                await record.save();
                console.log(`Updated to 10-sentence description for: ${data.term}`);
            } else {
                console.log(`Created new 10-sentence entry for: ${data.term}`);
            }
        }

        console.log('Ultimate medical knowledge updated successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating ultimate medical knowledge:', error);
        process.exit(1);
    }
}

seedUltimateKnowledge();
