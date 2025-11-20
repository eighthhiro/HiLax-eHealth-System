// Nurse Content Module

class NurseContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // Dashboard Content for Nurses
    getDashboardContent() {
        const sharedContent = new SharedContent(this.currentUser);
        return `
            <div class="dashboard-overview">
                ${this.getBentoBanner()}
                ${sharedContent.getAnnouncementsSection()}
                <div class="cards-grid">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-bed"></i>
                            </div>
                            <h3 class="card-title">Assigned Patients</h3>
                        </div>
                        <div class="card-content">
                            <p>Patients under your care today</p>
                            <div class="stat-number">15</div>
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
                            <p>Vital signs recorded today</p>
                            <div class="stat-number">28</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-syringe"></i>
                            </div>
                            <h3 class="card-title">Medications</h3>
                        </div>
                        <div class="card-content">
                            <p>Medications administered</p>
                            <div class="stat-number">45</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-clipboard-list"></i>
                            </div>
                            <h3 class="card-title">Tasks</h3>
                        </div>
                        <div class="card-content">
                            <p>Pending nursing tasks</p>
                            <div class="stat-number">7</div>
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
}
