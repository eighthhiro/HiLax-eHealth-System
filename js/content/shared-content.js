// Shared Content Module - Common content used across different roles

class SharedContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // All Patients Content
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
            
            // Generate personal info content
            let personalInfoContent = patient.personalInfo ? 
                `<button class="btn btn-sm btn-view-info" data-patient-id="${patient.id}" title="View Personal Info">
                    <i class="fas fa-id-card"></i>
                    View Info
                </button>` : 
                `<span class="no-record">Not Set</span>`;
            
            // Generate billing content
            let billingContent = patient.billing ? 
                `<button class="btn btn-sm btn-view-billing" data-patient-id="${patient.id}" title="View Billing">
                    <i class="fas fa-file-invoice-dollar"></i>
                    View Billing
                </button>` : 
                `<span class="no-record">Not Set</span>`;
            
            // Medical History button
            const medicalHistoryBtn = `<button class="btn btn-sm btn-medical-history" data-patient-id="${patient.id}" title="View Medical History">
                <i class="fas fa-notes-medical"></i>
                History
            </button>`;
            
            tableRows += `
                <tr class="patient-row">
                    <td>${patient.id}</td>
                    <td>${patient.fullName}</td>
                    <td>${patient.age}</td>
                    <td><span class="status-badge ${statusClass}">${patient.status}</span></td>
                    <td>${patient.doctor || 'Unassigned'}</td>
                    <td>${personalInfoContent}</td>
                    <td>${billingContent}</td>
                    <td>${recordsContent}</td>
                    <td>${medicalHistoryBtn}</td>
                    <td>${editDeleteButtons}</td>
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
                                    <th>Doctor</th>
                                    <th>Personal Info</th>
                                    <th>Billing</th>
                                    <th>Records</th>
                                    <th>Medical History</th>
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

    // Announcements Section (for all roles)
    getAnnouncementsSection() {
        const role = this.currentUser.role;
        
        // Load announcements from localStorage
        let announcements = [];
        try {
            const stored = localStorage.getItem('announcements');
            if (stored) {
                announcements = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading announcements:', error);
        }

        // Filter announcements for current role
        const visibleAnnouncements = announcements.filter(announcement => 
            announcement.visibleTo.includes(role) || announcement.visibleTo.includes('All')
        );

        const displayLimit = 3;
        let announcementsList = '';
        let viewMoreButton = '';
        
        if (visibleAnnouncements.length > 0) {
            announcementsList = visibleAnnouncements.slice(0, displayLimit).map(announcement => `
                <div class="announcement-item">
                    <div class="announcement-header">
                        <h4>${announcement.title}</h4>
                        <span class="announcement-date">${new Date(announcement.date).toLocaleDateString()}</span>
                    </div>
                    <p>${announcement.description}</p>
                </div>
            `).join('');
            
            if (visibleAnnouncements.length > displayLimit) {
                viewMoreButton = `
                    <button class="btn btn-view-more-announcements" id="viewMoreAnnouncementsBtn">
                        <i class="fas fa-chevron-down"></i>
                        View All ${visibleAnnouncements.length} Announcements
                    </button>
                `;
            }
        } else {
            announcementsList = '<p class="no-announcements">No announcements at this time.</p>';
        }

        return `
            <div class="announcements-section">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-bullhorn"></i>
                            Announcements
                        </h3>
                    </div>
                    <div class="card-content">
                        <div class="announcements-list">
                            ${announcementsList}
                        </div>
                        ${viewMoreButton}
                    </div>
                </div>
            </div>
        `;
    }

    // Social Footer (for all role dashboards)
    getSocialFooter() {
        return `
            <div class="social-footer" style="background: var(--dark-pink); padding: 32px 24px; border-radius: 12px; margin-top: 32px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h3 style="color: white; margin-bottom: 8px; font-size: 20px; font-weight: 600;">Connect With Us</h3>
                    <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px;">Stay updated with Hilax Hospital on social media</p>
                </div>
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                    <a href="https://facebook.com" target="_blank" style="color: white; font-size: 28px; transition: all 0.3s ease; opacity: 0.95;" onmouseover="this.style.opacity='1'; this.style.transform='translateY(-3px)'" onmouseout="this.style.opacity='0.95'; this.style.transform='translateY(0)'">
                        <i class="fab fa-facebook"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" style="color: white; font-size: 28px; transition: all 0.3s ease; opacity: 0.95;" onmouseover="this.style.opacity='1'; this.style.transform='translateY(-3px)'" onmouseout="this.style.opacity='0.95'; this.style.transform='translateY(0)'">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" style="color: white; font-size: 28px; transition: all 0.3s ease; opacity: 0.95;" onmouseover="this.style.opacity='1'; this.style.transform='translateY(-3px)'" onmouseout="this.style.opacity='0.95'; this.style.transform='translateY(0)'">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" style="color: white; font-size: 28px; transition: all 0.3s ease; opacity: 0.95;" onmouseover="this.style.opacity='1'; this.style.transform='translateY(-3px)'" onmouseout="this.style.opacity='0.95'; this.style.transform='translateY(0)'">
                        <i class="fab fa-linkedin"></i>
                    </a>
                    <a href="https://youtube.com" target="_blank" style="color: white; font-size: 28px; transition: all 0.3s ease; opacity: 0.95;" onmouseover="this.style.opacity='1'; this.style.transform='translateY(-3px)'" onmouseout="this.style.opacity='0.95'; this.style.transform='translateY(0)'">
                        <i class="fab fa-youtube"></i>
                    </a>
                    <a href="https://tiktok.com" target="_blank" style="color: white; font-size: 28px; transition: all 0.3s ease; opacity: 0.95;" onmouseover="this.style.opacity='1'; this.style.transform='translateY(-3px)'" onmouseout="this.style.opacity='0.95'; this.style.transform='translateY(0)'">
                        <i class="fab fa-tiktok"></i>
                    </a>
                    <a href="https://github.com" target="_blank" style="color: white; font-size: 28px; transition: all 0.3s ease; opacity: 0.95;" onmouseover="this.style.opacity='1'; this.style.transform='translateY(-3px)'" onmouseout="this.style.opacity='0.95'; this.style.transform='translateY(0)'">
                        <i class="fab fa-github"></i>
                    </a>
                    <a href="https://whatsapp.com" target="_blank" style="color: white; font-size: 28px; transition: all 0.3s ease; opacity: 0.95;" onmouseover="this.style.opacity='1'; this.style.transform='translateY(-3px)'" onmouseout="this.style.opacity='0.95'; this.style.transform='translateY(0)'">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                    <a href="https://telegram.org" target="_blank" style="color: white; font-size: 28px; transition: all 0.3s ease; opacity: 0.95;" onmouseover="this.style.opacity='1'; this.style.transform='translateY(-3px)'" onmouseout="this.style.opacity='0.95'; this.style.transform='translateY(0)'">
                        <i class="fab fa-telegram"></i>
                    </a>
                    <a href="mailto:info@hilaxhospital.com" style="color: white; font-size: 28px; transition: all 0.3s ease; opacity: 0.95;" onmouseover="this.style.opacity='1'; this.style.transform='translateY(-3px)'" onmouseout="this.style.opacity='0.95'; this.style.transform='translateY(0)'">
                        <i class="fas fa-envelope"></i>
                    </a>
                    <a href="tel:+1234567890" style="color: white; font-size: 28px; transition: all 0.3s ease; opacity: 0.95;" onmouseover="this.style.opacity='1'; this.style.transform='translateY(-3px)'" onmouseout="this.style.opacity='0.95'; this.style.transform='translateY(0)'">
                        <i class="fas fa-phone"></i>
                    </a>
                </div>
                <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.2);">
                    <p style="color: rgba(255, 255, 255, 0.85); font-size: 13px; margin: 0;">© ${new Date().getFullYear()} Hilax Hospital. All rights reserved.</p>
                </div>
            </div>
        `;
    }
}
