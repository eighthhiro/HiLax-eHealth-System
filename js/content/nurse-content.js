// Nurse Content Module

class NurseContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // Dashboard Content for Nurses
    getDashboardContent() {
        const sharedContent = new SharedContent(this.currentUser);
        return `
            <div class="dashboard-overview">
                ${this.getBentoBanner()}
                <div class="dashboard-flex-row">
                    ${sharedContent.getAnnouncementsSection()}
                    <div class="dashboard-cards-wrapper">
                        <div class="cards-grid">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-bed"></i>
                            </div>
                            <h3 class="card-title">Assigned Patients</h3>
                        </div>
                        <div class="card-content">
                            <p>Patients under your care today</p>
                            <div class="stat-number">15</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-heartbeat"></i>
                            </div>
                            <h3 class="card-title">Vital Signs</h3>
                        </div>
                        <div class="card-content">
                            <p>Vital signs recorded today</p>
                            <div class="stat-number">28</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-syringe"></i>
                            </div>
                            <h3 class="card-title">Medications</h3>
                        </div>
                        <div class="card-content">
                            <p>Medications administered</p>
                            <div class="stat-number">45</div>
                        </div>
                    </div>
                </div>
                    </div>
                </div>
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
                        <div style="overflow-x: auto;">
                            <table class="patients-table" style="min-width: 900px;">
                                <thead>
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
                            </table>
                            <div style="max-height: 180px; overflow-y: auto;">
                                <table class="patients-table" style="min-width: 900px;">
                                    <tbody>
                                        ${summaryRows || '<tr><td colspan="8" style="text-align: center; padding: 20px; color: #999;">No vital signs recorded yet</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
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
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            Lab Results Summary
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="overflow-x: auto;">
                            <table class="patients-table" style="min-width: 900px;">
                                <thead>
                                    <tr>
                                        <th style="width: 10%;">Patient ID</th>
                                        <th style="width: 20%;">Name</th>
                                        <th style="width: 15%;">Test Type</th>
                                        <th style="width: 12%;">Test Date</th>
                                        <th style="width: 10%;">Status</th>
                                        <th style="width: 12%;">Actions</th>
                                    </tr>
                                </thead>
                            </table>
                            <div style="max-height: 180px; overflow-y: auto;">
                                <table class="patients-table" style="min-width: 900px;">
                                    <tbody>
                                        ${summaryRows || '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No lab results yet</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-flask"></i>
                            Laboratory Results (View Only)
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
                        <div style="overflow-x: auto;">
                            <table class="patients-table" style="min-width: 900px;">
                                <thead>
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
                            </table>
                            <div style="max-height: 180px; overflow-y: auto;">
                                <table class="patients-table" style="min-width: 900px;">
                                    <tbody>
                                        ${summaryRows || '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #999;">No prescriptions yet</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
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
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-x-ray"></i> Imaging Results Summary
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="max-height: 400px; overflow-y: auto;">
                            <table class="patients-table">
                                <thead>
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
}

