// Dashboard Main JavaScript
class Dashboard {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
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
    }

    loadUserData() {
        if (!this.currentUser) return;

        // Update UI with user data
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userRole').textContent = this.currentUser.role;

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
        
        // For now, show a simple content based on page
        // In a real application, you would fetch data and render complex components
        const role = this.currentUser.role;
        
        let content = '';
        switch(pageId) {
            case 'dashboard':
                content = this.getDashboardContent();
                break;
            case 'all-patients':
                content = this.getAllPatientsContent();
                break;
            case 'prescriptions':
                content = this.getPrescriptionsContent();
                break;
            default:
                content = this.getDefaultContent(pageId);
        }

        contentArea.innerHTML = content;
    }

    getDashboardContent() {
        const role = this.currentUser.role;
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

    getAllPatientsContent() {
        return `
            <div class="patients-management">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-users"></i>
                            All Patients
                        </h3>
                        <button class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            Add New Patient
                        </button>
                    </div>
                    <div class="card-content">
                        <div class="data-table">
                            <div class="table-row header">
                                <div>Patient ID</div>
                                <div>Name</div>
                                <div>Age</div>
                                <div>Status</div>
                            </div>
                            <div class="table-row">
                                <div>P001</div>
                                <div>John Smith</div>
                                <div>45</div>
                                <div><span class="status-badge active">Active</span></div>
                            </div>
                            <div class="table-row">
                                <div>P002</div>
                                <div>Maria Garcia</div>
                                <div>32</div>
                                <div><span class="status-badge discharged">Discharged</span></div>
                            </div>
                            <div class="table-row">
                                <div>P003</div>
                                <div>Robert Johnson</div>
                                <div>68</div>
                                <div><span class="status-badge active">Active</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

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
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});