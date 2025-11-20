// MedTech Content Module

class MedTechContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // Dashboard Content for Medical Technologists
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
                                <i class="fas fa-flask"></i>
                            </div>
                            <h3 class="card-title">Pending Tests</h3>
                        </div>
                        <div class="card-content">
                            <p>Lab tests awaiting processing</p>
                            <div class="stat-number">18</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-vial"></i>
                            </div>
                            <h3 class="card-title">Completed Today</h3>
                        </div>
                        <div class="card-content">
                            <p>Tests completed today</p>
                            <div class="stat-number">45</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-microscope"></i>
                            </div>
                            <h3 class="card-title">In Progress</h3>
                        </div>
                        <div class="card-content">
                            <p>Currently being analyzed</p>
                            <div class="stat-number">7</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-exclamation-circle"></i>
                            </div>
                            <h3 class="card-title">Critical Results</h3>
                        </div>
                        <div class="card-content">
                            <p>Results requiring immediate attention</p>
                            <div class="stat-number">3</div>
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
