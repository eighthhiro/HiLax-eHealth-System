// Nurse Content Module

class NurseContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // Dashboard Content for Nurses
    getDashboardContent() {
        const sharedContent = new SharedContent(this.currentUser);
        
        // Calculate stats from localStorage
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const vitalSigns = JSON.parse(localStorage.getItem('vitalSigns') || '[]');
        const nursingAssessments = JSON.parse(localStorage.getItem('nursingAssessments') || '[]');
        
        const admittedPatients = patients.filter(p => p.status === 'Admitted').length;
        
        const today = new Date().toISOString().split('T')[0];
        const vitalSignsToday = vitalSigns.filter(vs => vs.recordedDate === today).length;
        const assessmentsToday = nursingAssessments.filter(a => a.date === today).length;
        
        return `
            <div class="dashboard-overview">
                ${this.getBentoBanner()}
                <div class="dashboard-flex-row">
                    ${sharedContent.getAnnouncementsSection()}
                    <div class="dashboard-cards-wrapper">
                        <div class="cards-grid">
                            <div class="card stat-card">
                                <div class="card-header">
                                    <div class="stat-info">
                                        <div class="card-icon">
                                            <i class="fas fa-bed"></i>
                                        </div>
                                        <h3 class="card-title">Admitted Patients</h3>
                                    </div>
                                    <div class="stat-number">${admittedPatients}</div>
                                </div>
                                <div class="card-content">
                                    <p>Currently admitted</p>
                                    <button class="btn-view-stat" data-page="patient-list">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                </div>
                            </div>
                            <div class="card stat-card">
                                <div class="card-header">
                                    <div class="stat-info">
                                        <div class="card-icon">
                                            <i class="fas fa-heartbeat"></i>
                                        </div>
                                        <h3 class="card-title">Vital Signs Today</h3>
                                    </div>
                                    <div class="stat-number">${vitalSignsToday}</div>
                                </div>
                                <div class="card-content">
                                    <p>Vital signs recorded</p>
                                    <button class="btn-view-stat" data-page="vital-signs">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                </div>
                            </div>
                            <div class="card stat-card">
                                <div class="card-header">
                                    <div class="stat-info">
                                        <div class="card-icon">
                                            <i class="fas fa-file-medical"></i>
                                        </div>
                                        <h3 class="card-title">Assessments Today</h3>
                                    </div>
                                    <div class="stat-number">${assessmentsToday}</div>
                                </div>
                                <div class="card-content">
                                    <p>Nursing assessments</p>
                                    <button class="btn-view-stat" data-page="nursing-assessment">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ${sharedContent.getSocialFooter()}
            </div>
        `;
    }

    // All Patients Content for Nurses
    getAllPatientsContent() {
        // Load patients from localStorage
        let patients = [];
        try {
            const stored = localStorage.getItem('patients');
            if (stored) {
                patients = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading patients:', error);
        }
        
        // If no patients, use default hardcoded data
        if (patients.length === 0) {
            patients = [
                { id: 'P001', fullName: 'Miranda, Hebrew T.', age: 19, status: 'Active', doctor: 'Dr. Sta.Maria' },
                { id: 'P002', fullName: 'Sta.Maria, Rizza M.', age: 20, status: 'Discharged', doctor: 'Dr. Salvador' },
                { id: 'P003', fullName: 'Puquiz, Daniel T.', age: 21, status: 'Active', doctor: 'Dr. Isabella' }
            ];
        }
        
        let tableRows = '';
        
        // Generate table rows from patient data
        patients.forEach(patient => {
            let statusClass = 'active';
            if (patient.status === 'Discharged') statusClass = 'discharged';
            if (patient.status === 'Admitted') statusClass = 'admitted';
            
            const doctor = patient.doctor || 'Not Assigned';
            
            // Personal Info button - view only for nurses
            const personalInfoBtn = patient.personalInfo ? 
                `<button class="btn btn-sm btn-view-info" data-patient-id="${patient.id}">
                    <i class="fas fa-eye"></i>
                    View Info
                </button>` : 
                '<span class="no-record">Not Set</span>';
            
            // Billing button - view only for nurses
            const billingBtn = patient.billing ? 
                `<button class="btn btn-sm btn-view-billing" data-patient-id="${patient.id}">
                    <i class="fas fa-file-invoice"></i>
                    View Billing
                </button>` : 
                '<span class="no-record">Not Set</span>';
            
            // Records column
            let recordsContent = '<span class="no-record">No file</span>';
            if (patient.recordsUrl) {
                recordsContent = `<a href="${patient.recordsUrl}" target="_blank" class="record-link">
                    <i class="fas fa-file-pdf"></i>
                    View File
                </a>`;
            }
            
            // Vital Signs button - always available for nurses
            const vitalSignsBtn = `<button class="btn btn-sm btn-vital-signs" data-patient-id="${patient.id}">
                <i class="fas fa-heartbeat"></i>
                Vital Signs
            </button>`;
            
            tableRows += `
                <tr data-patient-id="${patient.id}">
                    <td>${patient.id}</td>
                    <td>${patient.fullName}</td>
                    <td>${patient.age}</td>
                    <td><span class="status-badge ${statusClass}">${patient.status}</span></td>
                    <td>${doctor}</td>
                    <td>${personalInfoBtn}</td>
                    <td>${billingBtn}</td>
                    <td>${recordsContent}</td>
                    <td>${vitalSignsBtn}</td>
                </tr>
            `;
        });
        
        return `
            <div class="patients-management">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-users"></i>
                            All Patients
                        </h3>
                    </div>
                    <div class="card-content">
                        <table class="patients-table">
                            <thead>
                                <tr>
                                    <th>Patient ID</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Status</th>
                                    <th>Doctor</th>
                                    <th>Personal Info</th>
                                    <th>Billing</th>
                                    <th>Records</th>
                                    <th>Vital Signs</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows || '<tr><td colspan="9" style="text-align: center;">No patients found</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // Bento Banner
    getBentoBanner() {
        return `
            <div class="bento-banner">
                <div class="bento-box mission">
                    <div class="bento-icon">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <h3>Mission</h3>
                    <p>To provide safe, holistic, and accessible healthcare for every individual we serve</p>
                </div>
                <div class="bento-box vision">
                    <div class="bento-icon">
                        <i class="fas fa-eye"></i>
                    </div>
                    <h3>Vision</h3>
                    <p>To be a leading healthcare institution trusted by our community</p>
                </div>
                <div class="bento-box philosophy">
                    <div class="bento-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <h3>Philosophy</h3>
                    <p>Patient-centered care with integrity, respect, and commitment to excellence</p>
                </div>
            </div>
        `;
    }

    // Vital Signs Content for Nurses
    getVitalSignsContent() {
        // Get patients from localStorage
        let patients = [];
        try {
            const stored = localStorage.getItem('patients');
            if (stored) {
                patients = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading patients:', e);
        }

        // Fallback to sample data if no patients in localStorage
        if (patients.length === 0) {
            patients = [
                { id: 'P001', fullName: 'Miranda, Hebrew T.', age: 19, status: 'Active', doctor: 'Dr. Sta. Maria' },
                { id: 'P002', fullName: 'Sta.Maria, Rizza M.', age: 20, status: 'Admitted', doctor: 'Dr. Sta. Maria' },
                { id: 'P003', fullName: 'Puquiz, Daniel T.', age: 21, status: 'Active', doctor: 'Dr. Salvador' }
            ];
        }

        // Get all vital signs
        const allVitalSigns = JSON.parse(localStorage.getItem('vitalSigns') || '[]');

        // Create summary table with most recent vital signs per patient
        let summaryRows = '';
        patients.forEach(patient => {
            const patientVitalSigns = allVitalSigns.filter(vs => vs.patientId === patient.id);
            const latestVS = patientVitalSigns[0]; // Most recent (assuming array is sorted newest first)

            if (latestVS) {
                summaryRows += `
                    <tr>
                        <td style="width: 10%;">${patient.id}</td>
                        <td style="width: 20%;">${patient.fullName}</td>
                        <td style="width: 12%;">${latestVS.recordedDate}</td>
                        <td style="width: 12%;">${latestVS.recordedTime}</td>
                        <td style="width: 12%;"><strong>${latestVS.bloodPressure}</strong></td>
                        <td style="width: 10%;">${latestVS.heartRate}</td>
                        <td style="width: 12%;">${latestVS.temperature}°C</td>
                        <td style="width: 12%;">
                            <button class="btn btn-sm btn-view-more-vitals" data-patient-id="${patient.id}">
                                <i class="fas fa-eye"></i> View More
                            </button>
                        </td>
                    </tr>
                `;
            } else {
                summaryRows += `
                    <tr>
                        <td style="width: 10%;">${patient.id}</td>
                        <td style="width: 20%;">${patient.fullName}</td>
                        <td colspan="5" style="text-align: center; color: #999;">No vital signs recorded</td>
                        <td style="width: 12%;">-</td>
                    </tr>
                `;
            }
        });

        // Generate patient options for dropdown
        const patientOptions = patients.map(patient => 
            `<option value="${patient.id}">${patient.id} - ${patient.fullName}</option>`
        ).join('');

        return `
            <div class="vital-signs-management">
                <!-- Summary Table -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            Recent Vital Signs Summary
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="max-height: 180px; overflow-y: auto; overflow-x: auto; position: relative;">
                            <table class="patients-table" style="min-width: 900px;">
                                <thead style="position: sticky; top: 0; z-index: 10; background: white;">
                                    <tr>
                                        <th style="width: 10%;">Patient ID</th>
                                        <th style="width: 20%;">Name</th>
                                        <th style="width: 12%;">Date</th>
                                        <th style="width: 12%;">Time</th>
                                        <th style="width: 12%;">BP</th>
                                        <th style="width: 10%;">HR</th>
                                        <th style="width: 12%;">Temp</th>
                                        <th style="width: 12%;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${summaryRows || '<tr><td colspan="8" style="text-align: center; padding: 20px; color: #999;">No vital signs recorded yet</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Detailed Entry Form -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-heartbeat"></i>
                            Vital Signs Monitoring
                        </h3>
                    </div>
                    <div class="card-content">
                        <!-- Patient Selection -->
                        <div class="patient-selector" style="margin-bottom: 24px; padding: 20px; background: var(--light-pink); border-radius: 8px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="vitalSignsPatient" style="font-weight: 600; margin-bottom: 8px; display: block;">
                                    <i class="fas fa-user-injured"></i> Select Patient
                                </label>
                                <select id="vitalSignsPatient" class="form-control" required style="font-size: 14px;">
                                    <option value="">-- Select a patient --</option>
                                    ${patientOptions}
                                </select>
                            </div>
                        </div>

                        <!-- Patient Info Display (hidden until patient selected) -->
                        <div id="selectedPatientInfo" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin: 0 0 10px 0; color: var(--dark-pink); font-size: 16px;">
                                <i class="fas fa-user"></i> Patient Information
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> <span id="displayPatientId"></span></div>
                                <div><strong>Name:</strong> <span id="displayPatientName"></span></div>
                                <div><strong>Age:</strong> <span id="displayPatientAge"></span></div>
                                <div><strong>Physician:</strong> <span id="displayPatientDoctor"></span></div>
                            </div>
                        </div>

                        <!-- Vital Signs Form -->
                        <form id="vitalSignsForm" style="display: none;">
                            <div class="form-section" style="margin-bottom: 24px;">
                                <h4 style="color: var(--dark-pink); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--light-pink);">
                                    <i class="fas fa-heartbeat"></i> Vital Signs Measurements
                                </h4>
                                
                                <div class="form-row" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;">
                                    <div class="form-group">
                                        <label for="bloodPressure">
                                            <i class="fas fa-heart"></i> Blood Pressure (mmHg) *
                                        </label>
                                        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: center;">
                                            <input type="number" id="systolic" class="form-control" placeholder="Systolic" min="0" max="300" required>
                                            <span style="text-align: center; font-weight: bold;">/</span>
                                            <input type="number" id="diastolic" class="form-control" placeholder="Diastolic" min="0" max="200" required>
                                        </div>
                                        <small style="color: #666; display: block; margin-top: 4px;">Example: 120 / 80</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="heartRate">
                                            <i class="fas fa-heartbeat"></i> Heart Rate (bpm) *
                                        </label>
                                        <input type="number" id="heartRate" class="form-control" placeholder="Enter heart rate" min="0" max="300" required>
                                        <small style="color: #666; display: block; margin-top: 4px;">Normal: 60-100 bpm</small>
                                    </div>
                                </div>

                                <div class="form-row" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;">
                                    <div class="form-group">
                                        <label for="temperature">
                                            <i class="fas fa-thermometer-half"></i> Temperature (°C) *
                                        </label>
                                        <input type="number" step="0.1" id="temperature" class="form-control" placeholder="Enter temperature" min="30" max="45" required>
                                        <small style="color: #666; display: block; margin-top: 4px;">Normal: 36.1-37.2°C</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="respiratoryRate">
                                            <i class="fas fa-lungs"></i> Respiratory Rate (breaths/min) *
                                        </label>
                                        <input type="number" id="respiratoryRate" class="form-control" placeholder="Enter respiratory rate" min="0" max="100" required>
                                        <small style="color: #666; display: block; margin-top: 4px;">Normal: 12-20 breaths/min</small>
                                    </div>
                                </div>

                                <div class="form-row" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;">
                                    <div class="form-group">
                                        <label for="oxygenSaturation">
                                            <i class="fas fa-wind"></i> Oxygen Saturation (SpO2 %) *
                                        </label>
                                        <input type="number" step="0.1" id="oxygenSaturation" class="form-control" placeholder="Enter oxygen saturation" min="0" max="100" required>
                                        <small style="color: #666; display: block; margin-top: 4px;">Normal: 95-100%</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="weight">
                                            <i class="fas fa-weight"></i> Weight (kg)
                                        </label>
                                        <input type="number" step="0.1" id="weight" class="form-control" placeholder="Enter weight" min="0" max="500">
                                        <small style="color: #666; display: block; margin-top: 4px;">Optional</small>
                                    </div>
                                </div>

                                <div class="form-row" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;">
                                    <div class="form-group">
                                        <label for="height">
                                            <i class="fas fa-ruler-vertical"></i> Height (cm)
                                        </label>
                                        <input type="number" step="0.1" id="height" class="form-control" placeholder="Enter height" min="0" max="300">
                                        <small style="color: #666; display: block; margin-top: 4px;">Optional</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="painLevel">
                                            <i class="fas fa-exclamation-triangle"></i> Pain Level (0-10)
                                        </label>
                                        <input type="number" id="painLevel" class="form-control" placeholder="Enter pain level" min="0" max="10">
                                        <small style="color: #666; display: block; margin-top: 4px;">0 = No pain, 10 = Worst pain</small>
                                    </div>
                                </div>

                                <div class="form-row" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;">
                                    <div class="form-group">
                                        <label for="recordedDate">
                                            <i class="fas fa-calendar"></i> Recorded Date *
                                        </label>
                                        <input type="date" id="recordedDate" class="form-control" required>
                                        <small style="color: #666; display: block; margin-top: 4px;">Date of measurement</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="recordedTime">
                                            <i class="fas fa-clock"></i> Recorded Time *
                                        </label>
                                        <input type="time" id="recordedTime" class="form-control" required>
                                        <small style="color: #666; display: block; margin-top: 4px;">Time of measurement</small>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="vitalNotes">
                                        <i class="fas fa-notes-medical"></i> Clinical Notes
                                    </label>
                                    <textarea id="vitalNotes" class="form-control" rows="3" placeholder="Enter any observations or notes about the patient's condition..."></textarea>
                                </div>
                            </div>

                            <div class="form-actions" style="display: flex; gap: 12px; justify-content: flex-end; padding-top: 16px; border-top: 1px solid #ddd;">
                                <button type="button" class="btn btn-secondary" id="clearVitalSignsForm">
                                    <i class="fas fa-times"></i> Clear Form
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save"></i> Save Vital Signs
                                </button>
                            </div>
                        </form>

                        <!-- Recent Vital Signs History -->
                        <div id="vitalSignsHistory" style="display: none; margin-top: 32px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--light-pink);">
                                <i class="fas fa-history"></i> Recent Vital Signs History
                            </h4>
                            <div id="vitalSignsHistoryTable"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Lab Results Content for Nurse (view-only with patient selection)
    getLabResultsContent() {
        let patients = [];
        try {
            const stored = localStorage.getItem('patients');
            if (stored) {
                patients = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading patients:', e);
        }

        if (patients.length === 0) {
            patients = [
                { id: 'P001', fullName: 'Miranda, Hebrew T.', age: 19, status: 'Active', doctor: 'Dr. Sta. Maria' },
                { id: 'P002', fullName: 'Sta.Maria, Rizza M.', age: 20, status: 'Admitted', doctor: 'Dr. Sta. Maria' },
                { id: 'P003', fullName: 'Puquiz, Daniel T.', age: 21, status: 'Active', doctor: 'Dr. Salvador' }
            ];
        }

        const allLabResults = JSON.parse(localStorage.getItem('labResults') || '[]');

        let summaryRows = '';
        patients.forEach(patient => {
            const patientLabs = allLabResults.filter(lab => lab.patientId === patient.id);
            const latest = patientLabs[0];

            if (latest) {
                summaryRows += `
                    <tr>
                        <td style="width: 10%;">${patient.id}</td>
                        <td style="width: 20%;">${patient.fullName}</td>
                        <td style="width: 15%;">${latest.testType}</td>
                        <td style="width: 12%;">${latest.testDate}</td>
                        <td style="width: 10%;">${latest.status || 'Completed'}</td>
                        <td style="width: 12%;">
                            <button class="btn btn-sm btn-view-more-labs" data-patient-id="${patient.id}">
                                <i class="fas fa-eye"></i> View More
                            </button>
                        </td>
                    </tr>
                `;
            } else {
                summaryRows += `
                    <tr>
                        <td style="width: 10%;">${patient.id}</td>
                        <td style="width: 20%;">${patient.fullName}</td>
                        <td colspan="3" style="text-align: center; color: #999;">No lab results</td>
                        <td style="width: 12%;">-</td>
                    </tr>
                `;
            }
        });

        const patientOptions = patients.map(patient => 
            `<option value="${patient.id}">${patient.id} - ${patient.fullName}</option>`
        ).join('');

        return `
            <div class="lab-results-management">
                <!-- Info Banner -->
                <div class="info-banner" style="margin-bottom: 24px; padding: 16px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-info-circle" style="font-size: 24px;"></i>
                    <div>
                        <h4 style="margin: 0 0 4px 0; font-size: 16px;">Laboratory Results (View Only)</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">View lab test results processed by medical technologists. Only med-techs can input results.</p>
                    </div>
                </div>

                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            Lab Results Summary
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="max-height: 180px; overflow-y: auto; overflow-x: auto; position: relative;">
                            <table class="patients-table" style="min-width: 900px;">
                                <thead style="position: sticky; top: 0; z-index: 10; background: white;">
                                    <tr>
                                        <th style="width: 10%;">Patient ID</th>
                                        <th style="width: 20%;">Name</th>
                                        <th style="width: 15%;">Test Type</th>
                                        <th style="width: 12%;">Test Date</th>
                                        <th style="width: 10%;">Status</th>
                                        <th style="width: 12%;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${summaryRows || '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No lab results yet</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-flask"></i>
                            Laboratory Results
                        </h3>
                    </div>
                    <div class="card-content">
                        <div class="patient-selector" style="margin-bottom: 24px; padding: 20px; background: var(--light-pink); border-radius: 8px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="labResultsPatient" style="font-weight: 600; margin-bottom: 8px; display: block;">
                                    <i class="fas fa-user-injured"></i> Select Patient
                                </label>
                                <select id="labResultsPatient" class="form-control" required style="font-size: 14px;">
                                    <option value="">-- Select a patient --</option>
                                    ${patientOptions}
                                </select>
                            </div>
                        </div>

                        <div id="selectedPatientInfoLabs" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                                <i class="fas fa-user-injured"></i> <span id="selectedPatientNameLabs"></span>
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> <span id="selectedPatientIdLabs"></span></div>
                                <div><strong>Age:</strong> <span id="selectedPatientAgeLabs"></span></div>
                                <div><strong>Status:</strong> <span id="selectedPatientStatusLabs"></span></div>
                                <div><strong>Doctor:</strong> <span id="selectedPatientDoctorLabs"></span></div>
                            </div>
                        </div>

                        <div id="labResultsHistory" style="display: none; margin-top: 24px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                <i class="fas fa-history"></i> Lab Results History
                            </h4>
                            <div id="labResultsHistoryTable"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Prescriptions Content for Nurse (view-only with patient selection)
    getPrescriptionsContent() {
        // Get patients from localStorage
        let patients = [];
        try {
            const stored = localStorage.getItem('patients');
            if (stored) {
                patients = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading patients:', e);
        }

        // Fallback to sample data
        if (patients.length === 0) {
            patients = [
                { id: 'P001', fullName: 'Miranda, Hebrew T.', age: 19, status: 'Active', doctor: 'Dr. Sta. Maria' },
                { id: 'P002', fullName: 'Sta.Maria, Rizza M.', age: 20, status: 'Admitted', doctor: 'Dr. Sta. Maria' },
                { id: 'P003', fullName: 'Puquiz, Daniel T.', age: 21, status: 'Active', doctor: 'Dr. Salvador' }
            ];
        }

        // Get all prescriptions
        const allPrescriptions = JSON.parse(localStorage.getItem('medications') || '[]');

        // Create summary table
        let summaryRows = '';
        patients.forEach(patient => {
            const patientPrescriptions = allPrescriptions.filter(med => med.patientId === patient.id);
            const latestRx = patientPrescriptions[0];

            if (latestRx) {
                summaryRows += `
                    <tr>
                        <td style="width: 10%;">${patient.id}</td>
                        <td style="width: 20%;">${patient.fullName}</td>
                        <td style="width: 15%;">${latestRx.medicationName}</td>
                        <td style="width: 12%;">${latestRx.dosage}</td>
                        <td style="width: 10%;">${latestRx.frequency}</td>
                        <td style="width: 12%;">${latestRx.prescribedDate}</td>
                        <td style="width: 12%;">
                            <button class="btn btn-sm btn-view-more-prescriptions" data-patient-id="${patient.id}">
                                <i class="fas fa-eye"></i> View More
                            </button>
                        </td>
                    </tr>
                `;
            } else {
                summaryRows += `
                    <tr>
                        <td style="width: 10%;">${patient.id}</td>
                        <td style="width: 20%;">${patient.fullName}</td>
                        <td colspan="4" style="text-align: center; color: #999;">No prescriptions</td>
                        <td style="width: 12%;">-</td>
                    </tr>
                `;
            }
        });

        const patientOptions = patients.map(patient => 
            `<option value="${patient.id}">${patient.id} - ${patient.fullName}</option>`
        ).join('');

        return `
            <div class="prescriptions-management">
                <!-- Summary Table -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            Recent Prescriptions Summary
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="max-height: 180px; overflow-y: auto; overflow-x: auto; position: relative;">
                            <table class="patients-table" style="min-width: 900px;">
                                <thead style="position: sticky; top: 0; z-index: 10; background: white;">
                                    <tr>
                                        <th style="width: 10%;">Patient ID</th>
                                        <th style="width: 20%;">Name</th>
                                        <th style="width: 15%;">Medication</th>
                                        <th style="width: 12%;">Dosage</th>
                                        <th style="width: 10%;">Frequency</th>
                                        <th style="width: 12%;">Date Prescribed</th>
                                        <th style="width: 12%;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${summaryRows || '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #999;">No prescriptions yet</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Detailed View -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-prescription"></i>
                            Patient Prescriptions
                        </h3>
                    </div>
                    <div class="card-content">
                        <!-- Patient Selection -->
                        <div class="patient-selector" style="margin-bottom: 24px; padding: 20px; background: var(--light-pink); border-radius: 8px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="prescriptionsPatient" style="font-weight: 600; margin-bottom: 8px; display: block;">
                                    <i class="fas fa-user-injured"></i> Select Patient
                                </label>
                                <select id="prescriptionsPatient" class="form-control" required style="font-size: 14px;">
                                    <option value="">-- Select a patient --</option>
                                    ${patientOptions}
                                </select>
                            </div>
                        </div>

                        <!-- Patient Info Display -->
                        <div id="selectedPatientInfoPrescriptions" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                                <i class="fas fa-user-injured"></i> <span id="selectedPatientNamePrescriptions"></span>
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> <span id="selectedPatientIdPrescriptions"></span></div>
                                <div><strong>Age:</strong> <span id="selectedPatientAgePrescriptions"></span></div>
                                <div><strong>Status:</strong> <span id="selectedPatientStatusPrescriptions"></span></div>
                                <div><strong>Doctor:</strong> <span id="selectedPatientDoctorPrescriptions"></span></div>
                            </div>
                        </div>

                        <!-- Prescriptions History -->
                        <div id="prescriptionsHistory" style="display: none; margin-top: 24px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                <i class="fas fa-history"></i> Prescription History
                            </h4>
                            <div id="prescriptionsHistoryTable"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Medications Content for Nurses (View & Administer)
    getMedicationsContent() {
        // Get patients from localStorage
        let patients = [];
        try {
            const stored = localStorage.getItem('patients');
            if (stored) {
                patients = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading patients:', e);
        }

        // Get all medications and dispensing records
        const allMedications = JSON.parse(localStorage.getItem('medications') || '[]');
        const dispensingRecords = JSON.parse(localStorage.getItem('dispensingRecords') || '[]');

        // Create summary table with medications and dispensing status
        let summaryRows = '';
        patients.forEach(patient => {
            const patientMedications = allMedications.filter(med => med.patientId === patient.id);
            
            if (patientMedications.length > 0) {
                patientMedications.forEach(med => {
                    // Check if medication has been dispensed
                    const dispensed = dispensingRecords.find(dr => 
                        dr.patientId === patient.id && 
                        dr.medicationName === med.medicationName
                    );
                    
                    const statusBadge = dispensed 
                        ? '<span class="status-badge completed">Dispensed</span>' 
                        : '<span class="status-badge pending">Not Dispensed</span>';
                    
                    summaryRows += `
                        <tr>
                            <td>${patient.id}</td>
                            <td>${patient.fullName}</td>
                            <td>${med.medicationName}</td>
                            <td>${med.dosage}</td>
                            <td>${med.frequency}</td>
                            <td>${med.route}</td>
                            <td>${statusBadge}</td>
                            <td>
                                <button class="btn btn-sm btn-view-medication-details" data-medication-id="${med.id}">
                                    <i class="fas fa-eye"></i> View
                                </button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                summaryRows += `
                    <tr>
                        <td>${patient.id}</td>
                        <td>${patient.fullName}</td>
                        <td colspan="6" style="text-align: center; color: #999;">No medications prescribed</td>
                    </tr>
                `;
            }
        });

        // Generate patient options for dropdown
        const patientOptions = patients.map(patient => 
            `<option value="${patient.id}">${patient.id} - ${patient.fullName}</option>`
        ).join('');

        return `
            <div class="medications-management">
                <!-- Info Banner -->
                <div class="info-banner" style="margin-bottom: 24px; padding: 16px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-info-circle" style="font-size: 24px;"></i>
                    <div>
                        <h4 style="margin: 0 0 4px 0; font-size: 16px;">Medications (View Only)</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">View patient medications and dispensing status. Physicians prescribe, pharmacists dispense medications.</p>
                    </div>
                </div>

                <!-- Summary Table -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            All Patient Medications
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="max-height: 180px; overflow-y: auto; overflow-x: auto; position: relative;">
                            <table class="patients-table" style="min-width: 1000px;">
                                <thead style="position: sticky; top: 0; z-index: 10; background: white;">
                                    <tr>
                                        <th style="width: 10%;">Patient ID</th>
                                        <th style="width: 20%;">Patient Name</th>
                                        <th style="width: 15%;">Medication</th>
                                        <th style="width: 12%;">Dosage</th>
                                        <th style="width: 10%;">Frequency</th>
                                        <th style="width: 10%;">Route</th>
                                        <th style="width: 12%;">Status</th>
                                        <th style="width: 11%;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${summaryRows || '<tr><td colspan="8" style="text-align: center; padding: 20px; color: #999;">No medications prescribed yet</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Detailed View by Patient -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-pills"></i>
                            Patient Medication Details
                        </h3>
                    </div>
                    <div class="card-content">
                        <!-- Patient Selection -->
                        <div class="patient-selector" style="margin-bottom: 24px; padding: 20px; background: var(--light-pink); border-radius: 8px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="medicationsPatientNurse" style="font-weight: 600; margin-bottom: 8px; display: block;">
                                    <i class="fas fa-user-injured"></i> Select Patient
                                </label>
                                <select id="medicationsPatientNurse" class="form-control" required style="font-size: 14px;">
                                    <option value="">-- Select a patient to view medications --</option>
                                    ${patientOptions}
                                </select>
                            </div>
                        </div>

                        <!-- Patient Info Display -->
                        <div id="selectedPatientInfoMedicationsNurse" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                                <i class="fas fa-user-injured"></i> <span id="selectedPatientNameMedicationsNurse"></span>
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> <span id="selectedPatientIdMedicationsNurse"></span></div>
                                <div><strong>Age:</strong> <span id="selectedPatientAgeMedicationsNurse"></span></div>
                                <div><strong>Status:</strong> <span id="selectedPatientStatusMedicationsNurse"></span></div>
                                <div><strong>Doctor:</strong> <span id="selectedPatientDoctorMedicationsNurse"></span></div>
                            </div>
                        </div>

                        <!-- Medications Table -->
                        <div id="medicationsTableNurse" style="display: none;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                <i class="fas fa-list"></i> Prescribed Medications
                            </h4>
                            <div style="overflow-x: auto;">
                                <table class="patients-table">
                                    <thead>
                                        <tr>
                                            <th>Medication Name</th>
                                            <th>Dosage</th>
                                            <th>Frequency</th>
                                            <th>Route</th>
                                            <th>Duration</th>
                                            <th>Start Date</th>
                                            <th>Dispensing Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="medicationsListNurse">
                                        <!-- Will be populated by JavaScript -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Imaging Results Content (View Only)
    getImagingOrdersContent() {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const allImagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');

        let summaryRows = '';
        patients.forEach(patient => {
            const patientImaging = allImagingResults.filter(img => img.patientId === patient.id);
            const latest = patientImaging[0];

            if (latest) {
                summaryRows += `
                    <tr>
                        <td>${patient.id}</td>
                        <td>${patient.fullName}</td>
                        <td>${latest.imagingModality}</td>
                        <td>${latest.imagingDate}</td>
                        <td><span class="status-badge ${latest.status.toLowerCase().replace(' ', '-')}">${latest.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-view-more-imaging" data-patient-id="${patient.id}">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </td>
                    </tr>
                `;
            } else {
                summaryRows += `
                    <tr>
                        <td>${patient.id}</td>
                        <td>${patient.fullName}</td>
                        <td colspan="4" style="text-align: center; color: #999;">No imaging results</td>
                    </tr>
                `;
            }
        });

        return `
            <div class="imaging-results-management">
                <!-- Info Banner -->
                <div class="info-banner" style="margin-bottom: 24px; padding: 16px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-info-circle" style="font-size: 24px;"></i>
                    <div>
                        <h4 style="margin: 0 0 4px 0; font-size: 16px;">Imaging Results (View Only)</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">View imaging results processed by radiology technologists. Only rad-techs can input results.</p>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-x-ray"></i> Imaging Results Summary
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="max-height: 180px; overflow-y: auto; overflow-x: auto; position: relative;">
                            <table class="patients-table">
                                <thead style="position: sticky; top: 0; z-index: 10; background: white;">
                                    <tr>
                                        <th>Patient ID</th>
                                        <th>Name</th>
                                        <th>Modality</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${summaryRows || '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No imaging results yet</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Progress Notes Content (View Only - Physician Notes)
    getProgressNotesContent() {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const allProgressNotes = JSON.parse(localStorage.getItem('progressNotes') || '[]');

        // Create summary table with recent progress notes
        let summaryRows = '';
        const recentNotes = allProgressNotes.slice(0, 10);
        
        recentNotes.forEach(note => {
            const patient = patients.find(p => p.id === note.patientId);
            const patientName = patient ? patient.fullName : 'Unknown Patient';
            
            summaryRows += `
                <tr>
                    <td style="width: 10%;">${note.patientId}</td>
                    <td style="width: 18%;">${patientName}</td>
                    <td style="width: 12%;">${note.date}</td>
                    <td style="width: 10%;">${note.time}</td>
                    <td style="width: 12%;">
                        <span class="badge" style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background: ${
                            note.noteType === 'Progress Note' ? '#e3f2fd' :
                            note.noteType === 'Consultation' ? '#f3e5f5' :
                            note.noteType === 'Follow-up' ? '#e8f5e9' :
                            note.noteType === 'Admission Note' ? '#fff3e0' : '#f5f5f5'
                        }; color: ${
                            note.noteType === 'Progress Note' ? '#1976d2' :
                            note.noteType === 'Consultation' ? '#7b1fa2' :
                            note.noteType === 'Follow-up' ? '#388e3c' :
                            note.noteType === 'Admission Note' ? '#f57c00' : '#424242'
                        };">${note.noteType}</span>
                    </td>
                    <td style="width: 15%;">${note.chiefComplaint ? note.chiefComplaint.substring(0, 30) + '...' : 'N/A'}</td>
                    <td style="width: 12%;">${note.recordedBy}</td>
                    <td style="width: 11%;">
                        <button class="btn btn-sm btn-view-progress-note" data-note-id="${note.id}">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </td>
                </tr>
            `;
        });

        const patientOptions = patients.map(patient => 
            `<option value="${patient.id}">${patient.id} - ${patient.fullName}</option>`
        ).join('');

        return `
            <div class="progress-notes-management">
                <!-- Info Banner -->
                <div class="info-banner" style="margin-bottom: 24px; padding: 16px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-info-circle" style="font-size: 24px;"></i>
                    <div>
                        <h4 style="margin: 0 0 4px 0; font-size: 16px;">Progress Notes (View Only)</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">View progress notes written by physicians. Only physicians can create progress notes.</p>
                    </div>
                </div>

                <!-- Summary Table -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            Recent Progress Notes
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="max-height: 180px; overflow-y: auto; overflow-x: auto; position: relative;">
                            <table class="patients-table" style="min-width: 1000px;">
                                <thead style="position: sticky; top: 0; z-index: 10; background: var(--light-pink);">
                                    <tr>
                                        <th style="width: 10%;">Patient ID</th>
                                        <th style="width: 18%;">Name</th>
                                        <th style="width: 12%;">Date</th>
                                        <th style="width: 10%;">Time</th>
                                        <th style="width: 12%;">Note Type</th>
                                        <th style="width: 15%;">Chief Complaint</th>
                                        <th style="width: 12%;">Physician</th>
                                        <th style="width: 11%;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${summaryRows || '<tr><td colspan="8" style="text-align: center; padding: 20px; color: #999;">No progress notes recorded yet</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Patient Selection for History -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-file-medical"></i>
                            Patient Progress Notes History
                        </h3>
                    </div>
                    <div class="card-content">
                        <!-- Patient Selection -->
                        <div class="patient-selector" style="margin-bottom: 24px; padding: 20px; background: var(--light-pink); border-radius: 8px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="progressNotesPatientNurse" style="font-weight: 600; margin-bottom: 8px; display: block;">
                                    <i class="fas fa-user-injured"></i> Select Patient
                                </label>
                                <select id="progressNotesPatientNurse" class="form-control" required style="font-size: 14px;">
                                    <option value="">-- Select a patient --</option>
                                    ${patientOptions}
                                </select>
                            </div>
                        </div>

                        <!-- Patient Info Display -->
                        <div id="selectedPatientInfoProgressNotesNurse" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                                <i class="fas fa-user-injured"></i> <span id="selectedPatientNameProgressNotesNurse"></span>
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> <span id="selectedPatientIdProgressNotesNurse"></span></div>
                                <div><strong>Age:</strong> <span id="selectedPatientAgeProgressNotesNurse"></span></div>
                                <div><strong>Status:</strong> <span id="selectedPatientStatusProgressNotesNurse"></span></div>
                                <div><strong>Doctor:</strong> <span id="selectedPatientDoctorProgressNotesNurse"></span></div>
                            </div>
                        </div>

                        <!-- Progress Notes History -->
                        <div id="progressNotesHistoryNurse" style="display: none; margin-top: 24px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                <i class="fas fa-history"></i> Progress Notes History
                            </h4>
                            <div id="progressNotesHistoryTableNurse"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Nursing Assessment Content (Create/Edit Nursing Notes)
    getNursingAssessmentContent() {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const allNursingAssessments = JSON.parse(localStorage.getItem('nursingAssessments') || '[]');

        // Create summary table
        let summaryRows = '';
        const recentAssessments = allNursingAssessments.slice(0, 10);
        
        recentAssessments.forEach(assessment => {
            const patient = patients.find(p => p.id === assessment.patientId);
            const patientName = patient ? patient.fullName : 'Unknown Patient';
            
            summaryRows += `
                <tr>
                    <td style="width: 10%;">${assessment.patientId}</td>
                    <td style="width: 20%;">${patientName}</td>
                    <td style="width: 12%;">${assessment.date}</td>
                    <td style="width: 10%;">${assessment.time}</td>
                    <td style="width: 15%;">${assessment.assessmentType}</td>
                    <td style="width: 18%;">${assessment.chiefConcern ? assessment.chiefConcern.substring(0, 30) + '...' : 'N/A'}</td>
                    <td style="width: 15%;">
                        <button class="btn btn-sm btn-view-nursing-assessment" data-assessment-id="${assessment.id}">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </td>
                </tr>
            `;
        });

        const patientOptions = patients.map(patient => 
            `<option value="${patient.id}">${patient.id} - ${patient.fullName}</option>`
        ).join('');

        return `
            <div class="nursing-assessment-management">
                <!-- Summary Table -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            Recent Nursing Assessments
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="max-height: 180px; overflow-y: auto; overflow-x: auto; position: relative;">
                            <table class="patients-table" style="min-width: 1000px;">
                                <thead style="position: sticky; top: 0; z-index: 10; background: var(--light-pink);">
                                    <tr>
                                        <th style="width: 10%;">Patient ID</th>
                                        <th style="width: 20%;">Name</th>
                                        <th style="width: 12%;">Date</th>
                                        <th style="width: 10%;">Time</th>
                                        <th style="width: 15%;">Assessment Type</th>
                                        <th style="width: 18%;">Chief Concern</th>
                                        <th style="width: 15%;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${summaryRows || '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #999;">No nursing assessments recorded yet</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Create/View Assessments -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-file-medical"></i>
                            Nursing Assessment
                        </h3>
                    </div>
                    <div class="card-content">
                        <!-- Patient Selection -->
                        <div class="patient-selector" style="margin-bottom: 24px; padding: 20px; background: var(--light-pink); border-radius: 8px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="nursingAssessmentPatient" style="font-weight: 600; margin-bottom: 8px; display: block;">
                                    <i class="fas fa-user-injured"></i> Select Patient
                                </label>
                                <select id="nursingAssessmentPatient" class="form-control" required style="font-size: 14px;">
                                    <option value="">-- Select a patient --</option>
                                    ${patientOptions}
                                </select>
                            </div>
                        </div>

                        <!-- Patient Info Display -->
                        <div id="selectedPatientInfoNursingAssessment" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                                <i class="fas fa-user-injured"></i> <span id="selectedPatientNameNursingAssessment"></span>
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> <span id="selectedPatientIdNursingAssessment"></span></div>
                                <div><strong>Age:</strong> <span id="selectedPatientAgeNursingAssessment"></span></div>
                                <div><strong>Status:</strong> <span id="selectedPatientStatusNursingAssessment"></span></div>
                                <div><strong>Doctor:</strong> <span id="selectedPatientDoctorNursingAssessment"></span></div>
                            </div>
                        </div>

                        <!-- Assessment Form -->
                        <div id="nursingAssessmentForm" style="display: none;">
                            <form id="newNursingAssessmentForm">
                                <!-- Basic Information -->
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px;">
                                    <div class="form-group">
                                        <label for="assessmentDate">Date <span style="color: red;">*</span></label>
                                        <input type="date" id="assessmentDate" class="form-control" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="assessmentTime">Time <span style="color: red;">*</span></label>
                                        <input type="time" id="assessmentTime" class="form-control" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="assessmentType">Assessment Type <span style="color: red;">*</span></label>
                                        <select id="assessmentType" class="form-control" required>
                                            <option value="">-- Select type --</option>
                                            <option value="Initial Assessment">Initial Assessment</option>
                                            <option value="Shift Assessment">Shift Assessment</option>
                                            <option value="Focused Assessment">Focused Assessment</option>
                                            <option value="Pain Assessment">Pain Assessment</option>
                                            <option value="Post-Op Assessment">Post-Op Assessment</option>
                                            <option value="Discharge Assessment">Discharge Assessment</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Chief Concern -->
                                <div class="form-group" style="margin-bottom: 20px;">
                                    <label for="chiefConcern">Chief Concern <span style="color: red;">*</span></label>
                                    <input type="text" id="chiefConcern" class="form-control" required placeholder="Primary reason for assessment">
                                </div>

                                <!-- Vital Signs Section -->
                                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                    <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                        <i class="fas fa-heartbeat"></i> Vital Signs
                                    </h4>
                                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                                        <div class="form-group">
                                            <label for="assessmentBP">Blood Pressure</label>
                                            <input type="text" id="assessmentBP" class="form-control" placeholder="120/80">
                                        </div>
                                        <div class="form-group">
                                            <label for="assessmentHR">Heart Rate</label>
                                            <input type="number" id="assessmentHR" class="form-control" placeholder="bpm">
                                        </div>
                                        <div class="form-group">
                                            <label for="assessmentTemp">Temperature</label>
                                            <input type="number" step="0.1" id="assessmentTemp" class="form-control" placeholder="°C">
                                        </div>
                                        <div class="form-group">
                                            <label for="assessmentRR">Respiratory Rate</label>
                                            <input type="number" id="assessmentRR" class="form-control" placeholder="breaths/min">
                                        </div>
                                    </div>
                                </div>

                                <!-- Assessment Sections -->
                                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                    <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                        <i class="fas fa-clipboard-list"></i> Nursing Assessment
                                    </h4>
                                    
                                    <div class="form-group" style="margin-bottom: 16px;">
                                        <label for="generalAppearance" style="font-weight: 600; color: #495057;">
                                            General Appearance & Behavior <span style="color: red;">*</span>
                                        </label>
                                        <textarea id="generalAppearance" class="form-control" rows="2" required placeholder="Patient's overall appearance, alertness, orientation..."></textarea>
                                    </div>

                                    <div class="form-group" style="margin-bottom: 16px;">
                                        <label for="painAssessment" style="font-weight: 600; color: #495057;">
                                            Pain Assessment <span style="color: red;">*</span>
                                        </label>
                                        <textarea id="painAssessment" class="form-control" rows="2" required placeholder="Pain location, intensity (0-10), quality, duration..."></textarea>
                                    </div>

                                    <div class="form-group" style="margin-bottom: 16px;">
                                        <label for="respiratoryAssessment" style="font-weight: 600; color: #495057;">Respiratory Assessment</label>
                                        <textarea id="respiratoryAssessment" class="form-control" rows="2" placeholder="Breath sounds, respiratory effort, oxygen saturation..."></textarea>
                                    </div>

                                    <div class="form-group" style="margin-bottom: 16px;">
                                        <label for="cardiovascularAssessment" style="font-weight: 600; color: #495057;">Cardiovascular Assessment</label>
                                        <textarea id="cardiovascularAssessment" class="form-control" rows="2" placeholder="Heart sounds, peripheral pulses, capillary refill, edema..."></textarea>
                                    </div>

                                    <div class="form-group" style="margin-bottom: 16px;">
                                        <label for="neurological Assessment" style="font-weight: 600; color: #495057;">Neurological Assessment</label>
                                        <textarea id="neurologicalAssessment" class="form-control" rows="2" placeholder="Level of consciousness, pupil response, motor/sensory function..."></textarea>
                                    </div>

                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label for="skinIntegrity" style="font-weight: 600; color: #495057;">Skin Integrity</label>
                                        <textarea id="skinIntegrity" class="form-control" rows="2" placeholder="Skin condition, wounds, pressure areas, IV sites..."></textarea>
                                    </div>
                                </div>

                                <!-- Nursing Interventions & Plan -->
                                <div class="form-group" style="margin-bottom: 20px;">
                                    <label for="nursingInterventions" style="font-weight: 600;">
                                        <i class="fas fa-tasks"></i> Nursing Interventions & Care Plan <span style="color: red;">*</span>
                                    </label>
                                    <textarea id="nursingInterventions" class="form-control" rows="3" required placeholder="Planned and implemented nursing interventions, care priorities..."></textarea>
                                </div>

                                <!-- Additional Notes -->
                                <div class="form-group" style="margin-bottom: 20px;">
                                    <label for="assessmentNotes">Additional Notes</label>
                                    <textarea id="assessmentNotes" class="form-control" rows="2" placeholder="Any additional observations, patient/family education, follow-up needed..."></textarea>
                                </div>

                                <!-- Form Actions -->
                                <div class="form-actions" style="display: flex; gap: 12px; justify-content: flex-end;">
                                    <button type="button" class="btn btn-secondary" id="clearNursingAssessmentForm">Clear Form</button>
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-save"></i> Save Assessment
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Assessment History -->
                        <div id="nursingAssessmentHistory" style="display: none; margin-top: 24px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                <i class="fas fa-history"></i> Assessment History
                            </h4>
                            <div id="nursingAssessmentHistoryTable"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

