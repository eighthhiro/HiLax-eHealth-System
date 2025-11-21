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

    // All Patients - Shared content (role-specific for Nurse and Physician)
    getAllPatientsContent() {
        // Nurse and Physician have custom patients view
        if ((this.currentUser.role === 'Nurse' || this.currentUser.role === 'Physician') && this.roleContent && typeof this.roleContent.getAllPatientsContent === 'function') {
            return this.roleContent.getAllPatientsContent();
        }
        return this.sharedContent.getAllPatientsContent();
    }

    // All Staff - Admin only
    getAllStaffContent() {
        if (this.currentUser.role === 'HR/Admin' && this.roleContent) {
            return this.roleContent.getAllStaffContent();
        }
        return this.sharedContent.getDefaultContent('all-staff');
    }

    // Prescriptions - Role-specific (like vital signs)
    getPrescriptionsContent() {
        if (this.roleContent && typeof this.roleContent.getPrescriptionsContent === 'function') {
            return this.roleContent.getPrescriptionsContent();
        }
        return this.sharedContent.getPrescriptionsContent();
    }

    // Medications - Role-specific
    getMedicationsContent() {
        if (this.roleContent && typeof this.roleContent.getMedicationsContent === 'function') {
            return this.roleContent.getMedicationsContent();
        }
        return this.sharedContent.getDefaultContent('medications');
    }

    // Billing - Role-specific (Patient sees their own, others see management view)
    getBillingContent() {
        if (this.roleContent && typeof this.roleContent.getBillingContent === 'function') {
            return this.roleContent.getBillingContent();
        }
        return this.sharedContent.getDefaultContent('billing');
    }

    // Vital Signs - Role-specific
    getVitalSignsContent() {
        if (this.roleContent && typeof this.roleContent.getVitalSignsContent === 'function') {
            return this.roleContent.getVitalSignsContent();
        }
        return this.sharedContent.getDefaultContent('vital-signs');
    }

    // Lab Results - Role-specific
    getLabResultsContent() {
        if (this.roleContent && typeof this.roleContent.getLabResultsContent === 'function') {
            return this.roleContent.getLabResultsContent();
        }
        return this.sharedContent.getDefaultContent('lab-results');
    }

    // Imaging Results - Role-specific
    getImagingResultsContent() {
        if (this.roleContent && typeof this.roleContent.getImagingResultsContent === 'function') {
            return this.roleContent.getImagingResultsContent();
        }
        return this.sharedContent.getDefaultContent('imaging-results');
    }

    // Imaging Orders - RadTech specific
    getImagingOrdersContent() {
        if (this.roleContent && typeof this.roleContent.getImagingOrdersContent === 'function') {
            return this.roleContent.getImagingOrdersContent();
        }
        return this.sharedContent.getDefaultContent('imaging-orders');
    }

    // Image Archive - RadTech specific
    getImageArchiveContent() {
        if (this.roleContent && typeof this.roleContent.getImageArchiveContent === 'function') {
            return this.roleContent.getImageArchiveContent();
        }
        return this.sharedContent.getDefaultContent('image-archive');
    }

    // Impressions - RadTech specific
    getImpressionsContent() {
        if (this.roleContent && typeof this.roleContent.getImpressionsContent === 'function') {
            return this.roleContent.getImpressionsContent();
        }
        return this.sharedContent.getDefaultContent('impressions');
    }

    // Drug Dispensing - Role-specific
    getDrugDispensingContent() {
        if (this.roleContent && typeof this.roleContent.getDrugDispensingContent === 'function') {
            return this.roleContent.getDrugDispensingContent();
        }
        return this.sharedContent.getDefaultContent('drug-dispensing');
    }

    // Drug Inventory - Role-specific
    getDrugInventoryContent() {
        if (this.roleContent && typeof this.roleContent.getDrugInventoryContent === 'function') {
            return this.roleContent.getDrugInventoryContent();
        }
        return this.sharedContent.getDefaultContent('drug-inventory');
    }

    // Unavailable Meds - Role-specific
    getUnavailableMedsContent() {
        if (this.roleContent && typeof this.roleContent.getUnavailableMedsContent === 'function') {
            return this.roleContent.getUnavailableMedsContent();
        }
        return this.sharedContent.getDefaultContent('unavailable-meds');
    }

    // Quality Control - Role-specific
    getQualityControlContent() {
        if (this.roleContent && typeof this.roleContent.getQualityControlContent === 'function') {
            return this.roleContent.getQualityControlContent();
        }
        return this.sharedContent.getDefaultContent('quality-control');
    }

    // My Profile - Patient specific
    getMyProfileContent() {
        if (this.roleContent && typeof this.roleContent.getMyProfileContent === 'function') {
            return this.roleContent.getMyProfileContent();
        }
        return this.sharedContent.getDefaultContent('my-profile');
    }

    // Medical Records - Patient specific
    getMedicalRecordsContent() {
        if (this.roleContent && typeof this.roleContent.getMedicalRecordsContent === 'function') {
            return this.roleContent.getMedicalRecordsContent();
        }
        return this.sharedContent.getDefaultContent('medical-records');
    }

    // Progress Notes - Physician and Nurse (view only for nurse)
    getProgressNotesContent() {
        if (this.roleContent && typeof this.roleContent.getProgressNotesContent === 'function') {
            return this.roleContent.getProgressNotesContent();
        }
        return this.sharedContent.getDefaultContent('progress-notes');
    }

    // Nursing Assessment - Nurse specific
    getNursingAssessmentContent() {
        if (this.roleContent && typeof this.roleContent.getNursingAssessmentContent === 'function') {
            return this.roleContent.getNursingAssessmentContent();
        }
        return this.sharedContent.getDefaultContent('nursing-assessment');
    }

    // Default content for other pages
    getDefaultContent(pageId) {
        return this.sharedContent.getDefaultContent(pageId);
    }
}

