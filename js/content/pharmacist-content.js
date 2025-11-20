// Pharmacist Content Module

class PharmacistContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // Dashboard Content for Pharmacists
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
                                <i class="fas fa-prescription"></i>
                            </div>
                            <h3 class="card-title">Pending Prescriptions</h3>
                        </div>
                        <div class="card-content">
                            <p>Prescriptions awaiting fulfillment</p>
                            <div class="stat-number">23</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-pills"></i>
                            </div>
                            <h3 class="card-title">Dispensed Today</h3>
                        </div>
                        <div class="card-content">
                            <p>Medications dispensed today</p>
                            <div class="stat-number">87</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <h3 class="card-title">Low Stock</h3>
                        </div>
                        <div class="card-content">
                            <p>Medications running low</p>
                            <div class="stat-number">12</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <h3 class="card-title">Verified</h3>
                        </div>
                        <div class="card-content">
                            <p>Prescriptions verified this week</p>
                            <div class="stat-number">234</div>
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
