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
        
        // Add data-role attribute for CSS targeting
        document.body.setAttribute('data-role', this.currentUser.role);
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
            case 'patient-list': // Nurse role uses 'patient-list' menu item
                pageContent = this.contentGenerator.getAllPatientsContent();
                break;
            case 'all-staff':
                pageContent = this.contentGenerator.getAllStaffContent();
                break;
            case 'prescriptions':
                pageContent = this.contentGenerator.getPrescriptionsContent();
                break;
            case 'billing':
                pageContent = this.contentGenerator.getBillingContent();
                break;
            case 'vital-signs':
                pageContent = this.contentGenerator.getVitalSignsContent();
                break;
            case 'medications':
                pageContent = this.contentGenerator.getMedicationsContent();
                break;
            case 'lab-results':
                pageContent = this.contentGenerator.getLabResultsContent();
                break;
            case 'imaging-results':
                pageContent = this.contentGenerator.getImagingResultsContent();
                break;
            case 'imaging-orders':
                pageContent = this.contentGenerator.getImagingOrdersContent();
                break;
            case 'image-archive':
                pageContent = this.contentGenerator.getImageArchiveContent();
                break;
            case 'impressions':
                pageContent = this.contentGenerator.getImpressionsContent();
                break;
            case 'dispensing':
            case 'drug-dispensing':
                pageContent = this.contentGenerator.getDrugDispensingContent();
                break;
            case 'drug-inventory':
                pageContent = this.contentGenerator.getDrugInventoryContent();
                break;
            case 'unavailable-meds':
                pageContent = this.contentGenerator.getUnavailableMedsContent();
                break;
            case 'quality-control':
                pageContent = this.contentGenerator.getQualityControlContent();
                break;
            case 'my-profile':
                pageContent = this.contentGenerator.getMyProfileContent();
                break;
            case 'medical-records':
                pageContent = this.contentGenerator.getMedicalRecordsContent();
                break;
            case 'progress-notes':
                pageContent = this.contentGenerator.getProgressNotesContent();
                break;
            case 'nursing-assessment':
                pageContent = this.contentGenerator.getNursingAssessmentContent();
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
        if (pageId === 'all-patients' || pageId === 'patient-list') {
            this.attachPatientPageListeners();
        } else if (pageId === 'dashboard') {
            this.attachDashboardListeners();
        } else if (pageId === 'all-staff') {
            this.attachStaffPageListeners();
        } else if (pageId === 'billing') {
            this.attachBillingPageListeners();
        } else if (pageId === 'vital-signs') {
            this.attachVitalSignsListeners();
        } else if (pageId === 'medications') {
            this.attachMedicationsListeners();
        } else if (pageId === 'prescriptions') {
            this.attachPrescriptionsListeners();
        } else if (pageId === 'lab-results') {
            this.attachLabResultsListeners();
        } else if (pageId === 'imaging-results') {
            this.attachImagingResultsListeners();
        } else if (pageId === 'imaging-orders') {
            this.attachImagingOrdersListeners();
        } else if (pageId === 'dispensing' || pageId === 'drug-dispensing') {
            this.attachDrugDispensingListeners();
        } else if (pageId === 'drug-inventory') {
            this.attachDrugInventoryListeners();
        } else if (pageId === 'unavailable-meds') {
            this.attachUnavailableMedsListeners();
        } else if (pageId === 'quality-control') {
            this.attachQualityControlListeners();
        } else if (pageId === 'progress-notes') {
            this.attachProgressNotesListeners();
        } else if (pageId === 'nursing-assessment') {
            this.attachNursingAssessmentListeners();
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

        // Initialize carousel if present (for patient dashboard)
        this.initializeCarousel();

        // Awards management (for admin)
        this.attachAwardsManagementListeners();

        // Stat card view buttons
        this.attachStatCardListeners();
    }

    attachStatCardListeners() {
        const viewStatButtons = document.querySelectorAll('.btn-view-stat');
        viewStatButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                if (page) {
                    this.loadPage(page);
                }
            });
        });
    }

    initializeCarousel() {
        const carousel = document.querySelector('.awards-carousel');
        if (!carousel) return;

        let currentSlide = 0;
        const slides = document.querySelectorAll('.award-slide');
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const totalSlides = slides.length;

        if (totalSlides === 0) return;

        const showSlide = (index) => {
            // Hide all slides
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));

            // Show current slide
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        };

        // Button event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }

        // Indicator event listeners
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Auto-play carousel every 5 seconds
        setInterval(nextSlide, 5000);
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
            
            // Billing view buttons - show receipt modal instead of navigating
            const viewBillingButtons = document.querySelectorAll('.btn-view-billing');
            viewBillingButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const patientId = e.currentTarget.getAttribute('data-patient-id');
                    this.showBillingReceipt(patientId);
                });
            });

            // Vital Signs buttons (for Nurse role)
            const vitalSignsButtons = document.querySelectorAll('.btn-vital-signs');
            vitalSignsButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const patientId = e.currentTarget.getAttribute('data-patient-id');
                    this.selectedPatientForVitalSigns = patientId;
                    this.loadPage('vital-signs');
                });
            });

            // Medications buttons (for Physician role)
            const medicationsButtons = document.querySelectorAll('.btn-medications');
            medicationsButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const patientId = e.currentTarget.getAttribute('data-patient-id');
                    this.selectedPatientForMedications = patientId;
                    this.loadPage('medications');
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
                                <option value="Dr. Ramon Cruz">Dr. Ramon Cruz</option>
                                <option value="Dr. Isabella Reyes">Dr. Isabella Reyes</option>
                                <option value="Dr. Salvador">Dr. Salvador</option>
                                <option value="Dr. Sta. Maria">Dr. Sta. Maria</option>
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
                this.loadPage('billing');
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
                                <option value="Dr. Ramon Cruz" ${patientData.doctor === 'Dr. Ramon Cruz' ? 'selected' : ''}>Dr. Ramon Cruz</option>
                                <option value="Dr. Isabella Reyes" ${patientData.doctor === 'Dr. Isabella Reyes' ? 'selected' : ''}>Dr. Isabella Reyes</option>
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
        this.loadPage('dashboard');
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
            this.loadPage('dashboard');
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
            this.loadPage('dashboard');
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
            <div class="modal-content" style="max-width: 900px;">
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
                            <label for="gender">Gender *</label>
                            <select id="gender" required>
                                <option value="">Select Gender</option>
                                <option value="Male" ${existingData?.gender === 'Male' ? 'selected' : ''}>Male</option>
                                <option value="Female" ${existingData?.gender === 'Female' ? 'selected' : ''}>Female</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="civilStatus">Civil Status *</label>
                            <select id="civilStatus" required>
                                <option value="">Select Status</option>
                                <option value="Single" ${existingData?.civilStatus === 'Single' ? 'selected' : ''}>Single</option>
                                <option value="Married" ${existingData?.civilStatus === 'Married' ? 'selected' : ''}>Married</option>
                                <option value="Widowed" ${existingData?.civilStatus === 'Widowed' ? 'selected' : ''}>Widowed</option>
                                <option value="Separated" ${existingData?.civilStatus === 'Separated' ? 'selected' : ''}>Separated</option>
                                <option value="Divorced" ${existingData?.civilStatus === 'Divorced' ? 'selected' : ''}>Divorced</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="nationality">Nationality *</label>
                            <input type="text" id="nationality" placeholder="e.g., Filipino" value="${existingData?.nationality || 'Filipino'}" required>
                        </div>
                        <div class="form-group">
                            <label for="religion">Religion</label>
                            <input type="text" id="religion" placeholder="e.g., Roman Catholic" value="${existingData?.religion || ''}">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="contactInfo">Contact Number *</label>
                            <input type="tel" id="contactInfo" placeholder="+63 912 345 6789" value="${existingData?.contactInfo || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" placeholder="patient@example.com" value="${existingData?.email || ''}">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="address">Address *</label>
                            <textarea id="address" rows="2" placeholder="Enter full address" required>${existingData?.address || ''}</textarea>
                        </div>
                    </div>

                    <div class="form-row" style="grid-template-columns: repeat(3, 1fr);">
                        <div class="form-group">
                            <label for="emergencyContactPerson">Emergency Contact Person *</label>
                            <input type="text" id="emergencyContactPerson" value="${existingData?.emergencyContactPerson || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="emergencyContactNumber">Emergency Contact Number *</label>
                            <input type="tel" id="emergencyContactNumber" placeholder="+63 912 345 6789" value="${existingData?.emergencyContactNumber || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="emergencyContactRelation">Relationship *</label>
                            <input type="text" id="emergencyContactRelation" placeholder="e.g., Mother, Father, Spouse" value="${existingData?.emergencyContactRelation || ''}" required>
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
            gender: document.getElementById('gender').value,
            civilStatus: document.getElementById('civilStatus').value,
            nationality: document.getElementById('nationality').value,
            religion: document.getElementById('religion').value,
            address: document.getElementById('address').value,
            contactInfo: document.getElementById('contactInfo').value,
            email: document.getElementById('email').value,
            emergencyContactPerson: document.getElementById('emergencyContactPerson').value,
            emergencyContactNumber: document.getElementById('emergencyContactNumber').value,
            emergencyContactRelation: document.getElementById('emergencyContactRelation').value
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
                this.loadPage('all-patients');
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
            <div class="modal-content" style="max-width: 800px; display: flex; flex-direction: row; padding: 0; max-height: 90vh;">
                <!-- Quick Actions Sidebar -->
                <div style="width: 180px; background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%); padding: 20px; display: flex; flex-direction: column; gap: 12px; border-radius: 12px 0 0 12px;">
                    <h4 style="color: white; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0; opacity: 0.9;">
                        <i class="fas fa-bolt"></i> Quick Actions
                    </h4>
                    <button type="button" class="btn" id="viewVitalSignsBtn" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); width: 100%; justify-content: flex-start; font-size: 13px; padding: 10px 12px; transition: all 0.3s;">
                        <i class="fas fa-heartbeat"></i>
                        Vital Signs
                    </button>
                    <button type="button" class="btn" id="viewMedicationsBtn" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); width: 100%; justify-content: flex-start; font-size: 13px; padding: 10px 12px; transition: all 0.3s;">
                        <i class="fas fa-pills"></i>
                        Medications
                    </button>
                    <button type="button" class="btn" id="viewLabResultsBtn" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); width: 100%; justify-content: flex-start; font-size: 13px; padding: 10px 12px; transition: all 0.3s;">
                        <i class="fas fa-flask"></i>
                        Lab Results
                    </button>
                    <button type="button" class="btn" id="viewImagingResultsBtn" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); width: 100%; justify-content: flex-start; font-size: 13px; padding: 10px 12px; transition: all 0.3s;">
                        <i class="fas fa-x-ray"></i>
                        Imaging Results
                    </button>
                    <button type="button" class="btn" id="viewDrugDispensingBtn" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); width: 100%; justify-content: flex-start; font-size: 13px; padding: 10px 12px; transition: all 0.3s;">
                        <i class="fas fa-pills"></i>
                        Drug Dispensing
                    </button>
                </div>
                
                <!-- Main Content Area -->
                <div style="flex: 1; display: flex; flex-direction: column;">
                    <div class="modal-header" style="border-radius: 0;">
                        <h2>Personal Information - ${patient.fullName}</h2>
                        <button class="modal-close" id="closeViewInfoModal">&times;</button>
                    </div>
                    <div class="modal-body" style="padding: 20px; overflow-y: auto; flex: 1;">
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
                                <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Gender</label>
                                <p style="margin: 0; font-size: 16px;">${info.gender || 'Not specified'}</p>
                            </div>
                            <div class="info-item">
                                <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Civil Status</label>
                                <p style="margin: 0; font-size: 16px;">${info.civilStatus || 'Not specified'}</p>
                            </div>
                            <div class="info-item">
                                <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Nationality</label>
                                <p style="margin: 0; font-size: 16px;">${info.nationality || 'Not specified'}</p>
                            </div>
                            <div class="info-item">
                                <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Religion</label>
                                <p style="margin: 0; font-size: 16px;">${info.religion || 'Not specified'}</p>
                            </div>
                            <div class="info-item">
                                <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Contact Number</label>
                                <p style="margin: 0; font-size: 16px;">${info.contactInfo}</p>
                            </div>
                            <div class="info-item">
                                <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Email Address</label>
                                <p style="margin: 0; font-size: 16px;">${info.email || 'Not specified'}</p>
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
                            <div class="info-item">
                                <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Relationship</label>
                                <p style="margin: 0; font-size: 16px;">${info.emergencyContactRelation || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        ${this.currentUser.role === 'HR/Admin' ? `
                        <button type="button" class="btn btn-primary" id="editPersonalInfoBtn">
                            <i class="fas fa-edit"></i>
                            Edit Information
                        </button>
                        ` : ''}
                        <button type="button" class="btn btn-secondary" id="closeInfoBtn">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('closeViewInfoModal').addEventListener('click', () => modal.remove());
        document.getElementById('closeInfoBtn').addEventListener('click', () => modal.remove());
        document.getElementById('viewVitalSignsBtn').addEventListener('click', () => {
            modal.remove();
            this.showPatientVitalSignsModal(patientId);
        });
        document.getElementById('viewMedicationsBtn').addEventListener('click', () => {
            modal.remove();
            this.showPatientMedicationsModal(patientId, true);
        });
        document.getElementById('viewLabResultsBtn').addEventListener('click', () => {
            modal.remove();
            this.showPatientLabResultsModal(patientId);
        });
        document.getElementById('viewImagingResultsBtn').addEventListener('click', () => {
            modal.remove();
            this.showPatientImagingResultsModal(patientId);
        });
        document.getElementById('viewDrugDispensingBtn').addEventListener('click', () => {
            modal.remove();
            this.showPatientDrugDispensingModal(patientId);
        });
        
        // Edit button only exists for HR/Admin
        const editBtn = document.getElementById('editPersonalInfoBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.editingPatientId = patientId;
                modal.remove();
                this.showPersonalInfoModal(info);
            });
        }
    }

    // Show Patient Vital Signs Modal
    showPatientVitalSignsModal(patientId, returnToPersonalInfo = true) {
        // Get patient data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        let patient = patients.find(p => p.id === patientId);

        // Fallback to sample data
        if (!patient) {
            const fallbackPatients = [
                { id: 'P001', fullName: 'Miranda, Hebrew T.', age: 19, status: 'Active', doctor: 'Dr. Sta. Maria' },
                { id: 'P002', fullName: 'Sta.Maria, Rizza M.', age: 20, status: 'Admitted', doctor: 'Dr. Sta. Maria' },
                { id: 'P003', fullName: 'Puquiz, Daniel T.', age: 21, status: 'Active', doctor: 'Dr. Salvador' }
            ];
            patient = fallbackPatients.find(p => p.id === patientId);
        }

        if (!patient) {
            this.showNotification('Patient not found', 'error');
            return;
        }

        // Get vital signs for this patient
        const allVitalSigns = JSON.parse(localStorage.getItem('vitalSigns') || '[]');
        const patientVitalSigns = allVitalSigns.filter(vs => vs.patientId === patientId);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 1000px;">
                <h2 style="color: var(--dark-pink); margin-bottom: 20px;">
                    <i class="fas fa-heartbeat"></i> Vital Signs History - ${patient.fullName}
                </h2>

                <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                        <div><strong>Patient ID:</strong> ${patient.id}</div>
                        <div><strong>Age:</strong> ${patient.age}</div>
                        <div><strong>Physician:</strong> ${patient.doctor || 'Not Assigned'}</div>
                        <div><strong>Status:</strong> ${patient.status}</div>
                    </div>
                </div>

                ${patientVitalSigns.length > 0 ? `
                <div style="overflow-x: auto;">
                    <table class="patients-table" style="min-width: 900px;">
                        <thead>
                            <tr>
                                <th style="width: 12%;">Date</th>
                                <th style="width: 10%;">Time</th>
                                <th style="width: 12%;">BP (mmHg)</th>
                                <th style="width: 11%;">HR (bpm)</th>
                                <th style="width: 11%;">Temp (°C)</th>
                                <th style="width: 8%;">RR</th>
                                <th style="width: 11%;">SpO2 (%)</th>
                                <th style="width: 9%;">Pain</th>
                                <th style="width: 16%;">Recorded By</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${patientVitalSigns.map(vs => `
                                <tr>
                                    <td>${vs.recordedDate}</td>
                                    <td>${vs.recordedTime}</td>
                                    <td><strong>${vs.bloodPressure}</strong></td>
                                    <td>${vs.heartRate}</td>
                                    <td>${vs.temperature}</td>
                                    <td>${vs.respiratoryRate}</td>
                                    <td>${vs.oxygenSaturation}%</td>
                                    <td>${vs.painLevel !== null ? vs.painLevel + '/10' : '-'}</td>
                                    <td>${vs.recordedBy}</td>
                                </tr>
                                ${vs.notes ? `
                                <tr style="background: #f8f9fa;">
                                    <td colspan="9" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                        <strong style="color: var(--dark-pink);">Notes:</strong> ${vs.notes}
                                    </td>
                                </tr>
                                ` : ''}
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ` : `
                <div style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-heartbeat" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                    <p style="font-size: 16px;">No vital signs recorded yet for this patient.</p>
                </div>
                `}

                <div class="modal-actions" style="margin-top: 24px;">
                    <button type="button" class="btn btn-secondary" id="closeVitalSignsBtn">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeAndReopenPersonalInfo = () => {
            modal.remove();
            if (returnToPersonalInfo) {
                this.viewPersonalInfo(patientId);
            }
        };

        document.getElementById('closeVitalSignsBtn').addEventListener('click', closeAndReopenPersonalInfo);
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
        this.loadPage('all-staff');
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
                        <div class="form-group">
                            <label for="insuranceProvider">Insurance Provider</label>
                            <input type="text" id="insuranceProvider" placeholder="e.g., PhilHealth, HMO, Private">
                        </div>
                        <div class="form-group">
                            <label for="insuranceNumber">Insurance Number</label>
                            <input type="text" id="insuranceNumber" placeholder="Insurance policy number">
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
            insuranceProvider: document.getElementById('insuranceProvider').value,
            insuranceNumber: document.getElementById('insuranceNumber').value,
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
            this.loadPage('billing');
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
                    ${this.currentUser.role === 'HR/Admin' ? `
                    <button type="button" class="btn btn-primary" id="editBillingBtn">
                        <i class="fas fa-edit"></i>
                        Edit Billing
                    </button>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('closeReceiptModal').addEventListener('click', () => modal.remove());
        document.getElementById('closeReceiptBtn').addEventListener('click', () => modal.remove());
        
        // Edit button only exists for HR/Admin
        const editBtn = document.getElementById('editBillingBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                modal.remove();
                this.editBillingForm(patientId);
            });
        }
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

    // Awards Management Methods
    attachAwardsManagementListeners() {
        const addAwardBtn = document.getElementById('addAwardBtn');
        const editAwardBtns = document.querySelectorAll('.btn-edit-award');
        const deleteAwardBtns = document.querySelectorAll('.btn-delete-award');

        if (addAwardBtn) {
            addAwardBtn.addEventListener('click', () => this.showAddAwardModal());
        }

        editAwardBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const awardId = parseInt(e.currentTarget.getAttribute('data-award-id'));
                this.showEditAwardModal(awardId);
            });
        });

        deleteAwardBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const awardId = parseInt(e.currentTarget.getAttribute('data-award-id'));
                this.deleteAward(awardId);
            });
        });
    }

    showAddAwardModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'addAwardModal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2><i class="fas fa-trophy"></i> Add Hospital Award</h2>
                    <button class="modal-close" id="closeAwardModal">&times;</button>
                </div>
                <form id="addAwardForm" class="modal-form">
                    <div class="form-group">
                        <label for="awardTitle">Award Title *</label>
                        <input type="text" id="awardTitle" required placeholder="e.g., Excellence in Healthcare Award">
                    </div>

                    <div class="form-group">
                        <label for="awardDescription">Description *</label>
                        <textarea id="awardDescription" rows="3" required placeholder="Brief description of the award"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="awardImage">Image URL *</label>
                        <input type="text" id="awardImage" required placeholder="e.g., ./images/award1.png">
                        <small style="color: var(--text-light); font-size: 12px; margin-top: 5px; display: block;">
                            Enter the path to the award image (1024x1024px recommended)
                        </small>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" id="cancelAwardBtn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Add Award</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('closeAwardModal').addEventListener('click', () => modal.remove());
        document.getElementById('cancelAwardBtn').addEventListener('click', () => modal.remove());
        document.getElementById('addAwardForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddAward();
            modal.remove();
        });
    }

    handleAddAward() {
        const title = document.getElementById('awardTitle').value;
        const description = document.getElementById('awardDescription').value;
        const image = document.getElementById('awardImage').value;

        let awards = JSON.parse(localStorage.getItem('hospitalAwards') || '[]');
        const newId = awards.length > 0 ? Math.max(...awards.map(a => a.id)) + 1 : 1;

        const newAward = {
            id: newId,
            title: title,
            description: description,
            image: image
        };

        awards.push(newAward);
        localStorage.setItem('hospitalAwards', JSON.stringify(awards));

        this.showNotification('Award added successfully!', 'success');
        this.loadPage('dashboard');
    }

    showEditAwardModal(awardId) {
        const awards = JSON.parse(localStorage.getItem('hospitalAwards') || '[]');
        const award = awards.find(a => a.id === awardId);

        if (!award) {
            this.showNotification('Award not found', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'editAwardModal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2><i class="fas fa-edit"></i> Edit Hospital Award</h2>
                    <button class="modal-close" id="closeEditAwardModal">&times;</button>
                </div>
                <form id="editAwardForm" class="modal-form">
                    <div class="form-group">
                        <label for="editAwardTitle">Award Title *</label>
                        <input type="text" id="editAwardTitle" required value="${award.title}">
                    </div>

                    <div class="form-group">
                        <label for="editAwardDescription">Description *</label>
                        <textarea id="editAwardDescription" rows="3" required>${award.description}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="editAwardImage">Image URL *</label>
                        <input type="text" id="editAwardImage" required value="${award.image}">
                        <small style="color: var(--text-light); font-size: 12px; margin-top: 5px; display: block;">
                            Enter the path to the award image (1024x1024px recommended)
                        </small>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" id="cancelEditAwardBtn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Award</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('closeEditAwardModal').addEventListener('click', () => modal.remove());
        document.getElementById('cancelEditAwardBtn').addEventListener('click', () => modal.remove());
        document.getElementById('editAwardForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditAward(awardId);
            modal.remove();
        });
    }

    handleEditAward(awardId) {
        const title = document.getElementById('editAwardTitle').value;
        const description = document.getElementById('editAwardDescription').value;
        const image = document.getElementById('editAwardImage').value;

        let awards = JSON.parse(localStorage.getItem('hospitalAwards') || '[]');
        const awardIndex = awards.findIndex(a => a.id === awardId);

        if (awardIndex !== -1) {
            awards[awardIndex] = {
                id: awardId,
                title: title,
                description: description,
                image: image
            };
            localStorage.setItem('hospitalAwards', JSON.stringify(awards));

            this.showNotification('Award updated successfully!', 'success');
            this.loadPage('dashboard');
        } else {
            this.showNotification('Failed to update award', 'error');
        }
    }

    deleteAward(awardId) {
        if (!confirm('Are you sure you want to delete this award?')) {
            return;
        }

        let awards = JSON.parse(localStorage.getItem('hospitalAwards') || '[]');
        awards = awards.filter(a => a.id !== awardId);
        localStorage.setItem('hospitalAwards', JSON.stringify(awards));

        this.showNotification('Award deleted successfully!', 'success');
        this.loadPage('dashboard');
    }

    // Progress Notes Listeners
    attachProgressNotesListeners() {
        const patientSelect = document.getElementById('progressNotesPatient');
        const progressNotesForm = document.getElementById('newProgressNoteForm');
        const clearFormBtn = document.getElementById('clearProgressNoteForm');

        if (patientSelect) {
            patientSelect.addEventListener('change', (e) => this.handleProgressNotesPatientSelection(e.target.value));
        }

        if (progressNotesForm) {
            progressNotesForm.addEventListener('submit', (e) => this.saveProgressNote(e));
        }

        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', () => this.clearProgressNoteForm());
        }

        // Set current date and time by default
        const dateInput = document.getElementById('progressNoteDate');
        const timeInput = document.getElementById('progressNoteTime');
        if (dateInput && !dateInput.value) {
            const today = new Date();
            dateInput.value = today.toISOString().split('T')[0];
        }
        if (timeInput && !timeInput.value) {
            const now = new Date();
            timeInput.value = now.toTimeString().slice(0, 5);
        }

        // Add event listeners for "View" buttons in summary table
        const viewButtons = document.querySelectorAll('.btn-view-progress-note');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const noteId = e.currentTarget.getAttribute('data-note-id');
                if (noteId) {
                    this.showProgressNoteDetailsModal(noteId);
                }
            });
        });
    }

    handleProgressNotesPatientSelection(patientId) {
        const selectedPatientInfo = document.getElementById('selectedPatientInfoProgressNotes');
        const progressNotesForm = document.getElementById('progressNotesForm');
        const progressNotesHistory = document.getElementById('progressNotesHistory');

        if (!patientId) {
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'none';
            if (progressNotesForm) progressNotesForm.style.display = 'none';
            if (progressNotesHistory) progressNotesHistory.style.display = 'none';
            return;
        }

        // Get patient data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (patient) {
            // Display patient info
            this.displayPatientInfoProgressNotes(patient);
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'block';
            if (progressNotesForm) progressNotesForm.style.display = 'block';
            if (progressNotesHistory) progressNotesHistory.style.display = 'block';

            // Load progress notes history
            this.loadProgressNotesHistory(patientId);
        }
    }

    displayPatientInfoProgressNotes(patient) {
        const nameEl = document.getElementById('selectedPatientNameProgressNotes');
        const idEl = document.getElementById('selectedPatientIdProgressNotes');
        const ageEl = document.getElementById('selectedPatientAgeProgressNotes');
        const statusEl = document.getElementById('selectedPatientStatusProgressNotes');
        const doctorEl = document.getElementById('selectedPatientDoctorProgressNotes');

        if (nameEl) nameEl.textContent = patient.fullName;
        if (idEl) idEl.textContent = patient.id;
        if (ageEl) ageEl.textContent = patient.age;
        if (statusEl) statusEl.textContent = patient.status;
        if (doctorEl) doctorEl.textContent = patient.doctor || 'Not Assigned';
    }

    clearProgressNoteForm() {
        document.getElementById('progressNoteType').value = '';
        document.getElementById('chiefComplaint').value = '';
        document.getElementById('subjective').value = '';
        document.getElementById('objective').value = '';
        document.getElementById('assessment').value = '';
        document.getElementById('plan').value = '';
        document.getElementById('additionalNotes').value = '';
        
        // Reset date and time to current
        const today = new Date();
        document.getElementById('progressNoteDate').value = today.toISOString().split('T')[0];
        document.getElementById('progressNoteTime').value = new Date().toTimeString().slice(0, 5);
    }

    saveProgressNote(e) {
        e.preventDefault();

        const patientId = document.getElementById('progressNotesPatient').value;
        if (!patientId) {
            this.showNotification('Please select a patient first', 'error');
            return;
        }

        // Get form values
        const progressNote = {
            id: 'PN' + Date.now(),
            patientId: patientId,
            date: document.getElementById('progressNoteDate').value,
            time: document.getElementById('progressNoteTime').value,
            noteType: document.getElementById('progressNoteType').value,
            chiefComplaint: document.getElementById('chiefComplaint').value,
            subjective: document.getElementById('subjective').value,
            objective: document.getElementById('objective').value,
            assessment: document.getElementById('assessment').value,
            plan: document.getElementById('plan').value,
            additionalNotes: document.getElementById('additionalNotes').value,
            recordedBy: this.currentUser.fullName,
            recordedDate: new Date().toISOString().split('T')[0]
        };

        // Get existing progress notes
        let progressNotes = JSON.parse(localStorage.getItem('progressNotes') || '[]');
        
        // Add new note at the beginning (most recent first)
        progressNotes.unshift(progressNote);
        
        // Save to localStorage
        localStorage.setItem('progressNotes', JSON.stringify(progressNotes));

        this.showNotification('Progress note saved successfully!', 'success');
        
        // Clear form and reload history
        this.clearProgressNoteForm();
        this.loadProgressNotesHistory(patientId);
    }

    loadProgressNotesHistory(patientId) {
        const historyTable = document.getElementById('progressNotesHistoryTable');
        if (!historyTable) return;

        const allProgressNotes = JSON.parse(localStorage.getItem('progressNotes') || '[]');
        const patientNotes = allProgressNotes.filter(note => note.patientId === patientId);

        if (patientNotes.length === 0) {
            historyTable.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No progress notes recorded yet.</p>';
            return;
        }

        const tableHTML = `
            <div style="overflow-x: auto;">
                <table class="patients-table" style="min-width: 1000px;">
                    <thead>
                        <tr>
                            <th style="width: 12%;">Date</th>
                            <th style="width: 10%;">Time</th>
                            <th style="width: 15%;">Note Type</th>
                            <th style="width: 18%;">Chief Complaint</th>
                            <th style="width: 15%;">Assessment (Brief)</th>
                            <th style="width: 15%;">Recorded By</th>
                            <th style="width: 15%;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patientNotes.map(note => `
                            <tr>
                                <td>${note.date}</td>
                                <td>${note.time}</td>
                                <td>
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
                                <td>${note.chiefComplaint}</td>
                                <td>${note.assessment ? note.assessment.substring(0, 50) + '...' : 'N/A'}</td>
                                <td>${note.recordedBy}</td>
                                <td>
                                    <button class="btn btn-sm btn-view-note-detail" data-note-id="${note.id}">
                                        <i class="fas fa-eye"></i> View Full
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        historyTable.innerHTML = tableHTML;

        // Attach event listeners to the new "View Full" buttons
        const viewButtons = document.querySelectorAll('.btn-view-note-detail');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const noteId = e.currentTarget.getAttribute('data-note-id');
                if (noteId) {
                    this.showProgressNoteDetailsModal(noteId);
                }
            });
        });
    }

    showProgressNoteDetailsModal(noteId) {
        const allProgressNotes = JSON.parse(localStorage.getItem('progressNotes') || '[]');
        const note = allProgressNotes.find(n => n.id === noteId);

        if (!note) {
            this.showNotification('Progress note not found', 'error');
            return;
        }

        // Get patient info
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === note.patientId);
        const patientName = patient ? patient.fullName : 'Unknown Patient';

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h2><i class="fas fa-file-medical"></i> Progress Note Details</h2>
                    <button class="modal-close" id="closeProgressNoteModalBtn">&times;</button>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    <!-- Patient & Note Info -->
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                            <div><strong>Patient:</strong> ${patientName} (${note.patientId})</div>
                            <div><strong>Date:</strong> ${note.date} at ${note.time}</div>
                            <div>
                                <strong>Note Type:</strong> 
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
                            </div>
                            <div><strong>Recorded By:</strong> ${note.recordedBy}</div>
                        </div>
                    </div>

                    <!-- Chief Complaint -->
                    <div style="margin-bottom: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                        <h4 style="margin: 0 0 8px 0; color: #856404;">
                            <i class="fas fa-exclamation-circle"></i> Chief Complaint
                        </h4>
                        <p style="margin: 0; color: #856404;">${note.chiefComplaint}</p>
                    </div>

                    <!-- SOAP Format -->
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                        <h3 style="color: var(--dark-pink); margin-bottom: 16px;">
                            <i class="fas fa-notes-medical"></i> Clinical Documentation
                        </h3>

                        <div style="margin-bottom: 16px;">
                            <h4 style="color: #495057; margin-bottom: 8px;">
                                <i class="fas fa-comment-medical"></i> Subjective
                            </h4>
                            <div style="padding: 12px; background: white; border-radius: 4px; white-space: pre-wrap; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${note.subjective}</div>
                        </div>

                        <div style="margin-bottom: 16px;">
                            <h4 style="color: #495057; margin-bottom: 8px;">
                                <i class="fas fa-stethoscope"></i> Objective
                            </h4>
                            <div style="padding: 12px; background: white; border-radius: 4px; white-space: pre-wrap; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${note.objective}</div>
                        </div>

                        <div style="margin-bottom: 16px;">
                            <h4 style="color: #495057; margin-bottom: 8px;">
                                <i class="fas fa-diagnoses"></i> Assessment
                            </h4>
                            <div style="padding: 12px; background: white; border-radius: 4px; white-space: pre-wrap; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${note.assessment}</div>
                        </div>

                        <div style="margin-bottom: ${note.additionalNotes ? '16px' : '0'};">
                            <h4 style="color: #495057; margin-bottom: 8px;">
                                <i class="fas fa-clipboard-list"></i> Plan
                            </h4>
                            <div style="padding: 12px; background: white; border-radius: 4px; white-space: pre-wrap; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${note.plan}</div>
                        </div>

                        ${note.additionalNotes ? `
                        <div>
                            <h4 style="color: #495057; margin-bottom: 8px;">
                                <i class="fas fa-info-circle"></i> Additional Notes
                            </h4>
                            <div style="padding: 12px; background: white; border-radius: 4px; white-space: pre-wrap; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${note.additionalNotes}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="closeProgressNoteModalBtn2">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners for close buttons
        const closeBtn1 = modal.querySelector('#closeProgressNoteModalBtn');
        const closeBtn2 = modal.querySelector('#closeProgressNoteModalBtn2');

        const closeModal = () => {
            document.body.removeChild(modal);
        };

        closeBtn1.addEventListener('click', closeModal);
        closeBtn2.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Nursing Assessment Listeners
    attachNursingAssessmentListeners() {
        const patientSelect = document.getElementById('nursingAssessmentPatient');
        const assessmentForm = document.getElementById('newNursingAssessmentForm');
        const clearFormBtn = document.getElementById('clearNursingAssessmentForm');

        if (patientSelect) {
            patientSelect.addEventListener('change', (e) => this.handleNursingAssessmentPatientSelection(e.target.value));
        }

        if (assessmentForm) {
            assessmentForm.addEventListener('submit', (e) => this.saveNursingAssessment(e));
        }

        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', () => this.clearNursingAssessmentForm());
        }

        // Set current date and time by default
        const dateInput = document.getElementById('assessmentDate');
        const timeInput = document.getElementById('assessmentTime');
        if (dateInput && !dateInput.value) {
            const today = new Date();
            dateInput.value = today.toISOString().split('T')[0];
        }
        if (timeInput && !timeInput.value) {
            const now = new Date();
            timeInput.value = now.toTimeString().slice(0, 5);
        }

        // Add event listeners for "View" buttons in summary table
        const viewButtons = document.querySelectorAll('.btn-view-nursing-assessment');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const assessmentId = e.currentTarget.getAttribute('data-assessment-id');
                if (assessmentId) {
                    this.showNursingAssessmentDetailsModal(assessmentId);
                }
            });
        });

        // For nurses viewing progress notes (view only)
        const progressNotesPatientSelect = document.getElementById('progressNotesPatientNurse');
        if (progressNotesPatientSelect) {
            progressNotesPatientSelect.addEventListener('change', (e) => this.handleProgressNotesNurseSelection(e.target.value));
        }

        const viewProgressNoteButtons = document.querySelectorAll('.btn-view-progress-note');
        viewProgressNoteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const noteId = e.currentTarget.getAttribute('data-note-id');
                if (noteId) {
                    this.showProgressNoteDetailsModal(noteId);
                }
            });
        });
    }

    handleNursingAssessmentPatientSelection(patientId) {
        const selectedPatientInfo = document.getElementById('selectedPatientInfoNursingAssessment');
        const assessmentForm = document.getElementById('nursingAssessmentForm');
        const assessmentHistory = document.getElementById('nursingAssessmentHistory');

        if (!patientId) {
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'none';
            if (assessmentForm) assessmentForm.style.display = 'none';
            if (assessmentHistory) assessmentHistory.style.display = 'none';
            return;
        }

        // Get patient data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (patient) {
            // Display patient info
            this.displayPatientInfoNursingAssessment(patient);
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'block';
            if (assessmentForm) assessmentForm.style.display = 'block';
            if (assessmentHistory) assessmentHistory.style.display = 'block';

            // Load assessment history
            this.loadNursingAssessmentHistory(patientId);
        }
    }

    handleProgressNotesNurseSelection(patientId) {
        const selectedPatientInfo = document.getElementById('selectedPatientInfoProgressNotesNurse');
        const progressNotesHistory = document.getElementById('progressNotesHistoryNurse');

        if (!patientId) {
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'none';
            if (progressNotesHistory) progressNotesHistory.style.display = 'none';
            return;
        }

        // Get patient data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (patient) {
            // Display patient info
            this.displayPatientInfoProgressNotesNurse(patient);
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'block';
            if (progressNotesHistory) progressNotesHistory.style.display = 'block';

            // Load progress notes history
            this.loadProgressNotesHistoryNurse(patientId);
        }
    }

    displayPatientInfoNursingAssessment(patient) {
        const nameEl = document.getElementById('selectedPatientNameNursingAssessment');
        const idEl = document.getElementById('selectedPatientIdNursingAssessment');
        const ageEl = document.getElementById('selectedPatientAgeNursingAssessment');
        const statusEl = document.getElementById('selectedPatientStatusNursingAssessment');
        const doctorEl = document.getElementById('selectedPatientDoctorNursingAssessment');

        if (nameEl) nameEl.textContent = patient.fullName;
        if (idEl) idEl.textContent = patient.id;
        if (ageEl) ageEl.textContent = patient.age;
        if (statusEl) statusEl.textContent = patient.status;
        if (doctorEl) doctorEl.textContent = patient.doctor || 'Not Assigned';
    }

    displayPatientInfoProgressNotesNurse(patient) {
        const nameEl = document.getElementById('selectedPatientNameProgressNotesNurse');
        const idEl = document.getElementById('selectedPatientIdProgressNotesNurse');
        const ageEl = document.getElementById('selectedPatientAgeProgressNotesNurse');
        const statusEl = document.getElementById('selectedPatientStatusProgressNotesNurse');
        const doctorEl = document.getElementById('selectedPatientDoctorProgressNotesNurse');

        if (nameEl) nameEl.textContent = patient.fullName;
        if (idEl) idEl.textContent = patient.id;
        if (ageEl) ageEl.textContent = patient.age;
        if (statusEl) statusEl.textContent = patient.status;
        if (doctorEl) doctorEl.textContent = patient.doctor || 'Not Assigned';
    }

    clearNursingAssessmentForm() {
        document.getElementById('assessmentType').value = '';
        document.getElementById('chiefConcern').value = '';
        document.getElementById('assessmentBP').value = '';
        document.getElementById('assessmentHR').value = '';
        document.getElementById('assessmentTemp').value = '';
        document.getElementById('assessmentRR').value = '';
        document.getElementById('generalAppearance').value = '';
        document.getElementById('painAssessment').value = '';
        document.getElementById('respiratoryAssessment').value = '';
        document.getElementById('cardiovascularAssessment').value = '';
        document.getElementById('neurologicalAssessment').value = '';
        document.getElementById('skinIntegrity').value = '';
        document.getElementById('nursingInterventions').value = '';
        document.getElementById('assessmentNotes').value = '';
        
        // Reset date and time to current
        const today = new Date();
        document.getElementById('assessmentDate').value = today.toISOString().split('T')[0];
        document.getElementById('assessmentTime').value = new Date().toTimeString().slice(0, 5);
    }

    saveNursingAssessment(e) {
        e.preventDefault();

        const patientId = document.getElementById('nursingAssessmentPatient').value;
        if (!patientId) {
            this.showNotification('Please select a patient first', 'error');
            return;
        }

        // Get form values
        const assessment = {
            id: 'NA' + Date.now(),
            patientId: patientId,
            date: document.getElementById('assessmentDate').value,
            time: document.getElementById('assessmentTime').value,
            assessmentType: document.getElementById('assessmentType').value,
            chiefConcern: document.getElementById('chiefConcern').value,
            vitalSigns: {
                bloodPressure: document.getElementById('assessmentBP').value,
                heartRate: document.getElementById('assessmentHR').value,
                temperature: document.getElementById('assessmentTemp').value,
                respiratoryRate: document.getElementById('assessmentRR').value
            },
            generalAppearance: document.getElementById('generalAppearance').value,
            painAssessment: document.getElementById('painAssessment').value,
            respiratoryAssessment: document.getElementById('respiratoryAssessment').value,
            cardiovascularAssessment: document.getElementById('cardiovascularAssessment').value,
            neurologicalAssessment: document.getElementById('neurologicalAssessment').value,
            skinIntegrity: document.getElementById('skinIntegrity').value,
            nursingInterventions: document.getElementById('nursingInterventions').value,
            additionalNotes: document.getElementById('assessmentNotes').value,
            recordedBy: this.currentUser.fullName,
            recordedDate: new Date().toISOString().split('T')[0]
        };

        // Get existing assessments
        let assessments = JSON.parse(localStorage.getItem('nursingAssessments') || '[]');
        
        // Add new assessment at the beginning (most recent first)
        assessments.unshift(assessment);
        
        // Save to localStorage
        localStorage.setItem('nursingAssessments', JSON.stringify(assessments));

        this.showNotification('Nursing assessment saved successfully!', 'success');
        
        // Clear form and reload history
        this.clearNursingAssessmentForm();
        this.loadNursingAssessmentHistory(patientId);
    }

    loadNursingAssessmentHistory(patientId) {
        const historyTable = document.getElementById('nursingAssessmentHistoryTable');
        if (!historyTable) return;

        const allAssessments = JSON.parse(localStorage.getItem('nursingAssessments') || '[]');
        const patientAssessments = allAssessments.filter(assessment => assessment.patientId === patientId);

        if (patientAssessments.length === 0) {
            historyTable.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No assessments recorded yet.</p>';
            return;
        }

        const tableHTML = `
            <div style="overflow-x: auto;">
                <table class="patients-table" style="min-width: 1000px;">
                    <thead>
                        <tr>
                            <th style="width: 12%;">Date</th>
                            <th style="width: 10%;">Time</th>
                            <th style="width: 18%;">Assessment Type</th>
                            <th style="width: 20%;">Chief Concern</th>
                            <th style="width: 15%;">Recorded By</th>
                            <th style="width: 15%;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patientAssessments.map(assessment => `
                            <tr>
                                <td>${assessment.date}</td>
                                <td>${assessment.time}</td>
                                <td>${assessment.assessmentType}</td>
                                <td>${assessment.chiefConcern}</td>
                                <td>${assessment.recordedBy}</td>
                                <td>
                                    <button class="btn btn-sm btn-view-assessment-detail" data-assessment-id="${assessment.id}">
                                        <i class="fas fa-eye"></i> View Full
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        historyTable.innerHTML = tableHTML;

        // Attach event listeners to the new "View Full" buttons
        const viewButtons = document.querySelectorAll('.btn-view-assessment-detail');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const assessmentId = e.currentTarget.getAttribute('data-assessment-id');
                if (assessmentId) {
                    this.showNursingAssessmentDetailsModal(assessmentId);
                }
            });
        });
    }

    loadProgressNotesHistoryNurse(patientId) {
        const historyTable = document.getElementById('progressNotesHistoryTableNurse');
        if (!historyTable) return;

        const allProgressNotes = JSON.parse(localStorage.getItem('progressNotes') || '[]');
        const patientNotes = allProgressNotes.filter(note => note.patientId === patientId);

        if (patientNotes.length === 0) {
            historyTable.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No progress notes recorded yet.</p>';
            return;
        }

        const tableHTML = `
            <div style="overflow-x: auto;">
                <table class="patients-table" style="min-width: 1000px;">
                    <thead>
                        <tr>
                            <th style="width: 12%;">Date</th>
                            <th style="width: 10%;">Time</th>
                            <th style="width: 15%;">Note Type</th>
                            <th style="width: 18%;">Chief Complaint</th>
                            <th style="width: 15%;">Assessment (Brief)</th>
                            <th style="width: 15%;">Physician</th>
                            <th style="width: 15%;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patientNotes.map(note => `
                            <tr>
                                <td>${note.date}</td>
                                <td>${note.time}</td>
                                <td>
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
                                <td>${note.chiefComplaint}</td>
                                <td>${note.assessment ? note.assessment.substring(0, 50) + '...' : 'N/A'}</td>
                                <td>${note.recordedBy}</td>
                                <td>
                                    <button class="btn btn-sm btn-view-note-detail-nurse" data-note-id="${note.id}">
                                        <i class="fas fa-eye"></i> View Full
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        historyTable.innerHTML = tableHTML;

        // Attach event listeners to the new "View Full" buttons
        const viewButtons = document.querySelectorAll('.btn-view-note-detail-nurse');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const noteId = e.currentTarget.getAttribute('data-note-id');
                if (noteId) {
                    this.showProgressNoteDetailsModal(noteId);
                }
            });
        });
    }

    showNursingAssessmentDetailsModal(assessmentId) {
        const allAssessments = JSON.parse(localStorage.getItem('nursingAssessments') || '[]');
        const assessment = allAssessments.find(a => a.id === assessmentId);

        if (!assessment) {
            this.showNotification('Assessment not found', 'error');
            return;
        }

        // Get patient info
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === assessment.patientId);
        const patientName = patient ? patient.fullName : 'Unknown Patient';

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h2><i class="fas fa-file-medical"></i> Nursing Assessment Details</h2>
                    <button class="modal-close" id="closeAssessmentModalBtn">&times;</button>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    <!-- Patient & Assessment Info -->
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                            <div><strong>Patient:</strong> ${patientName} (${assessment.patientId})</div>
                            <div><strong>Date:</strong> ${assessment.date} at ${assessment.time}</div>
                            <div><strong>Assessment Type:</strong> ${assessment.assessmentType}</div>
                            <div><strong>Nurse:</strong> ${assessment.recordedBy}</div>
                        </div>
                    </div>

                    <!-- Chief Concern -->
                    <div style="margin-bottom: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                        <h4 style="margin: 0 0 8px 0; color: #856404;">
                            <i class="fas fa-exclamation-circle"></i> Chief Concern
                        </h4>
                        <p style="margin: 0; color: #856404;">${assessment.chiefConcern}</p>
                    </div>

                    <!-- Vital Signs -->
                    ${assessment.vitalSigns.bloodPressure || assessment.vitalSigns.heartRate || assessment.vitalSigns.temperature || assessment.vitalSigns.respiratoryRate ? `
                    <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 12px 0; color: #2e7d32;">
                            <i class="fas fa-heartbeat"></i> Vital Signs
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                            ${assessment.vitalSigns.bloodPressure ? `<div><strong>BP:</strong> ${assessment.vitalSigns.bloodPressure}</div>` : ''}
                            ${assessment.vitalSigns.heartRate ? `<div><strong>HR:</strong> ${assessment.vitalSigns.heartRate} bpm</div>` : ''}
                            ${assessment.vitalSigns.temperature ? `<div><strong>Temp:</strong> ${assessment.vitalSigns.temperature}°C</div>` : ''}
                            ${assessment.vitalSigns.respiratoryRate ? `<div><strong>RR:</strong> ${assessment.vitalSigns.respiratoryRate}/min</div>` : ''}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Assessment Sections -->
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                        <h3 style="color: var(--dark-pink); margin-bottom: 16px;">
                            <i class="fas fa-clipboard-list"></i> Nursing Assessment
                        </h3>

                        <div style="margin-bottom: 16px;">
                            <h4 style="color: #495057; margin-bottom: 8px;">General Appearance & Behavior</h4>
                            <div style="padding: 12px; background: white; border-radius: 4px; white-space: pre-wrap;">${assessment.generalAppearance}</div>
                        </div>

                        <div style="margin-bottom: 16px;">
                            <h4 style="color: #495057; margin-bottom: 8px;">Pain Assessment</h4>
                            <div style="padding: 12px; background: white; border-radius: 4px; white-space: pre-wrap;">${assessment.painAssessment}</div>
                        </div>

                        ${assessment.respiratoryAssessment ? `
                        <div style="margin-bottom: 16px;">
                            <h4 style="color: #495057; margin-bottom: 8px;">Respiratory Assessment</h4>
                            <div style="padding: 12px; background: white; border-radius: 4px; white-space: pre-wrap;">${assessment.respiratoryAssessment}</div>
                        </div>
                        ` : ''}

                        ${assessment.cardiovascularAssessment ? `
                        <div style="margin-bottom: 16px;">
                            <h4 style="color: #495057; margin-bottom: 8px;">Cardiovascular Assessment</h4>
                            <div style="padding: 12px; background: white; border-radius: 4px; white-space: pre-wrap;">${assessment.cardiovascularAssessment}</div>
                        </div>
                        ` : ''}

                        ${assessment.neurologicalAssessment ? `
                        <div style="margin-bottom: 16px;">
                            <h4 style="color: #495057; margin-bottom: 8px;">Neurological Assessment</h4>
                            <div style="padding: 12px; background: white; border-radius: 4px; white-space: pre-wrap;">${assessment.neurologicalAssessment}</div>
                        </div>
                        ` : ''}

                        ${assessment.skinIntegrity ? `
                        <div style="margin-bottom: 16px;">
                            <h4 style="color: #495057; margin-bottom: 8px;">Skin Integrity</h4>
                            <div style="padding: 12px; background: white; border-radius: 4px; white-space: pre-wrap;">${assessment.skinIntegrity}</div>
                        </div>
                        ` : ''}

                        <div style="margin-bottom: ${assessment.additionalNotes ? '16px' : '0'};">
                            <h4 style="color: #495057; margin-bottom: 8px;">Nursing Interventions & Care Plan</h4>
                            <div style="padding: 12px; background: white; border-radius: 4px; white-space: pre-wrap;">${assessment.nursingInterventions}</div>
                        </div>

                        ${assessment.additionalNotes ? `
                        <div>
                            <h4 style="color: #495057; margin-bottom: 8px;">Additional Notes</h4>
                            <div style="padding: 12px; background: white; border-radius: 4px; white-space: pre-wrap;">${assessment.additionalNotes}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="closeAssessmentModalBtn2">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners for close buttons
        const closeBtn1 = modal.querySelector('#closeAssessmentModalBtn');
        const closeBtn2 = modal.querySelector('#closeAssessmentModalBtn2');

        const closeModal = () => {
            document.body.removeChild(modal);
        };

        closeBtn1.addEventListener('click', closeModal);
        closeBtn2.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Vital Signs Page Listeners
    attachVitalSignsListeners() {
        const patientSelect = document.getElementById('vitalSignsPatient');
        const vitalSignsForm = document.getElementById('vitalSignsForm');
        const clearFormBtn = document.getElementById('clearVitalSignsForm');

        if (patientSelect) {
            patientSelect.addEventListener('change', (e) => this.handlePatientSelection(e.target.value));
        }

        if (vitalSignsForm) {
            vitalSignsForm.addEventListener('submit', (e) => this.saveVitalSigns(e));
        }

        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', () => this.clearVitalSignsForm());
        }

        // Add event listeners for "View More" buttons in summary table
        const viewMoreButtons = document.querySelectorAll('.btn-view-more-vitals');
        viewMoreButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const patientId = e.currentTarget.getAttribute('data-patient-id');
                if (patientId) {
                    // Pass false to prevent reopening personal info modal (we're in vital signs tab)
                    this.showPatientVitalSignsModal(patientId, false);
                }
            });
        });

        // Check if there's a pre-selected patient from the patient list
        if (this.selectedPatientForVitalSigns) {
            patientSelect.value = this.selectedPatientForVitalSigns;
            this.handlePatientSelection(this.selectedPatientForVitalSigns);
            this.selectedPatientForVitalSigns = null; // Clear after use
        }
    }

    handlePatientSelection(patientId) {
        const selectedPatientInfo = document.getElementById('selectedPatientInfo');
        const vitalSignsForm = document.getElementById('vitalSignsForm');
        const vitalSignsHistory = document.getElementById('vitalSignsHistory');

        if (!patientId) {
            selectedPatientInfo.style.display = 'none';
            if (vitalSignsForm) vitalSignsForm.style.display = 'none';
            vitalSignsHistory.style.display = 'none';
            return;
        }

        // Get patient data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (!patient) {
            // Try fallback data
            const fallbackPatients = [
                { id: 'P001', fullName: 'Miranda, Hebrew T.', age: 19, status: 'Active', doctor: 'Dr. Sta. Maria' },
                { id: 'P002', fullName: 'Sta.Maria, Rizza M.', age: 20, status: 'Admitted', doctor: 'Dr. Sta. Maria' },
                { id: 'P003', fullName: 'Puquiz, Daniel T.', age: 21, status: 'Active', doctor: 'Dr. Salvador' }
            ];
            const fallbackPatient = fallbackPatients.find(p => p.id === patientId);
            if (fallbackPatient) {
                this.displayPatientInfo(fallbackPatient);
            }
        } else {
            this.displayPatientInfo(patient);
        }

        // Show patient info and history (form only for nurses)
        selectedPatientInfo.style.display = 'block';
        if (vitalSignsForm && this.currentUser.role === 'Nurse') {
            vitalSignsForm.style.display = 'block';
        }
        vitalSignsHistory.style.display = 'block';

        // Load vital signs history
        this.loadVitalSignsHistory(patientId);
    }

    displayPatientInfo(patient) {
        document.getElementById('displayPatientId').textContent = patient.id;
        document.getElementById('displayPatientName').textContent = patient.fullName;
        document.getElementById('displayPatientAge').textContent = patient.age;
        document.getElementById('displayPatientDoctor').textContent = patient.doctor || 'Not Assigned';
    }

    clearVitalSignsForm() {
        document.getElementById('systolic').value = '';
        document.getElementById('diastolic').value = '';
        document.getElementById('heartRate').value = '';
        document.getElementById('temperature').value = '';
        document.getElementById('respiratoryRate').value = '';
        document.getElementById('oxygenSaturation').value = '';
        document.getElementById('weight').value = '';
        document.getElementById('height').value = '';
        document.getElementById('painLevel').value = '';
        document.getElementById('vitalNotes').value = '';
    }

    saveVitalSigns(e) {
        e.preventDefault();

        const patientId = document.getElementById('vitalSignsPatient').value;
        if (!patientId) {
            this.showNotification('Please select a patient', 'error');
            return;
        }

        const vitalSignsData = {
            id: Date.now().toString(),
            patientId: patientId,
            bloodPressure: `${document.getElementById('systolic').value}/${document.getElementById('diastolic').value}`,
            systolic: parseInt(document.getElementById('systolic').value),
            diastolic: parseInt(document.getElementById('diastolic').value),
            heartRate: parseInt(document.getElementById('heartRate').value),
            temperature: parseFloat(document.getElementById('temperature').value),
            respiratoryRate: parseInt(document.getElementById('respiratoryRate').value),
            oxygenSaturation: parseFloat(document.getElementById('oxygenSaturation').value),
            weight: document.getElementById('weight').value ? parseFloat(document.getElementById('weight').value) : null,
            height: document.getElementById('height').value ? parseFloat(document.getElementById('height').value) : null,
            painLevel: document.getElementById('painLevel').value ? parseInt(document.getElementById('painLevel').value) : null,
            notes: document.getElementById('vitalNotes').value,
            recordedBy: this.currentUser.name,
            recordedAt: new Date().toISOString(),
            recordedDate: new Date().toLocaleDateString(),
            recordedTime: new Date().toLocaleTimeString()
        };

        // Get existing vital signs from localStorage
        let allVitalSigns = JSON.parse(localStorage.getItem('vitalSigns') || '[]');
        allVitalSigns.unshift(vitalSignsData); // Add to beginning of array
        localStorage.setItem('vitalSigns', JSON.stringify(allVitalSigns));

        this.showNotification('Vital signs saved successfully!', 'success');
        this.clearVitalSignsForm();
        this.loadVitalSignsHistory(patientId);
    }

    loadVitalSignsHistory(patientId) {
        const historyTable = document.getElementById('vitalSignsHistoryTable');
        const allVitalSigns = JSON.parse(localStorage.getItem('vitalSigns') || '[]');
        const patientVitalSigns = allVitalSigns.filter(vs => vs.patientId === patientId);

        if (patientVitalSigns.length === 0) {
            historyTable.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No vital signs recorded yet.</p>';
            return;
        }

        const tableHTML = `
            <div style="overflow-x: auto;">
                <table class="patients-table" style="min-width: 900px;">
                    <thead>
                        <tr>
                            <th style="width: 12%;">Date</th>
                            <th style="width: 10%;">Time</th>
                            <th style="width: 12%;">BP (mmHg)</th>
                            <th style="width: 11%;">HR (bpm)</th>
                            <th style="width: 11%;">Temp (°C)</th>
                            <th style="width: 8%;">RR</th>
                            <th style="width: 11%;">SpO2 (%)</th>
                            <th style="width: 9%;">Pain</th>
                            <th style="width: 16%;">Recorded By</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patientVitalSigns.map(vs => `
                            <tr>
                                <td>${vs.recordedDate}</td>
                                <td>${vs.recordedTime}</td>
                                <td><strong>${vs.bloodPressure}</strong></td>
                                <td>${vs.heartRate}</td>
                                <td>${vs.temperature}</td>
                                <td>${vs.respiratoryRate}</td>
                                <td>${vs.oxygenSaturation}%</td>
                                <td>${vs.painLevel !== null ? vs.painLevel + '/10' : '-'}</td>
                                <td>${vs.recordedBy}</td>
                            </tr>
                            ${vs.notes ? `
                            <tr style="background: #f8f9fa;">
                                <td colspan="9" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                    <strong style="color: var(--dark-pink);">Notes:</strong> ${vs.notes}
                                </td>
                            </tr>
                            ` : ''}
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        historyTable.innerHTML = tableHTML;
    }

    // Medications Listeners
    attachMedicationsListeners() {
        // Check if nurse role - different element IDs
        if (this.currentUser.role === 'Nurse') {
            const patientSelectNurse = document.getElementById('medicationsPatientNurse');
            
            if (patientSelectNurse) {
                patientSelectNurse.addEventListener('change', (e) => this.handleMedicationsNursePatientSelection(e.target.value));
            }

            // Add event listeners for view buttons in summary table
            const viewDetailButtons = document.querySelectorAll('.btn-view-medication-details');
            viewDetailButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const medicationId = e.currentTarget.getAttribute('data-medication-id');
                    if (medicationId) {
                        this.showMedicationDetailsModalNurse(medicationId);
                    }
                });
            });
        } else {
            // Physician medications listeners
            const patientSelect = document.getElementById('medicationsPatient');
            const medicationsForm = document.getElementById('newMedicationForm');
            const clearFormBtn = document.getElementById('clearMedicationsForm');

            if (patientSelect) {
                patientSelect.addEventListener('change', (e) => this.handleMedicationsPatientSelection(e.target.value));
            }

            if (medicationsForm) {
                medicationsForm.addEventListener('submit', (e) => this.saveMedication(e));
            }

            if (clearFormBtn) {
                clearFormBtn.addEventListener('click', () => this.clearMedicationsForm());
            }

            // Add event listeners for "View More" buttons in summary table
            const viewMoreButtons = document.querySelectorAll('.btn-view-more-medications');
            viewMoreButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const patientId = e.currentTarget.getAttribute('data-patient-id');
                    if (patientId) {
                        this.showPatientMedicationsModal(patientId);
                    }
                });
            });

            // Check if there's a pre-selected patient from the patient list
            if (this.selectedPatientForMedications) {
                patientSelect.value = this.selectedPatientForMedications;
                this.handleMedicationsPatientSelection(this.selectedPatientForMedications);
                this.selectedPatientForMedications = null; // Clear after use
            }
        }
    }

    handleMedicationsPatientSelection(patientId) {
        const selectedPatientInfo = document.getElementById('selectedPatientInfoMedications');
        const medicationsForm = document.getElementById('medicationsForm');
        const medicationsHistory = document.getElementById('medicationsHistory');

        if (!patientId) {
            selectedPatientInfo.style.display = 'none';
            if (medicationsForm) medicationsForm.style.display = 'none';
            medicationsHistory.style.display = 'none';
            return;
        }

        // Get patient data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (patient) {
            // Display patient info
            this.displayPatientInfoMedications(patient);
            selectedPatientInfo.style.display = 'block';
            if (medicationsForm) medicationsForm.style.display = 'block';
            medicationsHistory.style.display = 'block';

            // Load medications history
            this.loadMedicationsHistory(patientId);
        }
    }

    displayPatientInfoMedications(patient) {
        document.getElementById('selectedPatientNameMedications').textContent = patient.fullName;
        document.getElementById('selectedPatientIdMedications').textContent = patient.id;
        document.getElementById('selectedPatientAgeMedications').textContent = patient.age;
        document.getElementById('selectedPatientStatusMedications').textContent = patient.status;
        document.getElementById('selectedPatientDoctorMedications').textContent = patient.doctor || 'Not Assigned';
    }

    clearMedicationsForm() {
        document.getElementById('medicationName').value = '';
        document.getElementById('dosage').value = '';
        document.getElementById('frequency').value = '';
        document.getElementById('route').value = '';
        document.getElementById('duration').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('medicationNotes').value = '';
    }

    saveMedication(e) {
        e.preventDefault();

        const patientId = document.getElementById('medicationsPatient').value;
        if (!patientId) {
            this.showNotification('Please select a patient first', 'error');
            return;
        }

        // Get form values
        const medication = {
            id: 'MED' + Date.now(),
            patientId: patientId,
            medicationName: document.getElementById('medicationName').value,
            dosage: document.getElementById('dosage').value,
            frequency: document.getElementById('frequency').value,
            route: document.getElementById('route').value,
            duration: document.getElementById('duration').value || 'Not specified',
            startDate: document.getElementById('startDate').value,
            notes: document.getElementById('medicationNotes').value,
            prescribedBy: 'Dr. Sta. Maria',
            prescribedDate: new Date().toLocaleDateString('en-US'),
            prescribedTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        // Get existing medications
        let medications = JSON.parse(localStorage.getItem('medications') || '[]');
        
        // Add new medication at the beginning (most recent first)
        medications.unshift(medication);
        
        // Save to localStorage
        localStorage.setItem('medications', JSON.stringify(medications));

        this.showNotification('Medication prescribed successfully!', 'success');
        
        // Clear form and reload history
        this.clearMedicationsForm();
        this.loadMedicationsHistory(patientId);
    }

    loadMedicationsHistory(patientId) {
        const historyTable = document.getElementById('medicationsHistoryTable');
        if (!historyTable) return;

        const allMedications = JSON.parse(localStorage.getItem('medications') || '[]');
        const patientMedications = allMedications.filter(med => med.patientId === patientId);

        if (patientMedications.length === 0) {
            historyTable.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No medications prescribed yet.</p>';
            return;
        }

        const tableHTML = `
            <div style="overflow-x: auto;">
                <table class="patients-table" style="min-width: 1000px;">
                    <thead>
                        <tr>
                            <th style="width: 15%;">Medication</th>
                            <th style="width: 10%;">Dosage</th>
                            <th style="width: 12%;">Frequency</th>
                            <th style="width: 10%;">Route</th>
                            <th style="width: 10%;">Duration</th>
                            <th style="width: 10%;">Start Date</th>
                            <th style="width: 10%;">Date Prescribed</th>
                            <th style="width: 13%;">Prescribed By</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patientMedications.map(med => `
                            <tr>
                                <td><strong>${med.medicationName}</strong></td>
                                <td>${med.dosage}</td>
                                <td>${med.frequency}</td>
                                <td>${med.route}</td>
                                <td>${med.duration}</td>
                                <td>${med.startDate}</td>
                                <td>${med.prescribedDate}</td>
                                <td>${med.prescribedBy}</td>
                            </tr>
                            ${med.notes ? `
                            <tr style="background: #f8f9fa;">
                                <td colspan="8" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                    <strong style="color: var(--dark-pink);">Notes:</strong> ${med.notes}
                                </td>
                            </tr>
                            ` : ''}
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        historyTable.innerHTML = tableHTML;
    }

    showPatientMedicationsModal(patientId, returnToPersonalInfo = false) {
        // Get patient data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        let patient = patients.find(p => p.id === patientId);

        // Fallback to sample data
        if (!patient) {
            const fallbackPatients = [
                { id: 'P001', fullName: 'Miranda, Hebrew T.', age: 19, status: 'Active', doctor: 'Dr. Sta. Maria' },
                { id: 'P002', fullName: 'Sta.Maria, Rizza M.', age: 20, status: 'Admitted', doctor: 'Dr. Sta. Maria' },
                { id: 'P003', fullName: 'Puquiz, Daniel T.', age: 21, status: 'Active', doctor: 'Dr. Salvador' }
            ];
            patient = fallbackPatients.find(p => p.id === patientId);
        }

        if (!patient) {
            this.showNotification('Patient not found', 'error');
            return;
        }

        // Get medications for this patient
        const allMedications = JSON.parse(localStorage.getItem('medications') || '[]');
        const patientMedications = allMedications.filter(med => med.patientId === patientId);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 1000px;">
                <h2 style="color: var(--dark-pink); margin-bottom: 20px;">
                    <i class="fas fa-pills"></i> Medication History - ${patient.fullName}
                </h2>

                <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                        <div><strong>Patient ID:</strong> ${patient.id}</div>
                        <div><strong>Age:</strong> ${patient.age}</div>
                        <div><strong>Physician:</strong> ${patient.doctor || 'Not Assigned'}</div>
                        <div><strong>Status:</strong> ${patient.status}</div>
                    </div>
                </div>

                ${patientMedications.length > 0 ? `
                <div style="overflow-x: auto;">
                    <table class="patients-table" style="min-width: 900px;">
                        <thead>
                            <tr>
                                <th style="width: 15%;">Medication</th>
                                <th style="width: 10%;">Dosage</th>
                                <th style="width: 12%;">Frequency</th>
                                <th style="width: 10%;">Route</th>
                                <th style="width: 10%;">Duration</th>
                                <th style="width: 10%;">Start Date</th>
                                <th style="width: 10%;">Prescribed</th>
                                <th style="width: 13%;">Prescribed By</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${patientMedications.map(med => `
                                <tr>
                                    <td><strong>${med.medicationName}</strong></td>
                                    <td>${med.dosage}</td>
                                    <td>${med.frequency}</td>
                                    <td>${med.route}</td>
                                    <td>${med.duration}</td>
                                    <td>${med.startDate}</td>
                                    <td>${med.prescribedDate}</td>
                                    <td>${med.prescribedBy}</td>
                                </tr>
                                ${med.notes ? `
                                <tr style="background: #f8f9fa;">
                                    <td colspan="8" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                        <strong style="color: var(--dark-pink);">Notes:</strong> ${med.notes}
                                    </td>
                                </tr>
                                ` : ''}
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ` : `
                <div style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-pills" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                    <p style="font-size: 16px;">No medications prescribed yet for this patient.</p>
                </div>
                `}

                <div class="modal-actions" style="margin-top: 24px;">
                    <button type="button" class="btn btn-secondary" id="closeMedicationsBtn">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeModal = () => {
            modal.remove();
            if (returnToPersonalInfo) {
                this.viewPersonalInfo(patientId);
            }
        };

        document.getElementById('closeMedicationsBtn').addEventListener('click', closeModal);
    }

    // Nurse Medications Handlers
    handleMedicationsNursePatientSelection(patientId) {
        const selectedPatientInfo = document.getElementById('selectedPatientInfoMedicationsNurse');
        const medicationsTable = document.getElementById('medicationsTableNurse');

        if (!patientId) {
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'none';
            if (medicationsTable) medicationsTable.style.display = 'none';
            return;
        }

        // Get patient data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (patient) {
            // Display patient info
            this.displayPatientInfoMedicationsNurse(patient);
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'block';
            if (medicationsTable) medicationsTable.style.display = 'block';

            // Load medications for this patient
            this.loadPatientMedicationsNurse(patientId);
        }
    }

    displayPatientInfoMedicationsNurse(patient) {
        document.getElementById('selectedPatientNameMedicationsNurse').textContent = patient.fullName;
        document.getElementById('selectedPatientIdMedicationsNurse').textContent = patient.id;
        document.getElementById('selectedPatientAgeMedicationsNurse').textContent = patient.age;
        document.getElementById('selectedPatientStatusMedicationsNurse').textContent = patient.status;
        document.getElementById('selectedPatientDoctorMedicationsNurse').textContent = patient.doctor || 'Not Assigned';
    }

    loadPatientMedicationsNurse(patientId) {
        const medicationsList = document.getElementById('medicationsListNurse');
        if (!medicationsList) return;

        const allMedications = JSON.parse(localStorage.getItem('medications') || '[]');
        const dispensingRecords = JSON.parse(localStorage.getItem('dispensingRecords') || '[]');
        const patientMedications = allMedications.filter(med => med.patientId === patientId);

        if (patientMedications.length === 0) {
            medicationsList.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px; color: #999;">No medications prescribed for this patient.</td></tr>';
            return;
        }

        let rowsHTML = '';
        patientMedications.forEach(med => {
            // Check if medication has been dispensed
            const dispensed = dispensingRecords.find(dr => 
                dr.patientId === patientId && 
                dr.medicationName === med.medicationName
            );

            const statusBadge = dispensed 
                ? '<span class="status-badge completed">Dispensed</span>' 
                : '<span class="status-badge pending">Not Dispensed</span>';

            rowsHTML += `
                <tr>
                    <td><strong>${med.medicationName}</strong></td>
                    <td>${med.dosage}</td>
                    <td>${med.frequency}</td>
                    <td>${med.route}</td>
                    <td>${med.duration}</td>
                    <td>${med.startDate}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="btn btn-sm btn-view-medication-detail" data-medication-id="${med.id}">
                            <i class="fas fa-eye"></i> Details
                        </button>
                    </td>
                </tr>
                ${med.notes ? `
                <tr style="background: #f8f9fa;">
                    <td colspan="8" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                        <strong style="color: var(--dark-pink);">Instructions:</strong> ${med.notes}
                    </td>
                </tr>
                ` : ''}
            `;
        });

        medicationsList.innerHTML = rowsHTML;

        // Attach click listeners to detail buttons
        const detailButtons = document.querySelectorAll('.btn-view-medication-detail');
        detailButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const medicationId = e.currentTarget.getAttribute('data-medication-id');
                if (medicationId) {
                    this.showMedicationDetailsModalNurse(medicationId);
                }
            });
        });
    }

    showMedicationDetailsModalNurse(medicationId) {
        const allMedications = JSON.parse(localStorage.getItem('medications') || '[]');
        const dispensingRecords = JSON.parse(localStorage.getItem('dispensingRecords') || '[]');
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');

        const medication = allMedications.find(med => med.id === medicationId);
        if (!medication) {
            this.showNotification('Medication not found', 'error');
            return;
        }

        const patient = patients.find(p => p.id === medication.patientId);
        const dispensed = dispensingRecords.find(dr => 
            dr.patientId === medication.patientId && 
            dr.medicationName === medication.medicationName
        );

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <h2 style="color: var(--dark-pink); margin-bottom: 20px;">
                    <i class="fas fa-pills"></i> Medication Details
                </h2>

                <!-- Patient Information -->
                <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                    <h4 style="color: var(--dark-pink); margin-bottom: 10px;">Patient Information</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <div><strong>Name:</strong> ${patient?.fullName || 'Unknown'}</div>
                        <div><strong>Patient ID:</strong> ${medication.patientId}</div>
                        <div><strong>Age:</strong> ${patient?.age || 'N/A'}</div>
                        <div><strong>Status:</strong> ${patient?.status || 'N/A'}</div>
                    </div>
                </div>

                <!-- Medication Information -->
                <div style="margin-bottom: 20px; padding: 20px; background: white; border: 1px solid #e1e8ed; border-radius: 8px;">
                    <h4 style="color: var(--dark-pink); margin-bottom: 16px;">Prescription Details</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;">
                        <div>
                            <strong style="color: #666;">Medication Name:</strong>
                            <div style="font-size: 16px; margin-top: 4px;">${medication.medicationName}</div>
                        </div>
                        <div>
                            <strong style="color: #666;">Dosage:</strong>
                            <div style="font-size: 16px; margin-top: 4px;">${medication.dosage}</div>
                        </div>
                        <div>
                            <strong style="color: #666;">Frequency:</strong>
                            <div style="font-size: 16px; margin-top: 4px;">${medication.frequency}</div>
                        </div>
                        <div>
                            <strong style="color: #666;">Route:</strong>
                            <div style="font-size: 16px; margin-top: 4px;">${medication.route}</div>
                        </div>
                        <div>
                            <strong style="color: #666;">Duration:</strong>
                            <div style="font-size: 16px; margin-top: 4px;">${medication.duration}</div>
                        </div>
                        <div>
                            <strong style="color: #666;">Start Date:</strong>
                            <div style="font-size: 16px; margin-top: 4px;">${medication.startDate}</div>
                        </div>
                        <div>
                            <strong style="color: #666;">Prescribed By:</strong>
                            <div style="font-size: 16px; margin-top: 4px;">${medication.prescribedBy}</div>
                        </div>
                        <div>
                            <strong style="color: #666;">Prescribed Date:</strong>
                            <div style="font-size: 16px; margin-top: 4px;">${medication.prescribedDate}</div>
                        </div>
                    </div>
                    ${medication.notes ? `
                        <div style="margin-top: 16px; padding: 12px; background: #f8f9fa; border-left: 3px solid var(--dark-pink); border-radius: 4px;">
                            <strong style="color: var(--dark-pink);">Instructions / Notes:</strong>
                            <div style="margin-top: 8px;">${medication.notes}</div>
                        </div>
                    ` : ''}
                </div>

                <!-- Dispensing Status -->
                <div style="margin-bottom: 20px; padding: 20px; background: ${dispensed ? '#d4edda' : '#fff3cd'}; border: 1px solid ${dispensed ? '#c3e6cb' : '#ffeeba'}; border-radius: 8px;">
                    <h4 style="color: ${dispensed ? '#155724' : '#856404'}; margin-bottom: 12px;">
                        <i class="fas fa-${dispensed ? 'check-circle' : 'clock'}"></i> Dispensing Status
                    </h4>
                    ${dispensed ? `
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; color: #155724;">
                            <div><strong>Status:</strong> Dispensed</div>
                            <div><strong>Quantity:</strong> ${dispensed.quantity}</div>
                            <div><strong>Dispensed By:</strong> ${dispensed.dispensedBy}</div>
                            <div><strong>Date:</strong> ${dispensed.dispensedDate}</div>
                        </div>
                        ${dispensed.notes ? `
                            <div style="margin-top: 12px; padding: 10px; background: white; border-radius: 4px;">
                                <strong>Pharmacist Notes:</strong> ${dispensed.notes}
                            </div>
                        ` : ''}
                    ` : `
                        <div style="color: #856404;">
                            <strong>Status:</strong> Not yet dispensed - waiting for pharmacist
                        </div>
                    `}
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" id="closeMedicationDetailModalNurse">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeModal = () => modal.remove();
        document.getElementById('closeMedicationDetailModalNurse').addEventListener('click', closeModal);
    }

    // Prescriptions Listeners
    attachPrescriptionsListeners() {
        const patientSelect = document.getElementById('prescriptionsPatient');

        if (patientSelect) {
            patientSelect.addEventListener('change', (e) => this.handlePrescriptionsPatientSelection(e.target.value));
        }

        // Add event listeners for "View More" buttons in summary table
        const viewMoreButtons = document.querySelectorAll('.btn-view-more-prescriptions');
        viewMoreButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const patientId = e.currentTarget.getAttribute('data-patient-id');
                if (patientId) {
                    this.showPatientPrescriptionsModal(patientId);
                }
            });
        });
    }

    handlePrescriptionsPatientSelection(patientId) {
        const selectedPatientInfo = document.getElementById('selectedPatientInfoPrescriptions');
        const prescriptionsHistory = document.getElementById('prescriptionsHistory');

        if (!patientId) {
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'none';
            if (prescriptionsHistory) prescriptionsHistory.style.display = 'none';
            return;
        }

        // Get patient data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (patient) {
            // Display patient info
            this.displayPatientInfoPrescriptions(patient);
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'block';
            if (prescriptionsHistory) prescriptionsHistory.style.display = 'block';

            // Load prescriptions history
            this.loadPrescriptionsHistory(patientId);
        }
    }

    displayPatientInfoPrescriptions(patient) {
        const nameEl = document.getElementById('selectedPatientNamePrescriptions');
        const idEl = document.getElementById('selectedPatientIdPrescriptions');
        const ageEl = document.getElementById('selectedPatientAgePrescriptions');
        const statusEl = document.getElementById('selectedPatientStatusPrescriptions');
        const doctorEl = document.getElementById('selectedPatientDoctorPrescriptions');

        if (nameEl) nameEl.textContent = patient.fullName;
        if (idEl) idEl.textContent = patient.id;
        if (ageEl) ageEl.textContent = patient.age;
        if (statusEl) statusEl.textContent = patient.status;
        if (doctorEl) doctorEl.textContent = patient.doctor || 'Not Assigned';
    }

    loadPrescriptionsHistory(patientId) {
        const historyTable = document.getElementById('prescriptionsHistoryTable');
        if (!historyTable) return;

        const allPrescriptions = JSON.parse(localStorage.getItem('medications') || '[]');
        const patientPrescriptions = allPrescriptions.filter(med => med.patientId === patientId);

        if (patientPrescriptions.length === 0) {
            historyTable.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No prescriptions yet.</p>';
            return;
        }

        const tableHTML = `
            <div style="overflow-x: auto;">
                <table class="patients-table" style="min-width: 1000px;">
                    <thead>
                        <tr>
                            <th style="width: 15%;">Medication</th>
                            <th style="width: 10%;">Dosage</th>
                            <th style="width: 12%;">Frequency</th>
                            <th style="width: 10%;">Route</th>
                            <th style="width: 10%;">Duration</th>
                            <th style="width: 10%;">Start Date</th>
                            <th style="width: 10%;">Date Prescribed</th>
                            <th style="width: 13%;">Prescribed By</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patientPrescriptions.map(med => `
                            <tr>
                                <td><strong>${med.medicationName}</strong></td>
                                <td>${med.dosage}</td>
                                <td>${med.frequency}</td>
                                <td>${med.route}</td>
                                <td>${med.duration}</td>
                                <td>${med.startDate}</td>
                                <td>${med.prescribedDate}</td>
                                <td>${med.prescribedBy}</td>
                            </tr>
                            ${med.notes ? `
                            <tr style="background: #f8f9fa;">
                                <td colspan="8" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                    <strong style="color: var(--dark-pink);">Notes:</strong> ${med.notes}
                                </td>
                            </tr>
                            ` : ''}
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        historyTable.innerHTML = tableHTML;
    }

    showPatientPrescriptionsModal(patientId) {
        // Get patient data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        let patient = patients.find(p => p.id === patientId);

        // Fallback to sample data
        if (!patient) {
            const fallbackPatients = [
                { id: 'P001', fullName: 'Miranda, Hebrew T.', age: 19, status: 'Active', doctor: 'Dr. Sta. Maria' },
                { id: 'P002', fullName: 'Sta.Maria, Rizza M.', age: 20, status: 'Admitted', doctor: 'Dr. Sta. Maria' },
                { id: 'P003', fullName: 'Puquiz, Daniel T.', age: 21, status: 'Active', doctor: 'Dr. Salvador' }
            ];
            patient = fallbackPatients.find(p => p.id === patientId);
        }

        if (!patient) {
            this.showNotification('Patient not found', 'error');
            return;
        }

        // Get prescriptions for this patient
        const allPrescriptions = JSON.parse(localStorage.getItem('medications') || '[]');
        const patientPrescriptions = allPrescriptions.filter(med => med.patientId === patientId);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 1000px;">
                <div class="modal-header">
                    <h2>Prescriptions - ${patient.fullName}</h2>
                    <button class="modal-close" id="closePrescriptionsModalBtn">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- Patient Info -->
                    <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                        <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                            <i class="fas fa-user-injured"></i> Patient Information
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                            <div><strong>Patient ID:</strong> ${patient.id}</div>
                            <div><strong>Name:</strong> ${patient.fullName}</div>
                            <div><strong>Age:</strong> ${patient.age}</div>
                            <div><strong>Doctor:</strong> ${patient.doctor || 'Not Assigned'}</div>
                        </div>
                    </div>

                    ${patientPrescriptions.length > 0 ? `
                    <div style="overflow-x: auto;">
                        <table class="patients-table" style="min-width: 1000px;">
                            <thead>
                                <tr>
                                    <th style="width: 15%;">Medication</th>
                                    <th style="width: 10%;">Dosage</th>
                                    <th style="width: 12%;">Frequency</th>
                                    <th style="width: 10%;">Route</th>
                                    <th style="width: 10%;">Duration</th>
                                    <th style="width: 10%;">Start Date</th>
                                    <th style="width: 10%;">Date Prescribed</th>
                                    <th style="width: 13%;">Prescribed By</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${patientPrescriptions.map(med => `
                                    <tr>
                                        <td><strong>${med.medicationName}</strong></td>
                                        <td>${med.dosage}</td>
                                        <td>${med.frequency}</td>
                                        <td>${med.route}</td>
                                        <td>${med.duration}</td>
                                        <td>${med.startDate}</td>
                                        <td>${med.prescribedDate}</td>
                                        <td>${med.prescribedBy}</td>
                                    </tr>
                                    ${med.notes ? `
                                    <tr style="background: #f8f9fa;">
                                        <td colspan="8" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                            <strong style="color: var(--dark-pink);">Notes:</strong> ${med.notes}
                                        </td>
                                    </tr>
                                    ` : ''}
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : `
                    <div style="text-align: center; padding: 40px; color: #999;">
                        <i class="fas fa-prescription" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                        <p style="font-size: 16px;">No prescriptions yet for this patient.</p>
                    </div>
                    `}

                    <div class="modal-actions" style="margin-top: 24px;">
                        <button type="button" class="btn btn-secondary" id="closePrescriptionsBtn">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeModal = () => modal.remove();
        document.getElementById('closePrescriptionsModalBtn').addEventListener('click', closeModal);
        document.getElementById('closePrescriptionsBtn').addEventListener('click', closeModal);
    }

    // Lab Results Listeners
    attachLabResultsListeners() {
        const patientSelect = document.getElementById('labResultsPatient');
        const labResultsForm = document.getElementById('newLabResultForm');
        const clearFormBtn = document.getElementById('clearLabResultsForm');
        const resultFileInput = document.getElementById('resultFile');
        const resultFileName = document.getElementById('resultFileName');

        if (patientSelect) {
            patientSelect.addEventListener('change', (e) => this.handleLabResultsPatientSelection(e.target.value));
        }

        if (labResultsForm) {
            labResultsForm.addEventListener('submit', async (e) => await this.saveLabResult(e));
        }

        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', () => this.clearLabResultsForm());
        }

        // File upload display handler
        if (resultFileInput && resultFileName) {
            resultFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    resultFileName.textContent = e.target.files[0].name;
                    resultFileName.style.color = '#333';
                } else {
                    resultFileName.textContent = 'No file chosen';
                    resultFileName.style.color = '#666';
                }
            });
        }

        const viewMoreButtons = document.querySelectorAll('.btn-view-more-labs');
        viewMoreButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const patientId = e.currentTarget.getAttribute('data-patient-id');
                if (patientId) {
                    this.showPatientLabResultsModal(patientId);
                }
            });
        });

        if (this.selectedPatientForLabResults) {
            patientSelect.value = this.selectedPatientForLabResults;
            this.handleLabResultsPatientSelection(this.selectedPatientForLabResults);
            this.selectedPatientForLabResults = null;
        }
    }

    handleLabResultsPatientSelection(patientId) {
        const selectedPatientInfo = document.getElementById('selectedPatientInfoLabs');
        const labResultsForm = document.getElementById('labResultsForm');
        const labResultsHistory = document.getElementById('labResultsHistory');

        if (!patientId) {
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'none';
            if (labResultsForm) labResultsForm.style.display = 'none';
            if (labResultsHistory) labResultsHistory.style.display = 'none';
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (patient) {
            this.displayPatientInfoLabs(patient);
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'block';
            if (labResultsForm) labResultsForm.style.display = 'block';
            if (labResultsHistory) labResultsHistory.style.display = 'block';
            this.loadLabResultsHistory(patientId);
        }
    }

    displayPatientInfoLabs(patient) {
        const nameEl = document.getElementById('selectedPatientNameLabs');
        const idEl = document.getElementById('selectedPatientIdLabs');
        const ageEl = document.getElementById('selectedPatientAgeLabs');
        const statusEl = document.getElementById('selectedPatientStatusLabs');
        const doctorEl = document.getElementById('selectedPatientDoctorLabs');

        if (nameEl) nameEl.textContent = patient.fullName;
        if (idEl) idEl.textContent = patient.id;
        if (ageEl) ageEl.textContent = patient.age;
        if (statusEl) statusEl.textContent = patient.status;
        if (doctorEl) doctorEl.textContent = patient.doctor || 'Not Assigned';
    }

    clearLabResultsForm() {
        document.getElementById('testType').value = '';
        document.getElementById('testDate').value = '';
        document.getElementById('labStatus').value = 'Completed';
        document.getElementById('labResultDetails').value = '';
        document.getElementById('resultFile').value = '';
        
        // Reset file name display
        const resultFileName = document.getElementById('resultFileName');
        if (resultFileName) {
            resultFileName.textContent = 'No file chosen';
            resultFileName.style.color = '#666';
        }
    }

    async saveLabResult(e) {
        e.preventDefault();

        const patientId = document.getElementById('labResultsPatient').value;
        if (!patientId) {
            this.showNotification('Please select a patient first', 'error');
            return;
        }

        const labResult = {
            id: 'LAB' + Date.now(),
            patientId: patientId,
            testType: document.getElementById('testType').value,
            testDate: document.getElementById('testDate').value,
            status: document.getElementById('labStatus').value,
            resultDetails: document.getElementById('labResultDetails').value,
            performedBy: this.currentUser.name,
            recordedDate: new Date().toLocaleDateString('en-US'),
            recordedTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        // Handle file upload to IndexedDB
        const fileInput = document.getElementById('resultFile');
        const file = fileInput?.files[0];
        
        if (file) {
            try {
                const fileData = await fileStorage.saveFile('labResults', labResult.id, file);
                labResult.fileData = fileData;
            } catch (error) {
                console.error('Error saving file:', error);
                this.showNotification('Lab result saved but file upload failed', 'warning');
            }
        }

        let labResults = JSON.parse(localStorage.getItem('labResults') || '[]');
        labResults.unshift(labResult);
        localStorage.setItem('labResults', JSON.stringify(labResults));

        this.showNotification('Lab result saved successfully!', 'success');
        this.clearLabResultsForm();
        this.loadLabResultsHistory(patientId);
    }

    loadLabResultsHistory(patientId) {
        const historyTable = document.getElementById('labResultsHistoryTable');
        if (!historyTable) return;

        const allLabResults = JSON.parse(localStorage.getItem('labResults') || '[]');
        const patientLabResults = allLabResults.filter(lab => lab.patientId === patientId);

        if (patientLabResults.length === 0) {
            historyTable.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No lab results yet.</p>';
            return;
        }

        const tableHTML = `
            <div style="overflow-x: auto;">
                <table class="patients-table" style="min-width: 1000px;">
                    <thead>
                        <tr>
                            <th style="width: 18%;">Test Type</th>
                            <th style="width: 12%;">Test Date</th>
                            <th style="width: 10%;">Status</th>
                            <th style="width: 15%;">Performed By</th>
                            <th style="width: 12%;">Recorded Date</th>
                            <th style="width: 10%;">File</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patientLabResults.map(lab => `
                            <tr>
                                <td><strong>${lab.testType}</strong></td>
                                <td>${lab.testDate}</td>
                                <td><span class="status-badge ${lab.status.toLowerCase().replace(' ', '-')}">${lab.status}</span></td>
                                <td>${lab.performedBy}</td>
                                <td>${lab.recordedDate}</td>
                                <td>
                                    ${lab.fileData ? `
                                        <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px; background: var(--info-blue); color: white; margin-right: 4px;" 
                                                onclick="fileStorage.viewFile('labResults', '${lab.id}')">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px; background: var(--dark-pink); color: white;" 
                                                onclick="fileStorage.downloadFile('labResults', '${lab.id}')">
                                            <i class="fas fa-download"></i>
                                        </button>
                                    ` : '<span style="color: #999; font-size: 12px;">-</span>'}
                                </td>
                            </tr>
                            <tr style="background: #f8f9fa;">
                                <td colspan="6" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                    <strong style="color: var(--dark-pink);">Results:</strong> ${lab.resultDetails}
                                    ${lab.fileData ? `<br><small style="color: #666;"><i class="fas fa-paperclip"></i> ${lab.fileData.fileName} (${(lab.fileData.fileSize / 1024).toFixed(1)} KB)</small>` : ''}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        historyTable.innerHTML = tableHTML;
    }

    showPatientLabResultsModal(patientId, returnToPersonalInfo = true) {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (!patient) {
            this.showNotification('Patient not found', 'error');
            return;
        }

        const allLabResults = JSON.parse(localStorage.getItem('labResults') || '[]');
        const patientLabResults = allLabResults.filter(lab => lab.patientId === patientId);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 1000px;">
                <div class="modal-header">
                    <h2>Lab Results - ${patient.fullName}</h2>
                    <button class="modal-close" id="closeLabResultsModalBtn">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                        <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                            <i class="fas fa-user-injured"></i> Patient Information
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                            <div><strong>Patient ID:</strong> ${patient.id}</div>
                            <div><strong>Name:</strong> ${patient.fullName}</div>
                            <div><strong>Age:</strong> ${patient.age}</div>
                            <div><strong>Doctor:</strong> ${patient.doctor || 'Not Assigned'}</div>
                        </div>
                    </div>

                    ${patientLabResults.length > 0 ? `
                    <div style="overflow-x: auto;">
                        <table class="patients-table" style="min-width: 1000px;">
                            <thead>
                                <tr>
                                    <th style="width: 18%;">Test Type</th>
                                    <th style="width: 12%;">Test Date</th>
                                    <th style="width: 10%;">Status</th>
                                    <th style="width: 15%;">Performed By</th>
                                    <th style="width: 12%;">Recorded Date</th>
                                    <th style="width: 10%;">File</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${patientLabResults.map(lab => `
                                    <tr>
                                        <td><strong>${lab.testType}</strong></td>
                                        <td>${lab.testDate}</td>
                                        <td><span class="status-badge ${lab.status.toLowerCase().replace(' ', '-')}">${lab.status}</span></td>
                                        <td>${lab.performedBy}</td>
                                        <td>${lab.recordedDate}</td>
                                        <td>
                                            ${lab.fileData ? `
                                                <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px; background: var(--info-blue); color: white; margin-right: 4px;" 
                                                        onclick="fileStorage.viewFile('labResults', '${lab.id}')">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                                <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px; background: var(--dark-pink); color: white;" 
                                                        onclick="fileStorage.downloadFile('labResults', '${lab.id}')">
                                                    <i class="fas fa-download"></i>
                                                </button>
                                            ` : '<span style="color: #999; font-size: 12px;">-</span>'}
                                        </td>
                                    </tr>
                                    <tr style="background: #f8f9fa;">
                                        <td colspan="6" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                            <strong style="color: var(--dark-pink);">Results:</strong> ${lab.resultDetails}
                                            ${lab.fileData ? `<br><small style="color: #666; margin-top: 6px; display: inline-block;">
                                                <i class="fas fa-paperclip"></i> ${lab.fileData.fileName} 
                                                <span style="color: #999;">(${(lab.fileData.fileSize / 1024).toFixed(1)} KB)</span>
                                            </small>` : ''}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : `
                    <div style="text-align: center; padding: 40px; color: #999;">
                        <i class="fas fa-flask" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                        <p style="font-size: 16px;">No lab results yet for this patient.</p>
                    </div>
                    `}

                    <div class="modal-actions" style="margin-top: 24px;">
                        <button type="button" class="btn btn-secondary" id="closeLabResultsBtn">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeAndReopenPersonalInfo = () => {
            modal.remove();
            if (returnToPersonalInfo) {
                this.viewPersonalInfo(patientId);
            }
        };
        document.getElementById('closeLabResultsModalBtn').addEventListener('click', closeAndReopenPersonalInfo);
        document.getElementById('closeLabResultsBtn').addEventListener('click', closeAndReopenPersonalInfo);
    }

    showPatientImagingResultsModal(patientId, returnToPersonalInfo = true) {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (!patient) {
            this.showNotification('Patient not found', 'error');
            return;
        }

        const allImagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');
        const patientImagingResults = allImagingResults.filter(img => img.patientId === patientId);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 1000px;">
                <div class="modal-header">
                    <h2>Imaging Results - ${patient.fullName}</h2>
                    <button class="modal-close" id="closeImagingResultsModalBtn">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                        <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                            <i class="fas fa-user-injured"></i> Patient Information
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                            <div><strong>Patient ID:</strong> ${patient.id}</div>
                            <div><strong>Name:</strong> ${patient.fullName}</div>
                            <div><strong>Age:</strong> ${patient.age}</div>
                            <div><strong>Doctor:</strong> ${patient.doctor || 'Not Assigned'}</div>
                        </div>
                    </div>

                    ${patientImagingResults.length > 0 ? `
                    <div style="overflow-x: auto;">
                        <table class="patients-table" style="min-width: 1000px;">
                            <thead>
                                <tr>
                                    <th style="width: 15%;">Modality</th>
                                    <th style="width: 12%;">Date</th>
                                    <th style="width: 10%;">Status</th>
                                    <th style="width: 15%;">Performed By</th>
                                    <th style="width: 12%;">Recorded Date</th>
                                    <th style="width: 10%;">File</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${patientImagingResults.map(img => `
                                    <tr>
                                        <td><strong>${img.imagingModality}</strong></td>
                                        <td>${img.imagingDate}</td>
                                        <td><span class="status-badge ${img.status.toLowerCase().replace(' ', '-')}">${img.status}</span></td>
                                        <td>${img.performedBy}</td>
                                        <td>${img.recordedDate}</td>
                                        <td>
                                            ${img.fileData ? `
                                                <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px; background: var(--info-blue); color: white; margin-right: 4px;" 
                                                        onclick="fileStorage.viewFile('imagingResults', '${img.id}')">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                                <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px; background: var(--dark-pink); color: white;" 
                                                        onclick="fileStorage.downloadFile('imagingResults', '${img.id}')">
                                                    <i class="fas fa-download"></i>
                                                </button>
                                            ` : '<span style="color: #999; font-size: 12px;">-</span>'}
                                        </td>
                                    </tr>
                                    <tr style="background: #f8f9fa;">
                                        <td colspan="6" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                            <strong style="color: var(--dark-pink);">Findings:</strong> ${img.imagingFindings}
                                            ${img.fileData ? `<br><small style="color: #666; margin-top: 6px; display: inline-block;">
                                                <i class="fas fa-paperclip"></i> ${img.fileData.fileName} 
                                                <span style="color: #999;">(${(img.fileData.fileSize / 1024).toFixed(1)} KB)</span>
                                            </small>` : ''}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : `
                    <div style="text-align: center; padding: 40px; color: #999;">
                        <i class="fas fa-x-ray" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                        <p style="font-size: 16px;">No imaging results yet for this patient.</p>
                    </div>
                    `}

                    <div class="modal-actions" style="margin-top: 24px;">
                        <button type="button" class="btn btn-secondary" id="closeImagingResultsBtn">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeAndReopenPersonalInfo = () => {
            modal.remove();
            if (returnToPersonalInfo) {
                this.viewPersonalInfo(patientId);
            }
        };
        document.getElementById('closeImagingResultsModalBtn').addEventListener('click', closeAndReopenPersonalInfo);
        document.getElementById('closeImagingResultsBtn').addEventListener('click', closeAndReopenPersonalInfo);
    }

    // Imaging Results Listeners
    attachImagingResultsListeners() {
        // Admin patient selector
        const patientSelectAdmin = document.getElementById('imagingResultsPatientAdmin');
        if (patientSelectAdmin) {
            patientSelectAdmin.addEventListener('change', (e) => this.loadImagingHistoryAdmin(e.target.value));
        }

        // Physician patient selector
        const patientSelectPhysician = document.getElementById('imagingResultsPatientPhysician');
        if (patientSelectPhysician) {
            patientSelectPhysician.addEventListener('change', (e) => this.loadImagingHistoryPhysician(e.target.value));
        }

        const viewMoreButtons = document.querySelectorAll('.btn-view-more-imaging');
        viewMoreButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const patientId = e.currentTarget.getAttribute('data-patient-id');
                if (patientId) {
                    this.showPatientImagingResultsModal(patientId);
                }
            });
        });
    }

    loadImagingHistoryAdmin(patientId) {
        const historyDiv = document.getElementById('imagingResultsHistoryAdmin');
        const historyTable = document.getElementById('imagingResultsHistoryTableAdmin');
        const patientInfoDiv = document.getElementById('selectedPatientInfoImagingAdmin');
        
        if (!historyDiv || !historyTable) return;

        if (!patientId) {
            if (historyDiv) historyDiv.style.display = 'none';
            if (patientInfoDiv) patientInfoDiv.style.display = 'none';
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);
        
        if (patient && patientInfoDiv) {
            document.getElementById('selectedPatientNameImagingAdmin').textContent = patient.fullName;
            document.getElementById('selectedPatientIdImagingAdmin').textContent = patient.id;
            document.getElementById('selectedPatientAgeImagingAdmin').textContent = patient.age;
            document.getElementById('selectedPatientStatusImagingAdmin').textContent = patient.status;
            document.getElementById('selectedPatientDoctorImagingAdmin').textContent = patient.doctor || 'Not Assigned';
            patientInfoDiv.style.display = 'block';
        }

        const allImagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');
        const patientImagingResults = allImagingResults.filter(img => img.patientId === patientId);

        if (patientImagingResults.length === 0) {
            historyTable.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No imaging results for this patient.</p>';
            historyDiv.style.display = 'block';
            return;
        }

        const tableHTML = `
            <div style="overflow-x: auto;">
                <table class="patients-table">
                    <thead>
                        <tr>
                            <th style="width: 12%;">Date</th>
                            <th style="width: 18%;">Modality</th>
                            <th style="width: 15%;">Status</th>
                            <th style="width: 20%;">Performed By</th>
                            <th style="width: 15%;">Recorded Date</th>
                            <th style="width: 20%;">File</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patientImagingResults.map(img => `
                            <tr>
                                <td style="padding: 12px;">${img.imagingDate}</td>
                                <td style="padding: 12px;"><strong>${img.imagingModality}</strong></td>
                                <td style="padding: 12px;"><span class="status-badge ${img.status.toLowerCase().replace(' ', '-')}">${img.status}</span></td>
                                <td style="padding: 12px;">${img.performedBy}</td>
                                <td style="padding: 12px;">${img.recordedDate}</td>
                                <td style="padding: 12px;">
                                    ${img.fileData ? `
                                        <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px; background: var(--info-blue); color: white; margin-right: 4px;" 
                                                onclick="fileStorage.viewFile('imagingResults', '${img.id}')">
                                            <i class="fas fa-eye"></i> View
                                        </button>
                                        <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px;" 
                                                onclick="fileStorage.downloadFile('imagingResults', '${img.id}')">
                                            <i class="fas fa-download"></i>
                                        </button>
                                    ` : '<span style="color: #999; font-size: 12px;">No file</span>'}
                                </td>
                            </tr>
                            <tr style="background: #f8f9fa;">
                                <td colspan="6" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                    <strong style="color: var(--dark-pink);">Findings:</strong> ${img.imagingFindings}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        historyTable.innerHTML = tableHTML;
        historyDiv.style.display = 'block';
    }

    loadImagingHistoryPhysician(patientId) {
        const historyDiv = document.getElementById('imagingResultsHistoryPhysician');
        const historyTable = document.getElementById('imagingResultsHistoryTablePhysician');
        const patientInfoDiv = document.getElementById('selectedPatientInfoImagingPhysician');
        
        if (!historyDiv || !historyTable) return;

        if (!patientId) {
            if (historyDiv) historyDiv.style.display = 'none';
            if (patientInfoDiv) patientInfoDiv.style.display = 'none';
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);
        
        if (patient && patientInfoDiv) {
            document.getElementById('selectedPatientNameImagingPhysician').textContent = patient.fullName;
            document.getElementById('selectedPatientIdImagingPhysician').textContent = patient.id;
            document.getElementById('selectedPatientAgeImagingPhysician').textContent = patient.age;
            document.getElementById('selectedPatientStatusImagingPhysician').textContent = patient.status;
            document.getElementById('selectedPatientDoctorImagingPhysician').textContent = patient.doctor || 'Not Assigned';
            patientInfoDiv.style.display = 'block';
        }

        const allImagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');
        const patientImagingResults = allImagingResults.filter(img => img.patientId === patientId);

        if (patientImagingResults.length === 0) {
            historyTable.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No imaging results for this patient.</p>';
            historyDiv.style.display = 'block';
            return;
        }

        const tableHTML = `
            <div style="overflow-x: auto;">
                <table class="patients-table">
                    <thead>
                        <tr>
                            <th style="width: 12%;">Date</th>
                            <th style="width: 18%;">Modality</th>
                            <th style="width: 15%;">Status</th>
                            <th style="width: 20%;">Performed By</th>
                            <th style="width: 15%;">Recorded Date</th>
                            <th style="width: 20%;">File</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patientImagingResults.map(img => `
                            <tr>
                                <td style="padding: 12px;">${img.imagingDate}</td>
                                <td style="padding: 12px;"><strong>${img.imagingModality}</strong></td>
                                <td style="padding: 12px;"><span class="status-badge ${img.status.toLowerCase().replace(' ', '-')}">${img.status}</span></td>
                                <td style="padding: 12px;">${img.performedBy}</td>
                                <td style="padding: 12px;">${img.recordedDate}</td>
                                <td style="padding: 12px;">
                                    ${img.fileData ? `
                                        <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px; background: var(--info-blue); color: white; margin-right: 4px;" 
                                                onclick="fileStorage.viewFile('imagingResults', '${img.id}')">
                                            <i class="fas fa-eye"></i> View
                                        </button>
                                        <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px;" 
                                                onclick="fileStorage.downloadFile('imagingResults', '${img.id}')">
                                            <i class="fas fa-download"></i>
                                        </button>
                                    ` : '<span style="color: #999; font-size: 12px;">No file</span>'}
                                </td>
                            </tr>
                            <tr style="background: #f8f9fa;">
                                <td colspan="6" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                    <strong style="color: var(--dark-pink);">Findings:</strong> ${img.imagingFindings}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        historyTable.innerHTML = tableHTML;
        historyDiv.style.display = 'block';
    }

    handleImagingResultsPatientSelection(patientId) {
        const selectedPatientInfo = document.getElementById('selectedPatientInfoImaging');
        const imagingResultsForm = document.getElementById('imagingResultsForm');
        const imagingResultsHistory = document.getElementById('imagingResultsHistory');

        if (!patientId) {
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'none';
            if (imagingResultsForm) imagingResultsForm.style.display = 'none';
            if (imagingResultsHistory) imagingResultsHistory.style.display = 'none';
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (patient) {
            this.displayPatientInfoImaging(patient);
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'block';
            if (imagingResultsForm) imagingResultsForm.style.display = 'block';
            if (imagingResultsHistory) imagingResultsHistory.style.display = 'block';
            this.loadImagingResultsHistory(patientId);
        }
    }

    displayPatientInfoImaging(patient) {
        const nameEl = document.getElementById('selectedPatientNameImaging');
        const idEl = document.getElementById('selectedPatientIdImaging');
        const ageEl = document.getElementById('selectedPatientAgeImaging');
        const statusEl = document.getElementById('selectedPatientStatusImaging');
        const doctorEl = document.getElementById('selectedPatientDoctorImaging');

        if (nameEl) nameEl.textContent = patient.fullName;
        if (idEl) idEl.textContent = patient.id;
        if (ageEl) ageEl.textContent = patient.age;
        if (statusEl) statusEl.textContent = patient.status;
        if (doctorEl) doctorEl.textContent = patient.doctor || 'Not Assigned';
    }

    clearImagingResultsForm() {
        document.getElementById('imagingType').value = '';
        document.getElementById('bodyPart').value = '';
        document.getElementById('imagingDate').value = '';
        document.getElementById('imagingStatus').value = 'Completed';
        document.getElementById('imagingFindings').value = '';
        document.getElementById('radiologistName').value = '';
        document.getElementById('imagingFile').value = '';
    }

    saveImagingResult(e) {
        e.preventDefault();

        const patientId = document.getElementById('imagingResultsPatient').value;
        if (!patientId) {
            this.showNotification('Please select a patient first', 'error');
            return;
        }

        const imagingResult = {
            id: 'IMG' + Date.now(),
            patientId: patientId,
            imagingType: document.getElementById('imagingType').value,
            bodyPart: document.getElementById('bodyPart').value,
            imagingDate: document.getElementById('imagingDate').value,
            status: document.getElementById('imagingStatus').value,
            findings: document.getElementById('imagingFindings').value,
            radiologist: document.getElementById('radiologistName').value || 'Not specified',
            performedBy: this.currentUser.name,
            recordedDate: new Date().toLocaleDateString('en-US'),
            recordedTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        let imagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');
        imagingResults.unshift(imagingResult);
        localStorage.setItem('imagingResults', JSON.stringify(imagingResults));

        this.showNotification('Imaging result saved successfully!', 'success');
        this.clearImagingResultsForm();
        this.loadImagingResultsHistory(patientId);
    }

    loadImagingResultsHistory(patientId) {
        const historyTable = document.getElementById('imagingResultsHistoryTable');
        if (!historyTable) return;

        const allImagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');
        const patientImagingResults = allImagingResults.filter(img => img.patientId === patientId);

        if (patientImagingResults.length === 0) {
            historyTable.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No imaging results yet.</p>';
            return;
        }

        const tableHTML = `
            <div style="overflow-x: auto;">
                <table class="patients-table" style="min-width: 1000px;">
                    <thead>
                        <tr>
                            <th style="width: 15%;">Imaging Type</th>
                            <th style="width: 12%;">Body Part</th>
                            <th style="width: 12%;">Date</th>
                            <th style="width: 10%;">Status</th>
                            <th style="width: 15%;">Radiologist</th>
                            <th style="width: 12%;">Recorded Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patientImagingResults.map(img => `
                            <tr>
                                <td><strong>${img.imagingType}</strong></td>
                                <td>${img.bodyPart}</td>
                                <td>${img.imagingDate}</td>
                                <td><span class="status-badge ${img.status.toLowerCase().replace(' ', '-')}">${img.status}</span></td>
                                <td>${img.radiologist}</td>
                                <td>${img.recordedDate}</td>
                            </tr>
                            <tr style="background: #f8f9fa;">
                                <td colspan="6" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                    <strong style="color: var(--dark-pink);">Findings:</strong> ${img.findings}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        historyTable.innerHTML = tableHTML;
    }

    // Imaging Orders Listeners (RadTech)
    attachImagingOrdersListeners() {
        const patientSelect = document.getElementById('imagingPatient');
        const imagingForm = document.getElementById('newImagingForm');
        const clearFormBtn = document.getElementById('clearImagingForm');
        const imagingFileInput = document.getElementById('imagingFile');
        const imagingFileName = document.getElementById('imagingFileName');

        if (patientSelect) {
            patientSelect.addEventListener('change', (e) => this.handleImagingOrdersPatientSelection(e.target.value));
        }

        if (imagingForm) {
            imagingForm.addEventListener('submit', async (e) => await this.saveImagingOrder(e));
        }

        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', () => this.clearImagingOrdersForm());
        }

        // File upload display handler
        if (imagingFileInput && imagingFileName) {
            imagingFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    imagingFileName.textContent = e.target.files[0].name;
                    imagingFileName.style.color = '#333';
                } else {
                    imagingFileName.textContent = 'No file chosen';
                    imagingFileName.style.color = '#666';
                }
            });
        }

        // View More buttons in summary table
        const viewMoreButtons = document.querySelectorAll('.btn-view-more-imaging');
        viewMoreButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const patientId = e.currentTarget.getAttribute('data-patient-id');
                if (patientId) {
                    this.showPatientImagingResultsModal(patientId);
                }
            });
        });

        if (this.selectedPatientForImaging) {
            patientSelect.value = this.selectedPatientForImaging;
            this.handleImagingOrdersPatientSelection(this.selectedPatientForImaging);
            this.selectedPatientForImaging = null;
        }
    }

    handleImagingOrdersPatientSelection(patientId) {
        const selectedPatientInfo = document.getElementById('selectedPatientInfoImaging');
        const imagingForm = document.getElementById('newImagingForm');
        const imagingHistoryCard = document.getElementById('imagingHistoryCard');

        if (!patientId) {
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'none';
            if (imagingForm) imagingForm.style.display = 'none';
            if (imagingHistoryCard) imagingHistoryCard.style.display = 'none';
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (patient) {
            // Display patient info
            const nameEl = document.getElementById('selectedPatientNameImaging');
            const idEl = document.getElementById('selectedPatientIdImaging');
            const ageEl = document.getElementById('selectedPatientAgeImaging');
            const doctorEl = document.getElementById('selectedPatientDoctorImaging');

            if (nameEl) nameEl.textContent = patient.fullName;
            if (idEl) idEl.textContent = patient.id;
            if (ageEl) ageEl.textContent = patient.age;
            if (doctorEl) doctorEl.textContent = patient.doctor || 'Not Assigned';

            // Show elements
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'block';
            if (imagingForm) imagingForm.style.display = 'block';
            if (imagingHistoryCard) imagingHistoryCard.style.display = 'block';
            
            this.loadImagingOrdersHistory(patientId);
        }
    }

    clearImagingOrdersForm() {
        document.getElementById('imagingModality').value = '';
        document.getElementById('imagingDate').value = '';
        document.getElementById('imagingStatus').value = 'Completed';
        document.getElementById('imagingFindings').value = '';
        document.getElementById('imagingFile').value = '';
        document.getElementById('imagingFileName').textContent = 'No file chosen';
        document.getElementById('imagingFileName').style.color = '#666';
    }

    async saveImagingOrder(e) {
        e.preventDefault();

        const patientId = document.getElementById('imagingPatient').value;
        if (!patientId) {
            this.showNotification('Please select a patient first', 'error');
            return;
        }

        const imagingResult = {
            id: 'IMG' + Date.now(),
            patientId: patientId,
            imagingModality: document.getElementById('imagingModality').value,
            imagingDate: document.getElementById('imagingDate').value,
            status: document.getElementById('imagingStatus').value,
            imagingFindings: document.getElementById('imagingFindings').value,
            performedBy: this.currentUser.name,
            recordedDate: new Date().toLocaleDateString('en-US'),
            recordedTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        // Handle file upload to IndexedDB
        const fileInput = document.getElementById('imagingFile');
        const file = fileInput?.files[0];
        
        if (file) {
            try {
                const fileData = await fileStorage.saveFile('imagingResults', imagingResult.id, file);
                imagingResult.fileData = fileData;
            } catch (error) {
                console.error('Error saving file:', error);
                this.showNotification('Imaging result saved but file upload failed', 'warning');
            }
        }

        let imagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');
        imagingResults.unshift(imagingResult);
        localStorage.setItem('imagingResults', JSON.stringify(imagingResults));

        this.showNotification('Imaging result saved successfully!', 'success');
        this.clearImagingOrdersForm();
        this.loadImagingOrdersHistory(patientId);
    }

    loadImagingOrdersHistory(patientId) {
        const historyTable = document.getElementById('imagingHistoryTable');
        if (!historyTable) return;

        const allImagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');
        const patientImagingResults = allImagingResults.filter(img => img.patientId === patientId);

        if (patientImagingResults.length === 0) {
            historyTable.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No imaging results yet.</p>';
            return;
        }

        const tableHTML = `
            <div style="overflow-x: auto;">
                <table class="patients-table" style="min-width: 1000px;">
                    <thead>
                        <tr>
                            <th style="width: 18%;">Modality</th>
                            <th style="width: 12%;">Date</th>
                            <th style="width: 10%;">Status</th>
                            <th style="width: 15%;">Performed By</th>
                            <th style="width: 12%;">Recorded Date</th>
                            <th style="width: 10%;">File</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patientImagingResults.map(img => `
                            <tr>
                                <td><strong>${img.imagingModality}</strong></td>
                                <td>${img.imagingDate}</td>
                                <td><span class="status-badge ${img.status.toLowerCase().replace(' ', '-')}">${img.status}</span></td>
                                <td>${img.performedBy}</td>
                                <td>${img.recordedDate}</td>
                                <td>
                                    ${img.fileData ? `
                                        <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px; background: var(--info-blue); color: white; margin-right: 4px;" 
                                                onclick="fileStorage.viewFile('imagingResults', '${img.id}')">
                                            <i class="fas fa-eye"></i> View
                                        </button>
                                        <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px; background: var(--dark-pink); color: white;" 
                                                onclick="fileStorage.downloadFile('imagingResults', '${img.id}')">
                                            <i class="fas fa-download"></i>
                                        </button>
                                    ` : '<span style="color: #999; font-size: 12px;">No file</span>'}
                                </td>
                            </tr>
                            <tr style="background: #f8f9fa;">
                                <td colspan="6" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                    <strong style="color: var(--dark-pink);">Findings:</strong> ${img.imagingFindings}
                                    ${img.fileData ? `<br><small style="color: #666;"><i class="fas fa-paperclip"></i> ${img.fileData.fileName} (${(img.fileData.fileSize / 1024).toFixed(1)} KB)</small>` : ''}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        historyTable.innerHTML = tableHTML;
    }

    // Drug Dispensing Listeners
    attachDrugDispensingListeners() {
        const patientSelect = document.getElementById('drugDispensingPatient');
        const drugDispensingForm = document.getElementById('newDrugDispensingForm');
        const clearFormBtn = document.getElementById('clearDrugDispensingForm');

        // Admin view selector
        const patientSelectAdmin = document.getElementById('drugDispensingPatientAdmin');

        if (patientSelect) {
            patientSelect.addEventListener('change', (e) => this.handleDrugDispensingPatientSelection(e.target.value));
        }

        if (patientSelectAdmin) {
            patientSelectAdmin.addEventListener('change', (e) => this.loadDrugDispensingHistoryAdmin(e.target.value));
        }

        if (drugDispensingForm) {
            drugDispensingForm.addEventListener('submit', (e) => this.saveDrugDispensing(e));
        }

        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', () => this.clearDrugDispensingForm());
        }

        const viewMoreButtons = document.querySelectorAll('.btn-view-more-dispensing');
        viewMoreButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const patientId = e.currentTarget.getAttribute('data-patient-id');
                if (patientId) {
                    this.showPatientDrugDispensingModal(patientId, false);
                }
            });
        });

        if (this.selectedPatientForDrugDispensing) {
            patientSelect.value = this.selectedPatientForDrugDispensing;
            this.handleDrugDispensingPatientSelection(this.selectedPatientForDrugDispensing);
            this.selectedPatientForDrugDispensing = null;
        }
    }

    handleDrugDispensingPatientSelection(patientId) {
        const selectedPatientInfo = document.getElementById('selectedPatientInfoDispensing');
        const drugDispensingForm = document.getElementById('drugDispensingForm');
        const drugDispensingHistory = document.getElementById('drugDispensingHistory');

        if (!patientId) {
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'none';
            if (drugDispensingForm) drugDispensingForm.style.display = 'none';
            if (drugDispensingHistory) drugDispensingHistory.style.display = 'none';
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (patient) {
            this.displayPatientInfoDispensing(patient);
            if (selectedPatientInfo) selectedPatientInfo.style.display = 'block';
            if (drugDispensingForm) drugDispensingForm.style.display = 'block';
            if (drugDispensingHistory) drugDispensingHistory.style.display = 'block';
            this.loadDrugDispensingHistory(patientId);
        }
    }

    displayPatientInfoDispensing(patient) {
        const nameEl = document.getElementById('selectedPatientNameDispensing');
        const idEl = document.getElementById('selectedPatientIdDispensing');
        const ageEl = document.getElementById('selectedPatientAgeDispensing');
        const statusEl = document.getElementById('selectedPatientStatusDispensing');
        const doctorEl = document.getElementById('selectedPatientDoctorDispensing');

        if (nameEl) nameEl.textContent = patient.fullName;
        if (idEl) idEl.textContent = patient.id;
        if (ageEl) ageEl.textContent = patient.age;
        if (statusEl) statusEl.textContent = patient.status;
        if (doctorEl) doctorEl.textContent = patient.doctor || 'Not Assigned';
    }

    clearDrugDispensingForm() {
        document.getElementById('drugName').value = '';
        document.getElementById('drugQuantity').value = '';
        document.getElementById('batchNumber').value = '';
        document.getElementById('lotNumber').value = '';
        document.getElementById('expiryDate').value = '';
        document.getElementById('dispensingDate').value = '';
        document.getElementById('drugDispensingNotes').value = '';
    }

    saveDrugDispensing(e) {
        e.preventDefault();

        const patientId = document.getElementById('drugDispensingPatient').value;
        if (!patientId) {
            this.showNotification('Please select a patient first', 'error');
            return;
        }

        const drugDispensing = {
            id: 'DISP' + Date.now(),
            patientId: patientId,
            drugName: document.getElementById('drugName').value,
            quantity: document.getElementById('drugQuantity').value,
            batchNumber: document.getElementById('batchNumber').value || 'Not specified',
            lotNumber: document.getElementById('lotNumber').value || 'Not specified',
            expiryDate: document.getElementById('expiryDate').value || 'Not specified',
            dispensedDate: document.getElementById('dispensingDate').value,
            notes: document.getElementById('drugDispensingNotes').value,
            dispensedBy: this.currentUser.name,
            recordedDate: new Date().toLocaleDateString('en-US'),
            recordedTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        let drugDispensings = JSON.parse(localStorage.getItem('drugDispensing') || '[]');
        drugDispensings.unshift(drugDispensing);
        localStorage.setItem('drugDispensing', JSON.stringify(drugDispensings));

        this.showNotification('Drug dispensing recorded successfully!', 'success');
        this.clearDrugDispensingForm();
        this.loadDrugDispensingHistory(patientId);
    }

    loadDrugDispensingHistory(patientId) {
        const historyTable = document.getElementById('drugDispensingHistoryTable');
        if (!historyTable) return;

        const allDrugDispensings = JSON.parse(localStorage.getItem('drugDispensing') || '[]');
        const patientDrugDispensings = allDrugDispensings.filter(disp => disp.patientId === patientId);

        if (patientDrugDispensings.length === 0) {
            historyTable.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No dispensing records yet.</p>';
            return;
        }

        const tableHTML = `
            <div style="overflow-x: auto;">
                <table class="patients-table" style="min-width: 1000px;">
                    <thead>
                        <tr>
                            <th style="width: 18%;">Drug Name</th>
                            <th style="width: 10%;">Quantity</th>
                            <th style="width: 12%;">Batch Number</th>
                            <th style="width: 12%;">Lot Number</th>
                            <th style="width: 12%;">Expiry Date</th>
                            <th style="width: 12%;">Date Dispensed</th>
                            <th style="width: 14%;">Dispensed By</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patientDrugDispensings.map(disp => `
                            <tr>
                                <td><strong>${disp.drugName}</strong></td>
                                <td>${disp.quantity}</td>
                                <td>${disp.batchNumber}</td>
                                <td>${disp.lotNumber}</td>
                                <td>${disp.expiryDate}</td>
                                <td>${disp.dispensedDate}</td>
                                <td>${disp.dispensedBy}</td>
                            </tr>
                            ${disp.notes ? `
                            <tr style="background: #f8f9fa;">
                                <td colspan="7" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                    <strong style="color: var(--dark-pink);">Notes:</strong> ${disp.notes}
                                </td>
                            </tr>
                            ` : ''}
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        historyTable.innerHTML = tableHTML;
    }

    loadDrugDispensingHistoryAdmin(patientId) {
        const historyDiv = document.getElementById('drugDispensingHistoryAdmin');
        const historyTable = document.getElementById('drugDispensingHistoryTableAdmin');
        const patientInfoDiv = document.getElementById('selectedPatientInfoDispensingAdmin');

        if (!patientId) {
            if (historyDiv) historyDiv.style.display = 'none';
            if (patientInfoDiv) patientInfoDiv.style.display = 'none';
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (!patient) return;

        // Show patient info
        if (patientInfoDiv) {
            patientInfoDiv.style.display = 'block';
            document.getElementById('selectedPatientNameDispensingAdmin').textContent = patient.fullName;
            document.getElementById('selectedPatientIdDispensingAdmin').textContent = patient.id;
            document.getElementById('selectedPatientAgeDispensingAdmin').textContent = patient.age;
            document.getElementById('selectedPatientStatusDispensingAdmin').textContent = patient.status;
            document.getElementById('selectedPatientDoctorDispensingAdmin').textContent = patient.doctor || 'Not Assigned';
        }

        // Show history
        if (historyDiv) historyDiv.style.display = 'block';
        if (!historyTable) return;

        const allDrugDispensings = JSON.parse(localStorage.getItem('drugDispensing') || '[]');
        const patientDrugDispensings = allDrugDispensings.filter(disp => disp.patientId === patientId);

        if (patientDrugDispensings.length === 0) {
            historyTable.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No dispensing records yet.</p>';
            return;
        }

        const tableHTML = `
            <div style="overflow-x: auto;">
                <table class="patients-table" style="min-width: 1000px;">
                    <thead>
                        <tr>
                            <th style="width: 18%; padding: 12px;">Drug Name</th>
                            <th style="width: 10%; padding: 12px;">Quantity</th>
                            <th style="width: 12%; padding: 12px;">Batch Number</th>
                            <th style="width: 12%; padding: 12px;">Lot Number</th>
                            <th style="width: 12%; padding: 12px;">Expiry Date</th>
                            <th style="width: 12%; padding: 12px;">Date Dispensed</th>
                            <th style="width: 14%; padding: 12px;">Dispensed By</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patientDrugDispensings.map(disp => `
                            <tr>
                                <td style="padding: 12px;"><strong>${disp.drugName}</strong></td>
                                <td style="padding: 12px;">${disp.quantity}</td>
                                <td style="padding: 12px;">${disp.batchNumber}</td>
                                <td style="padding: 12px;">${disp.lotNumber}</td>
                                <td style="padding: 12px;">${disp.expiryDate}</td>
                                <td style="padding: 12px;">${disp.dispensedDate}</td>
                                <td style="padding: 12px;">${disp.dispensedBy}</td>
                            </tr>
                            ${disp.notes ? `
                            <tr style="background: #f8f9fa;">
                                <td colspan="7" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                    <strong style="color: var(--dark-pink);">Notes:</strong> ${disp.notes}
                                </td>
                            </tr>
                            ` : ''}
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        historyTable.innerHTML = tableHTML;
    }

    showPatientDrugDispensingModal(patientId, returnToPersonalInfo = true) {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);

        if (!patient) {
            this.showNotification('Patient not found', 'error');
            return;
        }

        const allDrugDispensings = JSON.parse(localStorage.getItem('drugDispensing') || '[]');
        const patientDrugDispensings = allDrugDispensings.filter(disp => disp.patientId === patientId);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 1000px;">
                <div class="modal-header">
                    <h2>Drug Dispensing - ${patient.fullName}</h2>
                    <button class="modal-close" id="closeDrugDispensingModalBtn">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                        <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                            <i class="fas fa-user-injured"></i> Patient Information
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                            <div><strong>Patient ID:</strong> ${patient.id}</div>
                            <div><strong>Name:</strong> ${patient.fullName}</div>
                            <div><strong>Age:</strong> ${patient.age}</div>
                            <div><strong>Doctor:</strong> ${patient.doctor || 'Not Assigned'}</div>
                        </div>
                    </div>

                    ${patientDrugDispensings.length > 0 ? `
                    <div style="overflow-x: auto;">
                        <table class="patients-table" style="min-width: 1000px;">
                            <thead>
                                <tr>
                                    <th style="width: 18%;">Drug Name</th>
                                    <th style="width: 10%;">Quantity</th>
                                    <th style="width: 12%;">Batch Number</th>
                                    <th style="width: 12%;">Lot Number</th>
                                    <th style="width: 12%;">Expiry Date</th>
                                    <th style="width: 12%;">Date Dispensed</th>
                                    <th style="width: 14%;">Dispensed By</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${patientDrugDispensings.map(disp => `
                                    <tr>
                                        <td><strong>${disp.drugName}</strong></td>
                                        <td>${disp.quantity}</td>
                                        <td>${disp.batchNumber}</td>
                                        <td>${disp.lotNumber}</td>
                                        <td>${disp.expiryDate}</td>
                                        <td>${disp.dispensedDate}</td>
                                        <td>${disp.dispensedBy}</td>
                                    </tr>
                                    ${disp.notes ? `
                                    <tr style="background: #f8f9fa;">
                                        <td colspan="7" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                                            <strong style="color: var(--dark-pink);">Notes:</strong> ${disp.notes}
                                        </td>
                                    </tr>
                                    ` : ''}
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : `
                    <div style="text-align: center; padding: 40px; color: #999;">
                        <i class="fas fa-pills" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                        <p style="font-size: 16px;">No dispensing records yet for this patient.</p>
                    </div>
                    `}

                    <div class="modal-actions" style="margin-top: 24px;">
                        <button type="button" class="btn btn-secondary" id="closeDrugDispensingBtn">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeAndReopenPersonalInfo = () => {
            modal.remove();
            if (returnToPersonalInfo) {
                this.viewPersonalInfo(patientId);
            }
        };
        document.getElementById('closeDrugDispensingModalBtn').addEventListener('click', closeAndReopenPersonalInfo);
        document.getElementById('closeDrugDispensingBtn').addEventListener('click', closeAndReopenPersonalInfo);
    }

    // Drug Inventory Listeners and Functions
    attachDrugInventoryListeners() {
        const addNewDrugBtn = document.getElementById('addNewDrugBtn');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        const filterDrugName = document.getElementById('filterDrugName');
        const filterCategory = document.getElementById('filterCategory');
        const filterStatus = document.getElementById('filterStatus');

        if (addNewDrugBtn) {
            addNewDrugBtn.addEventListener('click', () => this.showAddDrugModal());
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearDrugFilters());
        }

        if (filterDrugName) {
            filterDrugName.addEventListener('input', () => this.filterDrugInventory());
        }

        if (filterCategory) {
            filterCategory.addEventListener('change', () => this.filterDrugInventory());
        }

        if (filterStatus) {
            filterStatus.addEventListener('change', () => this.filterDrugInventory());
        }

        const editButtons = document.querySelectorAll('.btn-edit-drug');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const drugId = e.currentTarget.getAttribute('data-drug-id');
                if (drugId) {
                    this.showEditDrugModal(drugId);
                }
            });
        });

        const deleteButtons = document.querySelectorAll('.btn-delete-drug');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const drugId = e.currentTarget.getAttribute('data-drug-id');
                if (drugId) {
                    this.deleteDrug(drugId);
                }
            });
        });
    }

    clearDrugFilters() {
        document.getElementById('filterDrugName').value = '';
        document.getElementById('filterCategory').value = '';
        document.getElementById('filterStatus').value = '';
        this.filterDrugInventory();
    }

    filterDrugInventory() {
        const searchText = document.getElementById('filterDrugName').value.toLowerCase();
        const category = document.getElementById('filterCategory').value;
        const status = document.getElementById('filterStatus').value;

        const allDrugs = JSON.parse(localStorage.getItem('drugInventory') || '[]');
        
        const filteredDrugs = allDrugs.filter(drug => {
            const matchesName = !searchText || 
                drug.drugName.toLowerCase().includes(searchText) || 
                (drug.genericName && drug.genericName.toLowerCase().includes(searchText));
            const matchesCategory = !category || drug.category === category;
            
            let matchesStatus = true;
            if (status) {
                const stockStatus = drug.stockQuantity === 0 ? 'out-of-stock' : 
                                  drug.stockQuantity <= drug.reorderLevel ? 'low-stock' : 'in-stock';
                matchesStatus = stockStatus === status;
            }
            
            return matchesName && matchesCategory && matchesStatus;
        });

        this.renderDrugInventoryTable(filteredDrugs);
    }

    renderDrugInventoryTable(drugs) {
        const tbody = document.querySelector('#drugInventoryTable tbody');
        if (!tbody) return;

        if (drugs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px; color: #999;">No drugs found matching filters.</td></tr>';
            return;
        }

        let inventoryRows = '';
        drugs.forEach(drug => {
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

        tbody.innerHTML = inventoryRows;
        this.attachDrugInventoryListeners();
    }

    showAddDrugModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2><i class="fas fa-plus-circle"></i> Add New Drug to Inventory</h2>
                    <button class="modal-close" id="closeAddDrugModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addDrugForm">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                            <div class="form-group">
                                <label for="drugName">Drug Name (Brand) <span style="color: red;">*</span></label>
                                <input type="text" id="drugName" class="form-control" required placeholder="e.g., Biogesic">
                            </div>
                            <div class="form-group">
                                <label for="genericName">Generic Name</label>
                                <input type="text" id="genericName" class="form-control" placeholder="e.g., Paracetamol">
                            </div>
                            <div class="form-group">
                                <label for="category">Category <span style="color: red;">*</span></label>
                                <select id="category" class="form-control" required>
                                    <option value="">-- Select Category --</option>
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
                            <div class="form-group">
                                <label for="dosageForm">Dosage Form</label>
                                <select id="dosageForm" class="form-control">
                                    <option value="">-- Select Form --</option>
                                    <option value="Tablet">Tablet</option>
                                    <option value="Capsule">Capsule</option>
                                    <option value="Syrup">Syrup</option>
                                    <option value="Suspension">Suspension</option>
                                    <option value="Injection">Injection</option>
                                    <option value="Cream">Cream</option>
                                    <option value="Ointment">Ointment</option>
                                    <option value="Drops">Drops</option>
                                    <option value="Inhaler">Inhaler</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="strength">Strength/Dosage</label>
                                <input type="text" id="strength" class="form-control" placeholder="e.g., 500mg">
                            </div>
                            <div class="form-group">
                                <label for="stockQuantity">Stock Quantity <span style="color: red;">*</span></label>
                                <input type="number" id="stockQuantity" class="form-control" required min="0" placeholder="0">
                            </div>
                            <div class="form-group">
                                <label for="reorderLevel">Reorder Level <span style="color: red;">*</span></label>
                                <input type="number" id="reorderLevel" class="form-control" required min="0" placeholder="10">
                            </div>
                            <div class="form-group">
                                <label for="unitPrice">Unit Price</label>
                                <input type="number" id="unitPrice" class="form-control" step="0.01" min="0" placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label for="batchNumber">Batch Number</label>
                                <input type="text" id="batchNumber" class="form-control" placeholder="e.g., BATCH2025001">
                            </div>
                            <div class="form-group">
                                <label for="expiryDate">Expiry Date</label>
                                <input type="date" id="expiryDate" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="supplier">Supplier</label>
                                <input type="text" id="supplier" class="form-control" placeholder="e.g., Pharma Inc.">
                            </div>
                            <div class="form-group">
                                <label for="location">Storage Location</label>
                                <input type="text" id="location" class="form-control" placeholder="e.g., Shelf A-12">
                            </div>
                        </div>
                        <div class="form-group" style="margin-top: 20px;">
                            <label for="notes">Notes</label>
                            <textarea id="notes" class="form-control" rows="3" placeholder="Additional information..."></textarea>
                        </div>
                        <div class="modal-actions" style="margin-top: 24px;">
                            <button type="button" class="btn btn-secondary" id="cancelAddDrug">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Add Drug
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('closeAddDrugModal').addEventListener('click', () => modal.remove());
        document.getElementById('cancelAddDrug').addEventListener('click', () => modal.remove());
        document.getElementById('addDrugForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDrug(modal);
        });
    }

    showEditDrugModal(drugId) {
        const allDrugs = JSON.parse(localStorage.getItem('drugInventory') || '[]');
        const drug = allDrugs.find(d => d.id === drugId);

        if (!drug) {
            this.showNotification('Drug not found', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2><i class="fas fa-edit"></i> Edit Drug Information</h2>
                    <button class="modal-close" id="closeEditDrugModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="editDrugForm">
                        <input type="hidden" id="editDrugId" value="${drug.id}">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                            <div class="form-group">
                                <label for="editDrugName">Drug Name (Brand) <span style="color: red;">*</span></label>
                                <input type="text" id="editDrugName" class="form-control" required value="${drug.drugName}">
                            </div>
                            <div class="form-group">
                                <label for="editGenericName">Generic Name</label>
                                <input type="text" id="editGenericName" class="form-control" value="${drug.genericName || ''}">
                            </div>
                            <div class="form-group">
                                <label for="editCategory">Category <span style="color: red;">*</span></label>
                                <select id="editCategory" class="form-control" required>
                                    <option value="">-- Select Category --</option>
                                    <option value="Antibiotic" ${drug.category === 'Antibiotic' ? 'selected' : ''}>Antibiotic</option>
                                    <option value="Analgesic" ${drug.category === 'Analgesic' ? 'selected' : ''}>Analgesic</option>
                                    <option value="Antipyretic" ${drug.category === 'Antipyretic' ? 'selected' : ''}>Antipyretic</option>
                                    <option value="Antihypertensive" ${drug.category === 'Antihypertensive' ? 'selected' : ''}>Antihypertensive</option>
                                    <option value="Antidiabetic" ${drug.category === 'Antidiabetic' ? 'selected' : ''}>Antidiabetic</option>
                                    <option value="Antihistamine" ${drug.category === 'Antihistamine' ? 'selected' : ''}>Antihistamine</option>
                                    <option value="Vitamin" ${drug.category === 'Vitamin' ? 'selected' : ''}>Vitamin</option>
                                    <option value="Other" ${drug.category === 'Other' ? 'selected' : ''}>Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="editDosageForm">Dosage Form</label>
                                <select id="editDosageForm" class="form-control">
                                    <option value="">-- Select Form --</option>
                                    <option value="Tablet" ${drug.dosageForm === 'Tablet' ? 'selected' : ''}>Tablet</option>
                                    <option value="Capsule" ${drug.dosageForm === 'Capsule' ? 'selected' : ''}>Capsule</option>
                                    <option value="Syrup" ${drug.dosageForm === 'Syrup' ? 'selected' : ''}>Syrup</option>
                                    <option value="Suspension" ${drug.dosageForm === 'Suspension' ? 'selected' : ''}>Suspension</option>
                                    <option value="Injection" ${drug.dosageForm === 'Injection' ? 'selected' : ''}>Injection</option>
                                    <option value="Cream" ${drug.dosageForm === 'Cream' ? 'selected' : ''}>Cream</option>
                                    <option value="Ointment" ${drug.dosageForm === 'Ointment' ? 'selected' : ''}>Ointment</option>
                                    <option value="Drops" ${drug.dosageForm === 'Drops' ? 'selected' : ''}>Drops</option>
                                    <option value="Inhaler" ${drug.dosageForm === 'Inhaler' ? 'selected' : ''}>Inhaler</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="editStrength">Strength/Dosage</label>
                                <input type="text" id="editStrength" class="form-control" value="${drug.strength || ''}">
                            </div>
                            <div class="form-group">
                                <label for="editStockQuantity">Stock Quantity <span style="color: red;">*</span></label>
                                <input type="number" id="editStockQuantity" class="form-control" required min="0" value="${drug.stockQuantity}">
                            </div>
                            <div class="form-group">
                                <label for="editReorderLevel">Reorder Level <span style="color: red;">*</span></label>
                                <input type="number" id="editReorderLevel" class="form-control" required min="0" value="${drug.reorderLevel}">
                            </div>
                            <div class="form-group">
                                <label for="editUnitPrice">Unit Price</label>
                                <input type="number" id="editUnitPrice" class="form-control" step="0.01" min="0" value="${drug.unitPrice || 0}">
                            </div>
                            <div class="form-group">
                                <label for="editBatchNumber">Batch Number</label>
                                <input type="text" id="editBatchNumber" class="form-control" value="${drug.batchNumber || ''}">
                            </div>
                            <div class="form-group">
                                <label for="editExpiryDate">Expiry Date</label>
                                <input type="date" id="editExpiryDate" class="form-control" value="${drug.expiryDate || ''}">
                            </div>
                            <div class="form-group">
                                <label for="editSupplier">Supplier</label>
                                <input type="text" id="editSupplier" class="form-control" value="${drug.supplier || ''}">
                            </div>
                            <div class="form-group">
                                <label for="editLocation">Storage Location</label>
                                <input type="text" id="editLocation" class="form-control" value="${drug.location || ''}">
                            </div>
                        </div>
                        <div class="form-group" style="margin-top: 20px;">
                            <label for="editNotes">Notes</label>
                            <textarea id="editNotes" class="form-control" rows="3">${drug.notes || ''}</textarea>
                        </div>
                        <div class="modal-actions" style="margin-top: 24px;">
                            <button type="button" class="btn btn-secondary" id="cancelEditDrug">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Update Drug
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('closeEditDrugModal').addEventListener('click', () => modal.remove());
        document.getElementById('cancelEditDrug').addEventListener('click', () => modal.remove());
        document.getElementById('editDrugForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateDrug(modal);
        });
    }

    saveDrug(modal) {
        const drug = {
            id: 'DRUG' + Date.now(),
            drugName: document.getElementById('drugName').value,
            genericName: document.getElementById('genericName').value,
            category: document.getElementById('category').value,
            dosageForm: document.getElementById('dosageForm').value,
            strength: document.getElementById('strength').value,
            stockQuantity: parseInt(document.getElementById('stockQuantity').value),
            reorderLevel: parseInt(document.getElementById('reorderLevel').value),
            unitPrice: parseFloat(document.getElementById('unitPrice').value) || 0,
            batchNumber: document.getElementById('batchNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            supplier: document.getElementById('supplier').value,
            location: document.getElementById('location').value,
            notes: document.getElementById('notes').value,
            addedBy: this.currentUser.name,
            addedDate: new Date().toLocaleDateString('en-US'),
            lastUpdated: new Date().toLocaleDateString('en-US')
        };

        let drugInventory = JSON.parse(localStorage.getItem('drugInventory') || '[]');
        drugInventory.unshift(drug);
        localStorage.setItem('drugInventory', JSON.stringify(drugInventory));

        this.showNotification('Drug added to inventory successfully!', 'success');
        modal.remove();
        this.loadPage('drug-inventory');
    }

    updateDrug(modal) {
        const drugId = document.getElementById('editDrugId').value;
        let drugInventory = JSON.parse(localStorage.getItem('drugInventory') || '[]');
        const drugIndex = drugInventory.findIndex(d => d.id === drugId);

        if (drugIndex === -1) {
            this.showNotification('Drug not found', 'error');
            return;
        }

        drugInventory[drugIndex] = {
            ...drugInventory[drugIndex],
            drugName: document.getElementById('editDrugName').value,
            genericName: document.getElementById('editGenericName').value,
            category: document.getElementById('editCategory').value,
            dosageForm: document.getElementById('editDosageForm').value,
            strength: document.getElementById('editStrength').value,
            stockQuantity: parseInt(document.getElementById('editStockQuantity').value),
            reorderLevel: parseInt(document.getElementById('editReorderLevel').value),
            unitPrice: parseFloat(document.getElementById('editUnitPrice').value) || 0,
            batchNumber: document.getElementById('editBatchNumber').value,
            expiryDate: document.getElementById('editExpiryDate').value,
            supplier: document.getElementById('editSupplier').value,
            location: document.getElementById('editLocation').value,
            notes: document.getElementById('editNotes').value,
            lastUpdated: new Date().toLocaleDateString('en-US'),
            updatedBy: this.currentUser.name
        };

        localStorage.setItem('drugInventory', JSON.stringify(drugInventory));
        this.showNotification('Drug updated successfully!', 'success');
        modal.remove();
        this.loadPage('drug-inventory');
    }

    deleteDrug(drugId) {
        if (!confirm('Are you sure you want to delete this drug from inventory? This action cannot be undone.')) {
            return;
        }

        let drugInventory = JSON.parse(localStorage.getItem('drugInventory') || '[]');
        drugInventory = drugInventory.filter(d => d.id !== drugId);
        localStorage.setItem('drugInventory', JSON.stringify(drugInventory));

        this.showNotification('Drug deleted from inventory', 'success');
        this.loadPage('drug-inventory');
    }

    // Unavailable Medications and Orders Management
    attachUnavailableMedsListeners() {
        const addUnavailableMedBtn = document.getElementById('addUnavailableMedBtn');
        const createNewOrderBtn = document.getElementById('createNewOrderBtn');

        if (addUnavailableMedBtn) {
            addUnavailableMedBtn.addEventListener('click', () => this.showAddUnavailableMedModal());
        }

        if (createNewOrderBtn) {
            createNewOrderBtn.addEventListener('click', () => this.showCreateOrderModal());
        }

        const editButtons = document.querySelectorAll('.btn-edit-unavailable');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const medId = e.currentTarget.getAttribute('data-med-id');
                if (medId) {
                    this.showEditUnavailableMedModal(medId);
                }
            });
        });

        const deleteButtons = document.querySelectorAll('.btn-delete-unavailable');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const medId = e.currentTarget.getAttribute('data-med-id');
                if (medId) {
                    this.deleteUnavailableMed(medId);
                }
            });
        });

        const viewOrderButtons = document.querySelectorAll('.btn-view-order');
        viewOrderButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.currentTarget.getAttribute('data-order-id');
                if (orderId) {
                    this.showOrderDetailsModal(orderId);
                }
            });
        });

        const updateStatusButtons = document.querySelectorAll('.btn-update-order-status');
        updateStatusButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.currentTarget.getAttribute('data-order-id');
                if (orderId) {
                    this.showUpdateOrderStatusModal(orderId);
                }
            });
        });
    }

    showAddUnavailableMedModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2><i class="fas fa-exclamation-triangle"></i> Report Unavailable Medication</h2>
                    <button class="modal-close" id="closeAddUnavailableModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addUnavailableMedForm">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                            <div class="form-group">
                                <label for="unavailableMedName">Medication Name (Brand) <span style="color: red;">*</span></label>
                                <input type="text" id="unavailableMedName" class="form-control" required placeholder="e.g., Biogesic">
                            </div>
                            <div class="form-group">
                                <label for="unavailableGenericName">Generic Name</label>
                                <input type="text" id="unavailableGenericName" class="form-control" placeholder="e.g., Paracetamol">
                            </div>
                            <div class="form-group">
                                <label for="unavailableStatus">Status <span style="color: red;">*</span></label>
                                <select id="unavailableStatus" class="form-control" required>
                                    <option value="">-- Select Status --</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                    <option value="Backordered">Backordered</option>
                                    <option value="Discontinued">Discontinued</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="unavailableDateReported">Date Reported <span style="color: red;">*</span></label>
                                <input type="date" id="unavailableDateReported" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="expectedRestockDate">Expected Restock Date</label>
                                <input type="date" id="expectedRestockDate" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="alternativeMed">Alternative Medication</label>
                                <input type="text" id="alternativeMed" class="form-control" placeholder="Suggested alternative">
                            </div>
                        </div>
                        <div class="form-group" style="margin-top: 20px;">
                            <label for="unavailableReason">Reason</label>
                            <input type="text" id="unavailableReason" class="form-control" placeholder="Why is this medication unavailable?">
                        </div>
                        <div class="form-group">
                            <label for="unavailableNotes">Notes</label>
                            <textarea id="unavailableNotes" class="form-control" rows="3" placeholder="Additional information..."></textarea>
                        </div>
                        <div class="modal-actions" style="margin-top: 24px;">
                            <button type="button" class="btn btn-secondary" id="cancelAddUnavailable">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Report Medication
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.getElementById('unavailableDateReported').valueAsDate = new Date();

        document.getElementById('closeAddUnavailableModal').addEventListener('click', () => modal.remove());
        document.getElementById('cancelAddUnavailable').addEventListener('click', () => modal.remove());
        document.getElementById('addUnavailableMedForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUnavailableMed(modal);
        });
    }

    showEditUnavailableMedModal(medId) {
        const allMeds = JSON.parse(localStorage.getItem('unavailableMeds') || '[]');
        const med = allMeds.find(m => m.id === medId);

        if (!med) {
            this.showNotification('Medication not found', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2><i class="fas fa-edit"></i> Edit Unavailable Medication</h2>
                    <button class="modal-close" id="closeEditUnavailableModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="editUnavailableMedForm">
                        <input type="hidden" id="editUnavailableMedId" value="${med.id}">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                            <div class="form-group">
                                <label for="editUnavailableMedName">Medication Name (Brand) <span style="color: red;">*</span></label>
                                <input type="text" id="editUnavailableMedName" class="form-control" required value="${med.medicationName}">
                            </div>
                            <div class="form-group">
                                <label for="editUnavailableGenericName">Generic Name</label>
                                <input type="text" id="editUnavailableGenericName" class="form-control" value="${med.genericName || ''}">
                            </div>
                            <div class="form-group">
                                <label for="editUnavailableStatus">Status <span style="color: red;">*</span></label>
                                <select id="editUnavailableStatus" class="form-control" required>
                                    <option value="Out of Stock" ${med.status === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
                                    <option value="Backordered" ${med.status === 'Backordered' ? 'selected' : ''}>Backordered</option>
                                    <option value="Discontinued" ${med.status === 'Discontinued' ? 'selected' : ''}>Discontinued</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="editUnavailableDateReported">Date Reported <span style="color: red;">*</span></label>
                                <input type="date" id="editUnavailableDateReported" class="form-control" required value="${med.dateReported}">
                            </div>
                            <div class="form-group">
                                <label for="editExpectedRestockDate">Expected Restock Date</label>
                                <input type="date" id="editExpectedRestockDate" class="form-control" value="${med.expectedRestockDate || ''}">
                            </div>
                            <div class="form-group">
                                <label for="editAlternativeMed">Alternative Medication</label>
                                <input type="text" id="editAlternativeMed" class="form-control" value="${med.alternativeMed || ''}">
                            </div>
                        </div>
                        <div class="form-group" style="margin-top: 20px;">
                            <label for="editUnavailableReason">Reason</label>
                            <input type="text" id="editUnavailableReason" class="form-control" value="${med.reason || ''}">
                        </div>
                        <div class="form-group">
                            <label for="editUnavailableNotes">Notes</label>
                            <textarea id="editUnavailableNotes" class="form-control" rows="3">${med.notes || ''}</textarea>
                        </div>
                        <div class="modal-actions" style="margin-top: 24px;">
                            <button type="button" class="btn btn-secondary" id="cancelEditUnavailable">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Update Medication
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('closeEditUnavailableModal').addEventListener('click', () => modal.remove());
        document.getElementById('cancelEditUnavailable').addEventListener('click', () => modal.remove());
        document.getElementById('editUnavailableMedForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateUnavailableMed(modal);
        });
    }

    saveUnavailableMed(modal) {
        const med = {
            id: 'UNAVAIL' + Date.now(),
            medicationName: document.getElementById('unavailableMedName').value,
            genericName: document.getElementById('unavailableGenericName').value,
            status: document.getElementById('unavailableStatus').value,
            dateReported: document.getElementById('unavailableDateReported').value,
            expectedRestockDate: document.getElementById('expectedRestockDate').value,
            alternativeMed: document.getElementById('alternativeMed').value,
            reason: document.getElementById('unavailableReason').value,
            notes: document.getElementById('unavailableNotes').value,
            reportedBy: this.currentUser.name,
            reportedDate: new Date().toLocaleDateString('en-US')
        };

        let unavailableMeds = JSON.parse(localStorage.getItem('unavailableMeds') || '[]');
        unavailableMeds.unshift(med);
        localStorage.setItem('unavailableMeds', JSON.stringify(unavailableMeds));

        this.showNotification('Unavailable medication reported successfully!', 'success');
        modal.remove();
        this.loadPage('unavailable-meds');
    }

    updateUnavailableMed(modal) {
        const medId = document.getElementById('editUnavailableMedId').value;
        let unavailableMeds = JSON.parse(localStorage.getItem('unavailableMeds') || '[]');
        const medIndex = unavailableMeds.findIndex(m => m.id === medId);

        if (medIndex === -1) {
            this.showNotification('Medication not found', 'error');
            return;
        }

        unavailableMeds[medIndex] = {
            ...unavailableMeds[medIndex],
            medicationName: document.getElementById('editUnavailableMedName').value,
            genericName: document.getElementById('editUnavailableGenericName').value,
            status: document.getElementById('editUnavailableStatus').value,
            dateReported: document.getElementById('editUnavailableDateReported').value,
            expectedRestockDate: document.getElementById('editExpectedRestockDate').value,
            alternativeMed: document.getElementById('editAlternativeMed').value,
            reason: document.getElementById('editUnavailableReason').value,
            notes: document.getElementById('editUnavailableNotes').value,
            lastUpdated: new Date().toLocaleDateString('en-US'),
            updatedBy: this.currentUser.name
        };

        localStorage.setItem('unavailableMeds', JSON.stringify(unavailableMeds));
        this.showNotification('Medication updated successfully!', 'success');
        modal.remove();
        this.loadPage('unavailable-meds');
    }

    deleteUnavailableMed(medId) {
        if (!confirm('Are you sure you want to remove this medication from the unavailable list?')) {
            return;
        }

        let unavailableMeds = JSON.parse(localStorage.getItem('unavailableMeds') || '[]');
        unavailableMeds = unavailableMeds.filter(m => m.id !== medId);
        localStorage.setItem('unavailableMeds', JSON.stringify(unavailableMeds));

        this.showNotification('Medication removed from unavailable list', 'success');
        this.loadPage('unavailable-meds');
    }

    showCreateOrderModal(unavailableMedId = null) {
        let prefilledMedName = '';
        if (unavailableMedId) {
            const unavailableMeds = JSON.parse(localStorage.getItem('unavailableMeds') || '[]');
            const med = unavailableMeds.find(m => m.id === unavailableMedId);
            if (med) {
                prefilledMedName = med.medicationName;
            }
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2><i class="fas fa-shopping-cart"></i> Create Medication Order</h2>
                    <button class="modal-close" id="closeCreateOrderModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="createOrderForm">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                            <div class="form-group">
                                <label for="orderMedicationName">Medication Name <span style="color: red;">*</span></label>
                                <input type="text" id="orderMedicationName" class="form-control" required value="${prefilledMedName}" placeholder="e.g., Biogesic">
                            </div>
                            <div class="form-group">
                                <label for="orderQuantity">Quantity <span style="color: red;">*</span></label>
                                <input type="text" id="orderQuantity" class="form-control" required placeholder="e.g., 1000 tablets">
                            </div>
                            <div class="form-group">
                                <label for="orderSupplierName">Supplier Name <span style="color: red;">*</span></label>
                                <input type="text" id="orderSupplierName" class="form-control" required placeholder="e.g., Pharma Inc.">
                            </div>
                            <div class="form-group">
                                <label for="orderSupplierContact">Supplier Contact</label>
                                <input type="text" id="orderSupplierContact" class="form-control" placeholder="Phone or email">
                            </div>
                            <div class="form-group">
                                <label for="orderDate">Order Date <span style="color: red;">*</span></label>
                                <input type="date" id="orderDate" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="orderExpectedDelivery">Expected Delivery Date</label>
                                <input type="date" id="orderExpectedDelivery" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="orderUnitCost">Unit Cost (₱)</label>
                                <input type="number" id="orderUnitCost" class="form-control" step="0.01" min="0" placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label for="orderTotalCost">Total Cost (₱)</label>
                                <input type="number" id="orderTotalCost" class="form-control" step="0.01" min="0" placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label for="orderStatus">Order Status <span style="color: red;">*</span></label>
                                <select id="orderStatus" class="form-control" required>
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Received">Received</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="orderTrackingNumber">Tracking Number</label>
                                <input type="text" id="orderTrackingNumber" class="form-control" placeholder="Shipment tracking number">
                            </div>
                        </div>
                        <div class="form-group" style="margin-top: 20px;">
                            <label for="orderNotes">Order Notes</label>
                            <textarea id="orderNotes" class="form-control" rows="3" placeholder="Additional order information..."></textarea>
                        </div>
                        <div class="modal-actions" style="margin-top: 24px;">
                            <button type="button" class="btn btn-secondary" id="cancelCreateOrder">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Create Order
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.getElementById('orderDate').valueAsDate = new Date();

        document.getElementById('closeCreateOrderModal').addEventListener('click', () => modal.remove());
        document.getElementById('cancelCreateOrder').addEventListener('click', () => modal.remove());
        document.getElementById('createOrderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMedicationOrder(modal);
        });
    }

    saveMedicationOrder(modal) {
        const orderNumber = 'ORD' + Date.now();
        const order = {
            id: orderNumber,
            orderNumber: orderNumber,
            medicationName: document.getElementById('orderMedicationName').value,
            quantity: document.getElementById('orderQuantity').value,
            supplierName: document.getElementById('orderSupplierName').value,
            supplierContact: document.getElementById('orderSupplierContact').value,
            orderDate: document.getElementById('orderDate').value,
            expectedDelivery: document.getElementById('orderExpectedDelivery').value,
            unitCost: parseFloat(document.getElementById('orderUnitCost').value) || 0,
            totalCost: parseFloat(document.getElementById('orderTotalCost').value) || 0,
            orderStatus: document.getElementById('orderStatus').value,
            trackingNumber: document.getElementById('orderTrackingNumber').value,
            notes: document.getElementById('orderNotes').value,
            orderedBy: this.currentUser.name,
            createdDate: new Date().toLocaleDateString('en-US')
        };

        let medOrders = JSON.parse(localStorage.getItem('medOrders') || '[]');
        medOrders.unshift(order);
        localStorage.setItem('medOrders', JSON.stringify(medOrders));

        this.showNotification('Medication order created successfully!', 'success');
        modal.remove();
        this.loadPage('unavailable-meds');
    }

    showOrderDetailsModal(orderId) {
        const allOrders = JSON.parse(localStorage.getItem('medOrders') || '[]');
        const order = allOrders.find(o => o.id === orderId);

        if (!order) {
            this.showNotification('Order not found', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2><i class="fas fa-file-invoice"></i> Order Details - ${order.orderNumber}</h2>
                    <button class="modal-close" id="closeOrderDetailsModal">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: var(--dark-pink); margin-bottom: 16px;">Order Information</h4>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                            <div><strong>Order Number:</strong> ${order.orderNumber}</div>
                            <div><strong>Status:</strong> <span class="status-badge ${order.orderStatus.toLowerCase()}">${order.orderStatus}</span></div>
                            <div><strong>Medication:</strong> ${order.medicationName}</div>
                            <div><strong>Quantity:</strong> ${order.quantity}</div>
                            <div><strong>Order Date:</strong> ${order.orderDate}</div>
                            <div><strong>Expected Delivery:</strong> ${order.expectedDelivery || 'TBD'}</div>
                        </div>
                    </div>

                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: var(--dark-pink); margin-bottom: 16px;">Supplier Information</h4>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                            <div><strong>Supplier Name:</strong> ${order.supplierName}</div>
                            <div><strong>Contact:</strong> ${order.supplierContact || 'N/A'}</div>
                            <div><strong>Tracking Number:</strong> ${order.trackingNumber || 'N/A'}</div>
                        </div>
                    </div>

                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: var(--dark-pink); margin-bottom: 16px;">Cost Information</h4>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                            <div><strong>Unit Cost:</strong> ₱${order.unitCost.toFixed(2)}</div>
                            <div><strong>Total Cost:</strong> ₱${order.totalCost.toFixed(2)}</div>
                        </div>
                    </div>

                    ${order.notes ? `
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                        <h4 style="color: var(--dark-pink); margin-bottom: 12px;">Notes</h4>
                        <p style="margin: 0;">${order.notes}</p>
                    </div>
                    ` : ''}

                    <div class="modal-actions" style="margin-top: 24px;">
                        <button type="button" class="btn btn-secondary" id="closeOrderDetails">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('closeOrderDetailsModal').addEventListener('click', () => modal.remove());
        document.getElementById('closeOrderDetails').addEventListener('click', () => modal.remove());
    }

    showUpdateOrderStatusModal(orderId) {
        const allOrders = JSON.parse(localStorage.getItem('medOrders') || '[]');
        const order = allOrders.find(o => o.id === orderId);

        if (!order) {
            this.showNotification('Order not found', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2><i class="fas fa-sync"></i> Update Order Status</h2>
                    <button class="modal-close" id="closeUpdateStatusModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="updateOrderStatusForm">
                        <input type="hidden" id="updateOrderId" value="${order.id}">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <div><strong>Order Number:</strong> ${order.orderNumber}</div>
                            <div><strong>Medication:</strong> ${order.medicationName}</div>
                            <div><strong>Current Status:</strong> <span class="status-badge ${order.orderStatus.toLowerCase()}">${order.orderStatus}</span></div>
                        </div>
                        <div class="form-group">
                            <label for="newOrderStatus">New Status <span style="color: red;">*</span></label>
                            <select id="newOrderStatus" class="form-control" required>
                                <option value="Pending" ${order.orderStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="Confirmed" ${order.orderStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                                <option value="Received" ${order.orderStatus === 'Received' ? 'selected' : ''}>Received</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="statusUpdateNotes">Update Notes</label>
                            <textarea id="statusUpdateNotes" class="form-control" rows="3" placeholder="Add any notes about this status change..."></textarea>
                        </div>
                        <div class="modal-actions" style="margin-top: 24px;">
                            <button type="button" class="btn btn-secondary" id="cancelUpdateStatus">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Update Status
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('closeUpdateStatusModal').addEventListener('click', () => modal.remove());
        document.getElementById('cancelUpdateStatus').addEventListener('click', () => modal.remove());
        document.getElementById('updateOrderStatusForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateOrderStatus(modal);
        });
    }

    updateOrderStatus(modal) {
        const orderId = document.getElementById('updateOrderId').value;
        const newStatus = document.getElementById('newOrderStatus').value;
        const statusNotes = document.getElementById('statusUpdateNotes').value;

        let medOrders = JSON.parse(localStorage.getItem('medOrders') || '[]');
        const orderIndex = medOrders.findIndex(o => o.id === orderId);

        if (orderIndex === -1) {
            this.showNotification('Order not found', 'error');
            return;
        }

        medOrders[orderIndex].orderStatus = newStatus;
        medOrders[orderIndex].lastStatusUpdate = new Date().toLocaleDateString('en-US');
        medOrders[orderIndex].updatedBy = this.currentUser.name;
        if (statusNotes) {
            medOrders[orderIndex].statusNotes = statusNotes;
        }

        localStorage.setItem('medOrders', JSON.stringify(medOrders));
        this.showNotification('Order status updated successfully!', 'success');
        modal.remove();
        this.loadPage('unavailable-meds');
    }

    // Quality Control Listeners and Functions
    attachQualityControlListeners() {
        const qcForm = document.getElementById('newQCForm');
        const clearFormBtn = document.getElementById('clearQCForm');
        const historyFilter = document.getElementById('qcHistoryFilter');

        if (qcForm) {
            qcForm.addEventListener('submit', (e) => this.saveQualityControl(e));
        }

        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', () => this.clearQCForm());
        }

        if (historyFilter) {
            historyFilter.addEventListener('change', (e) => this.loadQCHistory(e.target.value));
        }

        const viewDetailsButtons = document.querySelectorAll('.btn-view-qc-details');
        viewDetailsButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const qcId = e.currentTarget.getAttribute('data-qc-id');
                if (qcId) {
                    this.showQCDetailsModal(qcId);
                }
            });
        });

        // Load initial history
        this.loadQCHistory('');
    }

    clearQCForm() {
        document.getElementById('qcTestName').value = '';
        document.getElementById('qcControlLevel').value = '';
        document.getElementById('qcLotNumber').value = '';
        document.getElementById('qcExpiryDate').value = '';
        document.getElementById('qcObservedValue').value = '';
        document.getElementById('qcExpectedRange').value = '';
        document.getElementById('qcResult').value = '';
        document.getElementById('qcInstrument').value = '';
        document.getElementById('qcNotes').value = '';
    }

    saveQualityControl(e) {
        e.preventDefault();

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        const qcRecord = {
            id: 'QC' + Date.now(),
            testName: document.getElementById('qcTestName').value,
            controlLevel: document.getElementById('qcControlLevel').value,
            lotNumber: document.getElementById('qcLotNumber').value,
            expiryDate: document.getElementById('qcExpiryDate').value,
            observedValue: document.getElementById('qcObservedValue').value,
            expectedRange: document.getElementById('qcExpectedRange').value,
            result: document.getElementById('qcResult').value,
            instrument: document.getElementById('qcInstrument').value,
            notes: document.getElementById('qcNotes').value,
            testedBy: currentUser.name || 'Lab Staff',
            testDate: new Date().toLocaleDateString(),
            testTime: new Date().toLocaleTimeString(),
            recordedDateTime: new Date().toISOString()
        };

        let qcRecords = JSON.parse(localStorage.getItem('qualityControl') || '[]');
        qcRecords.unshift(qcRecord);
        localStorage.setItem('qualityControl', JSON.stringify(qcRecords));

        this.showNotification('Quality control record saved successfully', 'success');
        this.clearQCForm();
        this.loadQCHistory(document.getElementById('qcHistoryFilter').value);
        
        // Reload page to update today's summary
        this.loadPage('quality-control');
    }

    loadQCHistory(filterTest = '') {
        const qcRecords = JSON.parse(localStorage.getItem('qualityControl') || '[]');
        const historyTable = document.getElementById('qcHistoryTable');

        if (!historyTable) return;

        let filteredRecords = qcRecords;
        if (filterTest) {
            filteredRecords = qcRecords.filter(qc => qc.testName === filterTest);
        }

        if (filteredRecords.length === 0) {
            historyTable.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-clipboard-check" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                    <p style="font-size: 16px;">No quality control records found.</p>
                </div>
            `;
            return;
        }

        let historyRows = '';
        filteredRecords.forEach(qc => {
            const statusClass = qc.result === 'Within Range' ? 'active' : 
                              qc.result === 'Out of Range' ? 'discharged' : 'admitted';
            
            historyRows += `
                <tr>
                    <td style="padding: 12px;">${qc.testName}</td>
                    <td style="padding: 12px;">${qc.controlLevel}</td>
                    <td style="padding: 12px;">${qc.lotNumber}</td>
                    <td style="padding: 12px;">${qc.observedValue}</td>
                    <td style="padding: 12px;">${qc.expectedRange}</td>
                    <td style="padding: 12px;"><span class="status-badge ${statusClass}">${qc.result}</span></td>
                    <td style="padding: 12px;">${qc.testDate}</td>
                    <td style="padding: 12px;">${qc.testedBy}</td>
                    <td style="padding: 12px;">
                        <button class="btn btn-sm btn-view-qc-details" data-qc-id="${qc.id}">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </td>
                </tr>
            `;
            
            if (qc.notes) {
                historyRows += `
                    <tr style="background: #f8f9fa;">
                        <td colspan="9" style="text-align: left; padding: 12px; border-left: 3px solid var(--dark-pink);">
                            <strong style="color: var(--dark-pink);">Notes:</strong> ${qc.notes}
                        </td>
                    </tr>
                `;
            }
        });

        historyTable.innerHTML = `
            <div style="overflow-x: auto;">
                <table class="patients-table" style="width: 100%;">
                    <thead>
                        <tr>
                            <th style="padding: 12px;">Test Name</th>
                            <th style="padding: 12px;">Control Level</th>
                            <th style="padding: 12px;">Lot Number</th>
                            <th style="padding: 12px;">Observed</th>
                            <th style="padding: 12px;">Expected Range</th>
                            <th style="padding: 12px;">Result</th>
                            <th style="padding: 12px;">Date</th>
                            <th style="padding: 12px;">Tested By</th>
                            <th style="padding: 12px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${historyRows}
                    </tbody>
                </table>
            </div>
        `;

        // Re-attach event listeners for newly created buttons
        const viewDetailsButtons = historyTable.querySelectorAll('.btn-view-qc-details');
        viewDetailsButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const qcId = e.currentTarget.getAttribute('data-qc-id');
                if (qcId) {
                    this.showQCDetailsModal(qcId);
                }
            });
        });
    }

    showQCDetailsModal(qcId) {
        const qcRecords = JSON.parse(localStorage.getItem('qualityControl') || '[]');
        const qc = qcRecords.find(record => record.id === qcId);

        if (!qc) {
            this.showNotification('QC record not found', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'qcDetailsModal';

        const statusClass = qc.result === 'Within Range' ? 'active' : 
                          qc.result === 'Out of Range' ? 'discharged' : 'admitted';

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2><i class="fas fa-clipboard-check"></i> Quality Control Details</h2>
                    <button class="modal-close" id="closeQCDetailsBtn">&times;</button>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Test Name</label>
                            <p style="margin: 0; font-size: 16px;">${qc.testName}</p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Control Level</label>
                            <p style="margin: 0; font-size: 16px;">${qc.controlLevel}</p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Lot Number</label>
                            <p style="margin: 0; font-size: 16px;">${qc.lotNumber}</p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Expiry Date</label>
                            <p style="margin: 0; font-size: 16px;">${qc.expiryDate}</p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Observed Value</label>
                            <p style="margin: 0; font-size: 16px; font-weight: 600; color: var(--dark-pink);">${qc.observedValue}</p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Expected Range</label>
                            <p style="margin: 0; font-size: 16px;">${qc.expectedRange}</p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Result Status</label>
                            <p style="margin: 0; font-size: 16px;"><span class="status-badge ${statusClass}">${qc.result}</span></p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Instrument/Analyzer</label>
                            <p style="margin: 0; font-size: 16px;">${qc.instrument}</p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Test Date & Time</label>
                            <p style="margin: 0; font-size: 16px;">${qc.testDate} ${qc.testTime}</p>
                        </div>
                        <div class="info-item">
                            <label style="font-weight: bold; color: #666; display: block; margin-bottom: 5px;">Tested By</label>
                            <p style="margin: 0; font-size: 16px;">${qc.testedBy}</p>
                        </div>
                    </div>
                    ${qc.notes ? `
                    <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                        <label style="font-weight: bold; color: var(--dark-pink); display: block; margin-bottom: 8px;">Notes / Corrective Actions</label>
                        <p style="margin: 0; line-height: 1.6;">${qc.notes}</p>
                    </div>
                    ` : ''}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" id="closeQCModalBtn">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };

        document.getElementById('closeQCDetailsBtn').addEventListener('click', closeModal);
        document.getElementById('closeQCModalBtn').addEventListener('click', closeModal);
    }
}


// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});