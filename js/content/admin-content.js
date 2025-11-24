// Admin/HR Content Module

class AdminContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // Dashboard Content for Admin
    getDashboardContent() {
        // Get dynamic stats
        const stats = this.getDynamicStats();
        
        return `
            <div class="dashboard-overview">
                ${this.getBentoBanner()}
                <div class="dashboard-flex-row">
                    ${this.getAnnouncementsSection()}
                    <div class="dashboard-cards-wrapper">
                        <div class="cards-grid">
                    <div class="card stat-card">
                        <div class="card-header">
                            <div class="stat-info">
                                <div class="card-icon">
                                    <i class="fas fa-user-injured"></i>
                                </div>
                                <h3 class="card-title">Patients</h3>
                            </div>
                            <div class="stat-number">${stats.totalPatients}</div>
                        </div>
                        <div class="card-content">
                            <p>Total registered patients</p>
                            <button class="btn-view-stat" data-page="all-patients">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </div>
                    </div>
                    <div class="card stat-card">
                        <div class="card-header">
                            <div class="stat-info">
                                <div class="card-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <h3 class="card-title">Staff</h3>
                            </div>
                            <div class="stat-number">${stats.totalStaff}</div>
                        </div>
                        <div class="card-content">
                            <p>Total hospital staff members</p>
                            <button class="btn-view-stat" data-page="all-staff">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </div>
                    </div>
                    <div class="card stat-card">
                        <div class="card-header">
                            <div class="stat-info">
                                <div class="card-icon">
                                    <i class="fas fa-file-invoice-dollar"></i>
                                </div>
                                <h3 class="card-title">Billing</h3>
                            </div>
                            <div class="stat-number">${stats.pendingBilling}</div>
                        </div>
                        <div class="card-content">
                            <p>Pending billing statements</p>
                            <button class="btn-view-stat" data-page="billing">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </div>
                    </div>
                </div>
                    </div>
                </div>
                ${this.getAwardsManagementSection()}
                ${this.getSystemManagementSection()}
                ${new SharedContent(this.currentUser).getSocialFooter()}
            </div>
        `;
    }

    // Get Dynamic Stats
    getDynamicStats() {
        let totalPatients = 0;
        let totalStaff = 0;
        let pendingBilling = 0;

        // Count patients
        try {
            const patients = JSON.parse(localStorage.getItem('patients') || '[]');
            totalPatients = patients.length;
            
            // Count patients without billing (pending billing)
            pendingBilling = patients.filter(p => !p.billing).length;
        } catch (error) {
            console.error('Error loading patients:', error);
        }

        // Count staff - hierarchy has 26 staff members
        const hierarchyStaffCount = 26;
        let addedStaffCount = 0;
        
        try {
            const staff = JSON.parse(localStorage.getItem('staff') || '[]');
            addedStaffCount = staff.length;
        } catch (error) {
            console.error('Error loading staff:', error);
        }
        
        totalStaff = hierarchyStaffCount + addedStaffCount;

        return {
            totalPatients,
            totalStaff,
            pendingBilling
        };
    }

    // Announcements Section
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
                    ${role === 'HR/Admin' ? `
                        <div class="announcement-actions">
                            <button class="btn btn-sm btn-edit-announcement" data-id="${announcement.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-delete-announcement" data-id="${announcement.id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    ` : ''}
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

        let addButton = '';
        if (role === 'HR/Admin') {
            addButton = `
                <button class="btn btn-primary" id="addAnnouncementBtn">
                    <i class="fas fa-bullhorn"></i>
                    Add Announcement
                </button>
            `;
        }

        return `
            <div class="announcements-section">
                <div class="card">
                    <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 class="card-title">
                            <i class="fas fa-bullhorn"></i>
                            Announcements
                        </h3>
                        ${addButton}
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

    // All Staff Organizational Hierarchy
    getAllStaffContent() {
        const role = this.currentUser.role;
        
        // Load saved hierarchy staff names
        let hierarchyStaff = {};
        try {
            const stored = localStorage.getItem('hierarchyStaff');
            if (stored) {
                hierarchyStaff = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading hierarchy staff:', error);
        }

        // Helper function to get staff name
        const getStaffName = (nodeId, defaultName) => {
            return hierarchyStaff[nodeId] ? hierarchyStaff[nodeId].name : defaultName;
        };
        
        let addStaffButton = '';
        if (role === 'HR/Admin') {
            addStaffButton = `
                <button class="btn btn-primary" id="addStaffBtn">
                    <i class="fas fa-user-plus"></i>
                    Add New Staff
                </button>
            `;
        }

        // Load staff from localStorage
        let addedStaff = [];
        try {
            const stored = localStorage.getItem('staff');
            if (stored) {
                addedStaff = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading staff:', error);
        }

        // If no staff in localStorage, use sample data (limited to 3)
        if (addedStaff.length === 0) {
            addedStaff = [
                {
                    id: 'sample1',
                    name: 'Dr. Isabella Reyes',
                    displayName: 'Dr. Isabella Reyes, MD',
                    department: 'Medical',
                    position: 'Physician',
                    title: 'Chief Physician',
                    credentials: 'MD',
                    dateAdded: new Date().toISOString()
                },
                {
                    id: 'sample2',
                    name: 'Maria Lourdes Santos',
                    displayName: 'Maria Lourdes Santos, RN',
                    department: 'Nursing',
                    position: 'Nurse',
                    title: 'Head Nurse',
                    credentials: 'RN',
                    dateAdded: new Date().toISOString()
                },
                {
                    id: 'sample3',
                    name: 'Dr. Antonio Garcia',
                    displayName: 'Dr. Antonio Garcia, RPh',
                    department: 'Pharmacy',
                    position: 'Pharmacist',
                    title: 'Pharmacy Director',
                    credentials: 'RPh',
                    dateAdded: new Date().toISOString()
                }
            ];
        } else {
            // Limit to 3 most recent staff members
            addedStaff = addedStaff.slice(0, 3);
        }

        // Generate HTML for added staff
        let addedStaffHTML = '';
        if (addedStaff.length > 0) {
            addedStaffHTML = `
                <div class="added-staff-section" style="margin-bottom: 30px;">
                    <h3 style="color: var(--dark-pink); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-users"></i>
                        Recently Added Staff
                    </h3>
                    <div class="staff-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;">
            `;

            addedStaff.forEach(staff => {
                const badgeClass = staff.position ? staff.position.toLowerCase().replace(/\s+/g, '-') : 'staff';
                const displayTitle = staff.title || staff.position || 'Staff Member';
                const displayName = staff.displayName || staff.name || 'Unknown';
                const displayDepartment = staff.department || 'Unassigned';
                const displayPosition = staff.position || 'Staff';
                
                addedStaffHTML += `
                    <div class="staff-card" style="background: white; padding: 20px; border-radius: 10px; border-left: 4px solid var(--secondary-pink); box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                        <div style="display: flex; align-items: start; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: var(--light-pink); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fas fa-user" style="color: var(--dark-pink); font-size: 18px;"></i>
                            </div>
                            <div style="flex: 1; min-width: 0;">
                                <h4 style="margin: 0 0 4px 0; font-size: 15px; color: var(--text-dark); font-weight: 600;">${displayTitle}</h4>
                                <p style="margin: 0 0 8px 0; font-size: 14px; color: var(--text-dark); font-weight: 500;">${displayName}</p>
                                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                    <span class="node-badge ${badgeClass}" style="font-size: 10px; padding: 4px 8px;">${displayPosition}</span>
                                    <span style="font-size: 11px; color: #666; padding: 4px 8px; background: #f0f0f0; border-radius: 12px;">${displayDepartment}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            addedStaffHTML += `
                    </div>
                </div>
            `;
        }

        return `
            <div class="staff-management">
                <div class="card">
                    <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 class="card-title">
                            <i class="fas fa-sitemap"></i>
                            All Staff
                        </h3>
                        ${addStaffButton}
                    </div>
                    <div class="card-content">
                        ${addedStaffHTML}
                        
                        <h3 style="color: var(--dark-pink); margin-bottom: 20px; ${addedStaff.length > 0 ? 'margin-top: 30px; padding-top: 20px; border-top: 2px solid #f0f0f0;' : ''} display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-sitemap"></i>
                            Organizational Hierarchy
                        </h3>
                        <div class="org-tree">
                            <!-- Hospital Administrator -->
                            <div class="tree-level level-1">
                                <div class="tree-node executive editable-node" data-node-id="admin-1" data-title="Hospital Administrator" data-name="${getStaffName('admin-1', 'Dr. Maria Santos')}" style="cursor: pointer;">
                                    <div class="node-icon">
                                        <i class="fas fa-user-tie"></i>
                                    </div>
                                    <div class="node-content">
                                        <h4>Hospital Administrator</h4>
                                        <p class="node-name">${getStaffName('admin-1', 'Dr. Maria Santos')}</p>
                                        <span class="node-badge">Executive</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Department Heads -->
                            <div class="tree-level level-2">
                                <!-- Medical Director -->
                                <div class="tree-branch">
                                    <div class="tree-node director editable-node" data-node-id="med-dir-1" data-title="Medical Director" data-name="${getStaffName('med-dir-1', 'Dr. Ramon Cruz')}" style="cursor: pointer;">
                                        <div class="node-icon">
                                            <i class="fas fa-user-md"></i>
                                        </div>
                                        <div class="node-content">
                                            <h4>Medical Director</h4>
                                            <p class="node-name">${getStaffName('med-dir-1', 'Dr. Ramon Cruz')}</p>
                                            <span class="node-badge">Director</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Physicians under Medical Director -->
                                    <div class="tree-children">
                                        <div class="tree-node physician editable-node" data-node-id="phys-1" data-title="Chief Physician" data-name="${getStaffName('phys-1', 'Dr. Isabella Reyes')}" style="cursor: pointer;">
                                            <div class="node-icon">
                                                <i class="fas fa-stethoscope"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Chief Physician</h4>
                                                <p class="node-name">${getStaffName('phys-1', 'Dr. Isabella Reyes')}</p>
                                                <span class="node-badge">Physician</span>
                                            </div>
                                        </div>
                                        <div class="tree-node physician editable-node" data-node-id="phys-2" data-title="Senior Physician" data-name="${getStaffName('phys-2', 'Dr. Salvador')}" style="cursor: pointer;">
                                            <div class="node-icon">
                                                <i class="fas fa-stethoscope"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Senior Physician</h4>
                                                <p class="node-name">${getStaffName('phys-2', 'Dr. Salvador')}</p>
                                                <span class="node-badge">Physician</span>
                                            </div>
                                        </div>
                                        <div class="tree-node physician editable-node" data-node-id="phys-3" data-title="Physician" data-name="${getStaffName('phys-3', 'Dr. Sta.Maria')}" style="cursor: pointer;">
                                            <div class="node-icon">
                                                <i class="fas fa-stethoscope"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Physician</h4>
                                                <p class="node-name">${getStaffName('phys-3', 'Dr. Sta.Maria')}</p>
                                                <span class="node-badge">Physician</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Nursing Director -->
                                <div class="tree-branch">
                                    <div class="tree-node director editable-node" data-node-id="nurs-dir-1" data-title="Director of Nursing" data-name="${getStaffName('nurs-dir-1', 'Josefina Torres, RN')}" style="cursor: pointer;">
                                        <div class="node-icon">
                                            <i class="fas fa-user-nurse"></i>
                                        </div>
                                        <div class="node-content">
                                            <h4>Director of Nursing</h4>
                                            <p class="node-name">${getStaffName('nurs-dir-1', 'Josefina Torres, RN')}</p>
                                            <span class="node-badge">Director</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Nurses under Nursing Director -->
                                    <div class="tree-children">
                                        <div class="tree-node nurse editable-node" data-node-id="nurse-1" data-title="Head Nurse" data-name="${getStaffName('nurse-1', 'Maria Lourdes Santos, RN')}" style="cursor: pointer;">
                                            <div class="node-icon">
                                                <i class="fas fa-heartbeat"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Head Nurse</h4>
                                                <p class="node-name">${getStaffName('nurse-1', 'Maria Lourdes Santos, RN')}</p>
                                                <span class="node-badge">Nurse</span>
                                            </div>
                                        </div>
                                        <div class="tree-node nurse editable-node" data-node-id="nurse-2" data-title="Senior Nurse" data-name="${getStaffName('nurse-2', 'Angelica Dela Cruz, RN')}" style="cursor: pointer;">
                                            <div class="node-icon">
                                                <i class="fas fa-heartbeat"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Senior Nurse</h4>
                                                <p class="node-name">${getStaffName('nurse-2', 'Angelica Dela Cruz, RN')}</p>
                                                <span class="node-badge">Nurse</span>
                                            </div>
                                        </div>
                                        <div class="tree-node nurse editable-node" data-node-id="nurse-3" data-title="Staff Nurse" data-name="${getStaffName('nurse-3', 'Nurse Berna, RN')}" style="cursor: pointer;">
                                            <div class="node-icon">
                                                <i class="fas fa-heartbeat"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Staff Nurse</h4>
                                                <p class="node-name">${getStaffName('nurse-3', 'Nurse Berna, RN')}</p>
                                                <span class="node-badge">Nurse</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pharmacy Director -->
                                <div class="tree-branch">
                                    <div class="tree-node director editable-node" data-node-id="pharm-dir-1" data-title="Pharmacy Director" data-name="${getStaffName('pharm-dir-1', 'Dr. Antonio Garcia, RPh')}" style="cursor: pointer;">
                                        <div class="node-icon">
                                            <i class="fas fa-pills"></i>
                                        </div>
                                        <div class="node-content">
                                            <h4>Pharmacy Director</h4>
                                            <p class="node-name">${getStaffName('pharm-dir-1', 'Dr. Antonio Garcia, RPh')}</p>
                                            <span class="node-badge">Director</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Pharmacists -->
                                    <div class="tree-children">
                                        <div class="tree-node pharmacist editable-node" data-node-id="pharm-1" data-title="Senior Pharmacist" data-name="${getStaffName('pharm-1', 'Carmen Lopez, RPh')}" style="cursor: pointer;">
                                            <div class="node-icon">
                                                <i class="fas fa-prescription-bottle"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Senior Pharmacist</h4>
                                                <p class="node-name">${getStaffName('pharm-1', 'Carmen Lopez, RPh')}</p>
                                                <span class="node-badge">Pharmacist</span>
                                            </div>
                                        </div>
                                        <div class="tree-node pharmacist editable-node" data-node-id="pharm-2" data-title="Pharmacist" data-name="${getStaffName('pharm-2', 'Pharmacist Jer, RPh')}" style="cursor: pointer;">
                                            <div class="node-icon">
                                                <i class="fas fa-prescription-bottle"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Pharmacist</h4>
                                                <p class="node-name">${getStaffName('pharm-2', 'Pharmacist Jer, RPh')}</p>
                                                <span class="node-badge">Pharmacist</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Laboratory & Imaging Section -->
                            <div class="tree-level level-3">
                                <!-- Lab Director -->
                                <div class="tree-branch">
                                    <div class="tree-node director editable-node" data-node-id="lab-dir-1" data-title="Laboratory Director" data-name="${getStaffName('lab-dir-1', 'Dr. Ricardo Fernandez')}" style="cursor: pointer;">
                                        <div class="node-icon">
                                            <i class="fas fa-microscope"></i>
                                        </div>
                                        <div class="node-content">
                                            <h4>Laboratory Director</h4>
                                            <p class="node-name">${getStaffName('lab-dir-1', 'Dr. Ricardo Fernandez')}</p>
                                            <span class="node-badge">Director</span>
                                        </div>
                                    </div>
                                    
                                    <!-- MedTechs -->
                                    <div class="tree-children">
                                        <div class="tree-node medtech editable-node" data-node-id="medtech-1" data-title="Senior Med Tech" data-name="${getStaffName('medtech-1', 'Patricia Aquino, RMT')}" style="cursor: pointer;">
                                            <div class="node-icon">
                                                <i class="fas fa-vial"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Senior Med Tech</h4>
                                                <p class="node-name">${getStaffName('medtech-1', 'Patricia Aquino, RMT')}</p>
                                                <span class="node-badge">MedTech</span>
                                            </div>
                                        </div>
                                        <div class="tree-node medtech editable-node" data-node-id="medtech-2" data-title="Medical Technologist" data-name="${getStaffName('medtech-2', 'Lab Tech Cristel, RMT')}" style="cursor: pointer;">
                                            <div class="node-icon">
                                                <i class="fas fa-vial"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Medical Technologist</h4>
                                                <p class="node-name">${getStaffName('medtech-2', 'Lab Tech Cristel, RMT')}</p>
                                                <span class="node-badge">MedTech</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Radiology Director -->
                                <div class="tree-branch">
                                    <div class="tree-node director editable-node" data-node-id="rad-dir-1" data-title="Radiology Director" data-name="${getStaffName('rad-dir-1', 'Dr. Rodrigo Villanueva')}" style="cursor: pointer;">
                                        <div class="node-icon">
                                            <i class="fas fa-x-ray"></i>
                                        </div>
                                        <div class="node-content">
                                            <h4>Radiology Director</h4>
                                            <p class="node-name">${getStaffName('rad-dir-1', 'Dr. Rodrigo Villanueva')}</p>
                                            <span class="node-badge">Director</span>
                                        </div>
                                    </div>
                                    
                                    <!-- RadTechs -->
                                    <div class="tree-children">
                                        <div class="tree-node radtech editable-node" data-node-id="radtech-1" data-title="Senior Rad Tech" data-name="${getStaffName('radtech-1', 'Stephanie Ramos, RT')}" style="cursor: pointer;">
                                            <div class="node-icon">
                                                <i class="fas fa-radiation"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Senior Rad Tech</h4>
                                                <p class="node-name">${getStaffName('radtech-1', 'Stephanie Ramos, RT')}</p>
                                                <span class="node-badge">RadTech</span>
                                            </div>
                                        </div>
                                        <div class="tree-node radtech editable-node" data-node-id="radtech-2" data-title="Radiologic Technologist" data-name="${getStaffName('radtech-2', 'Radiology Tech Rafael, RT')}" style="cursor: pointer;">
                                            <div class="node-icon">
                                                <i class="fas fa-radiation"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Radiologic Technologist</h4>
                                                <p class="node-name">${getStaffName('radtech-2', 'Radiology Tech Rafael, RT')}</p>
                                                <span class="node-badge">RadTech</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- HR/Admin Director -->
                                <div class="tree-branch">
                                    <div class="tree-node director editable-node" data-node-id="hr-dir-1" data-title="HR/Admin Director" data-name="${getStaffName('hr-dir-1', 'Veronica Pascual')}" style="cursor: pointer;">
                                        <div class="node-icon">
                                            <i class="fas fa-user-cog"></i>
                                        </div>
                                        <div class="node-content">
                                            <h4>HR/Admin Director</h4>
                                            <p class="node-name">${getStaffName('hr-dir-1', 'Veronica Pascual')}</p>
                                            <span class="node-badge">Director</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Admin Staff -->
                                    <div class="tree-children">
                                        <div class="tree-node admin editable-node" data-node-id="admin-2" data-title="Senior Admin" data-name="${getStaffName('admin-2', 'Luisa Santiago')}" style="cursor: pointer;">
                                            <div class="node-icon">
                                                <i class="fas fa-clipboard-check"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Senior Admin</h4>
                                                <p class="node-name">${getStaffName('admin-2', 'Luisa Santiago')}</p>
                                                <span class="node-badge">Admin</span>
                                            </div>
                                        </div>
                                        <div class="tree-node admin editable-node" data-node-id="admin-3" data-title="Admin Staff" data-name="${getStaffName('admin-3', 'Chief Admin')}" style="cursor: pointer;">
                                            <div class="node-icon">
                                                <i class="fas fa-clipboard-check"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Admin Staff</h4>
                                                <p class="node-name">${getStaffName('admin-3', 'Chief Admin')}</p>
                                                <span class="node-badge">Admin</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Billing Management Content for Admin
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
            
            const hasInsurance = hasBilling && patient.billing.insuranceProvider;
            const insuranceStatus = hasInsurance ?
                '<span class="status-badge completed"><i class="fas fa-shield-alt"></i> Insured</span>' :
                '<span class="status-badge pending">No Insurance</span>';
            
            const insuranceInfo = hasInsurance ?
                `<div style="font-size: 12px; color: #666;">
                    <strong>${patient.billing.insuranceProvider}</strong><br>
                    ${patient.billing.insuranceNumber}
                </div>` :
                '<span style="color: #999;">-</span>';
            
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
                    <td>${insuranceStatus}</td>
                    <td>${insuranceInfo}</td>
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
                                    <th style="width: 10%;">Patient ID</th>
                                    <th style="width: 20%;">Name</th>
                                    <th style="width: 8%;">Age</th>
                                    <th style="width: 12%;">Billing Status</th>
                                    <th style="width: 12%;">Insurance Status</th>
                                    <th style="width: 18%;">Insurance Details</th>
                                    <th style="width: 20%;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${patientRows || '<tr><td colspan="7" style="text-align: center;">No patients found</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // Awards Management Section
    getAwardsManagementSection() {
        // Load awards from localStorage
        let awards = [];
        try {
            const stored = localStorage.getItem('hospitalAwards');
            if (stored) {
                awards = JSON.parse(stored);
            } else {
                // Initialize default awards if none exist
                awards = [
                    {
                        id: 1,
                        title: 'Excellence in Healthcare Award',
                        description: 'Recognized for outstanding patient care and medical innovation',
                        image: './images/award1.png'
                    },
                    {
                        id: 2,
                        title: 'Best Hospital Facility Award',
                        description: 'Awarded for state-of-the-art medical equipment and infrastructure',
                        image: './images/award2.png'
                    },
                    {
                        id: 3,
                        title: 'Patient Satisfaction Award',
                        description: 'Highest patient satisfaction rating in the region for exceptional care',
                        image: './images/award3.png'
                    }
                ];
                localStorage.setItem('hospitalAwards', JSON.stringify(awards));
            }
        } catch (error) {
            console.error('Error loading awards:', error);
        }

        const awardsHTML = awards.map(award => `
            <div class="award-card" data-award-id="${award.id}">
                <div class="award-image-container">
                    <img src="${award.image}" alt="${award.title}" onerror="this.src='https://via.placeholder.com/1024x1024/d4a5a5/ffffff?text=Award+Image'">
                </div>
                <div class="award-info">
                    <h4>${award.title}</h4>
                    <p>${award.description}</p>
                    <div class="award-actions">
                        <button class="btn btn-sm btn-edit-award" data-award-id="${award.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-delete-award" data-award-id="${award.id}">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div class="awards-management-section">
                <div class="section-header">
                    <h3>
                        <i class="fas fa-trophy"></i>
                        Hospital Awards & Recognition
                    </h3>
                    <button class="btn btn-primary" id="addAwardBtn">
                        <i class="fas fa-plus"></i>
                        Add Award
                    </button>
                </div>
                <div class="awards-grid">
                    ${awardsHTML}
                </div>
            </div>
        `;
    }

    // Vital Signs Content for Admin (view-only with patient selection)
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
                <!-- Info Banner -->
                <div class="info-banner" style="margin-bottom: 24px; padding: 16px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-info-circle" style="font-size: 24px;"></i>
                    <div>
                        <h4 style="margin: 0 0 4px 0; font-size: 16px;">Vital Signs (View Only)</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Monitor patient vital signs recorded by nurses. Only nurses can record vital signs.</p>
                    </div>
                </div>

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

                <!-- Detailed View -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-heartbeat"></i>
                            Vital Signs Records
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

    // Lab Results Content for Admin (view-only with patient selection)
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

    // Prescriptions Content for Admin (view-only with patient selection)
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

        // Fallback to sample data if no patients
        if (patients.length === 0) {
            patients = [
                { id: 'P001', fullName: 'Miranda, Hebrew T.', age: 19, status: 'Active', doctor: 'Dr. Sta. Maria' },
                { id: 'P002', fullName: 'Sta.Maria, Rizza M.', age: 20, status: 'Admitted', doctor: 'Dr. Sta. Maria' },
                { id: 'P003', fullName: 'Puquiz, Daniel T.', age: 21, status: 'Active', doctor: 'Dr. Salvador' }
            ];
        }

        // Get all medications (prescriptions)
        const allPrescriptions = JSON.parse(localStorage.getItem('medications') || '[]');

        // Create summary table with most recent prescriptions per patient
        let summaryRows = '';
        patients.forEach(patient => {
            const patientPrescriptions = allPrescriptions.filter(med => med.patientId === patient.id);
            const latestRx = patientPrescriptions[0]; // Most recent

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

        // Generate patient options for dropdown
        const patientOptions = patients.map(patient => 
            `<option value="${patient.id}">${patient.id} - ${patient.fullName}</option>`
        ).join('');

        return `
            <div class="prescriptions-management">
                <!-- Info Banner -->
                <div class="info-banner" style="margin-bottom: 24px; padding: 16px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-info-circle" style="font-size: 24px;"></i>
                    <div>
                        <h4 style="margin: 0 0 4px 0; font-size: 16px;">Prescriptions (View Only)</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">View patient prescriptions written by physicians. Only physicians can prescribe medications.</p>
                    </div>
                </div>

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

                        <!-- Patient Info Display (hidden until patient selected) -->
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
    getImagingResultsContent() {
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
                        <td style="width: 10%;">${latest.status || 'Completed'}</td>
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
                <!-- Info Banner -->
                <div class="info-banner" style="margin-bottom: 24px; padding: 16px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-info-circle" style="font-size: 24px;"></i>
                    <div>
                        <h4 style="margin: 0 0 4px 0; font-size: 16px;">Imaging Results (View Only)</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">View imaging results processed by radiology technologists. Only rad-techs can input results.</p>
                    </div>
                </div>

                <!-- Summary Table -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            Imaging Results Summary
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="max-height: 180px; overflow-y: auto; overflow-x: auto; position: relative;">
                            <table class="patients-table" style="min-width: 900px;">
                                <thead style="position: sticky; top: 0; z-index: 10; background: white;">
                                    <tr>
                                        <th style="width: 10%;">Patient ID</th>
                                        <th style="width: 20%;">Name</th>
                                        <th style="width: 15%;">Modality</th>
                                        <th style="width: 12%;">Date</th>
                                        <th style="width: 10%;">Status</th>
                                        <th style="width: 12%;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${summaryRows || '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No imaging results recorded yet</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Patient Selection and History -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-x-ray"></i>
                            Imaging Results
                        </h3>
                    </div>
                    <div class="card-content">
                        <div class="patient-selector" style="margin-bottom: 24px; padding: 20px; background: var(--light-pink); border-radius: 8px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="imagingResultsPatientAdmin" style="font-weight: 600; margin-bottom: 8px; display: block;">
                                    <i class="fas fa-user-injured"></i> Select Patient
                                </label>
                                <select id="imagingResultsPatientAdmin" class="form-control" style="font-size: 14px;">
                                    <option value="">-- Select a patient --</option>
                                    ${patientOptions}
                                </select>
                            </div>
                        </div>

                        <div id="selectedPatientInfoImagingAdmin" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                                <i class="fas fa-user-injured"></i> <span id="selectedPatientNameImagingAdmin"></span>
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> <span id="selectedPatientIdImagingAdmin"></span></div>
                                <div><strong>Age:</strong> <span id="selectedPatientAgeImagingAdmin"></span></div>
                                <div><strong>Status:</strong> <span id="selectedPatientStatusImagingAdmin"></span></div>
                                <div><strong>Doctor:</strong> <span id="selectedPatientDoctorImagingAdmin"></span></div>
                            </div>
                        </div>

                        <div id="imagingResultsHistoryAdmin" style="display: none; margin-top: 24px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                <i class="fas fa-history"></i> Imaging Results History
                            </h4>
                            <div id="imagingResultsHistoryTableAdmin"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Drug Dispensing Content for Admin (View Only)
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
                <!-- Info Banner -->
                <div class="info-banner" style="margin-bottom: 24px; padding: 16px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-info-circle" style="font-size: 24px;"></i>
                    <div>
                        <h4 style="margin: 0 0 4px 0; font-size: 16px;">Drug Dispensing (View Only)</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">View medication dispensing records processed by pharmacists. Only pharmacists can dispense medications.</p>
                    </div>
                </div>

                <!-- Summary Table -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            Recent Drug Dispensing Summary
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="max-height: 180px; overflow-y: auto; overflow-x: auto; position: relative;">
                            <table class="patients-table" style="min-width: 900px;">
                                <thead style="position: sticky; top: 0; z-index: 10; background: white;">
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
                                <tbody>
                                    ${summaryRows || '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #999;">No dispensing records yet</td></tr>'}
                                </tbody>
                            </table>
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
                                <label for="drugDispensingPatientAdmin" style="font-weight: 600; margin-bottom: 8px; display: block;">
                                    <i class="fas fa-user-injured"></i> Select Patient
                                </label>
                                <select id="drugDispensingPatientAdmin" class="form-control" required style="font-size: 14px;">
                                    <option value="">-- Select a patient --</option>
                                    ${patientOptions}
                                </select>
                            </div>
                        </div>

                        <div id="selectedPatientInfoDispensingAdmin" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                                <i class="fas fa-user-injured"></i> <span id="selectedPatientNameDispensingAdmin"></span>
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> <span id="selectedPatientIdDispensingAdmin"></span></div>
                                <div><strong>Age:</strong> <span id="selectedPatientAgeDispensingAdmin"></span></div>
                                <div><strong>Status:</strong> <span id="selectedPatientStatusDispensingAdmin"></span></div>
                                <div><strong>Doctor:</strong> <span id="selectedPatientDoctorDispensingAdmin"></span></div>
                            </div>
                        </div>

                        <div id="drugDispensingHistoryAdmin" style="display: none; margin-top: 24px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                <i class="fas fa-history"></i> Dispensing History
                            </h4>
                            <div id="drugDispensingHistoryTableAdmin"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // System Management Section - Export/Import Data
    getSystemManagementSection() {
        return `
            <div style="margin-top: 24px; text-align: center;">
                <button style="background: #e9ecef; border: none; cursor: pointer; padding: 8px 16px; border-radius: 20px; color: #6c757d; font-size: 12px; transition: all 0.3s ease;" onclick="this.parentElement.querySelector('.system-management-content').classList.toggle('hidden'); this.querySelector('i').classList.toggle('fa-chevron-down'); this.querySelector('i').classList.toggle('fa-chevron-up');" onmouseover="this.style.background='#dee2e6'" onmouseout="this.style.background='#e9ecef'">
                    <i class="fas fa-chevron-up" style="font-size: 10px;"></i>
                </button>
                <div class="card system-management-content" style="margin-top: 12px; border: none; background: white;">
                    <div class="card-content" style="padding: 24px;">
                        <div style="background: #fff3cd; padding: 16px; border-left: 4px solid #ffc107; border-radius: 4px; margin-bottom: 20px;">
                            <div style="display: flex; align-items: start; gap: 12px;">
                                <i class="fas fa-exclamation-triangle" style="color: #856404; font-size: 20px; margin-top: 2px;"></i>
                                <div>
                                    <strong style="color: #856404; display: block; margin-bottom: 4px;">System Administration Tools</strong>
                                    <p style="margin: 0; color: #856404; font-size: 14px;">These tools allow you to export and import all system data. Use with caution. Export data regularly for backup purposes.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <!-- Export Data -->
                            <div style="padding: 20px; border: 2px solid var(--light-pink); border-radius: 8px;">
                                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                                    <div style="width: 48px; height: 48px; background: var(--light-pink); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-download" style="color: var(--dark-pink); font-size: 20px;"></i>
                                    </div>
                                    <div>
                                        <h4 style="margin: 0; color: var(--dark-pink);">Export All Data</h4>
                                        <p style="margin: 4px 0 0 0; font-size: 13px; color: #666;">Download complete system backup</p>
                                    </div>
                                </div>
                                <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
                                    Exports all patients, staff, medical records, inventory, and system data to a JSON file.
                                </p>
                                <button class="btn btn-primary" id="exportAllDataBtn" style="width: 100%;">
                                    <i class="fas fa-file-download"></i> Export System Data
                                </button>
                            </div>
                            
                            <!-- Import Data -->
                            <div style="padding: 20px; border: 2px solid var(--light-pink); border-radius: 8px;">
                                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                                    <div style="width: 48px; height: 48px; background: var(--light-pink); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-upload" style="color: var(--dark-pink); font-size: 20px;"></i>
                                    </div>
                                    <div>
                                        <h4 style="margin: 0; color: var(--dark-pink);">Import Data</h4>
                                        <p style="margin: 4px 0 0 0; font-size: 13px; color: #666;">Restore from backup file</p>
                                    </div>
                                </div>
                                <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
                                    Import previously exported data. This will merge with existing data.
                                </p>
                                <input type="file" id="importDataFileInput" accept=".json" style="display: none;">
                                <button class="btn btn-secondary" id="importDataBtn" style="width: 100%;">
                                    <i class="fas fa-file-upload"></i> Import System Data
                                </button>
                            </div>
                        </div>
                        
                        <div style="margin-top: 20px; padding: 12px; background: #e7f3ff; border-left: 4px solid #2196F3; border-radius: 4px;">
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <i class="fas fa-info-circle" style="color: #1976D2; margin-top: 2px;"></i>
                                <p style="margin: 0; font-size: 13px; color: #1976D2;">
                                    <strong>Data Included:</strong> Patients, Staff, Medications, Vital Signs, Lab Results, Imaging Results, Prescriptions, Progress Notes, Nursing Assessments, Drug Inventory, Drug Dispensing, Unavailable Meds, Announcements, and all uploaded files.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Patient Medical History (PMH) Content for Admin (View Only)
    getMedicalHistoryContent() {
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

        const patientOptions = patients.map(patient => 
            `<option value="${patient.id}">${patient.id} - ${patient.fullName}</option>`
        ).join('');

        return `
            <div class="medical-history-management">
                <!-- Info Banner -->
                <div class="info-banner" style="margin-bottom: 24px; padding: 16px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-info-circle" style="font-size: 24px;"></i>
                    <div>
                        <h4 style="margin: 0 0 4px 0; font-size: 16px;">Medical History (View Only)</h4>
                        <p style="margin: 0; font-size: 13px; opacity: 0.95;">Admin can view patient medical history records. Only physicians can add or edit entries.</p>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-notes-medical"></i>
                            Patient Medical History (PMH)
                        </h3>
                    </div>
                    <div class="card-content">
                        <!-- Patient Selection -->
                        <div class="patient-selector" style="margin-bottom: 24px; padding: 20px; background: var(--light-pink); border-radius: 8px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label for="medicalHistoryPatientAdmin" style="font-weight: 600; margin-bottom: 8px; display: block;">
                                    <i class="fas fa-user-injured"></i> Select Patient
                                </label>
                                <select id="medicalHistoryPatientAdmin" class="form-control" required style="font-size: 14px;">
                                    <option value="">-- Select a patient --</option>
                                    ${patientOptions}
                                </select>
                            </div>
                        </div>

                        <!-- Patient Info Display -->
                        <div id="selectedPatientInfoMedicalHistoryAdmin" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                                <i class="fas fa-user-injured"></i> <span id="selectedPatientNameMedicalHistoryAdmin"></span>
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> <span id="selectedPatientIdMedicalHistoryAdmin"></span></div>
                                <div><strong>Age:</strong> <span id="selectedPatientAgeMedicalHistoryAdmin"></span></div>
                                <div><strong>Status:</strong> <span id="selectedPatientStatusMedicalHistoryAdmin"></span></div>
                                <div><strong>Doctor:</strong> <span id="selectedPatientDoctorMedicalHistoryAdmin"></span></div>
                            </div>
                        </div>

                        <!-- Medical History Display -->
                        <div id="medicalHistoryDisplayAdmin" style="display: none; margin-top: 24px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                                <i class="fas fa-history"></i> Medical History Records
                            </h4>
                            <div id="medicalHistoryTableContainerAdmin"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

