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
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        // Update page title
        const pageTitle = document.querySelector(`[data-page="${pageId}"] .menu-text`).textContent;
        document.getElementById('pageTitle').textContent = pageTitle;

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
        }
    }

    attachDashboardListeners() {
        const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
        if (addAnnouncementBtn) {
            addAnnouncementBtn.addEventListener('click', () => this.showAddAnnouncementModal());
        }

        const editButtons = document.querySelectorAll('.btn-edit-announcement');
        const deleteButtons = document.querySelectorAll('.btn-delete-announcement');
        
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.editAnnouncement(e));
        });
        
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteAnnouncement(e));
        });
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
        } else {
            // Patient role
            const editProfileBtn = document.getElementById('editPatientBtn');
            if (editProfileBtn) {
                editProfileBtn.addEventListener('click', () => this.editPatientProfile());
            }
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
            <td>${recordsContent}</td>
            <td>${editDeleteButtons}</td>
        `;
        
        // Append new row to table body
        tbody.appendChild(newRow);
        
        // Reattach event listeners to new buttons
        const editBtn = newRow.querySelector('.btn-edit');
        const deleteBtn = newRow.querySelector('.btn-delete');
        
        editBtn.addEventListener('click', (e) => this.editPatient(e));
        deleteBtn.addEventListener('click', (e) => this.deletePatient(e));
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
                            <textarea id="address" rows="2" required>${existingData?.address || ''}</textarea>
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
                this.showNotification('Personal information updated successfully!', 'success');
                this.loadPageContent('allPatients');
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
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});