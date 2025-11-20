// Admin/HR Content Module

class AdminContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // Dashboard Content for Admin
    getDashboardContent() {
        return `
            <div class="dashboard-overview">
                ${this.getBentoBanner()}
                <div class="dashboard-flex-row">
                    ${this.getAnnouncementsSection()}
                    <div class="dashboard-cards-wrapper">
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
                                <i class="fas fa-users"></i>
                            </div>
                            <h3 class="card-title">Staff</h3>
                        </div>
                        <div class="card-content">
                            <p>View all hospital staff members</p>
                            <div class="stat-number">156</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-flask"></i>
                            </div>
                            <h3 class="card-title">Lab Tests</h3>
                        </div>
                        <div class="card-content">
                            <p>Laboratory test results</p>
                            <div class="stat-number">3,421</div>
                        </div>
                    </div>
                </div>
                    </div>
                </div>
            </div>
        `;
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
                                <div class="tree-node executive">
                                    <div class="node-icon">
                                        <i class="fas fa-user-tie"></i>
                                    </div>
                                    <div class="node-content">
                                        <h4>Hospital Administrator</h4>
                                        <p class="node-name">Dr. Maria Santos</p>
                                        <span class="node-badge">Executive</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Department Heads -->
                            <div class="tree-level level-2">
                                <!-- Medical Director -->
                                <div class="tree-branch">
                                    <div class="tree-node director">
                                        <div class="node-icon">
                                            <i class="fas fa-user-md"></i>
                                        </div>
                                        <div class="node-content">
                                            <h4>Medical Director</h4>
                                            <p class="node-name">Dr. Ramon Cruz</p>
                                            <span class="node-badge">Director</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Physicians under Medical Director -->
                                    <div class="tree-children">
                                        <div class="tree-node physician">
                                            <div class="node-icon">
                                                <i class="fas fa-stethoscope"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Chief Physician</h4>
                                                <p class="node-name">Dr. Isabella Reyes</p>
                                                <span class="node-badge">Physician</span>
                                            </div>
                                        </div>
                                        <div class="tree-node physician">
                                            <div class="node-icon">
                                                <i class="fas fa-stethoscope"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Senior Physician</h4>
                                                <p class="node-name">Dr. Salvador</p>
                                                <span class="node-badge">Physician</span>
                                            </div>
                                        </div>
                                        <div class="tree-node physician">
                                            <div class="node-icon">
                                                <i class="fas fa-stethoscope"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Physician</h4>
                                                <p class="node-name">Dr. Sta.Maria</p>
                                                <span class="node-badge">Physician</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Nursing Director -->
                                <div class="tree-branch">
                                    <div class="tree-node director">
                                        <div class="node-icon">
                                            <i class="fas fa-user-nurse"></i>
                                        </div>
                                        <div class="node-content">
                                            <h4>Director of Nursing</h4>
                                            <p class="node-name">Josefina Torres, RN</p>
                                            <span class="node-badge">Director</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Nurses under Nursing Director -->
                                    <div class="tree-children">
                                        <div class="tree-node nurse">
                                            <div class="node-icon">
                                                <i class="fas fa-heartbeat"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Head Nurse</h4>
                                                <p class="node-name">Maria Lourdes Santos, RN</p>
                                                <span class="node-badge">Nurse</span>
                                            </div>
                                        </div>
                                        <div class="tree-node nurse">
                                            <div class="node-icon">
                                                <i class="fas fa-heartbeat"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Senior Nurse</h4>
                                                <p class="node-name">Angelica Dela Cruz, RN</p>
                                                <span class="node-badge">Nurse</span>
                                            </div>
                                        </div>
                                        <div class="tree-node nurse">
                                            <div class="node-icon">
                                                <i class="fas fa-heartbeat"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Staff Nurse</h4>
                                                <p class="node-name">Nurse Berna, RN</p>
                                                <span class="node-badge">Nurse</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pharmacy Director -->
                                <div class="tree-branch">
                                    <div class="tree-node director">
                                        <div class="node-icon">
                                            <i class="fas fa-pills"></i>
                                        </div>
                                        <div class="node-content">
                                            <h4>Pharmacy Director</h4>
                                            <p class="node-name">Dr. Antonio Garcia, RPh</p>
                                            <span class="node-badge">Director</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Pharmacists -->
                                    <div class="tree-children">
                                        <div class="tree-node pharmacist">
                                            <div class="node-icon">
                                                <i class="fas fa-prescription-bottle"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Senior Pharmacist</h4>
                                                <p class="node-name">Carmen Lopez, RPh</p>
                                                <span class="node-badge">Pharmacist</span>
                                            </div>
                                        </div>
                                        <div class="tree-node pharmacist">
                                            <div class="node-icon">
                                                <i class="fas fa-prescription-bottle"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Pharmacist</h4>
                                                <p class="node-name">Pharmacist Jer, RPh</p>
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
                                    <div class="tree-node director">
                                        <div class="node-icon">
                                            <i class="fas fa-microscope"></i>
                                        </div>
                                        <div class="node-content">
                                            <h4>Laboratory Director</h4>
                                            <p class="node-name">Dr. Ricardo Fernandez</p>
                                            <span class="node-badge">Director</span>
                                        </div>
                                    </div>
                                    
                                    <!-- MedTechs -->
                                    <div class="tree-children">
                                        <div class="tree-node medtech">
                                            <div class="node-icon">
                                                <i class="fas fa-vial"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Senior Med Tech</h4>
                                                <p class="node-name">Patricia Aquino, RMT</p>
                                                <span class="node-badge">MedTech</span>
                                            </div>
                                        </div>
                                        <div class="tree-node medtech">
                                            <div class="node-icon">
                                                <i class="fas fa-vial"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Medical Technologist</h4>
                                                <p class="node-name">Lab Tech Cristel, RMT</p>
                                                <span class="node-badge">MedTech</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Radiology Director -->
                                <div class="tree-branch">
                                    <div class="tree-node director">
                                        <div class="node-icon">
                                            <i class="fas fa-x-ray"></i>
                                        </div>
                                        <div class="node-content">
                                            <h4>Radiology Director</h4>
                                            <p class="node-name">Dr. Rodrigo Villanueva</p>
                                            <span class="node-badge">Director</span>
                                        </div>
                                    </div>
                                    
                                    <!-- RadTechs -->
                                    <div class="tree-children">
                                        <div class="tree-node radtech">
                                            <div class="node-icon">
                                                <i class="fas fa-radiation"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Senior Rad Tech</h4>
                                                <p class="node-name">Stephanie Ramos, RT</p>
                                                <span class="node-badge">RadTech</span>
                                            </div>
                                        </div>
                                        <div class="tree-node radtech">
                                            <div class="node-icon">
                                                <i class="fas fa-radiation"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Radiologic Technologist</h4>
                                                <p class="node-name">Radiology Tech Rafael, RT</p>
                                                <span class="node-badge">RadTech</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- HR/Admin Director -->
                                <div class="tree-branch">
                                    <div class="tree-node director">
                                        <div class="node-icon">
                                            <i class="fas fa-user-cog"></i>
                                        </div>
                                        <div class="node-content">
                                            <h4>HR/Admin Director</h4>
                                            <p class="node-name">Veronica Pascual</p>
                                            <span class="node-badge">Director</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Admin Staff -->
                                    <div class="tree-children">
                                        <div class="tree-node admin">
                                            <div class="node-icon">
                                                <i class="fas fa-clipboard-check"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Senior Admin</h4>
                                                <p class="node-name">Luisa Santiago</p>
                                                <span class="node-badge">Admin</span>
                                            </div>
                                        </div>
                                        <div class="tree-node admin">
                                            <div class="node-icon">
                                                <i class="fas fa-clipboard-check"></i>
                                            </div>
                                            <div class="node-content">
                                                <h4>Admin Staff</h4>
                                                <p class="node-name">Chief Admin</p>
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
}
