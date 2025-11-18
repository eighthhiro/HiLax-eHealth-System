// Role Configuration - Defines permissions for each role
const ROLE_PERMISSIONS = {
    'HR/Admin': {
        view: [
            'All patients', 'All staff', 'Lab results', 'Imaging results', 
            'Prescriptions', 'PRD / Vital signs', 'Billing', 'Drug dispensing'
        ],
        insert: ['Everything except prescriptions'],
        update: ['Everything except prescriptions'],
        delete: ['Everything except prescriptions'],
        specific: [
            'Create patient numbers',
            'Create staff numbers', 
            'Register patients (pre-registered list)',
            'Update patient demographics',
            'Update staff info',
            'Insert, edit, delete billing entries',
            'Insert or edit any medical record if needed',
            'Fix errors made by other roles'
        ],
        cannot: [
            'Prescribe medications (physicians only)',
            'Edit lab values directly (unless correcting errors)',
            'Edit imaging interpretations (unless correcting errors)'
        ],
        menu: [
            { icon: 'fas fa-tachometer-alt', text: 'Dashboard', id: 'dashboard' },
            { icon: 'fas fa-users', text: 'All Patients', id: 'all-patients' },
            { icon: 'fas fa-user-md', text: 'All Staff', id: 'all-staff' },
            { icon: 'fas fa-file-medical', text: 'Medical Records', id: 'medical-records' },
            { icon: 'fas fa-flask', text: 'Lab Results', id: 'lab-results' },
            { icon: 'fas fa-x-ray', text: 'Imaging Results', id: 'imaging-results' },
            { icon: 'fas fa-prescription', text: 'Prescriptions', id: 'prescriptions' },
            { icon: 'fas fa-heartbeat', text: 'Vital Signs', id: 'vital-signs' },
            { icon: 'fas fa-money-bill-wave', text: 'Billing', id: 'billing' },
            { icon: 'fas fa-pills', text: 'Drug Dispensing', id: 'drug-dispensing' },
            { icon: 'fas fa-cog', text: 'System Settings', id: 'settings' }
        ]
    },
    'Physician': {
        view: [
            'Patient demographics', 'Nurse PRD / vital signs', 'MedTech results', 
            'RadTech results', 'Pharmacy dispense logs', 'Billing summary (optional)'
        ],
        insert: ['Prescriptions', 'Diagnostic orders (labs / imaging)'],
        update: ['Their own prescriptions', 'Progress notes (if included)'],
        cannot: [
            'DELETE: Patient records, Lab results, Imaging results, Billing, Staff records',
            'EDIT: Vital signs, Pharmacy logs, Lab/Imaging values'
        ],
        menu: [
            { icon: 'fas fa-tachometer-alt', text: 'Dashboard', id: 'dashboard' },
            { icon: 'fas fa-user-injured', text: 'My Patients', id: 'my-patients' },
            { icon: 'fas fa-prescription', text: 'Prescriptions', id: 'prescriptions' },
            { icon: 'fas fa-stethoscope', text: 'Diagnostic Orders', id: 'diagnostic-orders' },
            { icon: 'fas fa-flask', text: 'Lab Results', id: 'lab-results' },
            { icon: 'fas fa-x-ray', text: 'Imaging Results', id: 'imaging-results' },
            { icon: 'fas fa-file-medical', text: 'Progress Notes', id: 'progress-notes' },
            { icon: 'fas fa-heartbeat', text: 'Vital Signs', id: 'vital-signs' }
        ]
    },
    'Nurse': {
        view: [
            'Patient demographics', 'Physician prescriptions', 'Lab results', 
            'Imaging results', 'Patient billing summary', 'Pharmacy dispensing'
        ],
        insert: ['Vital signs', 'Intake/outtake', 'Drug intake timestamps', 'Patient PRD notes', 'Nursing assessment forms'],
        update: ['Vital signs', 'Intake/outtake', 'Drug intake timestamps', 'Patient PRD notes', 'Nursing assessment forms'],
        cannot: [
            'DELETE: Patient records, Prescriptions, Lab results, Imaging results',
            'EDIT: Prescriptions, Lab values, Imaging results, Billing'
        ],
        menu: [
            { icon: 'fas fa-tachometer-alt', text: 'Dashboard', id: 'dashboard' },
            { icon: 'fas fa-user-injured', text: 'Patient List', id: 'patient-list' },
            { icon: 'fas fa-heartbeat', text: 'Vital Signs', id: 'vital-signs' },
            { icon: 'fas fa-prescription', text: 'Medications', id: 'medications' },
            { icon: 'fas fa-clipboard-list', text: 'PRD Notes', id: 'prd-notes' },
            { icon: 'fas fa-syringe', text: 'Drug Administration', id: 'drug-admin' },
            { icon: 'fas fa-file-medical', text: 'Nursing Assessment', id: 'nursing-assessment' }
        ]
    },
    'Pharmacist': {
        view: [
            'Physician prescriptions', 'Patient demographics (med-safe info only)', 
            'Nursing PRD (for timing confirmation)'
        ],
        insert: ['Drug dispensing timestamps', 'Drug batch/lot information', 'Notes on unavailable meds'],
        update: ['Drug dispensing timestamps', 'Drug batch/lot information', 'Notes on unavailable meds'],
        cannot: [
            'EDIT OR DELETE: Prescriptions, Patient demographics, Vital signs, Lab/Imaging, Billing'
        ],
        menu: [
            { icon: 'fas fa-tachometer-alt', text: 'Dashboard', id: 'dashboard' },
            { icon: 'fas fa-prescription', text: 'Prescriptions', id: 'prescriptions' },
            { icon: 'fas fa-pills', text: 'Drug Inventory', id: 'drug-inventory' },
            { icon: 'fas fa-capsules', text: 'Dispensing', id: 'dispensing' },
            { icon: 'fas fa-boxes', text: 'Batch Management', id: 'batch-management' },
            { icon: 'fas fa-exclamation-triangle', text: 'Unavailable Meds', id: 'unavailable-meds' }
        ]
    },
    'MedTech': {
        view: ['Orders from physicians', 'Patient demographics', 'PRD (if needed)'],
        insert: ['Lab results (CBC, urinalysis, etc.)', 'Lab result metadata'],
        update: ['Lab results (CBC, urinalysis, etc.)', 'Lab result metadata'],
        cannot: [
            'EDIT OR DELETE: Patient demographics, Imaging, Billing, Prescriptions, Vital signs'
        ],
        menu: [
            { icon: 'fas fa-tachometer-alt', text: 'Dashboard', id: 'dashboard' },
            { icon: 'fas fa-vial', text: 'Lab Orders', id: 'lab-orders' },
            { icon: 'fas fa-microscope', text: 'Test Results', id: 'test-results' },
            { icon: 'fas fa-flask', text: 'Lab Tests', id: 'lab-tests' },
            { icon: 'fas fa-clipboard-check', text: 'Quality Control', id: 'quality-control' }
        ]
    },
    'RadTech': {
        view: ['Physician imaging requests', 'Patient demographics', 'PRD'],
        insert: ['X-ray results', 'CT scan results', 'Image file links', 'Imaging impressions'],
        update: ['X-ray results', 'CT scan results', 'Image file links', 'Imaging impressions'],
        cannot: [
            'EDIT OR DELETE: Patient demographics, Lab results, Prescriptions, Billing, Vital signs'
        ],
        menu: [
            { icon: 'fas fa-tachometer-alt', text: 'Dashboard', id: 'dashboard' },
            { icon: 'fas fa-x-ray', text: 'Imaging Orders', id: 'imaging-orders' },
            { icon: 'fas fa-camera', text: 'Radiology', id: 'radiology' },
            { icon: 'fas fa-brain', text: 'CT Scans', id: 'ct-scans' },
            { icon: 'fas fa-file-image', text: 'Image Archive', id: 'image-archive' },
            { icon: 'fas fa-stethoscope', text: 'Impressions', id: 'impressions' }
        ]
    },
    'Patient': {
        view: [
            'Their own demographics', 'Their lab results', 'Their imaging results',
            'Their prescription list', 'Their billing history', 'Their PRD/vitals',
            'Their medication schedules'
        ],
        cannot: ['INSERT / UPDATE / DELETE ANYTHING'],
        menu: [
            { icon: 'fas fa-tachometer-alt', text: 'Dashboard', id: 'dashboard' },
            { icon: 'fas fa-user', text: 'My Profile', id: 'my-profile' },
            { icon: 'fas fa-file-medical', text: 'Medical Records', id: 'medical-records' },
            { icon: 'fas fa-prescription', text: 'Prescriptions', id: 'prescriptions' },
            { icon: 'fas fa-heartbeat', text: 'Vital Signs', id: 'vital-signs' },
            { icon: 'fas fa-money-bill', text: 'Billing', id: 'billing' },
            { icon: 'fas fa-clock', text: 'Appointments', id: 'appointments' }
        ]
    }
};