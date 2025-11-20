// Physician Content Module

class PhysicianContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // Dashboard Content for Physicians
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
                                <i class="fas fa-user-injured"></i>
                            </div>
                            <h3 class="card-title">My Patients</h3>
                        </div>
                        <div class="card-content">
                            <p>Patients under your care</p>
                            <div class="stat-number">42</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-calendar-check"></i>
                            </div>
                            <h3 class="card-title">Appointments</h3>
                        </div>
                        <div class="card-content">
                            <p>Today's scheduled appointments</p>
                            <div class="stat-number">8</div>
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
                            <p>Prescriptions issued this week</p>
                            <div class="stat-number">67</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-flask"></i>
                            </div>
                            <h3 class="card-title">Pending Results</h3>
                        </div>
                        <div class="card-content">
                            <p>Lab results awaiting review</p>
                            <div class="stat-number">12</div>
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
