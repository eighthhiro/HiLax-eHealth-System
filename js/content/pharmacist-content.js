// Pharmacist Content Module

class PharmacistContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // Dashboard Content for Pharmacists
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
                                <i class="fas fa-prescription"></i>
                            </div>
                            <h3 class="card-title">Pending Prescriptions</h3>
                        </div>
                        <div class="card-content">
                            <p>Prescriptions awaiting fulfillment</p>
                            <div class="stat-number">23</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-pills"></i>
                            </div>
                            <h3 class="card-title">Dispensed Today</h3>
                        </div>
                        <div class="card-content">
                            <p>Medications dispensed today</p>
                            <div class="stat-number">87</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <h3 class="card-title">Low Stock</h3>
                        </div>
                        <div class="card-content">
                            <p>Medications running low</p>
                            <div class="stat-number">12</div>
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

    // Lab Results Content for Pharmacist (view-only with patient selection)
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

    // Prescriptions Content for Pharmacist (view-only with patient selection)
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

    // Drug Inventory Content for Pharmacist
    getDrugInventoryContent() {
        const allDrugs = JSON.parse(localStorage.getItem('drugInventory') || '[]');

        // Filter by stock status
        const inStockDrugs = allDrugs.filter(drug => drug.stockQuantity > drug.reorderLevel);
        const lowStockDrugs = allDrugs.filter(drug => drug.stockQuantity > 0 && drug.stockQuantity <= drug.reorderLevel);
        const outOfStockDrugs = allDrugs.filter(drug => drug.stockQuantity === 0);

        let inventoryRows = '';
        allDrugs.forEach(drug => {
            const stockStatus = drug.stockQuantity === 0 ? 'out-of-stock' : 
                              drug.stockQuantity <= drug.reorderLevel ? 'low-stock' : 'in-stock';
            const statusText = drug.stockQuantity === 0 ? 'Out of Stock' : 
                              drug.stockQuantity <= drug.reorderLevel ? 'Low Stock' : 'In Stock';
            
            inventoryRows += `
                <tr>
                    <td style="padding: 12px;"><strong>${drug.drugName}</strong></td>
                    <td style="padding: 12px;">${drug.genericName || '-'}</td>
                    <td style="padding: 12px;">${drug.category || 'General'}</td>
                    <td style="padding: 12px;">${drug.dosageForm || '-'}</td>
                    <td style="padding: 12px;">${drug.strength || '-'}</td>
                    <td style="padding: 12px; text-align: center;">${drug.stockQuantity}</td>
                    <td style="padding: 12px; text-align: center;">${drug.reorderLevel}</td>
                    <td style="padding: 12px;"><span class="status-badge ${stockStatus}">${statusText}</span></td>
                    <td style="padding: 12px;">
                        <button class="btn btn-sm btn-edit-drug" data-drug-id="${drug.id}" style="padding: 5px 10px; font-size: 12px; margin-right: 4px;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-delete-drug" data-drug-id="${drug.id}" style="padding: 5px 10px; font-size: 12px; background: #dc3545; color: white;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            if (drug.batchNumber || drug.expiryDate || drug.supplier) {
                inventoryRows += `
                    <tr style="background: #f8f9fa;">
                        <td colspan="9" style="text-align: left; padding: 8px 12px; font-size: 13px; border-left: 3px solid var(--dark-pink);">
                            ${drug.batchNumber ? `<strong>Batch:</strong> ${drug.batchNumber} &nbsp;&nbsp;` : ''}
                            ${drug.expiryDate ? `<strong>Expiry:</strong> ${drug.expiryDate} &nbsp;&nbsp;` : ''}
                            ${drug.supplier ? `<strong>Supplier:</strong> ${drug.supplier} &nbsp;&nbsp;` : ''}
                            ${drug.location ? `<strong>Location:</strong> ${drug.location}` : ''}
                        </td>
                    </tr>
                `;
            }
        });

        return `
            <div class="drug-inventory-management">
                <!-- Summary Cards -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                    <div class="card" style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white;">
                        <div class="card-content" style="padding: 20px; text-align: center;">
                            <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px;">${inStockDrugs.length}</div>
                            <div style="font-size: 14px; opacity: 0.9;"><i class="fas fa-check-circle"></i> In Stock</div>
                        </div>
                    </div>
                    <div class="card" style="background: linear-gradient(135deg, #FF9800 0%, #f57c00 100%); color: white;">
                        <div class="card-content" style="padding: 20px; text-align: center;">
                            <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px;">${lowStockDrugs.length}</div>
                            <div style="font-size: 14px; opacity: 0.9;"><i class="fas fa-exclamation-triangle"></i> Low Stock</div>
                        </div>
                    </div>
                    <div class="card" style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color: white;">
                        <div class="card-content" style="padding: 20px; text-align: center;">
                            <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px;">${outOfStockDrugs.length}</div>
                            <div style="font-size: 14px; opacity: 0.9;"><i class="fas fa-times-circle"></i> Out of Stock</div>
                        </div>
                    </div>
                    <div class="card" style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white;">
                        <div class="card-content" style="padding: 20px; text-align: center;">
                            <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px;">${allDrugs.length}</div>
                            <div style="font-size: 14px; opacity: 0.9;"><i class="fas fa-list"></i> Total Items</div>
                        </div>
                    </div>
                </div>

                <!-- Main Inventory Card -->
                <div class="card">
                    <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 class="card-title">
                            <i class="fas fa-boxes"></i>
                            Drug Inventory Management
                        </h3>
                        <button class="btn btn-primary" id="addNewDrugBtn">
                            <i class="fas fa-plus"></i> Add New Drug
                        </button>
                    </div>
                    <div class="card-content">
                        <!-- Filter Section -->
                        <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; display: flex; gap: 12px; align-items: end;">
                            <div class="form-group" style="flex: 1; margin: 0;">
                                <label for="filterDrugName" style="font-size: 13px; margin-bottom: 4px;">Search Drug</label>
                                <input type="text" id="filterDrugName" class="form-control" placeholder="Search by drug name..." style="font-size: 14px;">
                            </div>
                            <div class="form-group" style="flex: 1; margin: 0;">
                                <label for="filterCategory" style="font-size: 13px; margin-bottom: 4px;">Category</label>
                                <select id="filterCategory" class="form-control" style="font-size: 14px;">
                                    <option value="">All Categories</option>
                                    <option value="Antibiotic">Antibiotic</option>
                                    <option value="Analgesic">Analgesic</option>
                                    <option value="Antipyretic">Antipyretic</option>
                                    <option value="Antihypertensive">Antihypertensive</option>
                                    <option value="Antidiabetic">Antidiabetic</option>
                                    <option value="Antihistamine">Antihistamine</option>
                                    <option value="Vitamin">Vitamin</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div class="form-group" style="flex: 1; margin: 0;">
                                <label for="filterStatus" style="font-size: 13px; margin-bottom: 4px;">Stock Status</label>
                                <select id="filterStatus" class="form-control" style="font-size: 14px;">
                                    <option value="">All Status</option>
                                    <option value="in-stock">In Stock</option>
                                    <option value="low-stock">Low Stock</option>
                                    <option value="out-of-stock">Out of Stock</option>
                                </select>
                            </div>
                            <button class="btn btn-secondary" id="clearFiltersBtn" style="height: 38px;">
                                <i class="fas fa-redo"></i> Clear
                            </button>
                        </div>

                        <!-- Inventory Table -->
                        <div style="overflow-x: auto;">
                            <table class="patients-table" id="drugInventoryTable" style="min-width: 1200px;">
                                <thead>
                                    <tr>
                                        <th style="padding: 12px;">Drug Name</th>
                                        <th style="padding: 12px;">Generic Name</th>
                                        <th style="padding: 12px;">Category</th>
                                        <th style="padding: 12px;">Dosage Form</th>
                                        <th style="padding: 12px;">Strength</th>
                                        <th style="padding: 12px; text-align: center;">Stock Qty</th>
                                        <th style="padding: 12px; text-align: center;">Reorder Level</th>
                                        <th style="padding: 12px;">Status</th>
                                        <th style="padding: 12px;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${inventoryRows || '<tr><td colspan="9" style="text-align: center; padding: 20px; color: #999;">No drugs in inventory. Click "Add New Drug" to start.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Drug Dispensing Content for Pharmacist
    getDrugDispensingContent() {
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

        const allDispensing = JSON.parse(localStorage.getItem('drugDispensing') || '[]');

        let summaryRows = '';
        patients.forEach(patient => {
            const patientDispensing = allDispensing.filter(d => d.patientId === patient.id);
            const latest = patientDispensing[0];

            if (latest) {
                summaryRows += `
                    <tr>
                        <td style="width: 10%;">${patient.id}</td>
                        <td style="width: 20%;">${patient.fullName}</td>
                        <td style="width: 15%;">${latest.drugName}</td>
                        <td style="width: 10%;">${latest.quantity}</td>
                        <td style="width: 12%;">${latest.dispensedDate}</td>
                        <td style="width: 12%;">${latest.batchNumber || '-'}</td>
                        <td style="width: 12%;">
                            <button class="btn btn-sm btn-view-more-dispensing" data-patient-id="${patient.id}">
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
                        <td colspan="4" style="text-align: center; color: #999;">No dispensing records</td>
                        <td style="width: 12%;">-</td>
                    </tr>
                `;
            }
        });

        const patientOptions = patients.map(patient => 
            `<option value="${patient.id}">${patient.id} - ${patient.fullName}</option>`
        ).join('');

        return `
            <div class="drug-dispensing-management">
                <!-- Summary Table -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            Recent Drug Dispensing Summary
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="overflow-x: auto;">
                            <table class="patients-table" style="min-width: 900px;">
                                <thead>
                                    <tr>
                                        <th style="width: 10%;">Patient ID</th>
                                        <th style="width: 20%;">Name</th>
                                        <th style="width: 15%;">Drug Name</th>
                                        <th style="width: 10%;">Quantity</th>
                                        <th style="width: 12%;">Date Dispensed</th>
                                        <th style="width: 12%;">Batch Number</th>
                                        <th style="width: 12%;">Actions</th>
                                    </tr>
                                </thead>
                            </table>
                            <div style="max-height: 180px; overflow-y: auto;">
                                <table class="patients-table" style="min-width: 900px;">
                                    <tbody>
                                        ${summaryRows || '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #999;">No dispensing records yet</td></tr>'}
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
                            Drug Dispensing Records
                        </h3>
                    </div>
                    <div class="card-content">
                        <div class="patient-selector" style="margin-bottom: 24px; padding: 20px; background: var(--light-pink); border-radius: 8px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="drugDispensingPatient" style="font-weight: 600; margin-bottom: 8px; display: block;">
                                    <i class="fas fa-user-injured"></i> Select Patient
                                </label>
                                <select id="drugDispensingPatient" class="form-control" required style="font-size: 14px;">
                                    <option value="">-- Select a patient --</option>
                                    ${patientOptions}
                                </select>
                            </div>
                        </div>

                        <div id="selectedPatientInfoDispensing" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                                <i class="fas fa-user-injured"></i> <span id="selectedPatientNameDispensing"></span>
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> <span id="selectedPatientIdDispensing"></span></div>
                                <div><strong>Age:</strong> <span id="selectedPatientAgeDispensing"></span></div>
                                <div><strong>Status:</strong> <span id="selectedPatientStatusDispensing"></span></div>
                                <div><strong>Doctor:</strong> <span id="selectedPatientDoctorDispensing"></span></div>
                            </div>
                        </div>

                        <div id="drugDispensingForm" style="display: none;">
                            <form id="newDrugDispensingForm">
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
                                    <div class="form-group">
                                        <label for="drugName">Drug Name <span style="color: red;">*</span></label>
                                        <input type="text" id="drugName" class="form-control" required placeholder="e.g., Paracetamol">
                                    </div>
                                    <div class="form-group">
                                        <label for="drugQuantity">Quantity <span style="color: red;">*</span></label>
                                        <input type="text" id="drugQuantity" class="form-control" required placeholder="e.g., 10 tablets">
                                    </div>
                                    <div class="form-group">
                                        <label for="batchNumber">Batch Number</label>
                                        <input type="text" id="batchNumber" class="form-control" placeholder="e.g., BATCH2025001">
                                    </div>
                                    <div class="form-group">
                                        <label for="lotNumber">Lot Number</label>
                                        <input type="text" id="lotNumber" class="form-control" placeholder="e.g., LOT-12345">
                                    </div>
                                    <div class="form-group">
                                        <label for="expiryDate">Expiry Date</label>
                                        <input type="date" id="expiryDate" class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label for="dispensingDate">Dispensing Date <span style="color: red;">*</span></label>
                                        <input type="date" id="dispensingDate" class="form-control" required>
                                    </div>
                                </div>
                                <div class="form-group" style="margin-bottom: 20px;">
                                    <label for="drugDispensingNotes">Notes</label>
                                    <textarea id="drugDispensingNotes" class="form-control" rows="3" placeholder="Additional notes or instructions..."></textarea>
                                </div>
                                <div class="form-actions" style="display: flex; gap: 12px; justify-content: flex-end;">
                                    <button type="button" class="btn btn-secondary" id="clearDrugDispensingForm">Clear Form</button>
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-save"></i> Record Dispensing
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div id="drugDispensingHistory" style="display: none; margin-top: 24px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                <i class="fas fa-history"></i> Dispensing History
                            </h4>
                            <div id="drugDispensingHistoryTable"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Unavailable Medications Content for Pharmacist
    getUnavailableMedsContent() {
        const allUnavailableMeds = JSON.parse(localStorage.getItem('unavailableMeds') || '[]');
        const allOrders = JSON.parse(localStorage.getItem('medOrders') || '[]');

        // Categorize by status
        const outOfStockMeds = allUnavailableMeds.filter(med => med.status === 'Out of Stock');
        const discontinuedMeds = allUnavailableMeds.filter(med => med.status === 'Discontinued');
        const backorderedMeds = allUnavailableMeds.filter(med => med.status === 'Backordered');

        // Orders by status
        const pendingOrders = allOrders.filter(order => order.orderStatus === 'Pending');
        const confirmedOrders = allOrders.filter(order => order.orderStatus === 'Confirmed');
        const receivedOrders = allOrders.filter(order => order.orderStatus === 'Received');

        let unavailableMedsRows = '';
        allUnavailableMeds.forEach(med => {
            unavailableMedsRows += `
                <tr>
                    <td style="padding: 12px;"><strong>${med.medicationName}</strong></td>
                    <td style="padding: 12px;">${med.genericName || '-'}</td>
                    <td style="padding: 12px;"><span class="status-badge ${med.status.toLowerCase().replace(' ', '-')}">${med.status}</span></td>
                    <td style="padding: 12px;">${med.dateReported}</td>
                    <td style="padding: 12px;">${med.expectedRestockDate || 'Unknown'}</td>
                    <td style="padding: 12px;">${med.alternativeMed || 'None suggested'}</td>
                    <td style="padding: 12px;">
                        <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px; background: var(--info-blue); color: white; margin-right: 4px;" 
                                onclick="dashboard.showCreateOrderModal('${med.id}')">
                            <i class="fas fa-shopping-cart"></i> Order
                        </button>
                        <button class="btn btn-sm btn-edit-unavailable" data-med-id="${med.id}" style="padding: 5px 10px; font-size: 12px; margin-right: 4px;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-delete-unavailable" data-med-id="${med.id}" style="padding: 5px 10px; font-size: 12px; background: #dc3545; color: white;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            if (med.reason || med.notes) {
                unavailableMedsRows += `
                    <tr style="background: #f8f9fa;">
                        <td colspan="7" style="text-align: left; padding: 8px 12px; font-size: 13px; border-left: 3px solid var(--dark-pink);">
                            ${med.reason ? `<strong>Reason:</strong> ${med.reason} &nbsp;&nbsp;` : ''}
                            ${med.notes ? `<strong>Notes:</strong> ${med.notes}` : ''}
                        </td>
                    </tr>
                `;
            }
        });

        let ordersRows = '';
        allOrders.forEach(order => {
            const statusClass = order.orderStatus === 'Received' ? 'completed' : 
                              order.orderStatus === 'Confirmed' ? 'in-progress' : 'pending';
            ordersRows += `
                <tr>
                    <td style="padding: 12px;"><strong>${order.orderNumber}</strong></td>
                    <td style="padding: 12px;">${order.medicationName}</td>
                    <td style="padding: 12px;">${order.quantity}</td>
                    <td style="padding: 12px;">${order.supplierName}</td>
                    <td style="padding: 12px;">${order.orderDate}</td>
                    <td style="padding: 12px;">${order.expectedDelivery || 'TBD'}</td>
                    <td style="padding: 12px;"><span class="status-badge ${statusClass}">${order.orderStatus}</span></td>
                    <td style="padding: 12px;">
                        <button class="btn btn-sm btn-view-order" data-order-id="${order.id}" style="padding: 5px 10px; font-size: 12px; margin-right: 4px;">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-update-order-status" data-order-id="${order.id}" style="padding: 5px 10px; font-size: 12px; background: var(--info-blue); color: white;">
                            <i class="fas fa-sync"></i>
                        </button>
                    </td>
                </tr>
            `;
            if (order.supplierContact || order.trackingNumber) {
                ordersRows += `
                    <tr style="background: #f8f9fa;">
                        <td colspan="8" style="text-align: left; padding: 8px 12px; font-size: 13px; border-left: 3px solid var(--dark-pink);">
                            ${order.supplierContact ? `<strong>Contact:</strong> ${order.supplierContact} &nbsp;&nbsp;` : ''}
                            ${order.trackingNumber ? `<strong>Tracking:</strong> ${order.trackingNumber} &nbsp;&nbsp;` : ''}
                            ${order.totalCost ? `<strong>Total Cost:</strong> ₱${order.totalCost}` : ''}
                        </td>
                    </tr>
                `;
            }
        });

        return `
            <div class="unavailable-meds-management">
                <!-- Summary Cards -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px;">
                    <div class="card" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white;">
                        <div class="card-content" style="padding: 20px; text-align: center;">
                            <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px;">${outOfStockMeds.length}</div>
                            <div style="font-size: 14px; opacity: 0.9;"><i class="fas fa-times-circle"></i> Out of Stock</div>
                        </div>
                    </div>
                    <div class="card" style="background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%); color: white;">
                        <div class="card-content" style="padding: 20px; text-align: center;">
                            <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px;">${discontinuedMeds.length}</div>
                            <div style="font-size: 14px; opacity: 0.9;"><i class="fas fa-ban"></i> Discontinued</div>
                        </div>
                    </div>
                    <div class="card" style="background: linear-gradient(135deg, #f39c12 0%, #d68910 100%); color: white;">
                        <div class="card-content" style="padding: 20px; text-align: center;">
                            <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px;">${backorderedMeds.length}</div>
                            <div style="font-size: 14px; opacity: 0.9;"><i class="fas fa-clock"></i> Backordered</div>
                        </div>
                    </div>
                    <div class="card" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white;">
                        <div class="card-content" style="padding: 20px; text-align: center;">
                            <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px;">${pendingOrders.length}</div>
                            <div style="font-size: 14px; opacity: 0.9;"><i class="fas fa-hourglass-half"></i> Pending Orders</div>
                        </div>
                    </div>
                    <div class="card" style="background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); color: white;">
                        <div class="card-content" style="padding: 20px; text-align: center;">
                            <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px;">${confirmedOrders.length}</div>
                            <div style="font-size: 14px; opacity: 0.9;"><i class="fas fa-check-circle"></i> Confirmed Orders</div>
                        </div>
                    </div>
                    <div class="card" style="background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: white;">
                        <div class="card-content" style="padding: 20px; text-align: center;">
                            <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px;">${receivedOrders.length}</div>
                            <div style="font-size: 14px; opacity: 0.9;"><i class="fas fa-box-open"></i> Received</div>
                        </div>
                    </div>
                </div>

                <!-- Unavailable Medications Card -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 class="card-title">
                            <i class="fas fa-exclamation-triangle"></i>
                            Unavailable Medications
                        </h3>
                        <button class="btn btn-primary" id="addUnavailableMedBtn">
                            <i class="fas fa-plus"></i> Report Unavailable Med
                        </button>
                    </div>
                    <div class="card-content">
                        <div style="overflow-x: auto;">
                            <table class="patients-table" style="min-width: 1200px;">
                                <thead>
                                    <tr>
                                        <th style="padding: 12px;">Medication Name</th>
                                        <th style="padding: 12px;">Generic Name</th>
                                        <th style="padding: 12px;">Status</th>
                                        <th style="padding: 12px;">Date Reported</th>
                                        <th style="padding: 12px;">Expected Restock</th>
                                        <th style="padding: 12px;">Alternative</th>
                                        <th style="padding: 12px;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${unavailableMedsRows || '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #999;">No unavailable medications reported.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Medication Orders Card -->
                <div class="card">
                    <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 class="card-title">
                            <i class="fas fa-shopping-cart"></i>
                            Medication Orders
                        </h3>
                        <button class="btn btn-primary" id="createNewOrderBtn">
                            <i class="fas fa-plus"></i> Create New Order
                        </button>
                    </div>
                    <div class="card-content">
                        <div style="overflow-x: auto;">
                            <table class="patients-table" style="min-width: 1200px;">
                                <thead>
                                    <tr>
                                        <th style="padding: 12px;">Order Number</th>
                                        <th style="padding: 12px;">Medication</th>
                                        <th style="padding: 12px;">Quantity</th>
                                        <th style="padding: 12px;">Supplier</th>
                                        <th style="padding: 12px;">Order Date</th>
                                        <th style="padding: 12px;">Expected Delivery</th>
                                        <th style="padding: 12px;">Status</th>
                                        <th style="padding: 12px;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${ordersRows || '<tr><td colspan="8" style="text-align: center; padding: 20px; color: #999;">No orders placed yet.</td></tr>'}
                                </tbody>
                            </table>
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
                    </tr>
                `;
            } else {
                summaryRows += `
                    <tr>
                        <td>${patient.id}</td>
                        <td>${patient.fullName}</td>
                        <td colspan="3" style="text-align: center; color: #999;">No imaging results</td>
                    </tr>
                `;
            }
        });

        return `
            <div class="imaging-results-management">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-x-ray"></i> Imaging Results (View Only)
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
                                    </tr>
                                </thead>
                                <tbody>
                                    ${summaryRows || '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #999;">No imaging results yet</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
