// RadTech Content Module

class RadTechContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // Dashboard Content for Radiologic Technologists
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
                                <i class="fas fa-x-ray"></i>
                            </div>
                            <h3 class="card-title">Pending Scans</h3>
                        </div>
                        <div class="card-content">
                            <p>Imaging requests awaiting</p>
                            <div class="stat-number">9</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-radiation"></i>
                            </div>
                            <h3 class="card-title">Completed Today</h3>
                        </div>
                        <div class="card-content">
                            <p>Imaging studies completed</p>
                            <div class="stat-number">22</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-file-medical"></i>
                            </div>
                            <h3 class="card-title">Awaiting Report</h3>
                        </div>
                        <div class="card-content">
                            <p>Images pending radiologist review</p>
                            <div class="stat-number">14</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-user-clock"></i>
                            </div>
                            <h3 class="card-title">Scheduled</h3>
                        </div>
                        <div class="card-content">
                            <p>Appointments for tomorrow</p>
                            <div class="stat-number">16</div>
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
