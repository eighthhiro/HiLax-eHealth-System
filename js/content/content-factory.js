// Content Factory - Routes to appropriate content module based on role

class ContentFactory {
    constructor(currentUser) {
        this.currentUser = currentUser;
        this.sharedContent = new SharedContent(currentUser);
        this.roleContent = this.initializeRoleContent();
    }

    initializeRoleContent() {
        switch (this.currentUser.role) {
            case 'HR/Admin':
                return new AdminContent(this.currentUser);
            case 'Physician':
                return new PhysicianContent(this.currentUser);
            case 'Nurse':
                return new NurseContent(this.currentUser);
            case 'Pharmacist':
                return new PharmacistContent(this.currentUser);
            case 'MedTech':
                return new MedTechContent(this.currentUser);
            case 'RadTech':
                return new RadTechContent(this.currentUser);
            case 'Patient':
                return new PatientContent(this.currentUser);
            default:
                return null;
        }
    }

    // Dashboard Content - Role-specific
    getDashboardContent() {
        if (this.roleContent && typeof this.roleContent.getDashboardContent === 'function') {
            return this.roleContent.getDashboardContent();
        }
        return this.sharedContent.getDefaultContent('dashboard');
    }

    // All Patients - Shared content
    getAllPatientsContent() {
        return this.sharedContent.getAllPatientsContent();
    }

    // All Staff - Admin only
    getAllStaffContent() {
        if (this.currentUser.role === 'HR/Admin' && this.roleContent) {
            return this.roleContent.getAllStaffContent();
        }
        return this.sharedContent.getDefaultContent('all-staff');
    }

    // Prescriptions - Shared content
    getPrescriptionsContent() {
        return this.sharedContent.getPrescriptionsContent();
    }

    // Default content for other pages
    getDefaultContent(pageId) {
        return this.sharedContent.getDefaultContent(pageId);
    }
}
