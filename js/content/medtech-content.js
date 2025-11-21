// MedTech Content Module

class MedTechContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // Dashboard Content for Medical Technologists
    getDashboardContent() {
        const stats = this.getDynamicStats();
        const sharedContent = new SharedContent(this.currentUser);
        
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
                                            <i class="fas fa-clock"></i>
                                        </div>
                                        <h3 class="card-title">Pending Lab Orders</h3>
                                    </div>
                                    <div class="stat-number">${stats.pendingLabOrders}</div>
                                </div>
                                <div class="card-content">
                                    <p>Patients awaiting lab results</p>
                                    <button class="btn-view-stat" data-page="lab-results">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                </div>
                            </div>
                            <div class="card stat-card">
                                <div class="card-header">
                                    <div class="stat-info">
                                        <div class="card-icon">
                                            <i class="fas fa-check-circle"></i>
                                        </div>
                                        <h3 class="card-title">Lab Orders Completed</h3>
                                    </div>
                                    <div class="stat-number">${stats.completedLabOrders}</div>
                                </div>
                                <div class="card-content">
                                    <p>Total lab results recorded</p>
                                    <button class="btn-view-stat" data-page="lab-results">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                </div>
                            </div>
                            <div class="card stat-card">
                                <div class="card-header">
                                    <div class="stat-info">
                                        <div class="card-icon">
                                            <i class="fas fa-clipboard-check"></i>
                                        </div>
                                        <h3 class="card-title">Quality Control Completed</h3>
                                    </div>
                                    <div class="stat-number">${stats.qcCompleted}</div>
                                </div>
                                <div class="card-content">
                                    <p>Total QC tests performed</p>
                                    <button class="btn-view-stat" data-page="quality-control">
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

    // Get Dynamic Stats
    getDynamicStats() {
        let totalPatients = 0;
        let completedLabOrders = 0;
        let qcCompleted = 0;

        // Get total patients
        try {
            const patients = JSON.parse(localStorage.getItem('patients') || '[]');
            totalPatients = patients.length;
        } catch (e) {
            console.error('Error loading patients:', e);
        }

        // Get completed lab orders
        try {
            const labResults = JSON.parse(localStorage.getItem('labResults') || '[]');
            completedLabOrders = labResults.length;
        } catch (e) {
            console.error('Error loading lab results:', e);
        }

        // Get QC completed
        try {
            const qcRecords = JSON.parse(localStorage.getItem('qualityControl') || '[]');
            qcCompleted = qcRecords.length;
        } catch (e) {
            console.error('Error loading QC records:', e);
        }

        // Calculate pending lab orders (patients with no lab results yet)
        let pendingLabOrders = 0;
        try {
            const patients = JSON.parse(localStorage.getItem('patients') || '[]');
            const labResults = JSON.parse(localStorage.getItem('labResults') || '[]');
            
            pendingLabOrders = patients.filter(patient => {
                return !labResults.some(lab => lab.patientId === patient.id);
            }).length;
        } catch (e) {
            console.error('Error calculating pending lab orders:', e);
        }

        return {
            pendingLabOrders,
            completedLabOrders,
            qcCompleted
        };
    }

    // Lab Results Content for MedTech
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
                            Recent Lab Results Summary
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

                        <div id="labResultsForm" style="display: none;">
                            <form id="newLabResultForm">
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
                                    <div class="form-group">
                                        <label for="testType">Test Type <span style="color: red;">*</span></label>
                                        <select id="testType" class="form-control" required>
                                            <option value="">-- Select test type --</option>
                                            <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                                            <option value="Blood Chemistry">Blood Chemistry</option>
                                            <option value="Urinalysis">Urinalysis</option>
                                            <option value="Lipid Profile">Lipid Profile</option>
                                            <option value="Liver Function Test">Liver Function Test</option>
                                            <option value="Kidney Function Test">Kidney Function Test</option>
                                            <option value="Blood Glucose">Blood Glucose</option>
                                            <option value="Thyroid Function Test">Thyroid Function Test</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="testDate">Test Date <span style="color: red;">*</span></label>
                                        <input type="date" id="testDate" class="form-control" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="labStatus">Status <span style="color: red;">*</span></label>
                                        <select id="labStatus" class="form-control" required>
                                            <option value="Completed">Completed</option>
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="resultFile">Result File (Optional)</label>
                                        <div style="position: relative;">
                                            <input type="file" id="resultFile" style="display: none;" accept=".pdf,.jpg,.jpeg,.png">
                                            <button type="button" class="btn btn-secondary" onclick="document.getElementById('resultFile').click()" style="width: 100%; text-align: left; display: flex; align-items: center; justify-content: space-between;">
                                                <span id="resultFileName" style="color: #666;">No file chosen</span>
                                                <i class="fas fa-upload"></i>
                                            </button>
                                        </div>
                                        <small style="color: #666; display: block; margin-top: 4px;">Upload lab result document (PDF, JPG, PNG)</small>
                                    </div>
                                </div>
                                <div class="form-group" style="margin-bottom: 20px;">
                                    <label for="labResultDetails">Test Results / Notes <span style="color: red;">*</span></label>
                                    <textarea id="labResultDetails" class="form-control" rows="4" required placeholder="Enter test results, findings, or observations..."></textarea>
                                </div>
                                <div class="form-actions" style="display: flex; gap: 12px; justify-content: flex-end;">
                                    <button type="button" class="btn btn-secondary" id="clearLabResultsForm">Clear Form</button>
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-save"></i> Save Lab Result
                                    </button>
                                </div>
                            </form>
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

    // Quality Control Content for MedTech
    getQualityControlContent() {
        const qcRecords = JSON.parse(localStorage.getItem('qualityControl') || '[]');
        
        // Get today's date for filtering
        const today = new Date().toLocaleDateString();
        const todayRecords = qcRecords.filter(qc => qc.testDate === today);
        
        let todayRows = '';
        if (todayRecords.length > 0) {
            todayRecords.forEach(qc => {
                const statusClass = qc.result === 'Within Range' ? 'active' : 
                                  qc.result === 'Out of Range' ? 'discharged' : 'admitted';
                todayRows += `
                    <tr>
                        <td>${qc.testName}</td>
                        <td>${qc.lotNumber}</td>
                        <td>${qc.testTime}</td>
                        <td><span class="status-badge ${statusClass}">${qc.result}</span></td>
                        <td>${qc.testedBy}</td>
                        <td>
                            <button class="btn btn-sm btn-view-qc-details" data-qc-id="${qc.id}">
                                <i class="fas fa-eye"></i> Details
                            </button>
                        </td>
                    </tr>
                `;
            });
        } else {
            todayRows = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No QC tests recorded today</td></tr>';
        }

        return `
            <div class="quality-control-management">
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-calendar-day"></i>
                            Today's Quality Control Tests
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="overflow-x: auto;">
                            <table class="patients-table" style="min-width: 900px;">
                                <thead>
                                    <tr>
                                        <th>Test Name</th>
                                        <th>Lot Number</th>
                                        <th>Test Time</th>
                                        <th>Result</th>
                                        <th>Tested By</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                            </table>
                            <div style="max-height: 180px; overflow-y: auto;">
                                <table class="patients-table" style="min-width: 900px;">
                                    <tbody>
                                        ${todayRows}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-clipboard-check"></i>
                            Record Quality Control Test
                        </h3>
                    </div>
                    <div class="card-content">
                        <form id="newQCForm">
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
                                <div class="form-group">
                                    <label for="qcTestName">Test Name <span style="color: red;">*</span></label>
                                    <select id="qcTestName" class="form-control" required>
                                        <option value="">-- Select test --</option>
                                        <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                                        <option value="Blood Chemistry">Blood Chemistry</option>
                                        <option value="Glucose">Glucose</option>
                                        <option value="Electrolytes">Electrolytes</option>
                                        <option value="Liver Panel">Liver Panel</option>
                                        <option value="Kidney Panel">Kidney Panel</option>
                                        <option value="Lipid Panel">Lipid Panel</option>
                                        <option value="Urinalysis">Urinalysis</option>
                                        <option value="Coagulation Studies">Coagulation Studies</option>
                                        <option value="Cardiac Markers">Cardiac Markers</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="qcControlLevel">Control Level <span style="color: red;">*</span></label>
                                    <select id="qcControlLevel" class="form-control" required>
                                        <option value="">-- Select level --</option>
                                        <option value="Level 1 (Low)">Level 1 (Low)</option>
                                        <option value="Level 2 (Normal)">Level 2 (Normal)</option>
                                        <option value="Level 3 (High)">Level 3 (High)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="qcLotNumber">Lot Number <span style="color: red;">*</span></label>
                                    <input type="text" id="qcLotNumber" class="form-control" required placeholder="e.g., LOT12345">
                                </div>
                                <div class="form-group">
                                    <label for="qcExpiryDate">Expiry Date <span style="color: red;">*</span></label>
                                    <input type="date" id="qcExpiryDate" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label for="qcObservedValue">Observed Value <span style="color: red;">*</span></label>
                                    <input type="text" id="qcObservedValue" class="form-control" required placeholder="e.g., 5.2">
                                </div>
                                <div class="form-group">
                                    <label for="qcExpectedRange">Expected Range <span style="color: red;">*</span></label>
                                    <input type="text" id="qcExpectedRange" class="form-control" required placeholder="e.g., 4.5 - 5.5">
                                </div>
                                <div class="form-group">
                                    <label for="qcResult">Result <span style="color: red;">*</span></label>
                                    <select id="qcResult" class="form-control" required>
                                        <option value="">-- Select result --</option>
                                        <option value="Within Range">Within Range</option>
                                        <option value="Out of Range">Out of Range</option>
                                        <option value="Review Required">Review Required</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="qcInstrument">Instrument/Analyzer <span style="color: red;">*</span></label>
                                    <input type="text" id="qcInstrument" class="form-control" required placeholder="e.g., Analyzer A1">
                                </div>
                            </div>
                            <div class="form-group" style="margin-bottom: 20px;">
                                <label for="qcNotes">Notes / Corrective Actions</label>
                                <textarea id="qcNotes" class="form-control" rows="3" placeholder="Enter any notes, observations, or corrective actions taken..."></textarea>
                            </div>
                            <div class="form-actions" style="display: flex; gap: 12px; justify-content: flex-end;">
                                <button type="button" class="btn btn-secondary" id="clearQCForm">Clear Form</button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save"></i> Save QC Record
                                </button>
                            </div>
                        </form>

                        <div style="margin-top: 32px; padding-top: 32px; border-top: 2px solid #e0e0e0;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                <i class="fas fa-history"></i> QC History
                            </h4>
                            <div style="margin-bottom: 16px;">
                                <label for="qcHistoryFilter" style="font-weight: 600; margin-right: 12px;">Filter by Test:</label>
                                <select id="qcHistoryFilter" class="form-control" style="display: inline-block; width: auto; min-width: 250px;">
                                    <option value="">All Tests</option>
                                    <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                                    <option value="Blood Chemistry">Blood Chemistry</option>
                                    <option value="Glucose">Glucose</option>
                                    <option value="Electrolytes">Electrolytes</option>
                                    <option value="Liver Panel">Liver Panel</option>
                                    <option value="Kidney Panel">Kidney Panel</option>
                                    <option value="Lipid Panel">Lipid Panel</option>
                                    <option value="Urinalysis">Urinalysis</option>
                                    <option value="Coagulation Studies">Coagulation Studies</option>
                                    <option value="Cardiac Markers">Cardiac Markers</option>
                                </select>
                            </div>
                            <div id="qcHistoryTable"></div>
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
}
