// Physician Content Module

class PhysicianContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // Dashboard Content for Physicians
    getDashboardContent() {
        const sharedContent = new SharedContent(this.currentUser);
        
        // Calculate stats from localStorage
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const medications = JSON.parse(localStorage.getItem('medications') || '[]');
        const progressNotes = JSON.parse(localStorage.getItem('progressNotes') || '[]');
        
        const admittedPatients = patients.filter(p => p.status === 'Admitted').length;
        
        // Count patients who have no prescriptions at all
        const patientsWithoutPrescriptions = patients.filter(patient => {
            return !medications.some(med => med.patientId === patient.id);
        }).length;
        
        const today = new Date().toISOString().split('T')[0];
        const notesToday = progressNotes.filter(n => n.date === today).length;
        
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
                                            <i class="fas fa-prescription"></i>
                                        </div>
                                        <h3 class="card-title">Pending Prescriptions</h3>
                                    </div>
                                    <div class="stat-number">${patientsWithoutPrescriptions}</div>
                                </div>
                                <div class="card-content">
                                    <p>Patients without prescriptions</p>
                                    <button class="btn-view-stat" data-page="prescriptions">
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
                                        <h3 class="card-title">Progress Notes Today</h3>
                                    </div>
                                    <div class="stat-number">${notesToday}</div>
                                </div>
                                <div class="card-content">
                                    <p>Notes documented today</p>
                                    <button class="btn-view-stat" data-page="progress-notes">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                </div>
                            </div>
                        </div>
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

    // All Patients Content for Physician
    getAllPatientsContent() {
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
            
            // Personal Info button - view only
            const personalInfoBtn = `<button class="btn btn-sm btn-view-info" data-patient-id="${patient.id}">
                <i class="fas fa-eye"></i>
                View Info
            </button>`;
            
            // Billing button - view only
            const billingBtn = `<button class="btn btn-sm btn-view-billing" data-patient-id="${patient.id}">
                <i class="fas fa-file-invoice"></i>
                View Billing
            </button>`;
            
            // Records column
            let recordsContent = '<span class="no-record">No file</span>';
            if (patient.recordsUrl) {
                recordsContent = `<a href="${patient.recordsUrl}" target="_blank" class="record-link">
                    <i class="fas fa-file-pdf"></i>
                    View File
                </a>`;
            }
            
            // Medications button
            const medicationsBtn = `<button class="btn btn-sm btn-medications" data-patient-id="${patient.id}">
                <i class="fas fa-pills"></i>
                Medications
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
                    <td>${medicationsBtn}</td>
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
                                    <th>Medications</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // Medications Content for Physician
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

        // Fallback to sample data if no patients in localStorage
        if (patients.length === 0) {
            patients = [
                { id: 'P001', fullName: 'Miranda, Hebrew T.', age: 19, status: 'Active', doctor: 'Dr. Sta. Maria' },
                { id: 'P002', fullName: 'Sta.Maria, Rizza M.', age: 20, status: 'Admitted', doctor: 'Dr. Sta. Maria' },
                { id: 'P003', fullName: 'Puquiz, Daniel T.', age: 21, status: 'Active', doctor: 'Dr. Salvador' }
            ];
        }

        // Get all medications
        const allMedications = JSON.parse(localStorage.getItem('medications') || '[]');

        // Create summary table with most recent medications per patient
        let summaryRows = '';
        patients.forEach(patient => {
            const patientMedications = allMedications.filter(med => med.patientId === patient.id);
            const latestMed = patientMedications[0]; // Most recent

            if (latestMed) {
                summaryRows += `
                    <tr>
                        <td style="width: 10%;">${patient.id}</td>
                        <td style="width: 20%;">${patient.fullName}</td>
                        <td style="width: 15%;">${latestMed.medicationName}</td>
                        <td style="width: 12%;">${latestMed.dosage}</td>
                        <td style="width: 10%;">${latestMed.frequency}</td>
                        <td style="width: 12%;">${latestMed.prescribedDate}</td>
                        <td style="width: 12%;">
                            <button class="btn btn-sm btn-view-more-medications" data-patient-id="${patient.id}">
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
                        <td colspan="4" style="text-align: center; color: #999;">No medications prescribed</td>
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
            <div class="medications-management">
                <!-- Summary Table -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            Recent Medications Summary
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
                                        ${summaryRows || '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #999;">No medications prescribed yet</td></tr>'}
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
                            <i class="fas fa-pills"></i>
                            Patient Medications
                        </h3>
                    </div>
                    <div class="card-content">
                        <!-- Patient Selection -->
                        <div class="patient-selector" style="margin-bottom: 24px; padding: 20px; background: var(--light-pink); border-radius: 8px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="medicationsPatient" style="font-weight: 600; margin-bottom: 8px; display: block;">
                                    <i class="fas fa-user-injured"></i> Select Patient
                                </label>
                                <select id="medicationsPatient" class="form-control" required style="font-size: 14px;">
                                    <option value="">-- Select a patient --</option>
                                    ${patientOptions}
                                </select>
                            </div>
                        </div>

                        <!-- Patient Info Display (hidden until patient selected) -->
                        <div id="selectedPatientInfoMedications" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                                <i class="fas fa-user-injured"></i> <span id="selectedPatientNameMedications"></span>
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> <span id="selectedPatientIdMedications"></span></div>
                                <div><strong>Age:</strong> <span id="selectedPatientAgeMedications"></span></div>
                                <div><strong>Status:</strong> <span id="selectedPatientStatusMedications"></span></div>
                                <div><strong>Doctor:</strong> <span id="selectedPatientDoctorMedications"></span></div>
                            </div>
                        </div>

                        <!-- Medication Entry Form -->
                        <div id="medicationsForm" style="display: none;">
                            <form id="newMedicationForm">
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
                                    <div class="form-group">
                                        <label for="medicationName">Medication Name <span style="color: red;">*</span></label>
                                        <input type="text" id="medicationName" class="form-control" required placeholder="e.g., Amoxicillin">
                                    </div>
                                    <div class="form-group">
                                        <label for="dosage">Dosage <span style="color: red;">*</span></label>
                                        <input type="text" id="dosage" class="form-control" required placeholder="e.g., 500mg">
                                    </div>
                                    <div class="form-group">
                                        <label for="frequency">Frequency <span style="color: red;">*</span></label>
                                        <select id="frequency" class="form-control" required>
                                            <option value="">-- Select frequency --</option>
                                            <option value="Once daily">Once daily</option>
                                            <option value="Twice daily">Twice daily</option>
                                            <option value="Three times daily">Three times daily</option>
                                            <option value="Four times daily">Four times daily</option>
                                            <option value="Every 4 hours">Every 4 hours</option>
                                            <option value="Every 6 hours">Every 6 hours</option>
                                            <option value="Every 8 hours">Every 8 hours</option>
                                            <option value="Every 12 hours">Every 12 hours</option>
                                            <option value="As needed">As needed (PRN)</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="route">Route <span style="color: red;">*</span></label>
                                        <select id="route" class="form-control" required>
                                            <option value="">-- Select route --</option>
                                            <option value="Oral">Oral</option>
                                            <option value="IV">Intravenous (IV)</option>
                                            <option value="IM">Intramuscular (IM)</option>
                                            <option value="SC">Subcutaneous (SC)</option>
                                            <option value="Topical">Topical</option>
                                            <option value="Inhalation">Inhalation</option>
                                            <option value="Rectal">Rectal</option>
                                            <option value="Sublingual">Sublingual</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="duration">Duration</label>
                                        <input type="text" id="duration" class="form-control" placeholder="e.g., 7 days, 2 weeks">
                                    </div>
                                    <div class="form-group">
                                        <label for="startDate">Start Date <span style="color: red;">*</span></label>
                                        <input type="date" id="startDate" class="form-control" required>
                                    </div>
                                </div>
                                <div class="form-group" style="margin-bottom: 20px;">
                                    <label for="medicationNotes">Instructions / Notes</label>
                                    <textarea id="medicationNotes" class="form-control" rows="3" placeholder="Special instructions, precautions, or additional notes..."></textarea>
                                </div>
                                <div class="form-actions" style="display: flex; gap: 12px; justify-content: flex-end;">
                                    <button type="button" class="btn btn-secondary" id="clearMedicationsForm">Clear Form</button>
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-save"></i> Prescribe Medication
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Medications History -->
                        <div id="medicationsHistory" style="display: none; margin-top: 24px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                <i class="fas fa-history"></i> Medication History
                            </h4>
                            <div id="medicationsHistoryTable"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Vital Signs Content for Physician (view-only with patient selection)
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
            const latestVS = patientVitalSigns[0]; // Most recent

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

                <!-- Detailed View -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-heartbeat"></i>
                            Patient Vital Signs
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

                        <!-- Vital Signs History -->
                        <div id="vitalSignsHistory" style="display: none; margin-top: 32px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--light-pink);">
                                <i class="fas fa-history"></i> Vital Signs History
                            </h4>
                            <div id="vitalSignsHistoryTable"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Lab Results Content for Physician (view-only with patient selection)
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

    // Prescriptions Content for Physician (view with patient selection)
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

    // Progress Notes Content for Physician
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
                    <td style="width: 12%;">
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
                <!-- Summary Table -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            Recent Progress Notes
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="overflow-x: auto;">
                            <table class="patients-table" style="min-width: 1000px;">
                                <thead>
                                    <tr>
                                        <th style="width: 10%;">Patient ID</th>
                                        <th style="width: 18%;">Name</th>
                                        <th style="width: 12%;">Date</th>
                                        <th style="width: 10%;">Time</th>
                                        <th style="width: 12%;">Note Type</th>
                                        <th style="width: 15%;">Chief Complaint</th>
                                        <th style="width: 12%;">Actions</th>
                                    </tr>
                                </thead>
                            </table>
                            <div style="max-height: 200px; overflow-y: auto;">
                                <table class="patients-table" style="min-width: 1000px;">
                                    <tbody>
                                        ${summaryRows || '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #999;">No progress notes recorded yet</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Create/View Progress Notes -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-file-medical"></i>
                            Progress Notes
                        </h3>
                    </div>
                    <div class="card-content">
                        <!-- Patient Selection -->
                        <div class="patient-selector" style="margin-bottom: 24px; padding: 20px; background: var(--light-pink); border-radius: 8px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="progressNotesPatient" style="font-weight: 600; margin-bottom: 8px; display: block;">
                                    <i class="fas fa-user-injured"></i> Select Patient
                                </label>
                                <select id="progressNotesPatient" class="form-control" required style="font-size: 14px;">
                                    <option value="">-- Select a patient --</option>
                                    ${patientOptions}
                                </select>
                            </div>
                        </div>

                        <!-- Patient Info Display -->
                        <div id="selectedPatientInfoProgressNotes" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                                <i class="fas fa-user-injured"></i> <span id="selectedPatientNameProgressNotes"></span>
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> <span id="selectedPatientIdProgressNotes"></span></div>
                                <div><strong>Age:</strong> <span id="selectedPatientAgeProgressNotes"></span></div>
                                <div><strong>Status:</strong> <span id="selectedPatientStatusProgressNotes"></span></div>
                                <div><strong>Doctor:</strong> <span id="selectedPatientDoctorProgressNotes"></span></div>
                            </div>
                        </div>

                        <!-- Progress Note Form -->
                        <div id="progressNotesForm" style="display: none;">
                            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                                <h4 style="margin: 0 0 8px 0; color: #856404;">
                                    <i class="fas fa-info-circle"></i> SOAP Format
                                </h4>
                                <p style="margin: 0; font-size: 13px; color: #856404;">
                                    <strong>S</strong>ubjective: Patient's symptoms and complaints | 
                                    <strong>O</strong>bjective: Clinical findings and test results | 
                                    <strong>A</strong>ssessment: Diagnosis and clinical impression | 
                                    <strong>P</strong>lan: Treatment plan and follow-up
                                </p>
                            </div>

                            <form id="newProgressNoteForm">
                                <!-- Basic Information -->
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px;">
                                    <div class="form-group">
                                        <label for="progressNoteDate">Date <span style="color: red;">*</span></label>
                                        <input type="date" id="progressNoteDate" class="form-control" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="progressNoteTime">Time <span style="color: red;">*</span></label>
                                        <input type="time" id="progressNoteTime" class="form-control" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="progressNoteType">Note Type <span style="color: red;">*</span></label>
                                        <select id="progressNoteType" class="form-control" required>
                                            <option value="">-- Select type --</option>
                                            <option value="Progress Note">Progress Note</option>
                                            <option value="Consultation">Consultation</option>
                                            <option value="Follow-up">Follow-up</option>
                                            <option value="Admission Note">Admission Note</option>
                                            <option value="Discharge Summary">Discharge Summary</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Chief Complaint -->
                                <div class="form-group" style="margin-bottom: 20px;">
                                    <label for="chiefComplaint">Chief Complaint <span style="color: red;">*</span></label>
                                    <input type="text" id="chiefComplaint" class="form-control" required placeholder="Main reason for visit or primary symptom">
                                </div>

                                <!-- SOAP Format -->
                                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                    <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                        <i class="fas fa-notes-medical"></i> Clinical Documentation (SOAP)
                                    </h4>
                                    
                                    <div class="form-group" style="margin-bottom: 16px;">
                                        <label for="subjective" style="font-weight: 600; color: #495057;">
                                            <i class="fas fa-comment-medical"></i> Subjective <span style="color: red;">*</span>
                                        </label>
                                        <textarea id="subjective" class="form-control" rows="3" required placeholder="Patient's complaints, symptoms, history of present illness..." style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"></textarea>
                                    </div>

                                    <div class="form-group" style="margin-bottom: 16px;">
                                        <label for="objective" style="font-weight: 600; color: #495057;">
                                            <i class="fas fa-stethoscope"></i> Objective <span style="color: red;">*</span>
                                        </label>
                                        <textarea id="objective" class="form-control" rows="3" required placeholder="Physical examination findings, vital signs, lab results, imaging findings..." style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"></textarea>
                                    </div>

                                    <div class="form-group" style="margin-bottom: 16px;">
                                        <label for="assessment" style="font-weight: 600; color: #495057;">
                                            <i class="fas fa-diagnoses"></i> Assessment <span style="color: red;">*</span>
                                        </label>
                                        <textarea id="assessment" class="form-control" rows="3" required placeholder="Diagnosis, differential diagnoses, clinical impression..." style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"></textarea>
                                    </div>

                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label for="plan" style="font-weight: 600; color: #495057;">
                                            <i class="fas fa-clipboard-list"></i> Plan <span style="color: red;">*</span>
                                        </label>
                                        <textarea id="plan" class="form-control" rows="3" required placeholder="Treatment plan, medications, procedures, follow-up instructions..." style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"></textarea>
                                    </div>
                                </div>

                                <!-- Additional Information -->
                                <div class="form-group" style="margin-bottom: 20px;">
                                    <label for="additionalNotes">Additional Notes</label>
                                    <textarea id="additionalNotes" class="form-control" rows="2" placeholder="Any additional observations, patient education provided, etc."></textarea>
                                </div>

                                <!-- Form Actions -->
                                <div class="form-actions" style="display: flex; gap: 12px; justify-content: flex-end;">
                                    <button type="button" class="btn btn-secondary" id="clearProgressNoteForm">Clear Form</button>
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-save"></i> Save Progress Note
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Progress Notes History -->
                        <div id="progressNotesHistory" style="display: none; margin-top: 24px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                <i class="fas fa-history"></i> Progress Notes History
                            </h4>
                            <div id="progressNotesHistoryTable"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Imaging Results Content (View Only)
    getImagingResultsContent() {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const allImagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');

        let summaryRows = '';
        patients.forEach(patient => {
            const patientImaging = allImagingResults.filter(img => img.patientId === patient.id);
            const latest = patientImaging[0];

            if (latest) {
                summaryRows += `
                    <tr>
                        <td style="width: 10%;">${patient.id}</td>
                        <td style="width: 20%;">${patient.fullName}</td>
                        <td style="width: 15%;">${latest.imagingModality}</td>
                        <td style="width: 12%;">${latest.imagingDate}</td>
                        <td style="width: 10%;">${latest.status}</td>
                        <td style="width: 12%;">
                            <button class="btn btn-sm btn-view-more-imaging" data-patient-id="${patient.id}">
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
                        <td colspan="3" style="text-align: center; color: #999;">No imaging results</td>
                        <td style="width: 12%;">-</td>
                    </tr>
                `;
            }
        });

        const patientOptions = patients.map(patient => 
            `<option value="${patient.id}">${patient.id} - ${patient.fullName}</option>`
        ).join('');

        return `
            <div class="imaging-results-management">
                <!-- Summary Table -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            Imaging Results Summary
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="overflow-x: auto;">
                            <table class="patients-table" style="min-width: 900px;">
                                <thead>
                                    <tr>
                                        <th style="width: 10%;">Patient ID</th>
                                        <th style="width: 20%;">Name</th>
                                        <th style="width: 15%;">Modality</th>
                                        <th style="width: 12%;">Date</th>
                                        <th style="width: 10%;">Status</th>
                                        <th style="width: 12%;">Actions</th>
                                    </tr>
                                </thead>
                            </table>
                            <div style="max-height: 180px; overflow-y: auto;">
                                <table class="patients-table" style="min-width: 900px;">
                                    <tbody>
                                        ${summaryRows || '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No imaging results recorded yet</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Patient Selection and History -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-x-ray"></i>
                            Imaging Results (View Only)
                        </h3>
                    </div>
                    <div class="card-content">
                        <div class="patient-selector" style="margin-bottom: 24px; padding: 20px; background: var(--light-pink); border-radius: 8px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="imagingResultsPatientPhysician" style="font-weight: 600; margin-bottom: 8px; display: block;">
                                    <i class="fas fa-user-injured"></i> Select Patient
                                </label>
                                <select id="imagingResultsPatientPhysician" class="form-control" style="font-size: 14px;">
                                    <option value="">-- Select a patient --</option>
                                    ${patientOptions}
                                </select>
                            </div>
                        </div>

                        <div id="selectedPatientInfoImagingPhysician" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                                <i class="fas fa-user-injured"></i> <span id="selectedPatientNameImagingPhysician"></span>
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> <span id="selectedPatientIdImagingPhysician"></span></div>
                                <div><strong>Age:</strong> <span id="selectedPatientAgeImagingPhysician"></span></div>
                                <div><strong>Status:</strong> <span id="selectedPatientStatusImagingPhysician"></span></div>
                                <div><strong>Doctor:</strong> <span id="selectedPatientDoctorImagingPhysician"></span></div>
                            </div>
                        </div>

                        <div id="imagingResultsHistoryPhysician" style="display: none; margin-top: 24px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                <i class="fas fa-history"></i> Imaging Results History
                            </h4>
                            <div id="imagingResultsHistoryTablePhysician"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

