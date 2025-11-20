// Dashboard Main JavaScript
class Dashboard {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.contentGenerator = null;
        this.patientStorage = new Map(); // In-memory storage for patient data
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadUserData();
        this.setupEventListeners();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    checkAuthentication() {
        const userData = sessionStorage.getItem('currentUser');
        if (!userData) {
            window.location.href = 'index.html';
            return;
        }
        this.currentUser = JSON.parse(userData);
        this.contentGenerator = new ContentFactory(this.currentUser);
        
        // Add role class to body for CSS targeting
        document.body.classList.remove('patient-role', 'admin-role', 'physician-role', 'nurse-role', 'pharmacist-role', 'medtech-role', 'radtech-role');
        if (this.currentUser.role === 'Patient') {
            document.body.classList.add('patient-role');
        }
    }

    loadUserData() {
        if (!this.currentUser) return;

        // Update UI with user data
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userRole').textContent = this.currentUser.role;

        // Load saved patients from localStorage
        this.loadPatientsFromStorage();

        // Build sidebar menu based on role
        this.buildSidebarMenu();

        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loadingScreen').classList.add('fade-out');
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
            }, 500);
        }, 1000);
    }

    buildSidebarMenu() {
        const menuContainer = document.getElementById('sidebarMenu');
        const role = this.currentUser.role;
        const menuItems = ROLE_PERMISSIONS[role]?.menu || [];

        menuContainer.innerHTML = '';

        menuItems.forEach(item => {
            const menuItem = document.createElement('li');
            menuItem.className = 'menu-item';
            menuItem.dataset.page = item.id;
            menuItem.innerHTML = `
                <i class="${item.icon}"></i>
                <span class="menu-text">${item.text}</span>
            `;
            menuItem.addEventListener('click', () => this.loadPage(item.id));
            menuContainer.appendChild(menuItem);
        });

        // Set first menu item as active and load it
        if (menuItems.length > 0) {
            const firstMenuItem = menuContainer.querySelector('.menu-item');
            if (firstMenuItem) {
                firstMenuItem.classList.add('active');
                const firstPageId = firstMenuItem.dataset.page;
                this.loadPageContent(firstPageId);
            }
        }
    }

    loadPage(pageId) {
        this.currentPage = pageId;
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeMenuItem = document.querySelector(`[data-page="${pageId}"]`);
        if (activeMenuItem) {
            activeMenuItem.classList.add('active');
            
            // Update page title
            const menuTextEl = activeMenuItem.querySelector('.menu-text');
            if (menuTextEl) {
                document.getElementById('pageTitle').textContent = menuTextEl.textContent;
            }
        }

        // Load page content
        this.loadPageContent(pageId);
    }

    loadPageContent(pageId) {
        const contentArea = document.getElementById('contentArea');
        
        let pageContent = '';
        switch(pageId) {
            case 'dashboard':
                pageContent = this.contentGenerator.getDashboardContent();
                break;
            case 'all-patients':
                pageContent = this.contentGenerator.getAllPatientsContent();
                break;
            case 'all-staff':
                pageContent = this.contentGenerator.getAllStaffContent();
                break;
            case 'prescriptions':
                pageContent = this.contentGenerator.getPrescriptionsContent();
                break;
            case 'billing':
                pageContent = this.getBillingContent();
                break;
            default:
                pageContent = this.contentGenerator.getDefaultContent(pageId);
        }

        contentArea.innerHTML = pageContent;
        
        // Attach event listeners after content is loaded
        this.attachPageEventListeners(pageId);
    }

    attachPageEventListeners(pageId) {
        // Attach listeners based on the page
        if (pageId === 'all-patients') {
            this.attachPatientPageListeners();
        } else if (pageId === 'dashboard') {
            this.attachDashboardListeners();
        } else if (pageId === 'all-staff') {
            this.attachStaffPageListeners();
        } else if (pageId === 'billing') {
            this.attachBillingPageListeners();
        }
    }

    attachDashboardListeners() {
        const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
        if (addAnnouncementBtn) {
            addAnnouncementBtn.addEventListener('click', () => this.showAddAnnouncementModal());
        }

        const editButtons = document.querySelectorAll('.btn-edit-announcement');
        const deleteButtons = document.querySelectorAll('.btn-delete-announcement');
        const viewMoreBtn = document.getElementById('viewMoreAnnouncementsBtn');
        
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.editAnnouncement(e));
        });
        
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteAnnouncement(e));
        });
        
        if (viewMoreBtn) {
            viewMoreBtn.addEventListener('click', () => this.showAllAnnouncementsModal());
        }
    }

    attachPatientPageListeners() {
        const role = this.currentUser.role;
        
        // Only add listeners for non-patient roles
        if (role !== 'Patient') {
            const editButtons = document.querySelectorAll('.btn-edit');
            const deleteButtons = document.querySelectorAll('.btn-delete');
            const addPatientBtn = document.getElementById('addPatientBtn');
            
            editButtons.forEach(btn => {
                btn.addEventListener('click', (e) => this.editPatient(e));
            });
            
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', (e) => this.deletePatient(e));
            });
            
            if (addPatientBtn) {
                addPatientBtn.addEventListener('click', () => this.addPatient());
            }
            
            // Personal info view buttons
            const viewInfoButtons = document.querySelectorAll('.btn-view-info');
            viewInfoButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const patientId = e.currentTarget.getAttribute('data-patient-id');
                    this.viewPersonalInfo(patientId);
                });
            });
            
            // Billing view buttons
            const viewBillingButtons = document.querySelectorAll('.btn-view-billing');
            viewBillingButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const patientId = e.currentTarget.getAttribute('data-patient-id');
                    this.selectedPatientForBilling = patientId;
                    this.loadPageContent('billing');
                });
            });
        } else {
            // Patient role
            const editProfileBtn = document.getElementById('editPatientBtn');
            if (editProfileBtn) {
                editProfileBtn.addEventListener('click', () => this.editPatientProfile());
            }
        }
    }

    attachStaffPageListeners() {
        const addStaffBtn = document.getElementById('addStaffBtn');
        if (addStaffBtn) {
            addStaffBtn.addEventListener('click', () => this.showAddStaffModal());
        }
    }

    addPatient() {
        this.showAddPatientModal();
    }

    showAddPatientModal() {
        // Generate next patient ID (LIFO - Last In, First Out)
        const nextId = this.generateNextPatientId();
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'addPatientModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add New Patient</h2>
                    <button class="modal-close" id="closeModal">&times;</button>
                </div>
                <form id="addPatientForm" class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="patientId">Patient ID</label>
                            <input type="text" id="patientId" value="${nextId}" disabled readonly>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="surname">Surname *</label>
                            <input type="text" id="surname" required>
                        </div>
                        <div class="form-group">
                            <label for="givenName">Given Name *</label>
                            <input type="text" id="givenName" required>
                        </div>
                    </div>

                    <div class="form-row form-row-small-fields">
                        <div class="form-group form-group-small">
                            <label for="middleInitial">M.I.</label>
                            <input type="text" id="middleInitial" maxlength="1">
                        </div>
                        <div class="form-group form-group-small">
                            <label for="age">Age *</label>
                            <input type="number" id="age" min="0" max="150" required>
                        </div>
                        <div class="form-group">
                            <label for="status">Status *</label>
                            <select id="status" required>
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Admitted">Admitted</option>
                                <option value="Discharged">Discharged</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="doctor">Assigned Doctor *</label>
                            <select id="doctor" required>
                                <option value="">Select Doctor</option>
                                <option value="Dr. Sta. Maria">Dr. Sta. Maria</option>
                                <option value="Dr. Salvador">Dr. Salvador</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="department">Department *</label>
                            <select id="department" required>
                                <option value="">Select Department</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Emergency">Emergency</option>
                                <option value="General Medicine">General Medicine</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Surgery">Surgery</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="recordsUrl">Records (URL/Link)</label>
                            <input type="url" id="recordsUrl" placeholder="https://example.com/records" />
                            <small>Enter a link to patient records, lab results, or medical documents</small>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <button type="button" class="btn btn-info" id="addPersonalInfoBtn">
                                <i class="fas fa-id-card"></i>
                                Add Personal Information
                            </button>
                            <small id="personalInfoStatus" style="display: block; margin-top: 5px; color: #666;">Personal information not added yet</small>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Add Patient</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Store temporary personal info
        this.tempPersonalInfo = null;

        // Event listeners
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('addPatientForm').addEventListener('submit', (e) => this.handleAddPatient(e));
        document.getElementById('addPersonalInfoBtn').addEventListener('click', () => this.showPersonalInfoModal());
    }

    generateNextPatientId() {
        // Extract all current patient IDs from the table (fresh scan each time)
        const rows = document.querySelectorAll('.patients-table tbody tr');
        let maxNumber = 0;
        
        // If no rows exist, start from P001
        if (rows.length === 0) {
            return 'P001';
        }
        
        rows.forEach(row => {
            const idElement = row.querySelector('td:first-child');
            if (idElement) {
                const id = idElement.textContent.trim();
                if (id && id.startsWith('P')) {
                    const num = parseInt(id.substring(1));
                    if (!isNaN(num) && num > maxNumber) {
                        maxNumber = num;
                    }
                }
            }
        });
        
        return `P${String(maxNumber + 1).padStart(3, '0')}`;
    }

    handleAddPatient(e) {
        e.preventDefault();

        const surname = document.getElementById('surname').value.trim();
        const givenName = document.getElementById('givenName').value.trim();
        const middleInitial = document.getElementById('middleInitial').value.trim();
        const age = document.getElementById('age').value;
        const status = document.getElementById('status').value;
        const doctor = document.getElementById('doctor').value;
        const department = document.getElementById('department').value;
        const recordsUrl = document.getElementById('recordsUrl').value.trim();
        const patientId = document.getElementById('patientId').value;

        // Format full name
        const fullName = middleInitial 
            ? `${surname}, ${givenName} ${middleInitial}.`
            : `${surname}, ${givenName}`;

        // Create patient data object
        const patientData = {
            id: patientId,
            fullName: fullName,
            surname: surname,
            givenName: givenName,
            middleInitial: middleInitial,
            age: age,
            status: status,
            doctor: doctor,
            department: department,
            recordsUrl: recordsUrl || null,
            personalInfo: this.tempPersonalInfo || null,
            prescriptions: [],
            labResults: [],
            imagingResults: [],
            vitalSigns: [],
            drugDispensing: []
        };
        
        // Reset temp personal info
        this.tempPersonalInfo = null;

        // Save patient to storage first
        this.savePatientToStorage(patientData);
        
        // Add patient to the list dynamically
        this.addPatientToList(patientId, fullName, age, status, doctor, recordsUrl);
        
        // Close modal
        this.closeModal();
        
        // Show success message
        this.showNotification(`Patient ${patientId} - ${fullName} added successfully!`, 'success');
    }

    addPatientToList(patientId, fullName, age, status, doctor, recordsUrl) {
        const tbody = document.querySelector('.patients-table tbody');
        if (!tbody) return;

        // Determine status badge class
        let statusClass = 'active';
        if (status === 'Discharged') statusClass = 'discharged';
        if (status === 'Admitted') statusClass = 'admitted';
        
        // Get patient data from storage to check for personal info
        const patientData = this.patientStorage.get(patientId);
        const hasPersonalInfo = patientData && patientData.personalInfo;
        const hasBilling = patientData && patientData.billing;
        
        // Generate personal info button
        const personalInfoContent = hasPersonalInfo
            ? `<button class="btn btn-sm btn-view-info" data-patient-id="${patientId}">
                <i class="fas fa-address-card"></i>
                View Info
            </button>`
            : '<span class="no-record">No info</span>';
        
        // Generate billing button
        const billingContent = hasBilling
            ? `<button class="btn btn-sm btn-view-billing" data-patient-id="${patientId}">
                <i class="fas fa-file-invoice-dollar"></i>
                View Billing
            </button>`
            : '<span class="no-record">Not Set</span>';
        
        // Create new patient row
        const newRow = document.createElement('tr');
        newRow.className = 'patient-row';
        
        const editDeleteButtons = `
            <button class="btn btn-sm btn-edit" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-delete" title="Delete">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        
        // Generate records content
        let recordsContent = '<span class="no-record">No file</span>';
        if (recordsUrl) {
            recordsContent = `<a href="${recordsUrl}" target="_blank" class="record-link">
                <i class="fas fa-external-link-alt"></i>
                View Records
            </a>`;
        }
        
        newRow.innerHTML = `
            <td>${patientId}</td>
            <td>${fullName}</td>
            <td>${age}</td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
            <td>${doctor}</td>
            <td>${personalInfoContent}</td>
            <td>${billingContent}</td>
            <td>${recordsContent}</td>
            <td>${editDeleteButtons}</td>
        `;
        
        // Append new row to table body
        tbody.appendChild(newRow);
        
        // Attach event listeners
        const editBtn = newRow.querySelector('.btn-edit');
        const deleteBtn = newRow.querySelector('.btn-delete');
        const viewInfoBtn = newRow.querySelector('.btn-view-info');
        const viewBillingBtn = newRow.querySelector('.btn-view-billing');
        
        editBtn.addEventListener('click', (e) => this.editPatient(e));
        deleteBtn.addEventListener('click', (e) => this.deletePatient(e));
        
        if (viewInfoBtn) {
            viewInfoBtn.addEventListener('click', (e) => {
                const patientId = e.currentTarget.dataset.patientId;
                this.viewPersonalInfo(patientId);
            });
        }
        
        if (viewBillingBtn) {
            viewBillingBtn.addEventListener('click', (e) => {
                const patientId = e.currentTarget.dataset.patientId;
                this.selectedPatientForBilling = patientId;
                this.loadPageContent('billing');
            });
        }
    }

    closeModal() {
        const modal = document.getElementById('addPatientModal');
        if (modal) {
            modal.remove();
        }
    }

    editPatient(event) {
        const patientRow = event.target.closest('tr');
        const patientId = patientRow.querySelector('td:first-child').textContent.trim();
        
        // Get patient data from storage
        const patientData = this.patientStorage.get(patientId);
        if (!patientData) {
            this.showNotification('Patient data not found', 'error');
            return;
        }
        
        this.showEditPatientModal(patientData);
    }

    showEditPatientModal(patientData) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'editPatientModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Patient</h2>
                    <button class="modal-close" id="closeEditModal">&times;</button>
                </div>
                <form id="editPatientForm" class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editPatientId">Patient ID</label>
                            <input type="text" id="editPatientId" value="${patientData.id}" disabled readonly>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="editSurname">Surname *</label>
                            <input type="text" id="editSurname" value="${patientData.surname}" required>
                        </div>
                        <div class="form-group">
                            <label for="editGivenName">Given Name *</label>
                            <input type="text" id="editGivenName" value="${patientData.givenName}" required>
                        </div>
                    </div>

                    <div class="form-row form-row-small-fields">
                        <div class="form-group form-group-small">
                            <label for="editMiddleInitial">M.I.</label>
                            <input type="text" id="editMiddleInitial" value="${patientData.middleInitial || ''}" maxlength="1">
                        </div>
                        <div class="form-group form-group-small">
                            <label for="editAge">Age *</label>
                            <input type="number" id="editAge" value="${patientData.age}" min="0" max="150" required>
                        </div>
                        <div class="form-group">
                            <label for="editStatus">Status *</label>
                            <select id="editStatus" required>
                                <option value="Active" ${patientData.status === 'Active' ? 'selected' : ''}>Active</option>
                                <option value="Admitted" ${patientData.status === 'Admitted' ? 'selected' : ''}>Admitted</option>
                                <option value="Discharged" ${patientData.status === 'Discharged' ? 'selected' : ''}>Discharged</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="editDoctor">Assigned Doctor *</label>
                            <select id="editDoctor" required>
                                <option value="Dr. Sta. Maria" ${patientData.doctor === 'Dr. Sta. Maria' ? 'selected' : ''}>Dr. Sta. Maria</option>
                                <option value="Dr. Salvador" ${patientData.doctor === 'Dr. Salvador' ? 'selected' : ''}>Dr. Salvador</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editDepartment">Department *</label>
                            <select id="editDepartment" required>
                                <option value="">Select Department</option>
                                <option value="Cardiology" ${patientData.department === 'Cardiology' ? 'selected' : ''}>Cardiology</option>
                                <option value="Emergency" ${patientData.department === 'Emergency' ? 'selected' : ''}>Emergency</option>
                                <option value="General Medicine" ${patientData.department === 'General Medicine' ? 'selected' : ''}>General Medicine</option>
                                <option value="Pediatrics" ${patientData.department === 'Pediatrics' ? 'selected' : ''}>Pediatrics</option>
                                <option value="Surgery" ${patientData.department === 'Surgery' ? 'selected' : ''}>Surgery</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group" style="flex: 1;">
                            <label for="editRecordsUrl">Records URL (Link to medical records)</label>
                            <input type="url" id="editRecordsUrl" placeholder="https://example.com/records" value="${patientData.recordsUrl || ''}">
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                        <button type="button" class="btn btn-secondary" id="cancelEditBtn">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('closeEditModal').addEventListener('click', () => this.closeEditModal());
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.closeEditModal());
        document.getElementById('editPatientForm').addEventListener('submit', (e) => this.handleEditPatient(e));
    }

    handleEditPatient(e) {
        e.preventDefault();

        const patientId = document.getElementById('editPatientId').value;
        const surname = document.getElementById('editSurname').value.trim();
        const givenName = document.getElementById('editGivenName').value.trim();
        const middleInitial = document.getElementById('editMiddleInitial').value.trim();
        const age = document.getElementById('editAge').value;
        const status = document.getElementById('editStatus').value;
        const doctor = document.getElementById('editDoctor').value;
        const department = document.getElementById('editDepartment').value;
        const recordsUrl = document.getElementById('editRecordsUrl').value.trim();

        // Format full name
        const fullName = middleInitial 
            ? `${surname}, ${givenName} ${middleInitial}.`
            : `${surname}, ${givenName}`;

        // Update patient data object
        const patientData = {
            id: patientId,
            fullName: fullName,
            surname: surname,
            givenName: givenName,
            middleInitial: middleInitial,
            age: age,
            status: status,
            doctor: doctor,
            department: department,
            recordsUrl: recordsUrl || null
        };

        // Update storage
        this.savePatientToStorage(patientData);
        
        // Update the table row
        this.updatePatientRow(patientId, fullName, age, status, doctor, recordsUrl);
        
        // Close modal
        this.closeEditModal();
        
        // Show success message
        this.showNotification(`Patient ${patientId} updated successfully!`, 'success');
    }

    updatePatientRow(patientId, fullName, age, status, doctor, recordsUrl) {
        const rows = document.querySelectorAll('.patients-table tbody tr');
        
        rows.forEach(row => {
            const id = row.querySelector('td:first-child').textContent.trim();
            if (id === patientId) {
                // Determine status badge class
                let statusClass = 'active';
                if (status === 'Discharged') statusClass = 'discharged';
                if (status === 'Admitted') statusClass = 'admitted';
                
                // Generate records content
                let recordsContent = '<span class="no-record">No file</span>';
                if (recordsUrl) {
                    recordsContent = `<a href="${recordsUrl}" target="_blank" class="record-link">
                        <i class="fas fa-external-link-alt"></i>
                        View Records
                    </a>`;
                }
                
                // Update cells
                row.querySelector('td:nth-child(2)').textContent = fullName;
                row.querySelector('td:nth-child(3)').textContent = age;
                row.querySelector('td:nth-child(4)').innerHTML = `<span class="status-badge ${statusClass}">${status}</span>`;
                row.querySelector('td:nth-child(5)').textContent = doctor;
                row.querySelector('td:nth-child(6)').innerHTML = recordsContent;
            }
        });
    }

    closeEditModal() {
        const modal = document.getElementById('editPatientModal');
        if (modal) {
            modal.remove();
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification-modal';
        notification.innerHTML = `
            <div class="notification-content ${type}">
                <div class="notification-icon">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                </div>
                <p class="notification-message">${message}</p>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    showConfirmModal(message, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'confirmModal';
        modal.innerHTML = `
            <div class="modal-content confirm-modal">
                <div class="modal-header">
                    <h2>Confirm Action</h2>
                    <button class="modal-close" id="closeConfirmModal">&times;</button>
                </div>
                <div class="confirm-body">
                    <div class="confirm-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <p class="confirm-message">${message}</p>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" id="cancelConfirmBtn">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteBtn">
                        <i class="fas fa-trash"></i> Yes, Delete
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        document.getElementById('closeConfirmModal').addEventListener('click', () => {
            modal.remove();
        });
        
        document.getElementById('cancelConfirmBtn').addEventListener('click', () => {
            modal.remove();
        });
        
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            modal.remove();
            onConfirm();
        });
    }

    deletePatient(event) {
        const patientRow = event.target.closest('tr');
        const patientId = patientRow.querySelector('td:first-child').textContent;
        
        this.showConfirmModal(
            `Are you sure you want to delete patient ${patientId}?`,
            () => {
                // Remove row from table
                patientRow.remove();
                
                // Remove from storage
                this.deletePatientFromStorage(patientId);
                
                // Renumber all remaining patients
                this.renumberPatientIds();
                
                // Update IDs in storage
                this.updateStorageAfterRenumber();
                
                this.showNotification(`Deleted Patient: ${patientId}`, 'success');
            }
        );
    }

    renumberPatientIds() {
        const rows = document.querySelectorAll('.patients-table tbody tr');
        let counter = 1;
        
        rows.forEach((row) => {
            const idCell = row.querySelector('td:first-child');
            if (idCell) {
                const newId = `P${String(counter).padStart(3, '0')}`;
                idCell.textContent = newId;
                counter++;
            }
        });
    }

    editPatientProfile() {
        alert('Edit Profile functionality - coming soon!');
        // TODO: Implement edit profile modal/form for patient
    }

    updateRecordsCell(patientId, recordsUrl) {
        // Find the patient row and update the records cell
        const rows = document.querySelectorAll('.patients-table tbody tr');
        rows.forEach(row => {
            const id = row.querySelector('td:first-child').textContent.trim();
            if (id === patientId) {
                const recordsCell = row.querySelector('.records-column');
                if (recordsCell) {
                    recordsCell.innerHTML = `
                        <a href="${recordsUrl}" target="_blank" class="record-link" title="View Records">
                            <i class="fas fa-external-link-alt"></i>
                            <span>View</span>
                        </a>
                    `;
                }
            }
        });
    }

    previewFile(patientId) {
        if (!window.patientFiles || !window.patientFiles[patientId]) {
            this.showNotification('No file available for this patient', 'error');
            return;
        }
        
        const file = window.patientFiles[patientId];
        const fileType = file.type;
        const fileName = file.name;
        
        const previewModal = document.createElement('div');
        previewModal.className = 'modal-overlay';
        previewModal.id = 'previewModal';
        
        let previewContent = '';
        
        if (fileType.startsWith('image/')) {
            // Preview image
            const blob = new Blob([file.data], { type: fileType });
            const url = URL.createObjectURL(blob);
            previewContent = `<img src="${url}" style="max-width: 100%; max-height: 80vh; border-radius: 8px;">`;
        } else if (fileType === 'application/pdf') {
            // For PDF, show file info and download option
            previewContent = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-file-pdf" style="font-size: 80px; color: #e74c3c; margin-bottom: 20px; display: block;"></i>
                    <h3>PDF Document</h3>
                    <p>${fileName}</p>
                    <p style="color: #888; font-size: 14px;">${(file.size / 1024).toFixed(2)} KB</p>
                    <p style="margin-top: 20px; color: #666; font-size: 13px;">PDF preview requires a PDF viewer plugin</p>
                </div>
            `;
        } else {
            // For other documents
            previewContent = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-file" style="font-size: 80px; color: #3498db; margin-bottom: 20px; display: block;"></i>
                    <h3>${fileName}</h3>
                    <p style="color: #888; font-size: 14px;">${(file.size / 1024).toFixed(2)} KB</p>
                </div>
            `;
        }
        
        previewModal.innerHTML = `
            <div class="modal-content preview-modal">
                <div class="modal-header">
                    <h2>${fileName}</h2>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-sm" id="downloadBtn" style="background: var(--info-blue); color: white; border: none; padding: 8px 16px;">
                            <i class="fas fa-download"></i>
                            Download
                        </button>
                        <button class="modal-close" id="closePreview">&times;</button>
                    </div>
                </div>
                <div class="modal-preview-body">
                    ${previewContent}
                </div>
            </div>
        `;
        
        document.body.appendChild(previewModal);
        
        // Download button handler
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadFile(fileName, file.data, fileType);
        });
        
        document.getElementById('closePreview').addEventListener('click', () => previewModal.remove());
        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) previewModal.remove();
        });
    }

    downloadFile(fileName, fileData, fileType) {
        const blob = new Blob([fileData], { type: fileType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });

        // Menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('collapsed');
        });
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('currentTime').textContent = `${dateString} • ${timeString}`;
    }

    savePatientToStorage(patientData) {
        try {
            // Store in memory map
            this.patientStorage.set(patientData.id, patientData);
            
            // Convert map to array and save to localStorage
            const patientsArray = Array.from(this.patientStorage.values());
            localStorage.setItem('patients', JSON.stringify(patientsArray));
        } catch (error) {
            console.error('Error saving patient to localStorage:', error);
        }
    }

    deletePatientFromStorage(patientId) {
        try {
            this.patientStorage.delete(patientId);
            const patientsArray = Array.from(this.patientStorage.values());
            localStorage.setItem('patients', JSON.stringify(patientsArray));
        } catch (error) {
            console.error('Error deleting patient from localStorage:', error);
        }
    }

    loadPatientsFromStorage() {
        try {
            const stored = localStorage.getItem('patients');
            if (stored) {
                const patientsArray = JSON.parse(stored);
                patientsArray.forEach(patient => {
                    this.patientStorage.set(patient.id, patient);
                });
            }
        } catch (error) {
            console.error('Error loading patients from localStorage:', error);
        }
    }

    updateStorageAfterRenumber() {
        try {
            const rows = document.querySelectorAll('.patients-table tbody tr');
            const updatedPatients = new Map();
            
            rows.forEach((row) => {
                const idCell = row.querySelector('td:first-child');
                const nameCell = row.querySelector('td:nth-child(2)');
                
                if (idCell && nameCell) {
                    const newId = idCell.textContent.trim();
                    const name = nameCell.textContent.trim();
                    
                    // Find the original patient data
                    let patientData = null;
                    for (let [oldId, patient] of this.patientStorage) {
                        if (patient.fullName === name) {
                            patientData = patient;
                            break;
                        }
                    }
                    
                    if (patientData) {
                        // Update the ID
                        patientData.id = newId;
                        updatedPatients.set(newId, patientData);
                    }
                }
            });
            
            this.patientStorage = updatedPatients;
            const patientsArray = Array.from(this.patientStorage.values());
            localStorage.setItem('patients', JSON.stringify(patientsArray));
        } catch (error) {
            console.error('Error updating storage after renumber:', error);
        }
    }

    // Announcement Management
    showAddAnnouncementModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content announcement-modal">
                <div class="modal-header">
                    <h3>Add New Announcement</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <form id="announcementForm" class="modal-form">
                    <div class="form-group">
                        <label for="announcementTitle">Title *</label>
                        <input type="text" id="announcementTitle" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="announcementDescription">Description *</label>
                        <textarea id="announcementDescription" rows="4" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Visible To *</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="All" id="visibleAll">
                                <span>All Staff</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="HR/Admin">
                                <span>HR/Admin</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="Physician">
                                <span>Physician</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="Nurse">
                                <span>Nurse</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="Pharmacist">
                                <span>Pharmacist</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="MedTech">
                                <span>MedTech</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="RadTech">
                                <span>RadTech</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="Patient">
                                <span>Patient</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                        <button type="submit" class="btn btn-primary">Add Announcement</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const form = modal.querySelector('#announcementForm');
        const visibleAllCheckbox = modal.querySelector('#visibleAll');
        const otherCheckboxes = modal.querySelectorAll('input[name="visibleTo"]:not(#visibleAll)');
        
        // Handle "All" checkbox
        visibleAllCheckbox.addEventListener('change', () => {
            if (visibleAllCheckbox.checked) {
                otherCheckboxes.forEach(cb => {
                    cb.checked = false;
                    cb.disabled = true;
                });
            } else {
                otherCheckboxes.forEach(cb => cb.disabled = false);
            }
        });
        
        closeBtn.addEventListener('click', () => modal.remove());
        cancelBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddAnnouncement(form);
            modal.remove();
        });
    }

    handleAddAnnouncement(form) {
        const title = form.querySelector('#announcementTitle').value;
        const description = form.querySelector('#announcementDescription').value;
        const checkboxes = form.querySelectorAll('input[name="visibleTo"]:checked');
        const visibleTo = Array.from(checkboxes).map(cb => cb.value);
        
        if (visibleTo.length === 0) {
            this.showNotification('Please select at least one role', 'error');
            return;
        }
        
        const announcement = {
            id: Date.now().toString(),
            title,
            description,
            visibleTo,
            date: new Date().toISOString()
        };
        
        // Load existing announcements
        let announcements = [];
        try {
            const stored = localStorage.getItem('announcements');
            if (stored) {
                announcements = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
        
        announcements.unshift(announcement);
        localStorage.setItem('announcements', JSON.stringify(announcements));
        
        this.showNotification('Announcement added successfully!', 'success');
        this.loadPageContent('dashboard');
    }

    editAnnouncement(e) {
        const btn = e.target.closest('.btn-edit-announcement');
        const announcementId = btn.dataset.id;
        
        // Load announcements
        let announcements = [];
        try {
            const stored = localStorage.getItem('announcements');
            if (stored) {
                announcements = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading announcements:', error);
            return;
        }
        
        const announcement = announcements.find(a => a.id === announcementId);
        if (!announcement) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content announcement-modal">
                <div class="modal-header">
                    <h3>Edit Announcement</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <form id="editAnnouncementForm" class="modal-form">
                    <div class="form-group">
                        <label for="editAnnouncementTitle">Title *</label>
                        <input type="text" id="editAnnouncementTitle" value="${announcement.title}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="editAnnouncementDescription">Description *</label>
                        <textarea id="editAnnouncementDescription" rows="4" required>${announcement.description}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Visible To *</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="All" id="editVisibleAll" ${announcement.visibleTo.includes('All') ? 'checked' : ''}>
                                <span>All Staff</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="HR/Admin" ${announcement.visibleTo.includes('HR/Admin') ? 'checked' : ''}>
                                <span>HR/Admin</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="Physician" ${announcement.visibleTo.includes('Physician') ? 'checked' : ''}>
                                <span>Physician</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="Nurse" ${announcement.visibleTo.includes('Nurse') ? 'checked' : ''}>
                                <span>Nurse</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="Pharmacist" ${announcement.visibleTo.includes('Pharmacist') ? 'checked' : ''}>
                                <span>Pharmacist</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="MedTech" ${announcement.visibleTo.includes('MedTech') ? 'checked' : ''}>
                                <span>MedTech</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="RadTech" ${announcement.visibleTo.includes('RadTech') ? 'checked' : ''}>
                                <span>RadTech</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="visibleTo" value="Patient" ${announcement.visibleTo.includes('Patient') ? 'checked' : ''}>
                                <span>Patient</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Announcement</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const form = modal.querySelector('#editAnnouncementForm');
        const visibleAllCheckbox = modal.querySelector('#editVisibleAll');
        const otherCheckboxes = modal.querySelectorAll('input[name="visibleTo"]:not(#editVisibleAll)');
        
        // Handle "All" checkbox
        visibleAllCheckbox.addEventListener('change', () => {
            if (visibleAllCheckbox.checked) {
                otherCheckboxes.forEach(cb => {
                    cb.checked = false;
                    cb.disabled = true;
                });
            } else {
                otherCheckboxes.forEach(cb => cb.disabled = false);
            }
        });
        
        // Check initial state
        if (visibleAllCheckbox.checked) {
            otherCheckboxes.forEach(cb => cb.disabled = true);
        }
        
        closeBtn.addEventListener('click', () => modal.remove());
        cancelBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditAnnouncement(form, announcementId);
            modal.remove();
        });
    }

    handleEditAnnouncement(form, announcementId) {
        const title = form.querySelector('#editAnnouncementTitle').value;
        const description = form.querySelector('#editAnnouncementDescription').value;
        const checkboxes = form.querySelectorAll('input[name="visibleTo"]:checked');
        const visibleTo = Array.from(checkboxes).map(cb => cb.value);
        
        if (visibleTo.length === 0) {
            this.showNotification('Please select at least one role', 'error');
            return;
        }
        
        // Load existing announcements
        let announcements = [];
        try {
            const stored = localStorage.getItem('announcements');
            if (stored) {
                announcements = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading announcements:', error);
            return;
        }
        
        const index = announcements.findIndex(a => a.id === announcementId);
        if (index !== -1) {
            announcements[index] = {
                ...announcements[index],
                title,
                description,
                visibleTo
            };
            
            localStorage.setItem('announcements', JSON.stringify(announcements));
            this.showNotification('Announcement updated successfully!', 'success');
            this.loadPageContent('dashboard');
        }
    }

    deleteAnnouncement(e) {
        const btn = e.target.closest('.btn-delete-announcement');
        const announcementId = btn.dataset.id;
        
        this.showConfirmModal('Are you sure you want to delete this announcement?', () => {
            // Load existing announcements
            let announcements = [];
            try {
                const stored = localStorage.getItem('announcements');
                if (stored) {
                    announcements = JSON.parse(stored);
                }
            } catch (error) {
                console.error('Error loading announcements:', error);
                return;
            }
            
            announcements = announcements.filter(a => a.id !== announcementId);
            localStorage.setItem('announcements', JSON.stringify(announcements));
            
            this.showNotification('Announcement deleted successfully!', 'success');
            this.loadPageContent('dashboard');
        });
    }

    // Personal Information Modal Methods
    showPersonalInfoModal(existingData = null) {
        const isEditMode = existingData !== null;
        const modalTitle = isEditMode ? 'Edit Personal Information' : 'Add Personal Information';
        const submitButtonText = isEditMode ? 'Update Information' : 'Save Information';
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'personalInfoModal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>${modalTitle}</h2>
                    <button class="modal-close" id="closePersonalInfoModal">&times;</button>
                </div>
                <form id="personalInfoForm" class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="height">Height (cm) *</label>
                            <input type="number" id="height" min="50" max="300" value="${existingData?.height || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="weight">Weight (kg) *</label>
                            <input type="number" id="weight" min="1" max="500" step="0.1" value="${existingData?.weight || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="bloodType">Blood Type *</label>
                            <select id="bloodType" required>
                                <option value="">Select Blood Type</option>
                                <option value="A+" ${existingData?.bloodType === 'A+' ? 'selected' : ''}>A+</option>
                                <option value="A-" ${existingData?.bloodType === 'A-' ? 'selected' : ''}>A-</option>
                                <option value="B+" ${existingData?.bloodType === 'B+' ? 'selected' : ''}>B+</option>
                                <option value="B-" ${existingData?.bloodType === 'B-' ? 'selected' : ''}>B-</option>
                                <option value="AB+" ${existingData?.bloodType === 'AB+' ? 'selected' : ''}>AB+</option>
                                <option value="AB-" ${existingData?.bloodType === 'AB-' ? 'selected' : ''}>AB-</option>
                                <option value="O+" ${existingData?.bloodType === 'O+' ? 'selected' : ''}>O+</option>
                                <option value="O-" ${existingData?.bloodType === 'O-' ? 'selected' : ''}>O-</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="birthday">Birthday *</label>
                            <input type="date" id="birthday" value="${existingData?.birthday || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="contactInfo">Contact Number *</label>
                            <input type="tel" id="contactInfo" placeholder="+63 912 345 6789" value="${existingData?.contactInfo || ''}" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="address">Address *</label>
                            <input type="text" id="address" placeholder="Enter full address" value="${existingData?.address || ''}" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="emergencyContactPerson">Emergency Contact Person *</label>
                            <input type="text" id="emergencyContactPerson" value="${existingData?.emergencyContactPerson || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="emergencyContactNumber">Emergency Contact Number *</label>
                            <input type="tel" id="emergencyContactNumber" placeholder="+63 912 345 6789" value="${existingData?.emergencyContactNumber || ''}" required>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" id="cancelPersonalInfoBtn">Cancel</button>
                        <button type="submit" class="btn btn-primary">${submitButtonText}</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('closePersonalInfoModal').addEventListener('click', () => modal.remove());
        document.getElementById('cancelPersonalInfoBtn').addEventListener('click', () => modal.remove());
        document.getElementById('personalInfoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePersonalInfoSubmit(e, isEditMode);
            modal.remove();
        });
    }

    handlePersonalInfoSubmit(e, isEditMode = false) {
        const personalInfo = {
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            bloodType: document.getElementById('bloodType').value,
            birthday: document.getElementById('birthday').value,
            address: document.getElementById('address').value,
            contactInfo: document.getElementById('contactInfo').value,
            emergencyContactPerson: document.getElementById('emergencyContactPerson').value,
            emergencyContactNumber: document.getElementById('emergencyContactNumber').value
        };

        if (isEditMode) {
            // In edit mode, update the patient in localStorage
            const patientId = this.editingPatientId;
            let patients = [];
            try {
                const stored = localStorage.getItem('patients');
                if (stored) {
                    patients = JSON.parse(stored);
                }
            } catch (error) {
                console.error('Error loading patients:', error);
                return;
            }

            const patientIndex = patients.findIndex(p => p.id === patientId);
            if (patientIndex !== -1) {
                patients[patientIndex].personalInfo = personalInfo;
                localStorage.setItem('patients', JSON.stringify(patients));
                this.editingPatientId = null; // Clear the editing patient ID
                this.showNotification('Personal information updated successfully!', 'success');
                this.loadPageContent('allPatients');
            } else {
                this.showNotification('Patient not found!', 'error');
            }
        } else {
            // In add mode, store temporarily
            this.tempPersonalInfo = personalInfo;
            
            // Update status text in Add Patient modal
            const statusEl = document.getElementById('personalInfoStatus');
            if (statusEl) {
                statusEl.textContent = 'Personal information added ✓';
                statusEl.style.color = '#28a745';
            }
            
            this.showNotification('Personal information added! Complete the patient form to save.', 'success');
        }
    }

    viewPersonalInfo(patientId) {
        // Load patient data
        let patients = [];
        try {
            const stored = localStorage.getItem('patients');
            if (stored) {
                patients = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading patients:', error);
            return;
        }

        const patient = patients.find(p => p.id === patientId);
        if (!patient || !patient.personalInfo) {
            this.showNotification('Personal information not found', 'error');
            return;
        }

        const info = patient.personalInfo;
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'viewPersonalInfoModal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>Personal Information - ${patient.fullName}</h2>
                    <button class="modal-close" id="closeViewInfoModal">&times;</button>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <div class="info-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Height</label>
                            <p style="margin: 0; font-size: 16px;">${info.height} cm</p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Weight</label>
                            <p style="margin: 0; font-size: 16px;">${info.weight} kg</p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Blood Type</label>
                            <p style="margin: 0; font-size: 16px;">${info.bloodType}</p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Birthday</label>
                            <p style="margin: 0; font-size: 16px;">${new Date(info.birthday).toLocaleDateString()}</p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Contact Number</label>
                            <p style="margin: 0; font-size: 16px;">${info.contactInfo}</p>
                        </div>
                        <div class="info-item" style="grid-column: 1 / -1;">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Address</label>
                            <p style="margin: 0; font-size: 16px;">${info.address}</p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Emergency Contact Person</label>
                            <p style="margin: 0; font-size: 16px;">${info.emergencyContactPerson}</p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Emergency Contact Number</label>
                            <p style="margin: 0; font-size: 16px;">${info.emergencyContactNumber}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-primary" id="editPersonalInfoBtn">
                        <i class="fas fa-edit"></i>
                        Edit Information
                    </button>
                    <button type="button" class="btn btn-secondary" id="closeInfoBtn">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('closeViewInfoModal').addEventListener('click', () => modal.remove());
        document.getElementById('closeInfoBtn').addEventListener('click', () => modal.remove());
        document.getElementById('editPersonalInfoBtn').addEventListener('click', () => {
            this.editingPatientId = patientId;
            modal.remove();
            this.showPersonalInfoModal(info);
        });
    }

    // View All Announcements Modal
    showAllAnnouncementsModal() {
        const role = this.currentUser.role;
        
        // Load announcements from localStorage
        let allAnnouncements = [];
        try {
            const stored = localStorage.getItem('announcements');
            if (stored) {
                allAnnouncements = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
        
        // Filter announcements for current role
        const visibleAnnouncements = allAnnouncements.filter(announcement => 
            announcement.visibleTo.includes(role) || announcement.visibleTo.includes('All')
        );
        
        // Sort by date (newest first)
        visibleAnnouncements.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let announcementsList = '';
        if (visibleAnnouncements.length > 0) {
            announcementsList = visibleAnnouncements.map(announcement => {
                const isAdmin = role === 'HR/Admin';
                
                return `
                    <div class="announcement-item" style="border-bottom: 1px solid #f0f0f0; padding: 25px 0; margin-bottom: 15px;">
                        <div class="announcement-header" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                            <h4 style="margin: 0; font-size: 16px; font-weight: 600; color: var(--text-dark);">${announcement.title}</h4>
                            <span class="announcement-date" style="font-size: 12px; color: #999; white-space: nowrap; margin-left: 15px;">${new Date(announcement.date).toLocaleDateString()}</span>
                        </div>
                        <p style="margin: 0; color: #666; line-height: 1.6; margin-bottom: ${isAdmin ? '15px' : '0'};">${announcement.description}</p>
                        ${isAdmin ? `
                            <div style="display: flex; gap: 10px; margin-top: 10px;">
                                <button class="btn btn-sm btn-edit-announcement-modal" data-id="${announcement.id}" style="padding: 6px 12px; font-size: 13px; background: var(--secondary-pink); color: white; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-delete-announcement-modal" data-id="${announcement.id}" style="padding: 6px 12px; font-size: 13px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                                    <i class="fas fa-trash-alt"></i> Delete
                                </button>
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('');
        } else {
            announcementsList = '<p style="text-align: center; color: #999; padding: 40px;">No announcements at this time.</p>';
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'allAnnouncementsModal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; max-height: 90vh;">
                <div class="modal-header">
                    <h2><i class="fas fa-bullhorn"></i> All Announcements</h2>
                    <button class="modal-close" id="closeAnnouncementsModal">&times;</button>
                </div>
                <div class="modal-body" style="max-height: calc(90vh - 120px); overflow-y: auto; padding: 0 25px;">
                    ${announcementsList}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        document.getElementById('closeAnnouncementsModal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Edit and delete buttons in modal
        const editBtnsModal = modal.querySelectorAll('.btn-edit-announcement-modal');
        const deleteBtnsModal = modal.querySelectorAll('.btn-delete-announcement-modal');
        
        editBtnsModal.forEach(btn => {
            btn.addEventListener('click', (e) => {
                modal.remove();
                this.editAnnouncement(e);
            });
        });
        
        deleteBtnsModal.forEach(btn => {
            btn.addEventListener('click', (e) => {
                modal.remove();
                this.deleteAnnouncement(e);
            });
        });
    }

    // Staff Management Methods
    showAddStaffModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'addStaffModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add New Staff Member</h2>
                    <button class="modal-close" id="closeStaffModal">&times;</button>
                </div>
                <form id="addStaffForm" class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="staffName">Full Name *</label>
                            <input type="text" id="staffName" placeholder="Enter full name" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="staffDepartment">Department *</label>
                            <select id="staffDepartment" required>
                                <option value="">Select Department</option>
                                <option value="Medical">Medical</option>
                                <option value="Nursing">Nursing</option>
                                <option value="Pharmacy">Pharmacy</option>
                                <option value="Laboratory">Laboratory</option>
                                <option value="Radiology">Radiology</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="staffPosition">Position *</label>
                            <select id="staffPosition" required>
                                <option value="">Select Position</option>
                                <option value="Director">Director</option>
                                <option value="Physician">Physician</option>
                                <option value="Nurse">Nurse</option>
                                <option value="Pharmacist">Pharmacist</option>
                                <option value="Medical Technologist">Medical Technologist</option>
                                <option value="Radiologic Technologist">Radiologic Technologist</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="staffTitle">Job Title</label>
                            <input type="text" id="staffTitle" placeholder="e.g., Chief Physician, Head Nurse">
                        </div>
                        <div class="form-group">
                            <label for="staffCredentials">Credentials</label>
                            <input type="text" id="staffCredentials" placeholder="e.g., RN, RPh, MD">
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" id="cancelStaffBtn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Add Staff Member</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('closeStaffModal').addEventListener('click', () => modal.remove());
        document.getElementById('cancelStaffBtn').addEventListener('click', () => modal.remove());
        document.getElementById('addStaffForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddStaff(e);
            modal.remove();
        });
    }

    handleAddStaff(e) {
        const staffName = document.getElementById('staffName').value.trim();
        const department = document.getElementById('staffDepartment').value;
        const position = document.getElementById('staffPosition').value;
        const title = document.getElementById('staffTitle').value.trim();
        const credentials = document.getElementById('staffCredentials').value.trim();

        // Format display name
        let displayName = staffName;
        if (credentials) {
            displayName += `, ${credentials}`;
        }

        // Create staff data object
        const staffData = {
            id: Date.now().toString(),
            name: staffName,
            displayName: displayName,
            department: department,
            position: position,
            title: title || position,
            credentials: credentials,
            dateAdded: new Date().toISOString()
        };

        // Save to localStorage
        this.saveStaffToStorage(staffData);

        // Show success message
        this.showNotification(`${displayName} added successfully to ${department} department!`, 'success');

        // Reload the staff page
        this.loadPageContent('all-staff');
    }

    saveStaffToStorage(staffData) {
        let staff = [];
        try {
            const stored = localStorage.getItem('staff');
            if (stored) {
                staff = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading staff:', error);
        }

        // Add new staff to beginning of array (LIFO)
        staff.unshift(staffData);
        
        try {
            localStorage.setItem('staff', JSON.stringify(staff));
        } catch (error) {
            console.error('Error saving staff:', error);
        }
    }

    // Billing Management Methods
    getBillingContent() {
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

        // Generate patient rows for billing
        let patientRows = '';
        patients.forEach(patient => {
            const hasBilling = patient.billing ? true : false;
            const billingStatus = hasBilling ? 
                '<span class="status-badge active">Billed</span>' : 
                '<span class="status-badge discharged">Not Billed</span>';
            
            const actionButton = hasBilling ?
                `<button class="btn btn-sm btn-view-receipt" data-patient-id="${patient.id}">
                    <i class="fas fa-receipt"></i>
                    View Receipt
                </button>` :
                `<button class="btn btn-sm btn-create-billing" data-patient-id="${patient.id}">
                    <i class="fas fa-plus"></i>
                    Create Billing
                </button>`;

            patientRows += `
                <tr>
                    <td>${patient.id}</td>
                    <td>${patient.fullName}</td>
                    <td>${patient.age}</td>
                    <td>${billingStatus}</td>
                    <td>${actionButton}</td>
                </tr>
            `;
        });

        return `
            <div class="billing-management">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-file-invoice-dollar"></i>
                            Billing Management
                        </h3>
                    </div>
                    <div class="card-content">
                        <table class="patients-table">
                            <thead>
                                <tr>
                                    <th style="width: 15%;">Patient ID</th>
                                    <th style="width: 35%;">Name</th>
                                    <th style="width: 10%;">Age</th>
                                    <th style="width: 20%;">Billing Status</th>
                                    <th style="width: 20%;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${patientRows || '<tr><td colspan="5" style="text-align: center;">No patients found</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    attachBillingPageListeners() {
        const createBillingBtns = document.querySelectorAll('.btn-create-billing');
        const viewReceiptBtns = document.querySelectorAll('.btn-view-receipt');

        createBillingBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const patientId = e.currentTarget.getAttribute('data-patient-id');
                this.showBillingForm(patientId);
            });
        });

        viewReceiptBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const patientId = e.currentTarget.getAttribute('data-patient-id');
                this.showBillingReceipt(patientId);
            });
        });

        // If a patient was selected from patients page, show form automatically
        if (this.selectedPatientForBilling) {
            const patientId = this.selectedPatientForBilling;
            this.selectedPatientForBilling = null; // Clear selection
            
            // Check if patient already has billing
            const patients = JSON.parse(localStorage.getItem('patients') || '[]');
            const patient = patients.find(p => p.id === patientId);
            
            if (patient && patient.billing) {
                this.showBillingReceipt(patientId);
            } else {
                this.showBillingForm(patientId);
            }
        }
    }

    showBillingForm(patientId) {
        // Get patient data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);
        
        if (!patient) {
            this.showNotification('Patient not found', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'billingFormModal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2><i class="fas fa-file-invoice-dollar"></i> Create Billing - ${patient.fullName} (${patientId})</h2>
                    <button class="modal-close" id="closeBillingModal">&times;</button>
                </div>
                <form id="billingForm" class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="roomCharges">Room Charges (₱) *</label>
                            <input type="number" id="roomCharges" min="0" step="0.01" value="0" required>
                        </div>
                        <div class="form-group">
                            <label for="consultationFee">Consultation Fee (₱) *</label>
                            <input type="number" id="consultationFee" min="0" step="0.01" value="0" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="labTests">Laboratory Tests (₱) *</label>
                            <input type="number" id="labTests" min="0" step="0.01" value="0" required>
                        </div>
                        <div class="form-group">
                            <label for="medications">Medications (₱) *</label>
                            <input type="number" id="medications" min="0" step="0.01" value="0" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="procedures">Procedures/Surgeries (₱) *</label>
                            <input type="number" id="procedures" min="0" step="0.01" value="0" required>
                        </div>
                        <div class="form-group">
                            <label for="imaging">Imaging/Radiology (₱) *</label>
                            <input type="number" id="imaging" min="0" step="0.01" value="0" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="otherCharges">Other Charges (₱)</label>
                            <input type="number" id="otherCharges" min="0" step="0.01" value="0">
                        </div>
                        <div class="form-group">
                            <label for="discount">Discount (%) *</label>
                            <input type="number" id="discount" min="0" max="100" step="0.01" value="0" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group" style="flex: 1;">
                            <label for="notes">Notes/Remarks</label>
                            <textarea id="notes" rows="2" placeholder="Additional notes or remarks"></textarea>
                        </div>
                    </div>

                    <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 10px 0; color: var(--dark-pink);">Billing Summary</h4>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>Subtotal:</span>
                            <span id="subtotal" style="font-weight: 600;">₱0.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>Discount:</span>
                            <span id="discountAmount" style="font-weight: 600; color: #28a745;">-₱0.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 2px solid var(--dark-pink);">
                            <span style="font-size: 18px; font-weight: 700;">Total Amount:</span>
                            <span id="totalAmount" style="font-size: 18px; font-weight: 700; color: var(--dark-pink);">₱0.00</span>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" id="cancelBillingBtn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Generate Billing</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Calculate total on input change
        const inputs = modal.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculateBillingTotal());
        });

        // Event listeners
        document.getElementById('closeBillingModal').addEventListener('click', () => modal.remove());
        document.getElementById('cancelBillingBtn').addEventListener('click', () => modal.remove());
        document.getElementById('billingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBillingSubmit(patientId);
            modal.remove();
        });

        // Initial calculation
        this.calculateBillingTotal();
    }

    calculateBillingTotal() {
        const roomCharges = parseFloat(document.getElementById('roomCharges')?.value || 0);
        const consultationFee = parseFloat(document.getElementById('consultationFee')?.value || 0);
        const labTests = parseFloat(document.getElementById('labTests')?.value || 0);
        const medications = parseFloat(document.getElementById('medications')?.value || 0);
        const procedures = parseFloat(document.getElementById('procedures')?.value || 0);
        const imaging = parseFloat(document.getElementById('imaging')?.value || 0);
        const otherCharges = parseFloat(document.getElementById('otherCharges')?.value || 0);
        const discountPercent = parseFloat(document.getElementById('discount')?.value || 0);

        const subtotal = roomCharges + consultationFee + labTests + medications + procedures + imaging + otherCharges;
        const discountAmount = subtotal * (discountPercent / 100);
        const total = subtotal - discountAmount;

        document.getElementById('subtotal').textContent = `₱${subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        document.getElementById('discountAmount').textContent = `-₱${discountAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        document.getElementById('totalAmount').textContent = `₱${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }

    handleBillingSubmit(patientId) {
        const billingData = {
            patientId: patientId,
            date: new Date().toISOString(),
            roomCharges: parseFloat(document.getElementById('roomCharges').value),
            consultationFee: parseFloat(document.getElementById('consultationFee').value),
            labTests: parseFloat(document.getElementById('labTests').value),
            medications: parseFloat(document.getElementById('medications').value),
            procedures: parseFloat(document.getElementById('procedures').value),
            imaging: parseFloat(document.getElementById('imaging').value),
            otherCharges: parseFloat(document.getElementById('otherCharges').value),
            discount: parseFloat(document.getElementById('discount').value),
            notes: document.getElementById('notes').value,
            subtotal: 0,
            discountAmount: 0,
            total: 0
        };

        // Calculate totals
        billingData.subtotal = billingData.roomCharges + billingData.consultationFee + billingData.labTests + 
                               billingData.medications + billingData.procedures + billingData.imaging + billingData.otherCharges;
        billingData.discountAmount = billingData.subtotal * (billingData.discount / 100);
        billingData.total = billingData.subtotal - billingData.discountAmount;

        // Save to patient record
        let patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patientIndex = patients.findIndex(p => p.id === patientId);
        
        if (patientIndex !== -1) {
            patients[patientIndex].billing = billingData;
            localStorage.setItem('patients', JSON.stringify(patients));
            
            // Update patientStorage Map
            this.patientStorage.set(patientId, patients[patientIndex]);
            
            this.showNotification('Billing created successfully!', 'success');
            this.loadPageContent('billing');
        } else {
            this.showNotification('Failed to save billing', 'error');
        }
    }

    showBillingReceipt(patientId) {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);
        
        if (!patient || !patient.billing) {
            this.showNotification('Billing information not found', 'error');
            return;
        }

        const billing = patient.billing;
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'billingReceiptModal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2><i class="fas fa-receipt"></i> Billing Receipt</h2>
                    <button class="modal-close" id="closeReceiptModal">&times;</button>
                </div>
                <div class="modal-body" style="padding: 30px;">
                    <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid var(--dark-pink);">
                        <h1 style="margin: 0; color: var(--dark-pink);">HILAX HOSPITAL</h1>
                        <p style="margin: 5px 0; color: #666;">Management System</p>
                        <p style="margin: 0; font-size: 14px; color: #999;">Official Billing Statement</p>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div>
                            <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">PATIENT INFORMATION</p>
                            <p style="margin: 0; font-weight: 600;">${patient.fullName}</p>
                            <p style="margin: 0; color: #666;">ID: ${patient.id}</p>
                            <p style="margin: 0; color: #666;">Age: ${patient.age}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">BILLING DATE</p>
                            <p style="margin: 0; font-weight: 600;">${new Date(billing.date).toLocaleDateString()}</p>
                            <p style="margin: 0; color: #666;">${new Date(billing.date).toLocaleTimeString()}</p>
                        </div>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr style="background: var(--light-pink);">
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--dark-pink);">Description</th>
                                <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--dark-pink);">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${billing.roomCharges > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">Room Charges</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #f0f0f0;">₱${billing.roomCharges.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td></tr>` : ''}
                            ${billing.consultationFee > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">Consultation Fee</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #f0f0f0;">₱${billing.consultationFee.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td></tr>` : ''}
                            ${billing.labTests > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">Laboratory Tests</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #f0f0f0;">₱${billing.labTests.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td></tr>` : ''}
                            ${billing.medications > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">Medications</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #f0f0f0;">₱${billing.medications.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td></tr>` : ''}
                            ${billing.procedures > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">Procedures/Surgeries</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #f0f0f0;">₱${billing.procedures.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td></tr>` : ''}
                            ${billing.imaging > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">Imaging/Radiology</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #f0f0f0;">₱${billing.imaging.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td></tr>` : ''}
                            ${billing.otherCharges > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">Other Charges</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #f0f0f0;">₱${billing.otherCharges.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td></tr>` : ''}
                        </tbody>
                    </table>

                    <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: 600;">Subtotal:</span>
                            <span style="font-weight: 600;">₱${billing.subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                        </div>
                        ${billing.discount > 0 ? `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #28a745;">
                            <span style="font-weight: 600;">Discount (${billing.discount}%):</span>
                            <span style="font-weight: 600;">-₱${billing.discountAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                        </div>
                        ` : ''}
                        <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 2px solid var(--dark-pink); margin-top: 8px;">
                            <span style="font-size: 20px; font-weight: 700;">TOTAL AMOUNT DUE:</span>
                            <span style="font-size: 20px; font-weight: 700; color: var(--dark-pink);">₱${billing.total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                        </div>
                    </div>

                    ${billing.notes ? `
                    <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                        <p style="margin: 0; font-weight: 600; color: #856404; margin-bottom: 5px;">Notes:</p>
                        <p style="margin: 0; color: #856404;">${billing.notes}</p>
                    </div>
                    ` : ''}

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
                        <p style="margin: 0;">Thank you for choosing HiLax Hospital</p>
                        <p style="margin: 5px 0 0 0;">For inquiries, please contact our billing department</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" id="closeReceiptBtn">Close</button>
                    <button type="button" class="btn btn-primary" id="editBillingBtn">
                        <i class="fas fa-edit"></i>
                        Edit Billing
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('closeReceiptModal').addEventListener('click', () => modal.remove());
        document.getElementById('closeReceiptBtn').addEventListener('click', () => modal.remove());
        document.getElementById('editBillingBtn').addEventListener('click', () => {
            modal.remove();
            this.editBillingForm(patientId);
        });
    }

    editBillingForm(patientId) {
        // Get existing billing data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);
        
        if (!patient || !patient.billing) {
            this.showNotification('Billing information not found', 'error');
            return;
        }

        const billing = patient.billing;
        
        // Show form with pre-filled data
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'editBillingModal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2><i class="fas fa-edit"></i> Edit Billing - ${patient.fullName} (${patientId})</h2>
                    <button class="modal-close" id="closeEditBillingModal">&times;</button>
                </div>
                <form id="editBillingForm" class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editRoomCharges">Room Charges (₱) *</label>
                            <input type="number" id="editRoomCharges" min="0" step="0.01" value="${billing.roomCharges}" required>
                        </div>
                        <div class="form-group">
                            <label for="editConsultationFee">Consultation Fee (₱) *</label>
                            <input type="number" id="editConsultationFee" min="0" step="0.01" value="${billing.consultationFee}" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="editLabTests">Laboratory Tests (₱) *</label>
                            <input type="number" id="editLabTests" min="0" step="0.01" value="${billing.labTests}" required>
                        </div>
                        <div class="form-group">
                            <label for="editMedications">Medications (₱) *</label>
                            <input type="number" id="editMedications" min="0" step="0.01" value="${billing.medications}" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="editProcedures">Procedures/Surgeries (₱) *</label>
                            <input type="number" id="editProcedures" min="0" step="0.01" value="${billing.procedures}" required>
                        </div>
                        <div class="form-group">
                            <label for="editImaging">Imaging/Radiology (₱) *</label>
                            <input type="number" id="editImaging" min="0" step="0.01" value="${billing.imaging}" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="editOtherCharges">Other Charges (₱)</label>
                            <input type="number" id="editOtherCharges" min="0" step="0.01" value="${billing.otherCharges}">
                        </div>
                        <div class="form-group">
                            <label for="editDiscount">Discount (%) *</label>
                            <input type="number" id="editDiscount" min="0" max="100" step="0.01" value="${billing.discount}" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group" style="flex: 1;">
                            <label for="editNotes">Notes/Remarks</label>
                            <textarea id="editNotes" rows="2" placeholder="Additional notes or remarks">${billing.notes || ''}</textarea>
                        </div>
                    </div>

                    <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 10px 0; color: var(--dark-pink);">Billing Summary</h4>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>Subtotal:</span>
                            <span id="editSubtotal" style="font-weight: 600;">₱0.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>Discount:</span>
                            <span id="editDiscountAmount" style="font-weight: 600; color: #28a745;">-₱0.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 2px solid var(--dark-pink);">
                            <span style="font-size: 18px; font-weight: 700;">Total Amount:</span>
                            <span id="editTotalAmount" style="font-size: 18px; font-weight: 700; color: var(--dark-pink);">₱0.00</span>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" id="cancelEditBillingBtn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Billing</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Calculate total on input change
        const inputs = modal.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculateEditBillingTotal());
        });

        // Event listeners
        document.getElementById('closeEditBillingModal').addEventListener('click', () => modal.remove());
        document.getElementById('cancelEditBillingBtn').addEventListener('click', () => modal.remove());
        document.getElementById('editBillingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditBillingSubmit(patientId);
            modal.remove();
        });

        // Initial calculation
        this.calculateEditBillingTotal();
    }

    calculateEditBillingTotal() {
        const roomCharges = parseFloat(document.getElementById('editRoomCharges')?.value || 0);
        const consultationFee = parseFloat(document.getElementById('editConsultationFee')?.value || 0);
        const labTests = parseFloat(document.getElementById('editLabTests')?.value || 0);
        const medications = parseFloat(document.getElementById('editMedications')?.value || 0);
        const procedures = parseFloat(document.getElementById('editProcedures')?.value || 0);
        const imaging = parseFloat(document.getElementById('editImaging')?.value || 0);
        const otherCharges = parseFloat(document.getElementById('editOtherCharges')?.value || 0);
        const discountPercent = parseFloat(document.getElementById('editDiscount')?.value || 0);

        const subtotal = roomCharges + consultationFee + labTests + medications + procedures + imaging + otherCharges;
        const discountAmount = subtotal * (discountPercent / 100);
        const total = subtotal - discountAmount;

        document.getElementById('editSubtotal').textContent = `₱${subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        document.getElementById('editDiscountAmount').textContent = `-₱${discountAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        document.getElementById('editTotalAmount').textContent = `₱${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }

    handleEditBillingSubmit(patientId) {
        const billingData = {
            patientId: patientId,
            date: new Date().toISOString(),
            roomCharges: parseFloat(document.getElementById('editRoomCharges').value),
            consultationFee: parseFloat(document.getElementById('editConsultationFee').value),
            labTests: parseFloat(document.getElementById('editLabTests').value),
            medications: parseFloat(document.getElementById('editMedications').value),
            procedures: parseFloat(document.getElementById('editProcedures').value),
            imaging: parseFloat(document.getElementById('editImaging').value),
            otherCharges: parseFloat(document.getElementById('editOtherCharges').value),
            discount: parseFloat(document.getElementById('editDiscount').value),
            notes: document.getElementById('editNotes').value,
            subtotal: 0,
            discountAmount: 0,
            total: 0
        };

        // Calculate totals
        billingData.subtotal = billingData.roomCharges + billingData.consultationFee + billingData.labTests + 
                               billingData.medications + billingData.procedures + billingData.imaging + billingData.otherCharges;
        billingData.discountAmount = billingData.subtotal * (billingData.discount / 100);
        billingData.total = billingData.subtotal - billingData.discountAmount;

        // Update patient record
        let patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patientIndex = patients.findIndex(p => p.id === patientId);
        
        if (patientIndex !== -1) {
            patients[patientIndex].billing = billingData;
            localStorage.setItem('patients', JSON.stringify(patients));
            
            // Update patientStorage Map
            this.patientStorage.set(patientId, patients[patientIndex]);
            
            this.showNotification('Billing updated successfully!', 'success');
            this.showBillingReceipt(patientId);
        } else {
            this.showNotification('Failed to update billing', 'error');
        }
    }
}


// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});