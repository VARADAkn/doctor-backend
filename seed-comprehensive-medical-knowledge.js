require('dotenv').config();
const { MedicalKnowledge, sequelize } = require('./models');

const comprehensiveKnowledgeData = [
    // Simple Terms (New)
    {
        term: 'Flu',
        description: 'The flu, or influenza, is a common viral infection that attacks your respiratory system — your nose, throat and lungs. For most people, the flu resolves on its own, but sometimes the flu and its complications can be deadly. Typical symptoms include fever, aching muscles, chills and sweats, headache, dry cough, and shortness of breath. It is primarily spread through respiratory droplets when an infected person coughs, sneezes, or speaks. Annual flu vaccinations are recommended for everyone 6 months and older as they significantly reduce the risk of severe illness. Antiviral medications can sometimes lessen the severity and duration of the illness if taken early. Rest and plenty of fluids are the most important treatments for most cases. Complications like pneumonia or bronchitis can occur, particularly in high-risk groups like the elderly or those with weakened immune systems. Good hygiene, such as frequent handwashing and avoiding close contact with sick individuals, helps prevent spread. Unlike a common cold, flu symptoms often appear suddenly and are much more intense.',
        category: 'Condition'
    },
    {
        term: 'Fever',
        description: 'A fever is a temporary increase in your body temperature, often due to an illness or infection. It is a sign that something out of the ordinary is going on in your body and is actually a part of the body\'s immune response. For an adult, a fever may be uncomfortable, but it usually isn\'t a cause for concern unless it reaches 103°F (39.4°C) or higher. In infants and toddlers, even a slightly elevated temperature may signify a serious infection and requires medical attention. Symptoms often accompanying a fever include sweating, chills, headache, muscle aches, loss of appetite, and general weakness. Fever is typically caused by bacteria, viruses, or other parasites, but can also be triggered by heat exhaustion or certain inflammatory conditions. Over-the-counter medications like paracetamol or ibuprofen are commonly used to reduce discomfort and lower temperature. Staying hydrated is crucial because high temperatures can lead to dehydration. If a fever is accompanied by a severe headache, stiff neck, or skin rash, immediate medical help should be sought. Most fevers go away within a few days once the underlying cause is addressed.',
        category: 'Symptom'
    },
    {
        term: 'Common Cold',
        description: 'The common cold is a viral infection of your nose and throat (upper respiratory tract) that is usually harmless, though it might not feel that way. Many types of viruses can cause a common cold, but rhinoviruses are the most frequent culprit. Symptoms usually appear one to three days after exposure to a cold-causing virus and include a runny or stuffy nose, sore throat, cough, and congestion. You might also experience slight body aches, a mild headache, or a low-grade fever. There is no cure for the common cold, as antibiotics are ineffective against viruses. Most people recover on their own within a week or ten days, although smokers may take longer to heal. Treatment focuses on relieving symptoms, such as using saline nasal drops or throat lozenges. Drinking plenty of fluids and getting adequate rest are essential components of recovery. To prevent catching a cold, it is best to wash your hands frequently and avoid touching your face. Complications like ear infections or sinusitis can sometimes develop if the virus migrates.',
        category: 'Condition'
    },
    {
        term: 'Snake Bite',
        description: 'A snake bite is an injury caused by the bite of a snake, and while many are non-venomous, some can be life-threatening. Venomous snake bites require immediate medical attention to prevent severe tissue damage or death. Symptoms of a venomous bite include puncture marks at the wound, redness, swelling, and severe pain at the site. Systemic symptoms like nausea, vomiting, labored breathing, and blurred vision may also develop quickly. If bitten, it is crucial to remain calm and still to slow the spread of venom through the lymphatic system. Do not try to suck out the venom or apply a tourniquet, as these methods can cause more harm. In a hospital, doctors will monitor vital signs and may administer anti-venom if it is determined the snake was poisonous. Identifying the type of snake can be helpful for treatment, but safety should always come first — never try to catch the snake. Long-term effects can include scarring or permanent nerve damage if the bite was deep and toxic. Proper footwear and caution in overgrown areas are the best ways to avoid encounters with snakes.',
        category: 'Injury'
    },
    {
        term: 'Migraine',
        description: 'A migraine is a headache that can cause severe throbbing pain or a pulsing sensation, usually on one side of the head. It is often accompanied by extreme sensitivity to light and sound, as well as nausea and vomiting. Migraine attacks can last for hours to days, and the pain can be so severe that it interferes with your daily activities. For some people, a warning symptom known as an aura occurs before or with the headache, involving visual disturbances like flashes of light. The exact cause of migraines isn\'t fully understood, but genetics and environmental factors seem to play a role. Common triggers include hormonal changes in women, certain foods and drinks, stress, and sensory stimuli. Medications can help prevent some migraines and make them less painful once they start. Resting in a dark, quiet room is a standard way to manage an attack in progress. Keeping a headache diary can help identify specific personal triggers to avoid in the future. Chronic migraines occur when someone experiences headaches on 15 or more days a month for at least three months.',
        category: 'Condition'
    },

    // Expanded Complex Terms (Existing)
    {
        term: 'Paracetamol',
        description: 'Paracetamol, also known as acetaminophen, is a widely used over-the-counter medication for pain relief and fever reduction. It is considered a first-line treatment for mild to moderate pain, such as headaches, toothaches, and menstrual cramps. Unlike ibuprofen and aspirin, it has minimal anti-inflammatory properties, making it safer for people with stomach issues. It works primarily in the central nervous system to increase the pain threshold and reduce temperature via the hypothalamus. When taken at the correct dosage, it is extremely safe and well-tolerated by most people, including children and the elderly. However, the most critical risk associated with paracetamol is liver toxicity, which can occur from even a single large overdose. Many other medications for colds or sinus pain also contain paracetamol, leading to accidental double-dosing. Because of this risk, it is vital to never exceed the maximum daily dose specified on the packaging. Alcohol consumption while taking the medication can also increase the risk of liver damage. Despite these risks, it remains one of the most essential medicines in the world due to its efficacy and low cost.',
        category: 'Medication'
    },
    {
        term: 'Ischemia',
        description: 'Ischemia is a serious medical condition characterized by an inadequate blood supply to a specific organ or part of the body. This restriction is often caused by a blockage in the blood vessels, such as a blood clot or a buildup of plaque (atherosclerosis). When blood flow is restricted, tissues do not receive enough oxygen or nutrients, which are essential for cellular survival. This lack of oxygen can lead to rapid tissue damage and, if left untreated, tissue death (necrosis). Myocardial ischemia occurs when blood flow to the heart muscle is reduced, often causing chest pain known as angina. Cerebral ischemia affects the brain and is the primary cause of strokes. Symptoms vary depending on the location but often include sudden pain, numbness, or loss of function in the affected area. Treatment aims to restore blood flow quickly through medications like blood thinners or surgical procedures like angioplasty. Chronic ischemia can lead to permanent organ failure over time. Managing underlying risks like high cholesterol, smoking, and diabetes is essential for preventing heart and brain ischemia.',
        category: 'Condition'
    },
    {
        term: 'Hepatitis',
        description: 'Hepatitis refers to inflammation of the liver, a vital organ that processes nutrients, filters blood, and fights infections. This inflammation can be caused by heavy alcohol use, toxins, certain medications, and some medical conditions. However, the most common cause of hepatitis is a group of viruses identified as Hepatitis A, B, C, D, and E. Symptoms often include jaundice (yellowing of skin and eyes), fatigue, abdominal pain, and loss of appetite. Hepatitis A is usually a short-term infection spread through contaminated food or water. Chronic infections like Hepatitis B and C can lead to serious long-term health problems, including liver scarring (cirrhosis) and liver cancer. Modern antiviral medications can often cure Hepatitis C and manage Hepatitis B effectively. Vaccines are available for Hepatitis A and B and are highly effective at preventing infection. If left untreated, chronic hepatitis can silently damage the liver for decades before symptoms appear. Regular blood tests for those at risk are essential for early detection and treatment. Lifestyle changes, such as avoiding alcohol and maintaining a healthy weight, are also important for liver health.',
        category: 'Condition'
    },
    {
        term: 'Fentanyl',
        description: 'Fentanyl is a powerful synthetic opioid that is similar to morphine but is 50 to 100 times more potent. It is a prescription drug that is typically used to treat patients with severe pain or to manage pain after surgery. It is also sometimes used to treat patients with chronic pain who are physically tolerant to other opioids. In a medical setting, it can be administered as an injection, a transdermal patch, or lozenges. However, fentanyl is also produced illegally and is frequently added to other street drugs because of its extreme potency. This illegal use has led to a significant increase in overdose deaths globally, as even a tiny amount can be fatal. It works by binding to the body\'s opioid receptors, which are found in areas of the brain that control pain and emotions. Common side effects include extreme happiness, drowsiness, nausea, confusion, and constipation. Respiratory depression, where breathing slows down or stops, is the most dangerous effect of an overdose. Naloxone is a medication that can rapidly reverse a fentanyl overdose if administered in time. Due to its high addictive potential, its use is strictly regulated and monitored by healthcare professionals.',
        category: 'Medication'
    },
    {
        term: 'Hypertension',
        description: 'Hypertension, commonly known as high blood pressure, is a condition where the force of the blood against your artery walls is too high. If left untreated, it overworks the heart and can cause serious damage to the arteries over time. It is often called a "silent killer" because many people have no symptoms until significant damage has occurred. Common symptoms of extremely high blood pressure include headaches, shortness of breath, or nosebleeds, though these aren\'t specific. Risk factors include aging, obesity, family history, and a high-sodium diet. Lifestyle modifications, such as reducing salt intake, regular exercise, and maintaining a healthy weight, are the first line of defense. Many people also require daily medications, such as ACE inhibitors or beta-blockers, to keep their pressure in a healthy range. Consistent monitoring is key, as small changes in habits can have a big impact on blood pressure readings. Long-term complications include heart attacks, strokes, kidney disease, and vision loss. Managing stress and limiting alcohol are also vital components of a hypertension management plan. Regular check-ups with a doctor are necessary to ensure treatment is effective and adjusted as needed.',
        category: 'Condition'
    },
    {
        term: 'Diabetes Mellitus',
        description: 'Diabetes Mellitus is a chronic metabolic disorder characterized by high levels of glucose in the blood. It occurs when the body either cannot produce enough insulin or cannot effectively use the insulin it produces. Insulin is a hormone produced by the pancreas that helps glucose enter cells to produce energy. There are three main types: Type 1 diabetes, Type 2 diabetes, and gestational diabetes. Type 1 diabetes is usually diagnosed in children and young adults and occurs when the immune system destroys insulin-producing cells. Type 2 diabetes is the most common form and is often associated with obesity, poor diet, and lack of physical activity. Symptoms may include increased thirst, frequent urination, fatigue, blurred vision, and slow wound healing. If untreated, diabetes can lead to severe complications such as heart disease, kidney failure, nerve damage, and vision loss. Management typically includes lifestyle modifications such as a balanced diet, regular exercise, and weight control. Many patients also require medications or insulin therapy to regulate blood sugar levels. Regular monitoring of blood glucose levels is essential to prevent complications. Early diagnosis and consistent treatment significantly improve quality of life for individuals with diabetes.',
        category: 'Condition'
    },
    {
        term: 'Antibiotics',
        description: 'Antibiotics are medications used to treat infections caused by bacteria. They work by either killing bacteria directly or preventing them from multiplying. Antibiotics are ineffective against viral infections such as the common cold or flu. There are many types of antibiotics, including penicillins, cephalosporins, tetracyclines, and macrolides. Each type targets bacteria in slightly different ways. Doctors prescribe antibiotics depending on the type of bacteria causing the infection. Common infections treated with antibiotics include pneumonia, urinary tract infections, and skin infections. It is important to complete the full course of antibiotics even if symptoms improve early. Stopping treatment too soon may allow bacteria to survive and become resistant. Antibiotic resistance is a major global health concern caused by the misuse and overuse of antibiotics. Resistant bacteria can make infections harder to treat and require stronger medications. Side effects of antibiotics may include stomach upset, diarrhea, and allergic reactions. Responsible antibiotic use is essential to preserve their effectiveness for future generations.',
        category: 'Medication'
    },
    {
        term: 'Asthma',
        description: 'Asthma is a chronic respiratory condition that affects the airways of the lungs. In people with asthma, the airways become inflamed and narrowed, making breathing difficult. The condition is often triggered by allergens, air pollution, respiratory infections, or physical exertion. Common symptoms include wheezing, shortness of breath, chest tightness, and coughing. Symptoms may vary from mild to severe and can worsen at night or early in the morning. Asthma attacks occur when the airway muscles tighten and inflammation increases. During an attack, breathing becomes extremely difficult and requires immediate treatment. Although asthma cannot be cured, it can be effectively managed with medications. Treatment often includes inhaled corticosteroids and bronchodilators. Quick-relief inhalers are used during asthma attacks to open the airways quickly. Long-term control medications help reduce airway inflammation and prevent attacks. Lifestyle modifications such as avoiding triggers and maintaining good air quality are important. With proper treatment and monitoring, most people with asthma can live normal and active lives.',
        category: 'Condition'
    },
    {
        term: 'Vaccination',
        description: 'Vaccination is a medical method used to protect individuals from infectious diseases. It involves administering a vaccine that stimulates the immune system to recognize and fight specific pathogens. Vaccines usually contain weakened or inactive parts of a microorganism such as bacteria or viruses. When introduced into the body, the immune system produces antibodies against the pathogen. This process prepares the immune system to respond quickly if exposed to the disease in the future. Vaccination has been responsible for controlling or eliminating many deadly diseases. Examples include smallpox, polio, and measles. Vaccines are typically administered through injections, oral drops, or nasal sprays. Immunization programs are essential for protecting entire communities through herd immunity. Side effects of vaccines are usually mild and may include fever or soreness at the injection site. Severe reactions are extremely rare compared to the risks of the diseases they prevent. Vaccination schedules are carefully designed to provide protection at the right age. Overall, vaccines remain one of the most effective public health interventions in history.',
        category: 'Treatment'
    },
    {
        term: 'Anemia',
        description: 'Anemia is a condition in which the body lacks enough healthy red blood cells to carry adequate oxygen to tissues. Red blood cells contain hemoglobin, a protein that binds oxygen and transports it throughout the body. When hemoglobin levels are low, the body’s tissues receive less oxygen. This leads to symptoms such as fatigue, weakness, pale skin, dizziness, and shortness of breath. Iron deficiency is the most common cause of anemia worldwide. Other causes include vitamin B12 deficiency, chronic diseases, or genetic disorders such as sickle cell anemia. Blood loss from injuries, menstruation, or gastrointestinal bleeding can also cause anemia. Diagnosis is typically made through blood tests that measure hemoglobin and red blood cell counts. Treatment depends on the underlying cause of the condition. Iron supplements and dietary changes are common treatments for iron deficiency anemia. In severe cases, blood transfusions may be required. Preventive measures include consuming iron-rich foods such as leafy greens, beans, and meat. Early treatment helps prevent complications such as heart strain and chronic fatigue.',
        category: 'Condition'
    },
    {
        term: 'MRI Scan',
        description: 'Magnetic Resonance Imaging, commonly known as an MRI scan, is a diagnostic imaging technique used in medicine. It uses strong magnetic fields and radio waves to produce detailed images of internal body structures. Unlike X-rays or CT scans, MRI does not use ionizing radiation. This makes it a safer option for repeated imaging in many cases. MRI scans are particularly useful for examining the brain, spinal cord, muscles, and soft tissues. Doctors often use MRI to diagnose tumors, injuries, infections, and neurological disorders. During the procedure, the patient lies inside a large cylindrical machine. The machine produces loud knocking sounds while scanning, which is normal. Patients must remain very still to ensure clear images. In some cases, a contrast dye is injected to enhance image clarity. The procedure is painless but may cause discomfort for individuals with claustrophobia. Results are interpreted by radiologists who analyze the images for abnormalities. MRI technology has significantly improved the accuracy of medical diagnosis and treatment planning.',
        category: 'Diagnostic Procedure'
    },
    {
        term: 'Chemotherapy',
        description: 'Chemotherapy is a medical treatment used primarily to treat cancer. It involves the use of powerful drugs designed to kill rapidly dividing cancer cells. These drugs circulate throughout the body and target cancer cells wherever they may be located. Chemotherapy can be used alone or combined with surgery and radiation therapy. The treatment is administered in cycles to allow the body time to recover between sessions. Chemotherapy drugs may be given intravenously, orally, or through injections. While effective at destroying cancer cells, chemotherapy can also affect healthy cells. This often leads to side effects such as hair loss, nausea, fatigue, and weakened immunity. Doctors carefully monitor patients to manage these side effects. Advances in medicine have improved chemotherapy drugs to make them more targeted and effective. Some patients receive chemotherapy before surgery to shrink tumors. Others receive it after surgery to eliminate remaining cancer cells. Despite its challenges, chemotherapy has saved millions of lives and continues to be an essential tool in cancer treatment.',
        category: 'Treatment'
    },
    {
        term: 'Insulin Therapy',
        description: 'Insulin therapy is a treatment used to control blood sugar levels in people with diabetes. It involves administering insulin, a hormone that regulates glucose in the bloodstream. Insulin therapy is essential for individuals with Type 1 diabetes because their bodies cannot produce insulin naturally. Some people with Type 2 diabetes also require insulin when other treatments are insufficient. Insulin can be delivered through injections, insulin pens, or insulin pumps. The dosage and timing depend on a person’s blood glucose levels and lifestyle. Different types of insulin work at different speeds, such as rapid-acting, short-acting, and long-acting insulin. Monitoring blood sugar regularly is crucial when using insulin therapy. Patients must balance insulin intake with meals, exercise, and daily activities. Incorrect dosing can lead to hypoglycemia, a dangerous drop in blood sugar levels. Healthcare providers educate patients on how to administer insulin safely. Proper insulin therapy helps prevent long-term complications of diabetes. With careful management, individuals using insulin can maintain stable blood sugar and lead healthy lives.',
        category: 'Treatment'
    },
    {
        term: 'Stroke',
        description: 'A stroke is a medical emergency that occurs when blood flow to the brain is interrupted. Without oxygen and nutrients, brain cells begin to die within minutes. There are two main types of stroke: ischemic stroke and hemorrhagic stroke. Ischemic stroke occurs when a blood clot blocks an artery supplying the brain. Hemorrhagic stroke occurs when a blood vessel in the brain ruptures and causes bleeding. Symptoms of a stroke include sudden weakness on one side of the body, difficulty speaking, confusion, and severe headache. Vision problems and loss of balance may also occur. Immediate medical treatment is critical to reduce brain damage. Treatments may include clot-dissolving medications or surgical procedures. Long-term rehabilitation is often required to help patients regain lost functions. Risk factors include high blood pressure, smoking, diabetes, and obesity. Preventive strategies include maintaining a healthy lifestyle and managing underlying health conditions. Early recognition of stroke symptoms can save lives and reduce disability.',
        category: 'Condition'
    },
    {
        term: 'Kidney Dialysis',
        description: 'Kidney dialysis is a life-saving treatment for individuals with severe kidney failure. The kidneys normally remove waste products and excess fluids from the blood. When they fail, harmful substances accumulate in the body. Dialysis performs the function of filtering the blood artificially. There are two main types of dialysis: hemodialysis and peritoneal dialysis. Hemodialysis uses a machine and filter to clean the blood outside the body. Peritoneal dialysis uses the lining of the abdomen to filter blood inside the body. Dialysis treatments are usually performed several times a week. Each session can last several hours depending on the method used. Patients undergoing dialysis must follow strict dietary and fluid restrictions. Side effects may include fatigue, low blood pressure, or muscle cramps. Dialysis can significantly improve quality of life for individuals with kidney failure. However, it is often considered a temporary solution until a kidney transplant is possible. Proper medical supervision is essential for effective dialysis treatment.',
        category: 'Treatment'
    },
    {
        term: 'Pneumonia',
        description: 'Pneumonia is a lung infection that causes inflammation in the air sacs of the lungs. These air sacs may fill with fluid or pus, making breathing difficult. Pneumonia can be caused by bacteria, viruses, or fungi. Symptoms often include cough with phlegm, fever, chills, and shortness of breath. Some patients also experience chest pain and fatigue. The severity of pneumonia can range from mild to life-threatening. Older adults, young children, and people with weakened immune systems are at higher risk. Diagnosis usually involves chest X-rays and laboratory tests. Treatment depends on the cause of the infection. Bacterial pneumonia is treated with antibiotics, while viral pneumonia may require supportive care. Severe cases may require hospitalization and oxygen therapy. Vaccines are available to prevent certain types of pneumonia. Good hygiene and healthy habits also help reduce the risk of infection.',
        category: 'Condition'
    },
    {
        term: 'Radiation Therapy',
        description: 'Radiation therapy is a medical treatment that uses high-energy radiation to destroy cancer cells. It works by damaging the DNA inside cancer cells so they cannot grow or divide. Radiation therapy can be used alone or in combination with other treatments such as surgery or chemotherapy. The treatment is carefully planned to target cancer cells while minimizing damage to surrounding healthy tissues. External beam radiation therapy is the most common type and uses machines to direct radiation at the tumor. Internal radiation therapy, also called brachytherapy, places radioactive materials inside the body near the cancer. Sessions are typically short and painless. Patients usually undergo multiple treatments over several weeks. Side effects may include fatigue, skin irritation, or hair loss in the treated area. Advances in technology have improved the precision of radiation therapy. This allows doctors to deliver higher doses to tumors while protecting healthy tissue. Radiation therapy plays a critical role in curing or controlling many types of cancer.',
        category: 'Treatment'
    },
    {
        term: 'Ultrasound',
        description: 'Ultrasound is a diagnostic imaging technique that uses high-frequency sound waves to produce images of structures inside the body. It is commonly used during pregnancy to monitor the development of the fetus. Ultrasound machines send sound waves into the body and record the echoes that bounce back. These echoes are then converted into images displayed on a screen. The procedure is non-invasive and does not use radiation. Ultrasound is used to examine organs such as the heart, liver, kidneys, and gallbladder. Doctors may also use it to guide certain medical procedures such as biopsies. During the test, a gel is applied to the skin to improve sound wave transmission. A handheld device called a transducer is moved over the area being examined. The procedure is painless and typically takes less than 30 minutes. Results can help doctors detect abnormalities such as tumors, cysts, or fluid buildup. Ultrasound is widely used because it is safe, affordable, and provides real-time imaging. It plays an important role in modern medical diagnostics.',
        category: 'Diagnostic Procedure'
    },
    {
        term: 'Tuberculosis',
        description: 'Tuberculosis is a serious infectious disease that primarily affects the lungs. It is caused by a bacterium called Mycobacterium tuberculosis. The disease spreads through airborne droplets when an infected person coughs or sneezes. Common symptoms include persistent cough, chest pain, weight loss, fever, and night sweats. Tuberculosis can also affect other parts of the body such as the kidneys, spine, or brain. The infection may remain dormant in some individuals without causing symptoms. However, dormant tuberculosis can become active if the immune system weakens. Diagnosis involves skin tests, blood tests, chest X-rays, and laboratory analysis of sputum samples. Treatment usually requires a long course of antibiotics taken for several months. Completing the entire treatment regimen is essential to prevent drug resistance. Drug-resistant tuberculosis is more difficult to treat and requires specialized medications. Vaccination with the BCG vaccine provides partial protection in many countries. Early detection and proper treatment are key to controlling the spread of tuberculosis.',
        category: 'Condition'
    },
    {
        term: 'Appendicitis',
        description: 'Appendicitis is an inflammation of the appendix, a small pouch attached to the large intestine. It is one of the most common causes of emergency abdominal surgery. The condition occurs when the appendix becomes blocked by stool, infection, or swelling. This blockage leads to bacterial growth and inflammation. Symptoms usually begin with pain near the navel that later moves to the lower right abdomen. Patients may also experience nausea, vomiting, fever, and loss of appetite. The pain often becomes severe and worsens with movement or coughing. If untreated, the appendix may rupture and cause a serious infection called peritonitis. Diagnosis typically involves physical examination, blood tests, and imaging such as ultrasound or CT scans. The standard treatment is surgical removal of the appendix, known as an appendectomy. This surgery is usually performed laparoscopically using small incisions. Recovery after surgery is typically quick and complications are rare. Prompt medical attention greatly reduces the risk of complications from appendicitis.',
        category: 'Condition'
    },
    {
        term: 'Blood Transfusion',
        description: 'A blood transfusion is a medical procedure in which blood or blood components are transferred into a patient’s bloodstream. It is commonly used to replace blood lost during surgery, injury, or medical conditions. Blood transfusions may involve whole blood or specific components such as red blood cells, plasma, or platelets. Before a transfusion, blood types are carefully matched to prevent reactions. Blood typing includes identifying ABO groups and Rh factors. The procedure is performed through an intravenous line inserted into a vein. Transfusions are typically safe when performed under proper medical supervision. However, there is a small risk of allergic reactions or infections. Modern screening techniques greatly reduce the risk of disease transmission. Blood transfusions are essential in treating conditions such as severe anemia, trauma, and certain cancers. Donated blood from healthy volunteers plays a crucial role in saving lives. Blood banks carefully store and distribute blood supplies to hospitals. This procedure has become a cornerstone of modern emergency and surgical medicine.',
        category: 'Treatment'
    },
    {
        term: 'Osteoporosis',
        description: 'Osteoporosis is a medical condition that weakens bones and makes them more fragile. The disease occurs when bone density decreases and bone structure deteriorates. As a result, bones become more susceptible to fractures. Osteoporosis most commonly affects the hips, spine, and wrists. The condition often develops silently without noticeable symptoms. Many people only discover they have osteoporosis after experiencing a fracture. Risk factors include aging, hormonal changes, lack of calcium, and sedentary lifestyle. Women are particularly at risk after menopause due to decreased estrogen levels. Diagnosis is usually made using bone density tests such as DEXA scans. Treatment focuses on slowing bone loss and strengthening bones. Medications such as bisphosphonates may be prescribed. Adequate calcium and vitamin D intake is essential for bone health. Regular weight-bearing exercise also helps maintain bone strength. Preventive measures are important to reduce the risk of fractures in older adults.',
        category: 'Condition'
    },
    {
        term: 'Cataract',
        description: 'A cataract is a clouding of the eye’s natural lens that affects vision. The lens normally helps focus light onto the retina to produce clear images. When a cataract forms, the lens becomes cloudy and light cannot pass through properly. This leads to blurred or dim vision. Cataracts often develop slowly and may affect one or both eyes. Common symptoms include sensitivity to light, difficulty seeing at night, and faded colors. Aging is the most common cause of cataracts. Other causes include diabetes, eye injuries, and prolonged exposure to ultraviolet radiation. Diagnosis is made through a comprehensive eye examination by an ophthalmologist. Early stages may be managed with stronger eyeglasses or improved lighting. However, advanced cataracts usually require surgery. Cataract surgery involves removing the cloudy lens and replacing it with an artificial lens. The procedure is highly successful and restores clear vision for most patients. Cataract surgery is one of the most commonly performed medical procedures worldwide.',
        category: 'Condition'
    },
    {
        term: 'Depression',
        description: 'Depression is a common mental health disorder that affects mood, thoughts, and daily functioning. It is characterized by persistent feelings of sadness, hopelessness, and loss of interest in activities. Depression can affect people of all ages and backgrounds. Symptoms may include fatigue, changes in appetite, sleep disturbances, and difficulty concentrating. Some individuals may also experience feelings of worthlessness or guilt. In severe cases, depression may lead to thoughts of self-harm or suicide. The condition can be triggered by genetic, biological, environmental, or psychological factors. Diagnosis is made through psychological evaluation by a healthcare professional. Treatment often involves a combination of therapy and medication. Antidepressant medications help regulate chemicals in the brain associated with mood. Psychotherapy helps individuals develop coping strategies and address emotional challenges. Lifestyle changes such as exercise and social support also contribute to recovery. With proper treatment and support, many individuals with depression can lead fulfilling lives.',
        category: 'Condition'
    },
    {
        term: 'Physiotherapy',
        description: 'Physiotherapy is a healthcare profession focused on improving movement and physical function. It is commonly used to treat injuries, disabilities, and chronic conditions. Physiotherapists use exercises, manual therapy, and specialized equipment to help patients recover mobility. The treatment aims to reduce pain and restore normal body function. Physiotherapy is widely used after surgeries such as joint replacements. It is also beneficial for patients recovering from strokes or spinal injuries. Treatment programs are customized according to the patient’s condition and goals. Sessions may include stretching exercises, strengthening exercises, and posture training. Physiotherapists also educate patients on preventing future injuries. Rehabilitation programs may last several weeks or months depending on the severity of the condition. Physiotherapy plays an important role in sports medicine and injury prevention. It also improves quality of life for individuals with chronic conditions such as arthritis. Through consistent therapy and proper guidance, patients can regain strength, mobility, and independence.',
        category: 'Treatment'
    },

    {
        term: 'Amoxicillin',
        description: 'Amoxicillin is a widely used antibiotic that belongs to the penicillin group of drugs. It is commonly prescribed to treat bacterial infections such as respiratory tract infections, ear infections, urinary tract infections, and skin infections. The medication works by stopping the growth of bacteria and preventing them from building protective cell walls. Amoxicillin is usually taken orally in the form of capsules, tablets, or liquid suspensions. Doctors often prescribe it for children as well as adults because it is generally safe when used correctly. The dosage depends on the severity of the infection and the age of the patient. It is important for patients to complete the entire course of treatment even if symptoms improve early. Stopping antibiotics too soon can allow bacteria to survive and develop resistance. Common side effects may include nausea, diarrhea, or mild allergic reactions. In rare cases, severe allergic reactions may occur and require immediate medical attention. Responsible use of antibiotics like amoxicillin is important to prevent antibiotic resistance.',
        category: 'Medication'
    },
    {
        term: 'Ibuprofen',
        description: 'Ibuprofen is a nonsteroidal anti-inflammatory drug commonly used to relieve pain, reduce inflammation, and lower fever. It is frequently used to treat headaches, muscle aches, arthritis, menstrual cramps, and minor injuries. The medication works by blocking substances in the body that cause inflammation and pain. Ibuprofen is available over the counter and in prescription-strength formulations. It is typically taken as tablets, capsules, or liquid suspensions. The drug should be taken with food to reduce the risk of stomach irritation. Long-term or excessive use may increase the risk of stomach ulcers, kidney problems, or cardiovascular issues. Doctors advise patients to follow recommended dosage guidelines carefully. Ibuprofen should not be combined with certain medications without medical advice. It is also not recommended for individuals with certain health conditions such as severe kidney disease. When used properly, ibuprofen is a safe and effective medication for short-term pain management.',
        category: 'Medication'
    },
    {
        term: 'Electrocardiogram',
        description: 'An electrocardiogram, commonly known as an ECG or EKG, is a medical test used to measure the electrical activity of the heart. The heart produces electrical signals that control its rhythm and pumping function. During an ECG test, small sensors called electrodes are placed on the skin of the chest, arms, and legs. These electrodes detect electrical signals generated by the heart and record them on a graph. Doctors analyze the pattern of these signals to detect abnormalities in heart rhythm. ECG tests are commonly used to diagnose conditions such as arrhythmias, heart attacks, and heart enlargement. The procedure is quick, painless, and non-invasive. It usually takes only a few minutes to complete. ECG tests are frequently performed in hospitals, clinics, and emergency rooms. The results help doctors determine whether additional tests or treatments are required. This diagnostic tool is essential in modern cardiology.',
        category: 'Diagnostic Procedure'
    },
    {
        term: 'CT Scan',
        description: 'Computed Tomography, commonly called a CT scan, is a medical imaging technique used to create detailed cross-sectional images of the body. It combines X-ray technology with computer processing to generate highly detailed images of internal organs, bones, and tissues. CT scans are widely used to diagnose injuries, tumors, infections, and internal bleeding. During the procedure, the patient lies on a motorized table that moves through a circular scanning machine. The scanner rotates around the body and captures multiple X-ray images from different angles. A computer then processes these images to produce detailed visual slices of the body. Sometimes a contrast dye is injected into the bloodstream to improve image clarity. CT scans are particularly useful in emergency situations because they provide rapid results. The procedure is painless but may involve exposure to a small amount of radiation. Doctors carefully consider the benefits and risks before recommending the test. CT scanning technology has greatly improved medical diagnosis and treatment planning.',
        category: 'Diagnostic Procedure'
    },
    {
        term: 'Ventilator',
        description: 'A ventilator is a medical device that helps patients breathe when they are unable to do so effectively on their own. It delivers oxygen-rich air into the lungs and removes carbon dioxide from the body. Ventilators are commonly used in intensive care units for patients with severe respiratory problems. Conditions such as pneumonia, respiratory failure, or major surgery may require ventilator support. The machine works by pushing air through a tube inserted into the patient’s airway. Doctors and respiratory therapists carefully adjust the machine settings to match the patient’s breathing needs. Ventilators can provide temporary life support during critical illness. Continuous monitoring ensures that oxygen levels remain stable. While ventilators can save lives, prolonged use may have complications such as infections or lung damage. Medical professionals aim to remove patients from ventilator support as soon as they can breathe independently. Ventilators became widely known during the COVID-19 pandemic when many patients required respiratory assistance.',
        category: 'Medical Equipment'
    },
    {
        term: 'Pacemaker',
        description: 'A pacemaker is a small medical device that helps regulate abnormal heart rhythms. It is implanted under the skin near the chest and connected to the heart with thin wires. The device sends electrical impulses to stimulate the heart when it beats too slowly or irregularly. Pacemakers are commonly used to treat conditions such as bradycardia and certain types of heart block. The implantation procedure is typically performed under local anesthesia. After the procedure, the device continuously monitors the heart’s electrical activity. If the heart rate drops below a safe level, the pacemaker delivers electrical signals to restore a normal rhythm. Modern pacemakers are programmable and can adapt to the patient’s physical activity level. Patients with pacemakers can usually return to normal daily activities after recovery. Regular check-ups are required to ensure the device is functioning properly. The battery of a pacemaker usually lasts several years before replacement is needed. This device has significantly improved the quality of life for patients with heart rhythm disorders.',
        category: 'Medical Device'
    },
    {
        term: 'Endoscopy',
        description: 'Endoscopy is a medical procedure used to examine the interior of the body using a flexible tube called an endoscope. The endoscope contains a tiny camera and light source that allows doctors to view internal organs on a monitor. This procedure is commonly used to examine the digestive tract, including the esophagus, stomach, and intestines. Doctors may perform endoscopy to investigate symptoms such as persistent stomach pain, bleeding, or difficulty swallowing. The procedure can also be used to collect tissue samples for biopsy. Endoscopy is typically performed under mild sedation to ensure patient comfort. It is considered minimally invasive because it does not require large surgical incisions. The camera provides real-time images that help doctors detect abnormalities such as ulcers, tumors, or inflammation. The procedure usually takes less than an hour. Patients can typically return home on the same day. Endoscopy plays an important role in early disease detection and diagnosis.',
        category: 'Diagnostic Procedure'
    },
    {
        term: 'Insulin Pump',
        description: 'An insulin pump is a small medical device used to deliver insulin continuously to people with diabetes. It helps maintain stable blood glucose levels throughout the day. The device is usually worn outside the body and connected to a small tube inserted under the skin. The pump releases small doses of insulin at regular intervals to mimic the natural function of the pancreas. Patients can also program additional insulin doses before meals. Insulin pumps reduce the need for multiple daily injections. They allow greater flexibility in managing diet and physical activity. Continuous glucose monitoring systems are sometimes integrated with insulin pumps. This combination provides better control of blood sugar levels. Proper training is necessary to use the device safely and effectively. Regular monitoring and adjustments are required to ensure optimal insulin delivery. Insulin pump therapy has significantly improved diabetes management for many patients.',
        category: 'Medical Device'
    },
    {
        term: 'Defibrillator',
        description: 'A defibrillator is a life-saving medical device used to treat sudden cardiac arrest. It works by delivering an electric shock to the heart to restore a normal rhythm. Sudden cardiac arrest occurs when the heart suddenly stops beating effectively. Without immediate treatment, the condition can be fatal within minutes. Defibrillators are commonly found in hospitals, ambulances, and public places. Automated External Defibrillators (AEDs) are designed for use by trained individuals and even bystanders. The device analyzes the heart rhythm and determines whether a shock is needed. If necessary, it delivers a controlled electrical shock to restart the heart. Early defibrillation greatly increases the chances of survival. Emergency responders are trained to use defibrillators quickly and safely. Public access to AEDs has saved many lives in emergency situations. This device is a critical component of modern emergency cardiac care.',
        category: 'Medical Device'
    },
    {
        term: 'Glaucoma',
        description: 'Glaucoma is a group of eye diseases that damage the optic nerve and can lead to vision loss. The optic nerve is responsible for transmitting visual information from the eye to the brain. This damage is often caused by increased pressure inside the eye. Glaucoma usually develops slowly and may not show symptoms in the early stages. As the disease progresses, it can cause gradual loss of peripheral vision. If left untreated, glaucoma may lead to permanent blindness. Risk factors include aging, family history, diabetes, and high eye pressure. Regular eye examinations are important for early detection. Treatments may include medicated eye drops, laser therapy, or surgery. These treatments help reduce eye pressure and prevent further damage to the optic nerve. Early diagnosis and proper treatment are essential for preserving vision. Glaucoma is one of the leading causes of blindness worldwide.',
        category: 'Condition'
    },
    {
        term: 'Metformin',
        description: 'Metformin is a commonly prescribed medication used to treat Type 2 diabetes. It helps lower blood sugar levels by improving the body’s sensitivity to insulin. The medication also reduces the amount of glucose produced by the liver. Metformin is usually taken orally in tablet form once or twice daily with meals. Doctors often recommend it as the first-line medication for managing Type 2 diabetes. In addition to lowering blood sugar, metformin may also help with modest weight loss. The drug is considered safe for long-term use when monitored by healthcare professionals. Some patients may experience mild side effects such as nausea, stomach discomfort, or diarrhea. These symptoms usually improve after the body adjusts to the medication. In rare cases, a serious condition called lactic acidosis may occur, especially in people with kidney problems. Patients taking metformin should have regular blood tests to monitor kidney function. With proper medical supervision, metformin is an effective and widely used diabetes medication.',
        category: 'Medication'
    },
    {
        term: 'Aspirin',
        description: 'Aspirin is a widely used medication that belongs to a group of drugs known as nonsteroidal anti-inflammatory drugs. It is commonly used to reduce pain, fever, and inflammation in the body. Aspirin works by blocking certain chemicals responsible for inflammation and pain signals. Doctors often prescribe low-dose aspirin to reduce the risk of heart attacks and strokes. It helps prevent blood clots by reducing the ability of platelets to stick together. Aspirin is available over the counter in tablet form. While effective, it must be used carefully because it can irritate the stomach lining. Long-term use may increase the risk of stomach ulcers or bleeding. Aspirin is generally not recommended for children with viral infections due to the risk of Reye’s syndrome. Patients should consult healthcare professionals before using aspirin regularly. When used appropriately, aspirin plays an important role in pain relief and cardiovascular disease prevention.',
        category: 'Medication'
    },
    {
        term: 'Bronchitis',
        description: 'Bronchitis is an inflammation of the bronchial tubes that carry air to and from the lungs. This condition causes swelling and increased mucus production in the airways. As a result, patients often experience persistent coughing and difficulty breathing. Bronchitis can be acute or chronic depending on the duration of symptoms. Acute bronchitis usually develops after a respiratory infection such as a cold or flu. Chronic bronchitis is a long-term condition often associated with smoking or air pollution. Symptoms include cough with mucus, fatigue, chest discomfort, and shortness of breath. Diagnosis is typically made through physical examination and sometimes imaging tests. Treatment focuses on relieving symptoms and supporting recovery. Doctors may recommend rest, hydration, and medications to reduce coughing. Avoiding smoking and air pollutants can help prevent bronchitis. With proper treatment, most cases of acute bronchitis resolve within a few weeks.',
        category: 'Condition'
    },
    {
        term: 'Sinusitis',
        description: 'Sinusitis is a condition characterized by inflammation of the sinus cavities in the skull. The sinuses are air-filled spaces that help filter and humidify the air we breathe. When these cavities become inflamed or infected, mucus can build up and cause discomfort. Common symptoms include facial pain, nasal congestion, headache, and thick nasal discharge. Sinusitis may be caused by viral infections, bacterial infections, or allergies. Acute sinusitis usually lasts less than four weeks, while chronic sinusitis may persist for months. Diagnosis is often based on symptoms and sometimes imaging studies such as CT scans. Treatment depends on the underlying cause of the inflammation. Doctors may recommend nasal sprays, decongestants, or antibiotics in bacterial cases. Steam inhalation and adequate hydration can also help relieve symptoms. Preventive measures include managing allergies and avoiding respiratory infections. Proper treatment helps restore normal sinus drainage and breathing.',
        category: 'Condition'
    },
    {
        term: 'Gallstones',
        description: 'Gallstones are solid deposits that form in the gallbladder, a small organ located beneath the liver. The gallbladder stores bile, a digestive fluid produced by the liver. When substances in bile become unbalanced, they can form hardened stones. Gallstones may vary in size from tiny grains to larger stones. Many people with gallstones experience no symptoms and may not require treatment. However, when a stone blocks a bile duct, it can cause severe abdominal pain known as a gallbladder attack. Other symptoms may include nausea, vomiting, and digestive problems. Diagnosis is usually made through ultrasound imaging. Treatment options depend on the severity of symptoms and complications. In many cases, doctors recommend surgical removal of the gallbladder. This procedure is known as cholecystectomy and is commonly performed using minimally invasive techniques. After surgery, most people can live normally without a gallbladder. Proper diet and lifestyle changes can help reduce the risk of gallstone formation.',
        category: 'Condition'
    },
    {
        term: 'Kidney Stones',
        description: 'Kidney stones are hard mineral deposits that form inside the kidneys. They develop when certain substances in the urine become concentrated and crystallize. These stones can vary in size and may remain in the kidney or move through the urinary tract. Small stones may pass naturally through urine without causing significant symptoms. Larger stones can cause severe pain, particularly in the lower back or abdomen. Other symptoms may include blood in the urine, nausea, and frequent urination. Dehydration is one of the most common risk factors for kidney stone formation. Doctors diagnose kidney stones using imaging techniques such as ultrasound or CT scans. Treatment depends on the size and location of the stone. Small stones may be managed with hydration and pain medication. Larger stones may require medical procedures such as lithotripsy to break them apart. Preventive strategies include drinking plenty of water and adjusting dietary habits.',
        category: 'Condition'
    },
    {
        term: 'Stethoscope',
        description: 'A stethoscope is a medical instrument used by healthcare professionals to listen to internal sounds of the body. It is commonly used to hear heartbeats, lung sounds, and blood flow. The device consists of a chest piece, flexible tubing, and earpieces. When the chest piece is placed on the patient’s body, sound vibrations travel through the tubing to the doctor’s ears. Stethoscopes are essential tools in routine physical examinations. Doctors use them to detect abnormalities in heart rhythms or breathing patterns. Modern digital stethoscopes can amplify sounds and record them electronically. Medical students are trained early in their education to use stethoscopes effectively. The instrument is lightweight and easy to carry, making it practical for clinical settings. It has remained a symbol of the medical profession for many years. Despite advances in medical technology, the stethoscope continues to play an important role in patient diagnosis and monitoring.',
        category: 'Medical Instrument'
    },
    {
        term: 'Pulse Oximeter',
        description: 'A pulse oximeter is a small medical device used to measure oxygen levels in the blood. It is commonly clipped onto a patient’s fingertip to obtain readings quickly. The device uses light sensors to estimate the percentage of oxygen carried by red blood cells. Oxygen saturation levels provide important information about respiratory and cardiovascular health. Pulse oximeters are frequently used in hospitals, clinics, and emergency settings. They are also widely used at home for monitoring chronic respiratory conditions. The device is non-invasive and provides results within seconds. Doctors often use pulse oximeters to monitor patients with lung diseases such as asthma or pneumonia. It became especially important during the COVID-19 pandemic to detect low oxygen levels. Normal oxygen saturation levels are usually between 95 and 100 percent. Lower readings may indicate respiratory problems requiring medical attention. Pulse oximeters are valuable tools for monitoring patient health and detecting early signs of oxygen deficiency.',
        category: 'Medical Device'
    },
    {
        term: 'Biopsy',
        description: 'A biopsy is a medical procedure in which a small sample of tissue is removed from the body for examination. The tissue sample is analyzed under a microscope by a pathologist. Biopsies are commonly performed to diagnose diseases such as cancer, infections, or inflammatory conditions. The procedure helps doctors determine whether abnormal cells are present. Biopsies can be performed using needles, endoscopic instruments, or surgical techniques. The method used depends on the location and type of tissue being examined. Local anesthesia is often used to minimize discomfort during the procedure. In many cases, biopsy results provide critical information needed for accurate diagnosis. Early detection of diseases through biopsy can significantly improve treatment outcomes. The procedure is generally safe but may cause minor side effects such as bruising or soreness. Advances in medical imaging have made biopsy procedures more precise and less invasive. Biopsy remains an essential diagnostic tool in modern medicine.',
        category: 'Diagnostic Procedure'
    },
    {
        term: 'Immunotherapy',
        description: 'Immunotherapy is a treatment that uses the body’s immune system to fight diseases, particularly cancer. It works by stimulating or strengthening the immune system so it can recognize and destroy harmful cells. Unlike traditional treatments that directly target cancer cells, immunotherapy enhances the body’s natural defenses. Several types of immunotherapy exist, including checkpoint inhibitors, monoclonal antibodies, and cancer vaccines. These treatments help immune cells identify cancer cells more effectively. Immunotherapy has shown promising results in treating cancers such as melanoma and lung cancer. The treatment may be administered through injections or intravenous infusions. Some patients experience long-lasting benefits because the immune system continues to recognize cancer cells. However, immunotherapy may also cause side effects such as fatigue or inflammation. Doctors carefully monitor patients during treatment to manage these effects. Ongoing research continues to improve the effectiveness of immunotherapy. This approach represents a major advancement in modern cancer treatment.',
        category: 'Treatment'
    },
    ,
    {
        term: 'Statins',
        description: 'Statins are a class of medications used to lower cholesterol levels in the blood. They are commonly prescribed to reduce the risk of heart disease and stroke. Statins work by blocking an enzyme in the liver that is responsible for producing cholesterol. By reducing cholesterol production, these medications help decrease the buildup of fatty deposits in blood vessels. This improves blood flow and reduces the risk of cardiovascular complications. Statins are often prescribed to individuals with high cholesterol or those at risk for heart attacks. Common statin medications include atorvastatin, simvastatin, and rosuvastatin. The medication is usually taken once daily and requires regular monitoring by healthcare providers. Some patients may experience side effects such as muscle pain or digestive issues. Doctors typically recommend combining statin therapy with lifestyle changes such as healthy diet and exercise. Regular blood tests are often performed to monitor cholesterol levels and liver function. When used correctly, statins significantly reduce the risk of serious heart-related conditions.',
        category: 'Medication'
    },
    {
        term: 'Beta Blockers',
        description: 'Beta blockers are medications used to treat various cardiovascular conditions. They work by blocking the effects of adrenaline on the heart and blood vessels. This action slows down the heart rate and reduces blood pressure. Doctors commonly prescribe beta blockers for conditions such as hypertension, heart rhythm disorders, and heart failure. They are also used to prevent migraines and reduce anxiety symptoms in certain situations. By lowering heart rate and blood pressure, beta blockers reduce the workload on the heart. Some common beta blocker medications include propranolol, atenolol, and metoprolol. Patients taking these medications should follow dosage instructions carefully. Sudden discontinuation of beta blockers can cause serious complications. Some side effects may include fatigue, dizziness, or cold hands and feet. Regular medical check-ups are necessary to ensure the medication is working effectively. Beta blockers have been widely used for decades and remain important in cardiovascular treatment.',
        category: 'Medication'
    },
    {
        term: 'ACE Inhibitors',
        description: 'ACE inhibitors are medications used primarily to treat high blood pressure and heart failure. ACE stands for Angiotensin-Converting Enzyme, which plays a role in regulating blood pressure. These medications work by relaxing blood vessels and reducing the amount of fluid retained by the body. As a result, blood flows more easily and the heart does not need to work as hard. ACE inhibitors are commonly prescribed for patients with hypertension or diabetes-related kidney disease. They can also help prevent complications after heart attacks. Some well-known ACE inhibitors include enalapril, lisinopril, and ramipril. The medication is usually taken once or twice daily depending on the prescription. Patients may experience mild side effects such as dizziness or dry cough. Regular monitoring of kidney function and blood pressure is recommended during treatment. Lifestyle changes such as reduced salt intake can enhance the effectiveness of ACE inhibitors. These medications have significantly improved long-term outcomes for patients with cardiovascular disease.',
        category: 'Medication'
    },
    {
        term: 'Diuretics',
        description: 'Diuretics are medications that help the body remove excess salt and water through urine. They are commonly known as water pills and are often prescribed for high blood pressure and heart failure. Diuretics reduce fluid buildup in the body, which helps lower blood pressure and reduce swelling. The medications work by affecting the kidneys and increasing urine production. Doctors may prescribe diuretics for conditions such as edema, kidney disease, or liver problems. There are several types of diuretics including thiazide diuretics, loop diuretics, and potassium-sparing diuretics. Each type works in a slightly different way within the kidneys. Patients taking diuretics may need to monitor electrolyte levels in their blood. Excessive fluid loss may cause dehydration or imbalances in minerals such as potassium. Doctors often recommend regular check-ups while using these medications. Lifestyle adjustments such as reducing salt intake can enhance the benefits of diuretics. When used properly, these medications help manage fluid balance and improve cardiovascular health.',
        category: 'Medication'
    },
    {
        term: 'Colonoscopy',
        description: 'Colonoscopy is a medical procedure used to examine the inside of the large intestine and rectum. It is commonly performed to detect abnormalities such as polyps, tumors, or inflammation. During the procedure, a long flexible tube with a camera called a colonoscope is inserted into the rectum. The camera transmits images to a monitor so doctors can carefully examine the intestinal lining. Colonoscopy is often recommended as a screening test for colorectal cancer. The procedure also allows doctors to remove polyps or collect tissue samples for biopsy. Patients usually receive sedation to remain comfortable during the examination. Before the procedure, patients must follow a special diet and take medications to clean the intestines. Colonoscopy is considered a safe and effective diagnostic tool. Complications are rare but may include bleeding or irritation of the intestinal lining. Regular screening colonoscopies help detect diseases early and improve treatment outcomes. This procedure plays a vital role in preventive healthcare.',
        category: 'Diagnostic Procedure'
    },
    {
        term: 'Anesthesia',
        description: 'Anesthesia is a medical technique used to prevent pain during surgical procedures. It works by blocking nerve signals or inducing unconsciousness in patients. There are several types of anesthesia including local, regional, and general anesthesia. Local anesthesia numbs a small area of the body for minor procedures. Regional anesthesia blocks pain in a larger section of the body, such as during childbirth. General anesthesia causes temporary loss of consciousness during major surgeries. Anesthesiologists are specialized doctors responsible for administering anesthesia safely. They monitor vital signs such as heart rate, breathing, and blood pressure throughout the procedure. Advances in medical science have made anesthesia safer than ever before. Some patients may experience temporary side effects such as nausea or dizziness after surgery. Proper evaluation before anesthesia helps reduce potential risks. Anesthesia has revolutionized modern medicine by making complex surgical procedures possible without pain.',
        category: 'Treatment'
    },
    {
        term: 'Laparoscopic Surgery',
        description: 'Laparoscopic surgery is a minimally invasive surgical technique used to perform operations with small incisions. Instead of large surgical cuts, surgeons insert a thin tube with a camera called a laparoscope into the body. The camera provides a magnified view of internal organs on a monitor. This allows surgeons to perform precise procedures using specialized instruments. Laparoscopic surgery is commonly used for procedures such as gallbladder removal and appendectomy. Because the incisions are small, patients usually experience less pain after surgery. Recovery time is typically faster compared to traditional open surgery. The risk of infection and scarring is also reduced. Patients are often able to return home within a short period after the procedure. Surgeons receive special training to perform laparoscopic techniques effectively. This surgical approach has become widely adopted in modern hospitals. Laparoscopic surgery has greatly improved patient outcomes and recovery experiences.',
        category: 'Treatment'
    },
    {
        term: 'Laser Surgery',
        description: 'Laser surgery is a medical procedure that uses focused beams of light to treat various medical conditions. The laser produces a highly concentrated energy beam that can cut or destroy tissue with precision. Laser surgery is commonly used in eye procedures such as LASIK to correct vision problems. It is also used to remove tumors, treat skin conditions, and perform cosmetic procedures. The precision of lasers allows surgeons to minimize damage to surrounding tissues. This results in faster healing and reduced risk of infection. Laser surgery is often performed on an outpatient basis. Patients typically experience less bleeding and discomfort compared to traditional surgery. The technology behind laser surgery continues to evolve with ongoing research. Some procedures require local anesthesia while others may require sedation. Doctors carefully evaluate patients to determine whether laser treatment is appropriate. Laser surgery represents a major advancement in modern medical technology.',
        category: 'Treatment'
    },
    {
        term: 'Organ Transplant',
        description: 'Organ transplantation is a surgical procedure in which a damaged or failing organ is replaced with a healthy donor organ. This treatment is often used when organs such as the heart, kidney, liver, or lungs fail. Organ transplants can save lives and significantly improve quality of life. The donor organ may come from a living donor or a deceased donor. Before transplantation, patients undergo extensive medical evaluation to determine eligibility. After surgery, patients must take medications to prevent the immune system from rejecting the new organ. These medications are known as immunosuppressants. Regular medical monitoring is required to ensure the transplanted organ functions properly. Advances in surgical techniques and immunology have greatly improved transplant success rates. Organ donation programs are essential to provide organs for patients in need. Ethical and medical guidelines regulate the transplantation process carefully. Organ transplantation remains one of the most remarkable achievements in modern medicine.',
        category: 'Treatment'
    },
    {
        term: 'Hyperbaric Oxygen Therapy',
        description: 'Hyperbaric oxygen therapy is a medical treatment that involves breathing pure oxygen in a pressurized chamber. This therapy increases the amount of oxygen dissolved in the blood. Higher oxygen levels help accelerate healing and fight certain infections. Hyperbaric oxygen therapy is often used to treat conditions such as carbon monoxide poisoning and severe wounds. It can also help patients with decompression sickness experienced by divers. The treatment improves oxygen delivery to tissues that have poor blood circulation. Patients typically lie inside a specialized chamber during the therapy session. Each session may last from 60 to 120 minutes depending on the treatment plan. Multiple sessions may be required for optimal results. The therapy is generally safe but must be administered under medical supervision. Some patients may experience temporary ear pressure or fatigue. Hyperbaric oxygen therapy has become an important tool in modern wound care and emergency medicine.',
        category: 'Treatment'
    },
    {
        term: 'Amoxicillin Clavulanate',
        description: 'Amoxicillin Clavulanate is a combination antibiotic medication used to treat various bacterial infections. It combines amoxicillin, a penicillin antibiotic, with clavulanic acid, which helps prevent bacterial resistance. The medication is commonly used to treat respiratory tract infections, ear infections, sinus infections, and urinary tract infections. Clavulanic acid works by inhibiting beta-lactamase enzymes produced by bacteria. These enzymes normally destroy antibiotics, so blocking them increases the effectiveness of amoxicillin. The medication is usually taken orally as tablets or liquid suspension. Doctors prescribe it when infections do not respond to simple antibiotics. Patients are advised to complete the full course of treatment to prevent resistance. Common side effects include mild stomach upset or diarrhea. Taking the medication with food may reduce digestive discomfort. Allergic reactions can occur in individuals sensitive to penicillin antibiotics. With proper medical supervision, this antibiotic is effective in treating a wide range of bacterial infections.',
        category: 'Medication'
    },
    {
        term: 'Atorvastatin',
        description: 'Atorvastatin is a medication used to lower cholesterol levels in the blood. It belongs to a group of drugs known as statins that help reduce the risk of heart disease. The medication works by blocking an enzyme responsible for cholesterol production in the liver. Lower cholesterol levels reduce the buildup of fatty deposits in blood vessels. This helps improve blood flow and prevents heart attacks and strokes. Atorvastatin is usually taken once daily and may be prescribed for long-term treatment. Doctors often recommend lifestyle changes such as diet and exercise along with the medication. Regular blood tests are required to monitor cholesterol levels and liver function. Some patients may experience mild side effects such as muscle aches or digestive issues. Rarely, serious muscle problems may occur and require medical attention. Patients should avoid excessive alcohol while taking this medication. Atorvastatin has become one of the most commonly prescribed cholesterol-lowering medications worldwide.',
        category: 'Medication'
    },
    {
        term: 'Corticosteroids',
        description: 'Corticosteroids are medications that reduce inflammation and suppress the immune system. They are used to treat many conditions including asthma, arthritis, allergies, and autoimmune diseases. These medications mimic hormones naturally produced by the adrenal glands. By reducing inflammation, corticosteroids help relieve pain and swelling in affected tissues. They are available in different forms such as tablets, injections, inhalers, and topical creams. Doctors carefully adjust doses depending on the severity of the condition. Long-term use of corticosteroids may cause side effects such as weight gain or weakened bones. Therefore, doctors try to prescribe the lowest effective dose. Patients should not stop corticosteroid therapy suddenly without medical advice. Gradual dose reduction is necessary to allow the body to adjust. Regular medical monitoring helps manage potential side effects. When used properly, corticosteroids are highly effective in controlling inflammatory diseases.',
        category: 'Medication'
    },
    {
        term: 'Antihistamines',
        description: 'Antihistamines are medications used to treat allergic reactions. They work by blocking histamine, a chemical released by the immune system during allergic responses. Histamine causes symptoms such as sneezing, itching, and runny nose. Antihistamines help reduce these symptoms and improve comfort. They are commonly used to treat conditions like hay fever, allergic rhinitis, and skin allergies. Some antihistamines may cause drowsiness, while newer versions are less sedating. These medications are available as tablets, syrups, nasal sprays, and eye drops. Doctors may recommend antihistamines for seasonal or chronic allergies. Side effects may include dry mouth or mild dizziness. Patients should follow recommended dosage guidelines carefully. In severe allergic reactions, additional treatments may be required. Antihistamines remain one of the most widely used treatments for allergy relief.',
        category: 'Medication'
    },
    {
        term: 'Angioplasty',
        description: 'Angioplasty is a medical procedure used to open narrowed or blocked blood vessels. It is commonly performed to treat coronary artery disease. During the procedure, a small balloon attached to a catheter is inserted into the blocked artery. The balloon is inflated to widen the artery and restore blood flow. In many cases, a small metal mesh tube called a stent is placed to keep the artery open. Angioplasty is considered a minimally invasive procedure compared to open heart surgery. The procedure is typically performed in a hospital cardiac catheterization laboratory. Patients are usually awake but receive medication to help them relax. Recovery time after angioplasty is relatively short. Doctors recommend lifestyle changes and medications to maintain artery health after the procedure. Angioplasty significantly reduces symptoms such as chest pain and improves blood circulation. This procedure has become a standard treatment for many heart conditions.',
        category: 'Treatment'
    },
    {
        term: 'Cardiac Catheterization',
        description: 'Cardiac catheterization is a diagnostic medical procedure used to examine heart function and blood vessels. During the procedure, a thin flexible tube called a catheter is inserted into a blood vessel. The catheter is carefully guided toward the heart. Doctors use this procedure to diagnose conditions such as blocked arteries or heart valve problems. Special dyes may be injected to make blood vessels visible on imaging scans. The procedure provides detailed information about heart function. It is commonly performed before treatments like angioplasty or heart surgery. Patients are typically awake but receive sedation to remain comfortable. The procedure usually takes less than an hour. Complications are rare but may include minor bleeding or bruising. Cardiac catheterization has greatly improved the diagnosis of heart diseases. It remains an important tool in modern cardiology.',
        category: 'Diagnostic Procedure'
    },
    {
        term: 'Arthritis',
        description: 'Arthritis is a condition characterized by inflammation of the joints. It causes pain, swelling, and stiffness in the affected areas. There are many different types of arthritis, including osteoarthritis and rheumatoid arthritis. Osteoarthritis occurs when joint cartilage gradually wears down over time. Rheumatoid arthritis is an autoimmune condition in which the immune system attacks joint tissues. Symptoms often worsen with age or physical activity. Doctors diagnose arthritis through physical examination and imaging tests. Treatment focuses on reducing pain and improving joint function. Medications, physical therapy, and lifestyle changes may be recommended. Severe cases may require joint replacement surgery. Maintaining a healthy weight can reduce stress on joints. Arthritis is one of the most common causes of disability worldwide.',
        category: 'Condition'
    },
    {
        term: 'Gastroenteritis',
        description: 'Gastroenteritis is an inflammation of the stomach and intestines. It is commonly caused by viral or bacterial infections. The condition is often referred to as stomach flu, although it is unrelated to influenza. Symptoms include diarrhea, vomiting, abdominal pain, and fever. Gastroenteritis spreads easily through contaminated food, water, or contact with infected individuals. Most cases are mild and resolve within a few days. Treatment usually involves rest and hydration. Drinking oral rehydration solutions helps replace lost fluids and electrolytes. Antibiotics are only used when bacterial infections are confirmed. Preventive measures include proper hygiene and safe food handling. Severe dehydration may require hospitalization in extreme cases. Gastroenteritis is common but usually manageable with supportive care.',
        category: 'Condition'
    },
    {
        term: 'Sepsis',
        description: 'Sepsis is a life-threatening medical condition caused by the body’s extreme response to infection. It occurs when the immune system triggers widespread inflammation throughout the body. This inflammation can damage tissues and organs. Sepsis often begins with infections in the lungs, urinary tract, or abdomen. Symptoms include fever, rapid heart rate, confusion, and difficulty breathing. Early diagnosis and treatment are critical for survival. Doctors treat sepsis with antibiotics and supportive care in hospitals. Severe cases may require intensive care and mechanical ventilation. Prompt treatment improves the chances of recovery. Preventing infections and treating them early reduces the risk of sepsis. Healthcare professionals closely monitor patients with infections for warning signs. Sepsis remains a major cause of death worldwide but can often be managed with early intervention.',
        category: 'Condition'
    },
    {
        term: 'Insulin Resistance',
        description: 'Insulin resistance is a condition in which the body’s cells do not respond properly to insulin. Insulin is a hormone that allows glucose to enter cells and produce energy. When cells become resistant to insulin, glucose builds up in the bloodstream. This condition often leads to Type 2 diabetes over time. Insulin resistance is commonly associated with obesity and sedentary lifestyle. Symptoms may not appear in the early stages. Doctors diagnose the condition through blood tests that measure glucose and insulin levels. Treatment focuses on lifestyle changes such as diet and exercise. Weight loss can significantly improve insulin sensitivity. Some patients may require medications to control blood sugar levels. Early detection helps prevent complications such as diabetes and heart disease. Managing insulin resistance is an important step in maintaining metabolic health.',
        category: 'Condition'
    },
{
term: 'Leukemia',
description: 'Leukemia is a type of cancer that affects the blood and bone marrow. It occurs when abnormal white blood cells grow uncontrollably and interfere with normal blood cell production. These abnormal cells prevent the body from fighting infections effectively. Leukemia can develop rapidly or slowly depending on the type. There are several types including acute lymphocytic leukemia and chronic myeloid leukemia. Symptoms may include fatigue, frequent infections, fever, and unexplained bruising. Doctors diagnose leukemia through blood tests and bone marrow examinations. Treatment options depend on the type and severity of the disease. Chemotherapy, radiation therapy, and bone marrow transplants are common treatments. Advances in medical research have significantly improved survival rates for many patients. Early diagnosis plays a crucial role in effective treatment. Continuous monitoring and medical care are essential for managing the disease.',
category: 'Condition'
},
{
term: 'Lymphoma',
description: 'Lymphoma is a cancer that begins in the lymphatic system, which is part of the body’s immune system. The lymphatic system includes lymph nodes, the spleen, and lymph vessels. Lymphoma occurs when certain white blood cells called lymphocytes grow abnormally. There are two main types of lymphoma known as Hodgkin lymphoma and non-Hodgkin lymphoma. Symptoms often include swollen lymph nodes, fatigue, fever, and night sweats. Patients may also experience unexplained weight loss and itching. Diagnosis typically involves imaging tests and lymph node biopsies. Treatment may include chemotherapy, radiation therapy, or targeted drug therapy. Doctors select treatment methods based on the stage and type of lymphoma. Many forms of lymphoma respond well to treatment when detected early. Advances in medical therapies have improved outcomes for lymphoma patients. Regular follow-up care is important to monitor recovery and prevent recurrence.',
category: 'Condition'
},
{
term: 'Melanoma',
description: 'Melanoma is a serious form of skin cancer that develops in cells called melanocytes. These cells produce melanin, the pigment responsible for skin color. Melanoma often appears as a new mole or changes in an existing mole. The condition is commonly associated with excessive exposure to ultraviolet radiation from sunlight or tanning beds. Early signs include irregular borders, uneven color, and increasing size of skin lesions. If detected early, melanoma can often be treated successfully. However, advanced melanoma may spread to other parts of the body. Diagnosis usually involves skin examination and biopsy of suspicious lesions. Treatment options include surgical removal, immunotherapy, and targeted therapy. Protecting the skin from excessive sun exposure can reduce the risk of melanoma. Regular skin checks help identify suspicious changes early. Melanoma is one of the most dangerous skin cancers but can be effectively treated when diagnosed early.',
category: 'Condition'
},
{
term: 'Parkinson Disease',
description: 'Parkinson disease is a progressive neurological disorder that affects movement. It occurs when certain nerve cells in the brain stop producing enough dopamine. Dopamine is a chemical that helps coordinate smooth and controlled muscle movements. As dopamine levels decrease, patients develop symptoms such as tremors, stiffness, and slow movement. The disease usually develops gradually and worsens over time. Patients may also experience balance problems and changes in speech. Doctors diagnose Parkinson disease based on symptoms and neurological examinations. While there is no cure, medications can help manage symptoms effectively. Treatments may include dopamine replacement therapies and physical therapy. Lifestyle modifications and regular exercise may improve mobility. Advanced cases may require surgical treatments such as deep brain stimulation. Ongoing research continues to explore better treatments for this condition.',
category: 'Condition'
},
{
term: 'Epilepsy',
description: 'Epilepsy is a neurological disorder characterized by recurrent seizures. Seizures occur when abnormal electrical activity takes place in the brain. These episodes may cause sudden movements, confusion, or loss of consciousness. Epilepsy can affect people of all ages and may develop due to various causes. Possible causes include brain injuries, infections, genetic conditions, or developmental disorders. Doctors diagnose epilepsy using neurological examinations and imaging tests such as MRI scans. Electroencephalograms are commonly used to measure electrical activity in the brain. Treatment usually involves medications known as anticonvulsants. These medications help control or reduce seizure frequency. Some patients may require surgical treatment if medications are ineffective. Lifestyle adjustments such as adequate sleep and stress management may help prevent seizures. With proper treatment, many individuals with epilepsy can live normal and active lives.',
category: 'Condition'
},
{
term: 'Multiple Sclerosis',
description: 'Multiple sclerosis is a chronic disease that affects the central nervous system. It occurs when the immune system attacks the protective covering of nerve fibers. This damage disrupts communication between the brain and the rest of the body. Symptoms vary widely and may include fatigue, vision problems, and muscle weakness. Some patients also experience numbness, balance problems, and difficulty walking. The disease often develops in young adults and progresses over time. Doctors diagnose multiple sclerosis through neurological examinations and imaging tests. Although there is no cure, treatments can help manage symptoms and slow disease progression. Medications are often used to reduce inflammation and prevent relapses. Physical therapy can help improve mobility and coordination. Supportive care plays an important role in maintaining quality of life. Research continues to explore new treatments for this complex neurological condition.',
category: 'Condition'
},
{
term: 'Glucose Test',
description: 'A glucose test is a medical test used to measure the amount of sugar in the blood. It is commonly used to diagnose and monitor diabetes. The test helps doctors evaluate how the body processes glucose. Blood samples are usually taken from a finger prick or a vein. Fasting glucose tests require patients to avoid eating before the test. Other types of glucose tests include oral glucose tolerance tests. Continuous glucose monitoring devices can also track glucose levels throughout the day. These tests help detect abnormal blood sugar levels early. Managing blood sugar levels is essential for preventing complications. Doctors use glucose test results to adjust treatment plans. Patients with diabetes often monitor their glucose levels regularly. Accurate glucose monitoring plays a vital role in maintaining metabolic health.',
category: 'Diagnostic Procedure'
},
{
term: 'Syringe',
description: 'A syringe is a medical instrument used to inject or withdraw fluids from the body. It consists of a cylindrical barrel, a plunger, and a needle attachment. Syringes are commonly used to administer medications and vaccines. Healthcare professionals also use them to draw blood samples for testing. The plunger allows precise control of fluid movement. Syringes come in different sizes depending on the intended use. Disposable syringes are widely used to prevent infections and contamination. Sterilization and proper disposal are important for maintaining safety. Medical professionals are trained to use syringes safely and accurately. Patients receiving injections may experience mild discomfort but the procedure is usually quick. Syringes play an essential role in modern healthcare and medical treatments.',
category: 'Medical Instrument'
},
{
term: 'IV Infusion Pump',
description: 'An IV infusion pump is a medical device used to deliver fluids and medications into a patient’s bloodstream. It allows healthcare providers to control the rate and dosage of medication precisely. Infusion pumps are commonly used in hospitals and intensive care units. The device is connected to an intravenous line inserted into the patient’s vein. It can deliver fluids such as saline, antibiotics, or chemotherapy drugs. Modern infusion pumps are programmable and highly accurate. They reduce the risk of medication errors during treatment. Nurses monitor infusion pumps regularly to ensure proper functioning. Some devices include alarms to detect blockages or incorrect flow rates. Infusion pumps are especially useful for patients who require continuous medication delivery. Proper training is necessary for healthcare professionals using the device. Infusion pump technology has significantly improved patient safety and treatment effectiveness.',
category: 'Medical Device'
},
{
term: 'Occupational Therapy',
description: 'Occupational therapy is a rehabilitation treatment that helps individuals regain the ability to perform daily activities. It is often used for patients recovering from injuries, surgeries, or neurological disorders. Occupational therapists evaluate patients and design personalized therapy plans. The therapy focuses on improving physical, cognitive, and emotional abilities. Patients practice activities such as dressing, eating, and writing. Special equipment may be used to assist with movement and coordination. Occupational therapy also helps individuals adapt to disabilities. The goal is to improve independence and quality of life. Therapy sessions may take place in hospitals, clinics, or home settings. Progress is monitored regularly to adjust treatment plans. Occupational therapy is especially beneficial for stroke survivors and elderly patients. With consistent therapy, many individuals regain functional independence.',
category: 'Treatment'
},
{
term: 'Hypertension Crisis',
description: 'Hypertensive crisis is a severe and dangerous increase in blood pressure that requires immediate medical attention. It occurs when blood pressure rises above extremely high levels, often exceeding 180/120 mmHg. There are two main types of hypertensive crisis: hypertensive urgency and hypertensive emergency. In hypertensive urgency, blood pressure is very high but there is no immediate organ damage. In hypertensive emergency, high blood pressure causes damage to organs such as the heart, brain, or kidneys. Symptoms may include severe headache, chest pain, blurred vision, confusion, and shortness of breath. Doctors diagnose the condition by measuring blood pressure and evaluating symptoms. Immediate treatment is necessary to reduce blood pressure safely. Medications may be given intravenously in hospital settings. Long-term treatment involves lifestyle changes and regular monitoring of blood pressure. Preventive measures include controlling hypertension through medication and healthy habits. Early medical intervention significantly reduces the risk of complications.',
category: 'Condition'
},
{
term: 'Bronchodilators',
description: 'Bronchodilators are medications used to relax and widen the airways in the lungs. They are commonly prescribed for respiratory conditions such as asthma and chronic obstructive pulmonary disease. These medications work by relaxing the muscles surrounding the airways. This allows air to flow more easily into and out of the lungs. Bronchodilators can provide rapid relief from breathing difficulties. They are usually administered through inhalers or nebulizers. Short-acting bronchodilators are used during sudden asthma attacks. Long-acting bronchodilators help maintain open airways for longer periods. Some patients may experience side effects such as tremors or increased heart rate. Doctors often combine bronchodilators with anti-inflammatory medications. Proper inhaler technique is important for effective treatment. Bronchodilators significantly improve breathing and quality of life for patients with respiratory diseases.',
category: 'Medication'
},
{
term: 'Ventilation Therapy',
description: 'Ventilation therapy is a medical treatment used to support breathing in patients with respiratory failure. It involves the use of mechanical devices to assist or replace natural breathing. This therapy is often required in intensive care units. Patients with severe lung diseases or injuries may require ventilatory support. The ventilator delivers oxygen into the lungs and removes carbon dioxide. Doctors carefully adjust ventilator settings based on patient needs. Continuous monitoring ensures that oxygen levels remain stable. Ventilation therapy may be temporary or long-term depending on the condition. Healthcare providers gradually reduce ventilator support as patients recover. Proper hygiene and monitoring help prevent infections during therapy. Advances in technology have made modern ventilators highly efficient. Ventilation therapy plays a critical role in saving lives during severe respiratory conditions.',
category: 'Treatment'
},
{
term: 'Anticoagulants',
description: 'Anticoagulants are medications that help prevent the formation of blood clots. They are often referred to as blood thinners. These medications do not actually thin the blood but reduce its ability to clot. Doctors prescribe anticoagulants to prevent strokes and heart attacks. They are commonly used in patients with conditions such as atrial fibrillation. Anticoagulants are also used after certain surgeries to prevent clot formation. Common medications include warfarin and newer oral anticoagulants. Patients taking these medications must follow dosage instructions carefully. Regular blood tests may be required to monitor clotting levels. Excessive use may increase the risk of bleeding complications. Doctors often recommend lifestyle adjustments while using anticoagulants. These medications play an essential role in preventing life-threatening cardiovascular events.',
category: 'Medication'
},
{
term: 'Radiology',
description: 'Radiology is a medical field that uses imaging techniques to diagnose and treat diseases. Radiologists are specialized doctors trained to interpret medical images. Common imaging methods include X-rays, CT scans, MRI scans, and ultrasounds. These techniques allow doctors to view internal structures without surgery. Radiology helps detect tumors, fractures, infections, and organ abnormalities. Imaging procedures are often quick and painless for patients. Radiology also assists in guiding certain medical procedures such as biopsies. Modern imaging technology provides highly detailed images for accurate diagnosis. Radiologists work closely with other healthcare professionals to plan treatments. Continuous advancements in imaging technology improve diagnostic accuracy. Radiology has become an essential part of modern medical practice. It plays a vital role in early disease detection and monitoring treatment progress.',
category: 'Diagnostic Field'
},
{
term: 'Dermatitis',
description: 'Dermatitis is a general term used to describe inflammation of the skin. It often results in redness, itching, and irritation. Several types of dermatitis exist, including contact dermatitis and atopic dermatitis. Contact dermatitis occurs when the skin reacts to irritants or allergens. Atopic dermatitis is a chronic condition commonly known as eczema. Symptoms may include dry skin, rashes, and swelling. Doctors diagnose dermatitis through physical examination and patient history. Treatment often involves topical medications and moisturizing creams. Avoiding irritants can help prevent flare-ups. Severe cases may require prescription medications. Maintaining proper skin care helps reduce symptoms. Dermatitis is common but manageable with appropriate treatment.',
category: 'Condition'
},
{
term: 'Electrolyte Imbalance',
description: 'Electrolyte imbalance occurs when the levels of minerals in the body become too high or too low. Electrolytes include sodium, potassium, calcium, and magnesium. These minerals help regulate many body functions. They are essential for nerve signals, muscle contractions, and fluid balance. Dehydration is a common cause of electrolyte imbalance. Symptoms may include fatigue, confusion, irregular heartbeat, and muscle weakness. Blood tests help doctors detect abnormal electrolyte levels. Treatment involves correcting the imbalance through fluids or medications. Severe cases may require hospital treatment. Maintaining proper hydration helps prevent electrolyte disturbances. Balanced nutrition also supports electrolyte stability. Electrolyte balance is crucial for overall body function.',
category: 'Condition'
},
{
term: 'Endocrinology',
description: 'Endocrinology is the branch of medicine that studies hormones and endocrine glands. Hormones regulate many essential body processes. These processes include growth, metabolism, reproduction, and mood regulation. Endocrine glands include the thyroid, pancreas, and adrenal glands. Endocrinologists diagnose and treat hormone-related disorders. Common conditions include diabetes and thyroid diseases. Blood tests are often used to measure hormone levels. Treatment may involve medications or hormone replacement therapy. Lifestyle changes may also help manage hormonal conditions. Research in endocrinology continues to improve understanding of hormone disorders. Early diagnosis helps prevent complications related to hormone imbalance. Endocrinology plays a vital role in maintaining body regulation.',
category: 'Medical Field'
},
{
term: 'Orthopedic Surgery',
description: 'Orthopedic surgery is a medical specialty that focuses on the musculoskeletal system. This includes bones, joints, muscles, ligaments, and tendons. Orthopedic surgeons treat injuries such as fractures and dislocations. They also manage chronic conditions like arthritis. Treatment may involve medications, therapy, or surgical procedures. Joint replacement surgery is a common orthopedic procedure. Orthopedic surgery aims to restore mobility and reduce pain. Advanced technologies have improved surgical precision. Patients often undergo rehabilitation after surgery. Physical therapy helps strengthen muscles and restore function. Orthopedic care plays a major role in injury recovery. Proper treatment helps patients return to normal activities.',
category: 'Treatment'
},
{
term: 'Nephrology',
description: 'Nephrology is the medical specialty that focuses on kidney health and diseases. Nephrologists diagnose and treat conditions affecting the kidneys. These conditions include chronic kidney disease and kidney infections. The kidneys play an important role in filtering waste from the blood. They also regulate fluid balance and blood pressure. Kidney disorders can disrupt these vital functions. Doctors use blood and urine tests to evaluate kidney health. Imaging studies may also be used for diagnosis. Treatment may involve medications or dialysis therapy. Lifestyle changes such as diet modification are often recommended. Early treatment helps prevent kidney failure. Nephrology is essential for managing kidney-related health conditions.',
category: 'Medical Field'
},
{
term: 'Hematology',
description: 'Hematology is the branch of medicine that studies blood and blood disorders. Hematologists diagnose and treat diseases affecting blood cells. These diseases include anemia, leukemia, and clotting disorders. Blood plays a vital role in transporting oxygen and nutrients. It also supports immune function and clotting processes. Blood tests are commonly used to detect abnormalities. Hematologists analyze blood samples to diagnose conditions. Treatment options may include medications or blood transfusions. Some patients may require bone marrow transplantation. Advances in hematology have improved treatment outcomes for blood diseases. Regular monitoring helps manage chronic blood conditions. Hematology remains an essential field in modern medicine.',
category: 'Medical Field'
},
  ,
{
term: 'Cardiomyopathy',
description: 'Cardiomyopathy is a disease of the heart muscle that affects its ability to pump blood effectively. The heart muscle may become enlarged, thickened, or stiff. As the condition progresses, the heart becomes weaker and less able to circulate blood. There are several types of cardiomyopathy including dilated, hypertrophic, and restrictive cardiomyopathy. Symptoms may include shortness of breath, fatigue, and swelling in the legs. Some patients may also experience irregular heartbeats or chest pain. The condition can be inherited or develop due to other medical problems. Doctors diagnose cardiomyopathy using imaging tests such as echocardiograms. Treatment depends on the severity of the condition. Medications may help control symptoms and improve heart function. In severe cases, surgical procedures or heart transplantation may be required. Early diagnosis and proper management can significantly improve quality of life.',
category: 'Condition'
},
{
term: 'Echocardiogram',
description: 'An echocardiogram is a diagnostic test that uses ultrasound waves to create images of the heart. The test allows doctors to observe the structure and movement of the heart. It helps evaluate how well the heart pumps blood. During the procedure, a device called a transducer is placed on the chest. The transducer sends sound waves that bounce off the heart and create images on a monitor. Echocardiograms are commonly used to detect heart valve problems and heart muscle diseases. The test is painless and non-invasive. It usually takes less than an hour to complete. Doctors may perform the test in hospitals or specialized diagnostic centers. Echocardiograms provide valuable information about heart function. The results help doctors plan appropriate treatments. This test plays an important role in diagnosing many cardiovascular conditions.',
category: 'Diagnostic Procedure'
},
{
term: 'Anxiety Disorder',
description: 'Anxiety disorder is a mental health condition characterized by excessive fear and worry. It can interfere with daily activities and relationships. People with anxiety disorders often feel nervous or restless without a clear reason. Physical symptoms may include rapid heartbeat, sweating, and difficulty concentrating. There are several types of anxiety disorders including generalized anxiety disorder and panic disorder. Stressful life events or genetic factors may contribute to the condition. Doctors diagnose anxiety disorders through psychological evaluation. Treatment often includes psychotherapy and medications. Cognitive behavioral therapy is commonly used to help patients manage anxiety. Lifestyle changes such as exercise and stress management can also be beneficial. Support from family and healthcare professionals plays an important role in recovery. With proper treatment, many individuals learn to control their symptoms and live productive lives.',
category: 'Condition'
},
{
term: 'Obesity',
description: 'Obesity is a medical condition characterized by excessive body fat that increases health risks. It is often measured using body mass index, or BMI. A BMI of 30 or higher is generally considered obese. Obesity can increase the risk of several chronic diseases. These include diabetes, heart disease, and certain cancers. Factors contributing to obesity include poor diet, lack of exercise, and genetic influences. Hormonal conditions may also contribute to weight gain. Doctors often recommend lifestyle changes to manage obesity. Healthy eating habits and regular physical activity are important components of treatment. In some cases, medications or weight-loss surgery may be recommended. Psychological support can also help individuals maintain healthy habits. Addressing obesity early can significantly reduce health complications.',
category: 'Condition'
},
{
term: 'Thyroid Disorder',
description: 'Thyroid disorders affect the thyroid gland, which regulates metabolism through hormone production. The thyroid gland is located in the neck and produces hormones that control energy levels. Two common thyroid disorders are hypothyroidism and hyperthyroidism. Hypothyroidism occurs when the thyroid produces too little hormone. Hyperthyroidism occurs when the thyroid produces too much hormone. Symptoms may include weight changes, fatigue, and changes in heart rate. Doctors diagnose thyroid disorders through blood tests that measure hormone levels. Imaging tests may also be used to examine the thyroid gland. Treatment depends on the specific condition and its severity. Medications can help regulate hormone levels. In some cases, surgery or radioactive iodine therapy may be required. Proper management helps restore normal metabolism and improve health.',
category: 'Condition'
},
{
term: 'Insulin Injection',
description: 'Insulin injections are used to deliver insulin to patients with diabetes. Insulin is a hormone that helps regulate blood sugar levels. Patients with Type 1 diabetes require insulin therapy because their bodies cannot produce insulin. Some individuals with Type 2 diabetes also require insulin injections. The medication is usually injected under the skin using a syringe or insulin pen. Doctors teach patients how to administer injections safely. Injection sites may include the abdomen, thigh, or upper arm. Regular monitoring of blood glucose levels is necessary during insulin therapy. Proper dosage helps prevent complications such as hypoglycemia. Maintaining a balanced diet and exercise routine supports treatment effectiveness. Patients must follow medical guidance carefully when using insulin. Insulin injections remain a critical component of diabetes management.',
category: 'Treatment'
},
{
term: 'Antidepressants',
description: 'Antidepressants are medications used to treat depression and other mental health conditions. They work by balancing certain chemicals in the brain. These chemicals, known as neurotransmitters, affect mood and emotions. Several types of antidepressants exist, including SSRIs and tricyclic antidepressants. Doctors prescribe these medications based on individual symptoms and medical history. Antidepressants may take several weeks to show full effectiveness. Patients are advised to take the medication consistently as prescribed. Side effects may include nausea, sleep changes, or weight gain. Doctors monitor patients regularly to evaluate treatment progress. Combining medication with therapy often provides the best results. Antidepressants have helped millions of people manage depression. Proper medical supervision ensures safe and effective treatment.',
category: 'Medication'
},
{
term: 'Antiviral Drugs',
description: 'Antiviral drugs are medications used to treat viral infections. Unlike antibiotics, they specifically target viruses rather than bacteria. These drugs work by preventing viruses from multiplying in the body. Antiviral medications are used to treat diseases such as influenza, HIV, and hepatitis. Early treatment with antivirals often improves recovery outcomes. Some antivirals can also help reduce the severity of symptoms. Doctors prescribe these medications depending on the type of virus involved. Antiviral drugs are available in tablet, capsule, or injectable forms. Patients must follow dosage instructions carefully to ensure effectiveness. Side effects may vary depending on the medication used. Researchers continue to develop new antiviral treatments. Antiviral drugs are essential in managing many infectious diseases.',
category: 'Medication'
},
{
term: 'Ulcerative Colitis',
description: 'Ulcerative colitis is a chronic inflammatory bowel disease that affects the large intestine. It causes inflammation and ulcers in the lining of the colon. Symptoms often include abdominal pain, diarrhea, and rectal bleeding. The exact cause of ulcerative colitis is not fully understood. Genetic and immune system factors may contribute to the condition. Doctors diagnose the disease using colonoscopy and imaging tests. Blood tests may also help detect inflammation. Treatment focuses on reducing inflammation and controlling symptoms. Medications such as anti-inflammatory drugs are commonly prescribed. In severe cases, surgery may be necessary to remove affected portions of the colon. Patients often require long-term medical management. With proper treatment, many individuals achieve symptom control and improved quality of life.',
category: 'Condition'
},
{
term: 'Chronic Fatigue Syndrome',
description: 'Chronic fatigue syndrome is a complex disorder characterized by extreme and persistent fatigue. The fatigue does not improve with rest and can worsen with physical activity. The condition may affect memory, concentration, and sleep patterns. The exact cause of chronic fatigue syndrome is unknown. Some researchers believe infections or immune system abnormalities may play a role. Diagnosis is based on symptoms and medical evaluation. Doctors rule out other possible causes of fatigue before confirming the condition. Treatment focuses on managing symptoms and improving quality of life. Lifestyle adjustments such as pacing activities may help reduce fatigue. Psychological support may also be beneficial for patients. Although recovery may take time, many individuals learn strategies to manage the condition. Continued research aims to better understand and treat this disorder.',
category: 'Condition'
},
 ,
{
term: 'Alzheimer Disease',
description: 'Alzheimer disease is a progressive neurological disorder that affects memory and cognitive function. It is the most common cause of dementia in older adults. The disease occurs when abnormal protein deposits form in the brain. These deposits interfere with communication between brain cells. Over time, brain cells become damaged and die. Early symptoms often include memory loss and difficulty remembering recent events. As the disease progresses, patients may experience confusion and changes in behavior. Doctors diagnose Alzheimer disease through cognitive tests and brain imaging. Although there is no cure, medications may help slow the progression of symptoms. Supportive care and therapy can improve quality of life for patients. Family support is important in managing daily challenges. Ongoing research aims to discover better treatments and prevention strategies.',
category: 'Condition'
},
{
term: 'Dementia',
description: 'Dementia is a general term used to describe a decline in cognitive abilities. It affects memory, thinking, and the ability to perform daily activities. Dementia is not a single disease but a group of symptoms associated with brain disorders. Alzheimer disease is the most common cause of dementia. Other causes include vascular dementia and Lewy body dementia. Symptoms often develop gradually and worsen over time. Patients may experience memory loss, confusion, and difficulty communicating. Doctors diagnose dementia through cognitive assessments and medical tests. Treatment focuses on managing symptoms and improving quality of life. Medications may help slow cognitive decline in some cases. Support from caregivers is essential for daily functioning. Early diagnosis allows patients and families to plan appropriate care.',
category: 'Condition'
},
{
term: 'Arthroscopy',
description: 'Arthroscopy is a minimally invasive surgical procedure used to examine and treat joint problems. It involves inserting a small camera called an arthroscope into the joint. The camera allows surgeons to view the inside of the joint on a monitor. This procedure is commonly used to treat knee, shoulder, and ankle injuries. Small surgical instruments may also be inserted to repair damaged tissues. Arthroscopy usually requires only small incisions in the skin. As a result, patients experience less pain and faster recovery. Doctors often recommend arthroscopy for conditions such as torn ligaments or cartilage damage. The procedure is typically performed under anesthesia. Most patients return home on the same day. Physical therapy may be required after surgery to restore joint movement. Arthroscopy has greatly improved the treatment of joint injuries.',
category: 'Treatment'
},
{
term: 'Hemodialysis',
description: 'Hemodialysis is a medical procedure used to filter waste and excess fluids from the blood. It is commonly used for patients with severe kidney failure. The procedure involves circulating blood through a special machine called a dialysis machine. This machine acts as an artificial kidney. It removes toxins and extra fluids from the blood before returning it to the body. Hemodialysis treatments are usually performed several times a week. Each session may last several hours depending on the patient’s condition. Doctors monitor blood pressure and other vital signs during the procedure. Patients undergoing dialysis must follow dietary and fluid restrictions. Hemodialysis helps maintain chemical balance in the body. Although it cannot cure kidney failure, it significantly improves survival and quality of life. Some patients may eventually receive kidney transplants.',
category: 'Treatment'
},
{
term: 'Gallbladder Surgery',
description: 'Gallbladder surgery, also known as cholecystectomy, is the removal of the gallbladder. The gallbladder stores bile produced by the liver. This surgery is often performed when gallstones cause pain or infection. The most common method is laparoscopic surgery. During this procedure, small incisions are made in the abdomen. A camera and surgical instruments are used to remove the gallbladder. Patients usually recover faster with laparoscopic surgery compared to open surgery. Most people can live normally without a gallbladder. The liver continues to produce bile for digestion. Doctors recommend dietary adjustments during recovery. Gallbladder surgery is considered a safe and effective procedure. Proper post-operative care helps prevent complications.',
category: 'Treatment'
},
{
term: 'Neurology',
description: 'Neurology is the branch of medicine that deals with disorders of the nervous system. The nervous system includes the brain, spinal cord, and nerves. Neurologists are doctors specialized in diagnosing and treating neurological disorders. These disorders include epilepsy, stroke, and Parkinson disease. Neurological conditions can affect movement, sensation, and thinking. Diagnosis often involves neurological examinations and imaging tests. MRI and CT scans are commonly used to examine brain structures. Treatment may involve medications, therapy, or surgical procedures. Research in neurology continues to improve treatment options. Early diagnosis can help prevent complications in many neurological conditions. Neurology plays a critical role in modern healthcare. It helps improve the understanding and management of brain-related diseases.',
category: 'Medical Field'
},
{
term: 'Pulmonology',
description: 'Pulmonology is the branch of medicine that focuses on diseases of the lungs and respiratory system. Pulmonologists treat conditions such as asthma, pneumonia, and chronic obstructive pulmonary disease. The lungs are responsible for exchanging oxygen and carbon dioxide in the body. Respiratory diseases can affect breathing and oxygen supply. Diagnosis often involves imaging tests and lung function tests. Pulmonary function tests measure how well the lungs work. Treatment may include medications, oxygen therapy, or lifestyle changes. Pulmonologists also manage respiratory infections and lung injuries. Smoking cessation is often recommended to improve lung health. Preventive care helps reduce the risk of respiratory diseases. Pulmonology plays a vital role in maintaining healthy breathing. Early treatment can significantly improve patient outcomes.',
category: 'Medical Field'
},
{
term: 'Immunology',
description: 'Immunology is the branch of medicine that studies the immune system. The immune system protects the body against infections and harmful substances. Immunologists study how the body recognizes and fights pathogens. Disorders of the immune system can lead to diseases such as allergies and autoimmune conditions. Some immune disorders cause the body to attack its own tissues. Vaccination and immunotherapy are based on principles of immunology. Doctors use blood tests to evaluate immune system function. Research in immunology has improved treatments for many diseases. Scientists continue to develop vaccines and therapies using immune system knowledge. Understanding immune responses helps improve infection control. Immunology plays an important role in modern medical science.',
category: 'Medical Field'
},
{
term: 'Urology',
description: 'Urology is the medical specialty that focuses on the urinary tract system and male reproductive organs. Urologists diagnose and treat conditions affecting the kidneys, bladder, and urethra. Common conditions include kidney stones, urinary tract infections, and prostate disorders. The urinary system removes waste and excess fluids from the body. Problems in this system can cause pain or difficulty urinating. Doctors use imaging tests and laboratory tests to diagnose urological conditions. Treatment may include medications or surgical procedures. Preventive care helps maintain urinary health. Drinking adequate water supports proper kidney function. Urology also addresses reproductive health issues in men. Early treatment helps prevent complications in urinary diseases.',
category: 'Medical Field'
},
{
term: 'Gastroenterology',
description: 'Gastroenterology is the branch of medicine that focuses on the digestive system. The digestive system includes the stomach, intestines, liver, and pancreas. Gastroenterologists diagnose and treat digestive disorders. Common conditions include acid reflux, ulcers, and inflammatory bowel disease. Symptoms may include abdominal pain, nausea, and changes in digestion. Doctors use procedures such as endoscopy and colonoscopy for diagnosis. Treatment may involve medications or dietary adjustments. Maintaining a healthy diet supports digestive health. Gastroenterology research continues to improve treatments for digestive diseases. Early diagnosis helps prevent serious complications. Gastroenterologists play an important role in digestive health care. Their work improves patient comfort and nutritional well-being.',
category: 'Medical Field'
},
{
term: 'Appendectomy',
description: 'Appendectomy is a surgical procedure used to remove the appendix from the body. The appendix is a small pouch attached to the large intestine. This surgery is most commonly performed when a patient develops appendicitis. Appendicitis occurs when the appendix becomes inflamed or infected. If untreated, the appendix may rupture and cause severe infection in the abdomen. During an appendectomy, surgeons remove the appendix to prevent complications. The surgery may be performed using open surgery or laparoscopic techniques. Laparoscopic surgery involves smaller incisions and faster recovery. Patients usually receive anesthesia during the procedure. After surgery, patients are monitored for signs of infection or complications. Recovery typically takes a few weeks depending on the surgical method used. Appendectomy is one of the most common emergency surgical procedures worldwide.',
category: 'Treatment'
},
{
term: 'Bone Marrow Transplant',
description: 'Bone marrow transplant is a medical procedure used to replace damaged bone marrow with healthy cells. Bone marrow is responsible for producing blood cells in the body. The procedure is commonly used to treat cancers such as leukemia and lymphoma. It may also be used for certain genetic blood disorders. In a bone marrow transplant, healthy stem cells are introduced into the patient’s body. These cells begin producing new blood cells. Transplants may come from a donor or from the patient’s own cells. The procedure often requires chemotherapy before transplantation. This helps destroy diseased cells in the body. Patients must remain under medical supervision during recovery. Bone marrow transplantation can be life-saving for many patients. Advances in transplantation techniques continue to improve survival rates.',
category: 'Treatment'
},
{
term: 'CT Angiography',
description: 'CT angiography is an imaging test used to examine blood vessels in the body. It uses computed tomography along with contrast dye to produce detailed images. The contrast dye helps highlight blood vessels on the scan. Doctors use CT angiography to detect blockages or abnormalities in arteries. The test is commonly used to evaluate coronary arteries in the heart. It can also detect aneurysms and blood clots. During the procedure, patients lie on a scanning table while images are taken. The test is quick and usually painless. Doctors may recommend CT angiography when patients experience chest pain or circulation problems. The images help guide treatment decisions. Early detection of vascular problems can prevent serious complications.',
category: 'Diagnostic Procedure'
},
{
term: 'Deep Brain Stimulation',
description: 'Deep brain stimulation is a surgical treatment used for certain neurological disorders. The procedure involves implanting electrodes in specific areas of the brain. These electrodes send electrical signals that regulate abnormal brain activity. Deep brain stimulation is commonly used to treat Parkinson disease. It may also help patients with severe tremors or movement disorders. A small device called a pulse generator is implanted in the chest. This device controls the electrical signals sent to the brain. Doctors adjust the device settings to optimize symptom control. The procedure is usually considered when medications are not effective. Patients often experience significant improvement in movement and quality of life. Regular follow-up visits are required to adjust the device. Deep brain stimulation represents an important advancement in neurological treatment.',
category: 'Treatment'
},
{
term: 'Dialysis',
description: 'Dialysis is a medical treatment used to remove waste products from the blood. It is necessary when the kidneys are no longer able to perform their function properly. The kidneys normally filter toxins and excess fluids from the body. When kidney failure occurs, dialysis helps perform this filtration. There are two main types of dialysis: hemodialysis and peritoneal dialysis. Hemodialysis uses a machine to clean the blood outside the body. Peritoneal dialysis uses the lining of the abdomen to filter blood. Dialysis treatments are usually performed several times per week. Patients must follow dietary restrictions during dialysis treatment. Dialysis helps maintain fluid and electrolyte balance in the body. Although it cannot cure kidney failure, it prolongs life and improves quality of life.',
category: 'Treatment'
},
{
term: 'Electroencephalogram',
description: 'Electroencephalogram, often abbreviated as EEG, is a diagnostic test used to measure electrical activity in the brain. The test helps doctors understand how brain cells communicate. Small sensors called electrodes are placed on the scalp. These electrodes detect electrical signals produced by brain activity. EEG tests are commonly used to diagnose epilepsy and seizure disorders. They may also help evaluate sleep disorders or brain injuries. The test is painless and usually takes less than an hour. Patients are asked to relax during the procedure. The recorded brain wave patterns are analyzed by specialists. Abnormal patterns may indicate neurological conditions. EEG technology has greatly improved the understanding of brain function. It remains a key tool in neurology.',
category: 'Diagnostic Procedure'
},
{
term: 'Gastric Bypass Surgery',
description: 'Gastric bypass surgery is a weight-loss surgery used to treat severe obesity. The procedure changes how the stomach and small intestine handle food. Surgeons create a small stomach pouch during the operation. This limits the amount of food a person can eat at one time. The surgery also alters digestion to reduce calorie absorption. Gastric bypass is usually recommended when other weight-loss methods fail. Patients must follow strict dietary guidelines after surgery. Medical monitoring is necessary during recovery. Many patients experience significant weight loss after the procedure. Weight reduction can improve conditions such as diabetes and hypertension. Lifestyle changes remain essential after surgery. Gastric bypass surgery has helped many individuals achieve long-term weight control.',
category: 'Treatment'
},
{
term: 'Hemoglobin Test',
description: 'A hemoglobin test measures the amount of hemoglobin in the blood. Hemoglobin is a protein found in red blood cells. It carries oxygen from the lungs to the body’s tissues. The test is commonly used to diagnose anemia. Low hemoglobin levels may indicate blood loss or nutritional deficiencies. High levels may occur in certain medical conditions. Blood samples are usually taken from a vein in the arm. The test is quick and minimally invasive. Doctors use hemoglobin levels to monitor overall health. It may also help evaluate treatment effectiveness. Regular testing is important for patients with chronic diseases. Hemoglobin testing is a fundamental component of routine medical evaluation.',
category: 'Diagnostic Procedure'
},
{
term: 'Insulin Pump Therapy',
description: 'Insulin pump therapy is a method used to manage diabetes. It involves a small electronic device that delivers insulin continuously. The device is worn outside the body and connected to a small tube. Insulin is delivered into the body through the tube. The pump mimics the natural function of the pancreas. Patients can adjust insulin delivery based on meals and activity levels. Insulin pump therapy reduces the need for multiple daily injections. Continuous glucose monitoring may be used alongside the pump. This helps maintain stable blood sugar levels. Proper training is required for effective use of the device. Regular monitoring and adjustments are necessary. Insulin pump therapy improves diabetes management for many patients.',
category: 'Treatment'
},
{
term: 'Laser Therapy',
description: 'Laser therapy is a medical treatment that uses focused light energy. The laser beam can cut or destroy tissues with high precision. Doctors use laser therapy in many medical fields. It is commonly used in dermatology and ophthalmology. Laser treatments can remove tumors or repair damaged tissues. The procedure is usually minimally invasive. Patients often experience less bleeding compared to traditional surgery. Recovery time is usually shorter. Laser therapy may also be used for cosmetic treatments. Doctors carefully adjust laser settings depending on the condition being treated. Advances in technology have improved laser treatment effectiveness. Laser therapy continues to expand in modern medical practice.',
category: 'Treatment'
} // ... I can add more or focus on these for now to demonstrate the "vast" requirement.
];

async function seedComprehensiveKnowledge() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Update existing or create new
        for (const data of comprehensiveKnowledgeData) {
            if (!data) continue;
            const [record, created] = await MedicalKnowledge.findOrCreate({
                where: { term: data.term },
                defaults: data
            });

            if (!created) {
                // If it existed, update it with the new vast description
                record.description = data.description;
                record.category = data.category;
                await record.save();
                console.log(`Updated vast description for: ${data.term}`);
            } else {
                console.log(`Created new entry for: ${data.term}`);
            }
        }

        console.log('Comprehensive medical knowledge updated successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating comprehensive medical knowledge:', error);
        require('fs').writeFileSync('err-trace.txt', error.stack, 'utf8');
        process.exit(1);
    }
}

seedComprehensiveKnowledge();
