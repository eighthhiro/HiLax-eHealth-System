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
                ${this.getAnnouncementsSection()}
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
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-x-ray"></i>
                            </div>
                            <h3 class="card-title">Imaging</h3>
                        </div>
                        <div class="card-content">
                            <p>Radiology and imaging results</p>
                            <div class="stat-number">892</div>
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

        let announcementsList = '';
        if (visibleAnnouncements.length > 0) {
            announcementsList = visibleAnnouncements.slice(0, 3).map(announcement => `
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
                <button class="btn btn-primary btn-with-tooltip" id="addStaffBtn">
                    <i class="fas fa-user-plus"></i>
                    Add New Staff
                    <span class="tooltip-text">You need Director approval</span>
                </button>
            `;
        }

        return `
            <div class="staff-management">
                <div class="card">
                    <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 class="card-title">
                            <i class="fas fa-sitemap"></i>
                            Organizational Hierarchy
                        </h3>
                        ${addStaffButton}
                    </div>
                    <div class="card-content">
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
