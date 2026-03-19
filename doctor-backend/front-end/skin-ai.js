const FLASK_API_URL = 'http://localhost:5000';
let selectedSkinFile = null;
let skinChart = null;
let currentSkinImageFile = null;
let cropper = null;

let skinConditionLibrary = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchSkinLibrary();
    const fileElem = document.getElementById('fileElem');
    if (fileElem) {
        fileElem.addEventListener('change', function () {
            handleSkinFiles(this.files);
        });
    }
});

async function fetchSkinLibrary() {
    try {
        console.log('[SkinScan AI] Fetching library from DB...');
        const response = await fetch('/api/skin/library');
        if (response.ok) {
            skinConditionLibrary = await response.json();
            console.log(`[SkinScan AI] Library loaded: ${skinConditionLibrary.length} entries.`);
        }
    } catch (err) {
        console.error('[SkinScan AI] Library load failed:', err);
    }
}

function findConditionInLibrary(aiResult) {
    if (!aiResult || !skinConditionLibrary.length) return null;

    const searchKey = aiResult.toLowerCase().trim();
    const slugKey = searchKey.replace(/\s+/g, '_');

    // Try finding by exact key, name, or slug
    return skinConditionLibrary.find(c =>
        c.key === searchKey ||
        c.key === slugKey ||
        c.displayName.toLowerCase() === searchKey
    );
}

// Walkthrough Functions
function openMelanomaDetails() { document.getElementById('details-modal').classList.add('active'); }
function closeDetailsModal() { document.getElementById('details-modal').classList.remove('active'); }
function openDiagnosticDetails() { document.getElementById('diagnostic-modal').classList.add('active'); }
function closeDiagnosticModal() { document.getElementById('diagnostic-modal').classList.remove('active'); }
function openTechDetails() { document.getElementById('tech-modal').classList.add('active'); }
function closeTechModal() { document.getElementById('tech-modal').classList.remove('active'); }
function openWelcomeDetails() { document.getElementById('welcome-modal').classList.add('active'); }
function closeWelcomeDetails() { document.getElementById('welcome-modal').classList.remove('active'); }

function scrollToClassification() {
    const walkthrough = document.querySelector('.walkthrough-container');
    const classification = document.getElementById('classification');
    if (walkthrough) walkthrough.style.display = 'none';
    if (classification) {
        classification.style.display = 'flex';
        classification.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// File Handling
function handleSkinFiles(files) {
    if (files.length > 0) {
        setupNewSkinFile(files[0]);
    }
}

function setupNewSkinFile(file) {
    selectedSkinFile = file;
    const preview = document.getElementById('preview-img');
    const placeholder = document.getElementById('upload-placeholder');
    const btn = document.getElementById('predict-btn');
    const cropBtn = document.getElementById('crop-trigger-btn');
    const imageToCrop = document.getElementById('image-to-crop');

    if (file && preview) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
            if (placeholder) placeholder.classList.add('hidden');
            if (cropBtn) cropBtn.classList.remove('hidden');
            if (imageToCrop) imageToCrop.src = e.target.result;
        };
        reader.readAsDataURL(file);
        if (btn) btn.disabled = false;
        const resultContent = document.getElementById('result-content');
        if (resultContent) resultContent.classList.add('hidden');
    }
}

function openCropModal() {
    const modal = document.getElementById('crop-modal');
    const img2Crop = document.getElementById('image-to-crop');
    if (modal) modal.classList.add('active');
    if (cropper) cropper.destroy();
    if (img2Crop) {
        cropper = new Cropper(img2Crop, { aspectRatio: 1, viewMode: 1 });
    }
}

function closeCropModal() {
    const modal = document.getElementById('crop-modal');
    if (modal) modal.classList.remove('active');
    if (cropper) { cropper.destroy(); cropper = null; }
}

function saveCrop() {
    if (!cropper) return;
    cropper.getCroppedCanvas({ width: 224, height: 224 }).toBlob((blob) => {
        const newFile = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });
        selectedSkinFile = newFile;
        const preview = document.getElementById('preview-img');
        const img2Crop = document.getElementById('image-to-crop');
        const url = URL.createObjectURL(blob);
        if (preview) preview.src = url;
        if (img2Crop) img2Crop.src = url;
        closeCropModal();
    }, 'image/jpeg');
}

async function startPrediction() {
    if (!selectedSkinFile) return;

    const loader = document.getElementById('loader');
    const resultContent = document.getElementById('result-content');
    const btn = document.getElementById('predict-btn');

    if (loader) loader.classList.remove('hidden');
    if (resultContent) resultContent.classList.add('hidden');
    if (btn) btn.disabled = true;

    const formData = new FormData();
    formData.append('file', selectedSkinFile);

    try {
        const response = await fetch(`${FLASK_API_URL}/predict`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            displaySkinResults(data);
        } else {
            alert('Skin AI Error: ' + (data.error || 'Unexpected response format from server. Please check the backend.'));
        }
    } catch (err) {
        console.error(err);
        alert('Connection error with Skin AI server.');
    } finally {
        if (loader) loader.classList.add('hidden');
        if (btn) btn.disabled = false;
    }
}

function displaySkinResults(data) {
    const loader = document.getElementById('loader');
    const resultContent = document.getElementById('result-content');
    if (loader) loader.classList.add('hidden');
    if (resultContent) {
        resultContent.classList.remove('hidden');
        resultContent.scrollIntoView({ behavior: 'smooth' });
    }

    currentSkinImageFile = data.image_file;

    const topFullName = data.top_full_name || data.top_class_full || data.top_class;
    const dbMatch = findConditionInLibrary(topFullName) || findConditionInLibrary(data.top_class);

    const titleEl = document.getElementById('top-full-name');
    if (titleEl) titleEl.textContent = dbMatch ? dbMatch.displayName : topFullName;

    const confEl = document.getElementById('top-confidence');
    if (confEl) confEl.textContent = `${data.top_confidence || data.top_prob}% Probability`;

    const descEl = document.getElementById('desc-text');
    if (descEl) descEl.textContent = dbMatch ? dbMatch.description : (data.top_desc || "Analyzing lesion characteristics...");

    const actionEl = document.getElementById('action-text');
    if (actionEl) actionEl.textContent = dbMatch ? dbMatch.recommendedAction : (data.top_action || "Consult with a dermatologist for a professional evaluation.");

    updateRiskBadge(dbMatch ? dbMatch.riskLevel : data.top_risk);
    renderPredictionChart(data.predictions);
    renderDetailedBreakdown(data.predictions);

    // Save context for Chatbot
    lastAnalysisContext = {
        condition: dbMatch ? dbMatch.displayName : topFullName,
        confidence: data.top_confidence || data.top_prob,
        risk: dbMatch ? dbMatch.riskLevel : (data.top_risk || 'Medium'),
        description: dbMatch ? dbMatch.description : "Awaiting deeper clinical review.",
        action: dbMatch ? dbMatch.recommendedAction : (data.top_action || "Consult with a dermatologist.")
    };
}

function updateRiskBadge(risk) {
    const badge = document.getElementById('risk-badge');
    const diseaseBtns = document.querySelectorAll('.check-disease-btn');
    if (!badge) return;
    badge.className = 'risk-badge';
    const level = (risk || 'low').toLowerCase();

    // In all cases, display the diseaseBtns
    diseaseBtns.forEach(btn => btn.style.display = 'flex');

    if (level === 'critical' || level === 'high') {
        badge.classList.add('risk-high');
        badge.textContent = 'High Priority';
    } else if (level === 'medium') {
        badge.style.background = '#fef3c7';
        badge.style.color = '#92400e';
        badge.textContent = 'Clinical Observation';
        // Auto-prompt to predict skin disease
        setTimeout(() => {
            if (confirm("The analysis indicates this lesion is NOT high-risk. Would you like to predict what skin disease it might be?")) {
                checkDisease();
            }
        }, 500);
    } else {
        badge.classList.add('risk-low');
        badge.textContent = 'Low Risk';
        // Auto-prompt to predict skin disease
        setTimeout(() => {
            if (confirm("The analysis indicates this lesion is NOT high-risk. Would you like to predict what skin disease it might be?")) {
                checkDisease();
            }
        }, 500);
    }
}

function renderPredictionChart(predictions) {
    const ctxEl = document.getElementById('predictionChart');
    if (!ctxEl) return;
    if (skinChart) skinChart.destroy();
    const labels = predictions.slice(0, 5).map(p => p.full_name || p.class);
    const probs = predictions.slice(0, 5).map(p => p.probability);
    skinChart = new Chart(ctxEl.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: probs,
                backgroundColor: '#1E88E5',
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { display: false, max: 100 },
                y: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function renderDetailedBreakdown(predictions) {
    const breakdownList = document.getElementById('breakdown-list');
    const breakdownContainer = document.getElementById('detailed-breakdown');
    if (!breakdownList) return;
    breakdownList.innerHTML = '';

    const items = predictions.filter(p => p.probability > 3).slice(0, 3);
    if (items.length > 0) {
        if (breakdownContainer) breakdownContainer.classList.remove('hidden');
        items.forEach(p => {
            const fullName = p.full_name || p.class;
            const dbMatch = findConditionInLibrary(fullName) || findConditionInLibrary(p.class);

            const div = document.createElement('div');
            div.className = 'breakdown-item';
            div.style.cssText = `
                padding: 1.5rem;
                background: #fdfdfe;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                margin-bottom: 1.25rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            `;

            const description = dbMatch ? dbMatch.description : `Clinical indicators suggest patterns consistent with ${fullName}.`;
            const action = dbMatch ? dbMatch.recommendedAction : 'Scheduled follow-up is advised.';
            const risk = dbMatch ? dbMatch.riskLevel : 'Observation advised';

            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <div style="display: flex; flex-direction: column;">
                        <strong style="font-size: 1.15rem; color: #1e293b; font-weight: 700;">${dbMatch ? dbMatch.displayName : fullName}</strong>
                        <span style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">Risk Level: ${risk}</span>
                    </div>
                    <span style="background: #eff6ff; color: #1e88e5; padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 0.85rem;">${p.probability}%</span>
                </div>
                <div style="margin-top: 10px;">
                    <p style="font-size: 0.95rem; color: #475569; line-height: 1.6; margin-bottom: 0.75rem;">
                        <strong>About:</strong> ${description}
                    </p>
                    <p style="font-size: 0.95rem; color: #0f172a; line-height: 1.6; font-weight: 500; background: #f8fafc; padding: 0.75rem; border-radius: 6px; border-left: 3px solid #1e88e5;">
                        <i class="fas fa-hand-holding-medical" style="color: #1e88e5; margin-right: 8px;"></i>${action}
                    </p>
                </div>
            `;
            breakdownList.appendChild(div);
        });
    }
}

function downloadReport() {
    if (!currentSkinImageFile) return;
    window.location.href = `${FLASK_API_URL}/download_report?file=${encodeURIComponent(currentSkinImageFile)}`;
}

let chatHistory = [];
let lastAnalysisContext = null;

function toggleAIChat() {
    const drawer = document.getElementById('chatbot-drawer');
    const overlay = document.getElementById('chat-overlay');
    if (drawer) drawer.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

function handleChatKey(e) {
    if (e.key === 'Enter') sendChatMessage();
}

async function sendChatMessage() {
    const input = document.getElementById('chatbot-input');
    const indicator = document.getElementById('typing-indicator');
    const msg = input.value.trim();
    if (!msg) return;

    appendMessage('user', msg);
    input.value = '';

    // Show typing indicator
    if (indicator) indicator.classList.add('active');

    try {
        const response = await fetch('/api/chatbot/consult', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: msg,
                history: chatHistory,
                context: lastAnalysisContext || { condition: 'Unknown', confidence: 0, risk: 'Unknown', description: 'Not analyzed yet' }
            })
        });

        const data = await response.json();
        if (data.success) {
            appendMessage('ai', data.reply);
            chatHistory.push({ role: 'user', content: msg });
            chatHistory.push({ role: 'assistant', content: data.reply });
        } else {
            appendMessage('ai', "I'm having trouble connecting right now. " + (data.message || ""));
        }
    } catch (err) {
        appendMessage('ai', "System connection error. Please try again later.");
    } finally {
        if (indicator) indicator.classList.remove('active');
    }
}

function appendMessage(role, text) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

async function checkDisease() {
    if (!selectedSkinFile) return;

    const btns = document.querySelectorAll('.check-disease-btn');
    btns.forEach(btn => {
        btn.disabled = true;
        btn.innerHTML = 'Analyzing...';
    });

    const formData = new FormData();
    formData.append('file', selectedSkinFile);

    try {
        const response = await fetch(`${FLASK_API_URL}/predict_disease`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        const resultDivs = document.querySelectorAll('.disease-result');
        const nameSpans = document.querySelectorAll('.disease-name');
        const confSpans = document.querySelectorAll('.disease-confidence');

        if (data.disease && resultDivs.length > 0) {
            nameSpans.forEach(span => span.textContent = data.disease.replace(/_/g, ' '));
            confSpans.forEach(span => span.textContent = data.confidence + '% Confidence');
            resultDivs.forEach(div => div.style.display = 'block');
        } else {
            alert('Could not predict the disease.');
        }
    } catch (err) {
        alert('Connection error. Ensure the Skin Disease endpoint is accessible.');
    } finally {
        btns.forEach(btn => {
            btn.disabled = false;
            btn.innerHTML = `
                <i class="fas fa-stethoscope"></i> Check Skin Disease
            `;
        });
    }
}
