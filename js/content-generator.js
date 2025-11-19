// Content Generator Module - Handles all page content generation

class ContentGenerator {
    constructor(currentUser) {
        this.currentUser = currentUser;
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

    // Dashboard Content
    getDashboardContent() {
        return `
            <div class="dashboard-overview">
                <div class="cards-grid">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-user-injured"></i>
                            </div>
                            <h3 class="card-title">Patients</h3>
                        </div>
                        <div class="card-content">
                            <p>Manage patient information and records</p>
                            <div class="stat-number">1,247</div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-prescription"></i>
                            </div>
                            <h3 class="card-title">Prescriptions</h3>
                        </div>
                        <div class="card-content">
                            <p>View and manage medication orders</p>
                            <div class="stat-number">89</div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-flask"></i>
                            </div>
                            <h3 class="card-title">Lab Results</h3>
                        </div>
                        <div class="card-content">
                            <p>Access laboratory test results</p>
                            <div class="stat-number">156</div>
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
                            <p>Monitor patient vital statistics</p>
                            <div class="stat-number">Active: 42</div>
                        </div>
                    </div>
                </div>

                <div class="recent-activity">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="fas fa-history"></i>
                                Recent Activity
                            </h3>
                        </div>
                        <div class="card-content">
                            <div class="activity-list">
                                <div class="activity-item">
                                    <i class="fas fa-user-plus success"></i>
                                    <span>New patient registered - John Doe</span>
                                    <small>2 minutes ago</small>
                                </div>
                                <div class="activity-item">
                                    <i class="fas fa-prescription info"></i>
                                    <span>Prescription updated for Patient #P001</span>
                                    <small>15 minutes ago</small>
                                </div>
                                <div class="activity-item">
                                    <i class="fas fa-flask warning"></i>
                                    <span>Lab results available for Patient #P045</span>
                                    <small>1 hour ago</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // All Patients Content with role-based visibility
    getAllPatientsContent() {
        const role = this.currentUser.role;
        
        // Patient role only sees their own record
        if (role === 'Patient') {
            return this.getPatientOwnRecordContent();
        }
        
        // Other roles see all patients
        return this.getAllPatientsTableContent();
    }

    getPatientOwnRecordContent() {
        return `
            <div class="patients-management">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-user"></i>
                            My Medical Record
                        </h3>
                    </div>
                    <div class="card-content">
                        <div class="patient-detail">
                            <div class="detail-row">
                                <label>Patient ID:</label>
                                <span>${this.currentUser.patientId || 'P001'}</span>
                            </div>
                            <div class="detail-row">
                                <label>Name:</label>
                                <span>${this.currentUser.name}</span>
                            </div>
                            <div class="detail-row">
                                <label>Status:</label>
                                <span><span class="status-badge active">Active</span></span>
                            </div>
                        </div>
                        <div class="button-group" style="margin-top: 20px;">
                            <button class="btn btn-primary" id="editPatientBtn">
                                <i class="fas fa-edit"></i>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getAllPatientsTableContent() {
        const role = this.currentUser.role;
        
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
                { id: 'P001', fullName: 'John Smith', age: 45, status: 'Active' },
                { id: 'P002', fullName: 'Maria Garcia', age: 32, status: 'Discharged' },
                { id: 'P003', fullName: 'Robert Johnson', age: 68, status: 'Active' }
            ];
        }
        
        let tableRows = '';
        
        // Generate table rows from patient data
        patients.forEach(patient => {
            let statusClass = 'active';
            if (patient.status === 'Discharged') statusClass = 'discharged';
            if (patient.status === 'Admitted') statusClass = 'admitted';
            
            const editDeleteButtons = role !== 'Patient' ? `
                <button class="btn btn-sm btn-edit" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-delete" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            ` : '';
            
            // Generate records column content
            let recordsContent = '<span class="no-record">No file</span>';
            if (patient.recordsUrl) {
                recordsContent = `<a href="${patient.recordsUrl}" target="_blank" class="record-link">
                    <i class="fas fa-external-link-alt"></i>
                    View Records
                </a>`;
            }
            
            tableRows += `
                <tr class="patient-row">
                    <td>${patient.id}</td>
                    <td>${patient.fullName}</td>
                    <td>${patient.age}</td>
                    <td><span class="status-badge ${statusClass}">${patient.status}</span></td>
                    <td class="records-column">${recordsContent}</td>
                    <td class="actions-column">
                        ${editDeleteButtons}
                    </td>
                </tr>
            `;
        });

        let addPatientButton = '';
        if (role === 'HR/Admin') {
            addPatientButton = `
                <button class="btn btn-primary" id="addPatientBtn">
                    <i class="fas fa-plus"></i>
                    Add New Patient
                </button>
            `;
        }

        return `
            <div class="patients-management">
                <div class="card">
                    <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 class="card-title">
                            <i class="fas fa-users"></i>
                            All Patients
                        </h3>
                        ${addPatientButton}
                    </div>
                    <div class="card-content">
                        <table class="patients-table">
                            <thead>
                                <tr>
                                    <th>Patient ID</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Status</th>
                                    <th>Records</th>
                                    <th>Actions</th>
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

    // Prescriptions Content
    getPrescriptionsContent() {
        const role = this.currentUser.role;
        let actionButtons = '';
        
        if (role === 'Physician' || role === 'HR/Admin') {
            actionButtons = `
                <button class="btn btn-primary">
                    <i class="fas fa-plus"></i>
                    New Prescription
                </button>
            `;
        }

        return `
            <div class="prescriptions-management">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-prescription"></i>
                            Prescriptions
                        </h3>
                        ${actionButtons}
                    </div>
                    <div class="card-content">
                        <div class="data-table">
                            <div class="table-row header">
                                <div>Prescription ID</div>
                                <div>Patient</div>
                                <div>Medication</div>
                                <div>Status</div>
                            </div>
                            <div class="table-row">
                                <div>RX001</div>
                                <div>John Smith (P001)</div>
                                <div>Amoxicillin 500mg</div>
                                <div><span class="status-badge active">Active</span></div>
                            </div>
                            <div class="table-row">
                                <div>RX002</div>
                                <div>Maria Garcia (P002)</div>
                                <div>Lisinopril 10mg</div>
                                <div><span class="status-badge completed">Completed</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Default Content for unimplemented pages
    getDefaultContent(pageId) {
        return `
            <div class="default-content">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-cog"></i>
                            ${pageId.charAt(0).toUpperCase() + pageId.slice(1).replace('-', ' ')}
                        </h3>
                    </div>
                    <div class="card-content">
                        <p>This section is under development. Content for ${pageId} will be implemented soon.</p>
                        <p><strong>Role:</strong> ${this.currentUser.role}</p>
                        <p><strong>Permissions:</strong> ${ROLE_PERMISSIONS[this.currentUser.role]?.view.slice(0, 3).join(', ')}...</p>
                    </div>
                </div>
            </div>
        `;
    }
}
