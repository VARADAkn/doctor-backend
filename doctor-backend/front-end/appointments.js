// Enhanced Appointment Management Functions

let allAppointments = [];
let currentFilter = 'all';

async function loadAppointments() {
    const container = document.getElementById('appointments-container');
    const user = JSON.parse(localStorage.getItem('user'));

    // Support both ID formats ensuring we get a valid ID
    const patientId = user.patientId || user.id || user.profileId;

    if (!patientId) {
        container.innerHTML = '<p style="text-align:center;">Session invalid</p>';
        return;
    }

    container.innerHTML = '<div style="text-align:center; padding:2rem;"><i class="fas fa-spinner fa-spin" style="font-size:2rem; color:var(--primary);"></i><p>Loading appointments...</p></div>';

    try {
        const response = await fetch('/api/appointments/patient-appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patientId })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch appointments');
        }

        allAppointments = await response.json();
        renderAppointments();
    } catch (error) {
        console.error('Error loading appointments:', error);
        container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><h3>Error Loading Appointments</h3><p>Please try again later</p></div>';
    }
}

function renderAppointments() {
    const container = document.getElementById('appointments-container');

    let filtered = allAppointments;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (currentFilter === 'upcoming') {
        const todayStr = new Date().toISOString().split('T')[0];
        filtered = allAppointments.filter(apt => {
            const aptDateStr = apt.appointmentDate.split('T')[0];
            return (apt.status === 'pending' || apt.status === 'confirmed') && aptDateStr >= todayStr;
        });
    } else if (currentFilter === 'completed') {
        filtered = allAppointments.filter(apt => apt.status === 'completed' || apt.status === 'processed');
    } else if (currentFilter === 'cancelled') {
        filtered = allAppointments.filter(apt => apt.status === 'cancelled');
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>No Appointments Found</h3>
                <p>You don't have any ${currentFilter === 'all' ? '' : currentFilter} appointments yet.</p>
                ${currentFilter === 'all' ? '<button class="btn btn-primary" onclick="openCreateAppointmentModal()" style="margin-top: 1rem;"><i class="fas fa-plus"></i> Book Your First Appointment</button>' : ''}
            </div>`;
        return;
    }

    container.innerHTML = filtered.map(apt => {
        const aptDate = new Date(apt.appointmentDate);
        const isPast = new Date(apt.appointmentDate + ' ' + apt.appointmentTime) < new Date();

        return `
            <div class="appointment-card status-${apt.status}">
                <div class="appointment-header">
                    <div class="doctor-info">
                        <h4>
                            <i class="fas fa-user-md" style="color: var(--primary);"></i>
                            Dr. ${apt.Doctor?.name || 'Unknown Doctor'}
                        </h4>
                        <p><i class="fas fa-stethoscope" style="margin-right: 5px;"></i>${apt.Doctor?.specialization || 'General Practitioner'}</p>
                    </div>
                    <span class="status-badge ${apt.status}">${apt.status}</span>
                </div>
                
                <div class="appointment-details">
                    <div class="detail-item">
                        <span class="detail-label">Date</span>
                        <span class="detail-value">
                            <i class="fas fa-calendar"></i>
                            ${aptDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Time</span>
                        <span class="detail-value">
                            <i class="fas fa-clock"></i>
                            ${formatTime(apt.appointmentTime)}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Type</span>
                        <span class="detail-value">
                            <i class="fas fa-tag"></i>
                            ${apt.type ? apt.type.charAt(0).toUpperCase() + apt.type.slice(1) : 'Routine'}
                        </span>
                    </div>
                </div>

                ${apt.reason ? `
                    <div class="appointment-reason">
                        <strong>Reason for Visit</strong>
                        <p>${apt.reason}</p>
                    </div>
                ` : ''}

                ${apt.notes ? `
                    <div class="appointment-reason" style="border-left-color: var(--success);">
                        <strong>Doctor's Notes</strong>
                        <p>${apt.notes}</p>
                    </div>
                ` : ''}
                
                ${apt.cancellationReason ? `
                    <div class="appointment-reason" style="border-left-color: var(--danger);">
                        <strong>Cancellation Reason</strong>
                        <p>${apt.cancellationReason}</p>
                    </div>
                ` : ''}


                ${(apt.status === 'pending' || apt.status === 'confirmed') && !isPast ? `
                    <div class="appointment-actions">
                        <button class="btn" onclick="cancelAppointment('${apt.id}')" 
                            style="background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; width: 100%;">
                            <i class="fas fa-times-circle"></i> Cancel Appointment
                        </button>
                    </div>
                ` : ''}

                ${apt.status === 'cancelled' ? `
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #fee2e2; border-radius: 8px; text-align: center;">
                        <i class="fas fa-info-circle" style="color: #991b1b; margin-right: 5px;"></i>
                        <span style="color: #991b1b; font-size: 0.9rem; font-weight: 500;">This appointment was cancelled</span>
                    </div>
                ` : ''}

                ${apt.status === 'completed' || apt.status === 'processed' ? `
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #d1fae5; border-radius: 8px; text-align: center;">
                        <i class="fas fa-check-circle" style="color: #065f46; margin-right: 5px;"></i>
                        <span style="color: #065f46; font-size: 0.9rem; font-weight: 500;">Appointment completed</span>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function formatTime(timeString) {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function filterAppointments(filter) {
    currentFilter = filter;
    // Update button styles
    ['all', 'upcoming', 'completed', 'cancelled'].forEach(f => {
        const btn = document.getElementById(`filter-${f}`);
        if (btn) {
            if (f === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });

    renderAppointments();
}

async function openCreateAppointmentModal() {
    const modal = document.getElementById('appointment-modal');
    modal.style.display = 'flex';

    // Reset fields
    document.getElementById('appointment-form').reset();
    document.getElementById('appointment-time').innerHTML = '<option value="">Select doctor and date first...</option>';

    const doctorSelect = document.getElementById('doctor-select');
    doctorSelect.innerHTML = '<option value="">Loading doctors...</option>';
    doctorSelect.disabled = true;

    const user = JSON.parse(localStorage.getItem('user'));
    const patientId = user.patientId || user.id || user.profileId;

    try {
        const response = await fetch('/api/appointments/available-doctors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patientId })
        });

        if (!response.ok) throw new Error('Failed to fetch doctors');

        const doctors = await response.json();

        if (doctors.length === 0) {
            doctorSelect.innerHTML = '<option value="">No doctors available</option>';
            alert('⚠️ No doctors are currently assigned to your workspace. Please contact support.');
            return;
        }

        doctorSelect.innerHTML = '<option value="">Choose a doctor...</option>' +
            doctors.map(doc => `
                <option value="${doc.id}">Dr. ${doc.name || 'Unknown'}${doc.specialization ? ' - ' + doc.specialization : ''}</option>
            `).join('');
        doctorSelect.disabled = false;

        // Add event listeners for triggering slot loading
        doctorSelect.onchange = loadAvailableSlots;

    } catch (error) {
        console.error('Error loading doctors:', error);
        doctorSelect.innerHTML = '<option value="">Error loading doctors</option>';
        alert('❌ Failed to load doctors. ' + error.message);
    }

    // Set minimum date to today
    const dateInput = document.getElementById('appointment-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

function closeAppointmentModal() {
    document.getElementById('appointment-modal').style.display = 'none';
}

async function loadAvailableSlots() {
    const doctorId = document.getElementById('doctor-select').value;
    const date = document.getElementById('appointment-date').value;
    const timeSelect = document.getElementById('appointment-time');

    if (!doctorId || !date) {
        timeSelect.innerHTML = '<option value="">Select doctor and date first...</option>';
        return;
    }

    timeSelect.innerHTML = '<option value="">Loading slots...</option>';
    timeSelect.disabled = true;

    try {
        const response = await fetch('/api/appointments/available-slots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctorId, date })
        });

        const data = await response.json();

        if (data.availableSlots && data.availableSlots.length > 0) {
            timeSelect.innerHTML = '<option value="">Choose a time...</option>' +
                data.availableSlots.map(slot => {
                    const time = formatTime(slot);
                    return `<option value="${slot}">${time}</option>`;
                }).join('');
            timeSelect.disabled = false;
        } else {
            timeSelect.innerHTML = '<option value="">No slots available for this date</option>';
            alert('⚠️ No available time slots for this date. Please choose another date.');

            // If checking a date in the past, warn user
            if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
                timeSelect.innerHTML = '<option value="">Cannot book past dates</option>';
            }
        }
    } catch (error) {
        console.error('Error loading slots:', error);
        timeSelect.innerHTML = '<option value="">Error loading slots</option>';
    }
}

async function submitAppointment(event) {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    const patientId = user.patientId || user.id || user.profileId;

    const formData = {
        patientId,
        doctorId: document.getElementById('doctor-select').value,
        appointmentDate: document.getElementById('appointment-date').value,
        appointmentTime: document.getElementById('appointment-time').value,
        type: document.getElementById('appointment-type').value,
        reason: document.getElementById('appointment-reason').value
    };

    // Attempt to find workspaceId from user object or we'll let backend handle/ignore it
    if (user.workSpaceId) {
        formData.workSpaceId = user.workSpaceId;
    }

    // Disable submit button
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';

    try {
        const response = await fetch('/api/appointments/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('✅ Appointment booked successfully!');
            closeAppointmentModal();
            loadAppointments();
            // Refresh dashboard stats if function exists
            if (typeof loadDashboardStats === 'function') loadDashboardStats();
        } else {
            alert('❌ ' + (result.error || 'Failed to book appointment'));
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('❌ Failed to book appointment. Please try again.\n\nError: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

async function cancelAppointment(id) {
    const reason = prompt("Please provide a reason for cancellation:");
    if (reason === null) return; // User cancelled prompt

    if (reason.trim() === "") {
        alert("Cancellation reason is required.");
        return;
    }

    try {
        const response = await fetch(`/api/appointments/cancel/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cancellationReason: reason })
        });

        if (response.ok) {
            alert('✅ Appointment cancelled');
            loadAppointments();
            if (typeof loadDashboardStats === 'function') loadDashboardStats();
        } else {
            const data = await response.json();
            alert('❌ Failed to cancel appointment: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('❌ Failed to cancel appointment');
    }
}
