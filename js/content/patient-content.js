// Patient Content Module

class PatientContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // Dashboard Content for Patients
    getDashboardContent() {
        const sharedContent = new SharedContent(this.currentUser);
        return `
            <div class="dashboard-overview">
                ${this.getBentoBanner()}
                <div class="dashboard-flex-row">
                    ${sharedContent.getAnnouncementsSection()}
                    ${this.getAwardsCarousel()}
                </div>
                ${sharedContent.getSocialFooter()}
            </div>
        `;
    }

    // My Profile Content - Comprehensive patient profile display
    getMyProfileContent() {
        const patientId = this.currentUser.patientId || 'P001';
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        let patient = patients.find(p => p.id === patientId);

        // Get medical history records
        const medicalHistory = JSON.parse(localStorage.getItem('medicalHistory') || '[]');
        const patientMedicalHistory = medicalHistory.filter(h => h.patientId === patientId);
        
        // Get significant allergies
        const allergies = patientMedicalHistory
            .filter(h => h.category === 'Allergy' && h.isSignificantAllergy)
            .map(h => h.allergen || h.title)
            .filter(a => a);
        
        // Get significant medical conditions (Chronic Condition, Past Illness)
        const significantConditions = patientMedicalHistory
            .filter(h => ['Chronic Condition', 'Past Illness'].includes(h.category))
            .map(h => h.title)
            .filter(t => t);
        
        const allergiesDisplay = allergies.length > 0 ? allergies.join(', ') : 'None known';
        const medicalHistoryDisplay = significantConditions.length > 0 ? significantConditions.join(', ') : 'No significant medical history';

        // Fallback to sample data if patient not found
        if (!patient) {
            patient = {
                id: patientId,
                fullName: this.currentUser.name || 'Unknown Patient',
                age: 19,
                gender: 'Male',
                dateOfBirth: '2006-03-15',
                bloodType: 'O+',
                civilStatus: 'Single',
                nationality: 'Filipino',
                religion: 'Roman Catholic',
                address: '123 Main Street, Barangay Centro, Tanauan City, Batangas',
                contactNumber: '09123456789',
                email: 'patient@email.com',
                emergencyContact: 'Juan Dela Cruz',
                emergencyContactNumber: '09987654321',
                emergencyContactRelation: 'Father',
                admissionDate: '2024-01-15',
                roomNumber: '201',
                status: 'Active',
                doctor: 'Dr. Sta. Maria',
                insuranceProvider: 'PhilHealth',
                insuranceNumber: 'PH-123456789'
            };
        }

        // Merge personalInfo if it exists
        const info = patient.personalInfo || {};
        const displayData = {
            id: patient.id,
            fullName: patient.fullName,
            age: patient.age,
            gender: info.gender || patient.gender || 'Not specified',
            dateOfBirth: info.birthday || patient.dateOfBirth || 'Not specified',
            bloodType: info.bloodType || patient.bloodType || 'Unknown',
            civilStatus: info.civilStatus || patient.civilStatus || 'Not specified',
            nationality: info.nationality || patient.nationality || 'Not specified',
            religion: info.religion || patient.religion || 'Not specified',
            address: info.address || patient.address || 'Not specified',
            contactNumber: info.contactInfo || patient.contactNumber || 'Not specified',
            email: info.email || patient.email || 'Not specified',
            emergencyContact: info.emergencyContactPerson || patient.emergencyContact || 'Not specified',
            emergencyContactNumber: info.emergencyContactNumber || patient.emergencyContactNumber || 'Not specified',
            emergencyContactRelation: info.emergencyContactRelation || patient.emergencyContactRelation || 'Not specified',
            admissionDate: patient.admissionDate || 'Not admitted',
            roomNumber: patient.roomNumber || 'N/A',
            status: patient.status || 'Active',
            doctor: patient.doctor || 'Not Assigned',
            allergies: allergiesDisplay,
            medicalHistory: medicalHistoryDisplay,
            insuranceProvider: (patient.billing && patient.billing.insuranceProvider) ? patient.billing.insuranceProvider : 'None',
            insuranceNumber: (patient.billing && patient.billing.insuranceNumber) ? patient.billing.insuranceNumber : 'N/A',
            height: info.height || 'Not specified',
            weight: info.weight || 'Not specified'
        };

        return `
            <div class="my-profile-container">
                <!-- Profile Header -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h2 style="margin: 0; font-size: 24px; color: var(--dark-pink);">
                            <i class="fas fa-user-circle"></i> My Profile
                        </h2>
                    </div>
                    <div class="card-content" style="padding: 32px;">
                        <div style="display: flex; align-items: center; gap: 32px; margin-bottom: 32px;">
                            <div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, var(--light-pink) 0%, var(--dark-pink) 100%); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(212, 165, 165, 0.3);">
                                <i class="fas fa-user" style="font-size: 56px; color: white;"></i>
                            </div>
                            <div style="flex: 1;">
                                <h1 style="margin: 0 0 8px 0; font-size: 32px; color: var(--dark-pink);">${displayData.fullName}</h1>
                                <div style="display: flex; gap: 24px; flex-wrap: wrap; margin-top: 12px;">
                                    <span style="background: var(--light-pink); padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                                        <i class="fas fa-id-card"></i> ${displayData.id}
                                    </span>
                                    <span style="background: ${displayData.status === 'Active' ? '#d4edda' : '#fff3cd'}; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; color: ${displayData.status === 'Active' ? '#155724' : '#856404'};">
                                        <i class="fas fa-circle" style="font-size: 8px;"></i> ${displayData.status}
                                    </span>
                                    <span style="background: #e3f2fd; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; color: #1565c0;">
                                        <i class="fas fa-user-md"></i> ${displayData.doctor}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Personal Information Section -->
                        <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; border-left: 4px solid var(--dark-pink); margin-bottom: 24px;">
                            <h3 style="color: var(--dark-pink); margin: 0 0 20px 0; font-size: 18px;">
                                <i class="fas fa-user"></i> Personal Information
                            </h3>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                                <div class="profile-info-item">
                                    <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Date of Birth</span>
                                    <span style="font-weight: 600; font-size: 15px;">
                                        <i class="fas fa-birthday-cake" style="color: var(--dark-pink); margin-right: 8px;"></i>
                                        ${displayData.dateOfBirth}
                                    </span>
                                </div>
                                <div class="profile-info-item">
                                    <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Age</span>
                                    <span style="font-weight: 600; font-size: 15px;">
                                        <i class="fas fa-calendar" style="color: var(--dark-pink); margin-right: 8px;"></i>
                                        ${displayData.age} years old
                                    </span>
                                </div>
                                <div class="profile-info-item">
                                    <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Gender</span>
                                    <span style="font-weight: 600; font-size: 15px;">
                                        <i class="fas ${displayData.gender === 'Male' ? 'fa-mars' : displayData.gender === 'Female' ? 'fa-venus' : 'fa-genderless'}" style="color: var(--dark-pink); margin-right: 8px;"></i>
                                        ${displayData.gender}
                                    </span>
                                </div>
                                <div class="profile-info-item">
                                    <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Blood Type</span>
                                    <span style="font-weight: 600; font-size: 15px;">
                                        <i class="fas fa-tint" style="color: var(--dark-pink); margin-right: 8px;"></i>
                                        ${displayData.bloodType}
                                    </span>
                                </div>
                                <div class="profile-info-item">
                                    <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Height</span>
                                    <span style="font-weight: 600; font-size: 15px;">
                                        <i class="fas fa-ruler-vertical" style="color: var(--dark-pink); margin-right: 8px;"></i>
                                        ${displayData.height}
                                    </span>
                                </div>
                                <div class="profile-info-item">
                                    <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Weight</span>
                                    <span style="font-weight: 600; font-size: 15px;">
                                        <i class="fas fa-weight" style="color: var(--dark-pink); margin-right: 8px;"></i>
                                        ${displayData.weight}
                                    </span>
                                </div>
                                <div class="profile-info-item">
                                    <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Civil Status</span>
                                    <span style="font-weight: 600; font-size: 15px;">
                                        <i class="fas fa-heart" style="color: var(--dark-pink); margin-right: 8px;"></i>
                                        ${displayData.civilStatus}
                                    </span>
                                </div>
                                <div class="profile-info-item">
                                    <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Nationality</span>
                                    <span style="font-weight: 600; font-size: 15px;">
                                        <i class="fas fa-flag" style="color: var(--dark-pink); margin-right: 8px;"></i>
                                        ${displayData.nationality}
                                    </span>
                                </div>
                                <div class="profile-info-item">
                                    <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Religion</span>
                                    <span style="font-weight: 600; font-size: 15px;">
                                        <i class="fas fa-pray" style="color: var(--dark-pink); margin-right: 8px;"></i>
                                        ${displayData.religion}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Information Section -->
                        <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; border-left: 4px solid var(--dark-pink); margin-bottom: 24px;">
                            <h3 style="color: var(--dark-pink); margin: 0 0 20px 0; font-size: 18px;">
                                <i class="fas fa-address-book"></i> Contact Information
                            </h3>
                            <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                                <div class="profile-info-item">
                                    <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Address</span>
                                    <span style="font-weight: 600; font-size: 15px;">
                                        <i class="fas fa-map-marker-alt" style="color: var(--dark-pink); margin-right: 8px;"></i>
                                        ${displayData.address}
                                    </span>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                                    <div class="profile-info-item">
                                        <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Contact Number</span>
                                        <span style="font-weight: 600; font-size: 15px;">
                                            <i class="fas fa-phone" style="color: var(--dark-pink); margin-right: 8px;"></i>
                                            ${displayData.contactNumber}
                                        </span>
                                    </div>
                                    <div class="profile-info-item">
                                        <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Email Address</span>
                                        <span style="font-weight: 600; font-size: 15px;">
                                            <i class="fas fa-envelope" style="color: var(--dark-pink); margin-right: 8px;"></i>
                                            ${displayData.email}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Emergency Contact Section -->
                        <div style="background: #fff3cd; padding: 24px; border-radius: 12px; border-left: 4px solid #ffc107; margin-bottom: 24px;">
                            <h3 style="color: #856404; margin: 0 0 20px 0; font-size: 18px;">
                                <i class="fas fa-exclamation-triangle"></i> Emergency Contact
                            </h3>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                                <div class="profile-info-item">
                                    <span style="color: #856404; font-size: 13px; display: block; margin-bottom: 4px;">Contact Person</span>
                                    <span style="font-weight: 600; font-size: 15px; color: #856404;">
                                        <i class="fas fa-user-shield" style="color: #ffc107; margin-right: 8px;"></i>
                                        ${displayData.emergencyContact}
                                    </span>
                                </div>
                                <div class="profile-info-item">
                                    <span style="color: #856404; font-size: 13px; display: block; margin-bottom: 4px;">Relationship</span>
                                    <span style="font-weight: 600; font-size: 15px; color: #856404;">
                                        <i class="fas fa-users" style="color: #ffc107; margin-right: 8px;"></i>
                                        ${displayData.emergencyContactRelation}
                                    </span>
                                </div>
                                <div class="profile-info-item">
                                    <span style="color: #856404; font-size: 13px; display: block; margin-bottom: 4px;">Contact Number</span>
                                    <span style="font-weight: 600; font-size: 15px; color: #856404;">
                                        <i class="fas fa-phone-square" style="color: #ffc107; margin-right: 8px;"></i>
                                        ${displayData.emergencyContactNumber}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Medical Information Section -->
                        <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; border-left: 4px solid var(--dark-pink); margin-bottom: 24px;">
                            <h3 style="color: var(--dark-pink); margin: 0 0 20px 0; font-size: 18px;">
                                <i class="fas fa-notes-medical"></i> Medical Information
                            </h3>
                            <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                                <div class="profile-info-item">
                                    <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Known Allergies</span>
                                    <span style="font-weight: 600; font-size: 15px;">
                                        <i class="fas fa-allergies" style="color: var(--dark-pink); margin-right: 8px;"></i>
                                        ${displayData.allergies}
                                    </span>
                                </div>
                                <div class="profile-info-item">
                                    <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Medical History</span>
                                    <span style="font-weight: 600; font-size: 15px;">
                                        <i class="fas fa-file-medical" style="color: var(--dark-pink); margin-right: 8px;"></i>
                                        ${displayData.medicalHistory}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Hospital & Insurance Information -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                            <div style="background: #e3f2fd; padding: 20px; border-radius: 12px; border-left: 4px solid #1976d2;">
                                <h4 style="color: #1565c0; margin: 0 0 16px 0; font-size: 16px;">
                                    <i class="fas fa-hospital"></i> Hospital Information
                                </h4>
                                <div style="display: grid; gap: 12px;">
                                    <div>
                                        <span style="color: #1565c0; font-size: 13px; display: block; margin-bottom: 4px;">Admission Date</span>
                                        <span style="font-weight: 600; font-size: 14px; color: #0d47a1;">${displayData.admissionDate}</span>
                                    </div>
                                    <div>
                                        <span style="color: #1565c0; font-size: 13px; display: block; margin-bottom: 4px;">Room Number</span>
                                        <span style="font-weight: 600; font-size: 14px; color: #0d47a1;">${displayData.roomNumber}</span>
                                    </div>
                                    <div>
                                        <span style="color: #1565c0; font-size: 13px; display: block; margin-bottom: 4px;">Attending Physician</span>
                                        <span style="font-weight: 600; font-size: 14px; color: #0d47a1;">${displayData.doctor}</span>
                                    </div>
                                </div>
                            </div>
                            <div style="background: #e8f5e9; padding: 20px; border-radius: 12px; border-left: 4px solid #388e3c;">
                                <h4 style="color: #2e7d32; margin: 0 0 16px 0; font-size: 16px;">
                                    <i class="fas fa-shield-alt"></i> Insurance Information
                                </h4>
                                <div style="display: grid; gap: 12px;">
                                    <div>
                                        <span style="color: #2e7d32; font-size: 13px; display: block; margin-bottom: 4px;">Insurance Provider</span>
                                        <span style="font-weight: 600; font-size: 14px; color: #1b5e20;">${displayData.insuranceProvider}</span>
                                    </div>
                                    <div>
                                        <span style="color: #2e7d32; font-size: 13px; display: block; margin-bottom: 4px;">Insurance Number</span>
                                        <span style="font-weight: 600; font-size: 14px; color: #1b5e20;">${displayData.insuranceNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Medical Records Content - Comprehensive view of all medical records
    getMedicalRecordsContent() {
        const patientId = this.currentUser.patientId || 'P001';
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId) || { id: patientId, fullName: this.currentUser.name };

        // Gather all medical records
        const vitalSigns = JSON.parse(localStorage.getItem('vitalSigns') || '[]').filter(vs => vs.patientId === patientId);
        const labResults = JSON.parse(localStorage.getItem('labResults') || '[]').filter(lab => lab.patientId === patientId);
        const imagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]').filter(img => img.patientId === patientId);
        const prescriptions = JSON.parse(localStorage.getItem('medications') || '[]').filter(med => med.patientId === patientId);
        const dispensing = JSON.parse(localStorage.getItem('drugDispensing') || '[]').filter(d => d.patientId === patientId);

        return `
            <div class="medical-records-container">
                <div class="card">
                    <div class="card-header">
                        <h2 style="margin: 0; font-size: 24px; color: var(--dark-pink);">
                            <i class="fas fa-file-medical"></i> My Medical Records
                        </h2>
                    </div>
                    <div class="card-content" style="padding: 32px;">
                        <!-- Patient Header -->
                        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 20px; border-radius: 12px; margin-bottom: 32px; border-left: 4px solid var(--dark-pink);">
                            <h3 style="margin: 0 0 12px 0; color: var(--dark-pink); font-size: 20px;">${patient.fullName}</h3>
                            <div style="display: flex; gap: 16px; flex-wrap: wrap; font-size: 14px;">
                                <span><strong>Patient ID:</strong> ${patient.id}</span>
                                <span><strong>Age:</strong> ${patient.age || 'N/A'}</span>
                                <span><strong>Blood Type:</strong> ${patient.bloodType || 'Unknown'}</span>
                                <span><strong>Physician:</strong> ${patient.doctor || 'Not Assigned'}</span>
                            </div>
                        </div>

                        <!-- Summary Cards -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px;">
                            <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 12px; text-align: center; border-left: 4px solid #1976d2;">
                                <div style="font-size: 36px; font-weight: 700; color: #0d47a1; margin-bottom: 8px;">${vitalSigns.length}</div>
                                <div style="color: #1565c0; font-weight: 600;"><i class="fas fa-heartbeat"></i> Vital Signs Records</div>
                            </div>
                            <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 20px; border-radius: 12px; text-align: center; border-left: 4px solid #7b1fa2;">
                                <div style="font-size: 36px; font-weight: 700; color: #4a148c; margin-bottom: 8px;">${labResults.length}</div>
                                <div style="color: #6a1b9a; font-weight: 600;"><i class="fas fa-flask"></i> Lab Results</div>
                            </div>
                            <div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); padding: 20px; border-radius: 12px; text-align: center; border-left: 4px solid #388e3c;">
                                <div style="font-size: 36px; font-weight: 700; color: #1b5e20; margin-bottom: 8px;">${imagingResults.length}</div>
                                <div style="color: #2e7d32; font-weight: 600;"><i class="fas fa-x-ray"></i> Imaging Results</div>
                            </div>
                            <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 20px; border-radius: 12px; text-align: center; border-left: 4px solid #f57c00;">
                                <div style="font-size: 36px; font-weight: 700; color: #e65100; margin-bottom: 8px;">${prescriptions.length}</div>
                                <div style="color: #ef6c00; font-weight: 600;"><i class="fas fa-prescription"></i> Prescriptions</div>
                            </div>
                            <div style="background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%); padding: 20px; border-radius: 12px; text-align: center; border-left: 4px solid var(--dark-pink);">
                                <div style="font-size: 36px; font-weight: 700; color: #880e4f; margin-bottom: 8px;">${dispensing.length}</div>
                                <div style="color: var(--dark-pink); font-weight: 600;"><i class="fas fa-pills"></i> Drug Dispensing</div>
                            </div>
                        </div>

                        <!-- Vital Signs Section -->
                        <div style="margin-bottom: 32px;">
                            <h3 style="color: var(--dark-pink); padding-bottom: 12px; border-bottom: 2px solid var(--light-pink); margin-bottom: 20px;">
                                <i class="fas fa-heartbeat"></i> Recent Vital Signs
                            </h3>
                            ${vitalSigns.length > 0 ? `
                            <div style="overflow-x: auto;">
                                <table class="patients-table" style="font-size: 14px;">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>BP</th>
                                            <th>HR</th>
                                            <th>Temp</th>
                                            <th>RR</th>
                                            <th>SpO2</th>
                                            <th>Recorded By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${vitalSigns.slice(0, 5).map(vs => `
                                            <tr>
                                                <td>${vs.recordedDate} ${vs.recordedTime || ''}</td>
                                                <td><strong>${vs.bloodPressure}</strong></td>
                                                <td>${vs.heartRate} bpm</td>
                                                <td>${vs.temperature}°C</td>
                                                <td>${vs.respiratoryRate}/min</td>
                                                <td>${vs.oxygenSaturation}%</td>
                                                <td>${vs.recordedBy}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                                ${vitalSigns.length > 5 ? `<p style="text-align: center; margin-top: 12px; color: #666; font-size: 14px;"><i class="fas fa-info-circle"></i> Showing 5 of ${vitalSigns.length} records. View all in Vital Signs page.</p>` : ''}
                            </div>
                            ` : '<p style="text-align: center; padding: 32px; color: #999;"><i class="fas fa-heartbeat" style="font-size: 36px; opacity: 0.3; display: block; margin-bottom: 12px;"></i>No vital signs recorded</p>'}
                        </div>

                        <!-- Lab Results Section -->
                        <div style="margin-bottom: 32px;">
                            <h3 style="color: var(--dark-pink); padding-bottom: 12px; border-bottom: 2px solid var(--light-pink); margin-bottom: 20px;">
                                <i class="fas fa-flask"></i> Recent Lab Results
                            </h3>
                            ${labResults.length > 0 ? `
                            <div style="overflow-x: auto;">
                                <table class="patients-table" style="font-size: 14px;">
                                    <thead>
                                        <tr>
                                            <th>Test Type</th>
                                            <th>Test Date</th>
                                            <th>Status</th>
                                            <th>Results</th>
                                            <th>File</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${labResults.slice(0, 5).map(lab => `
                                            <tr>
                                                <td><strong>${lab.testType}</strong></td>
                                                <td>${lab.testDate}</td>
                                                <td><span class="status-badge ${(lab.status || 'Completed').toLowerCase()}">${lab.status || 'Completed'}</span></td>
                                                <td>${lab.resultDetails || 'See file'}</td>
                                                <td>
                                                    ${lab.fileData ? `
                                                        <button class="btn btn-sm" style="padding: 4px 8px; font-size: 12px; background: var(--info-blue); color: white;" 
                                                                onclick="fileStorage.viewFile('labResults', '${lab.id}')">View</button>
                                                    ` : '-'}
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                                ${labResults.length > 5 ? `<p style="text-align: center; margin-top: 12px; color: #666; font-size: 14px;"><i class="fas fa-info-circle"></i> Showing 5 of ${labResults.length} records. View all in Lab Results page.</p>` : ''}
                            </div>
                            ` : '<p style="text-align: center; padding: 32px; color: #999;"><i class="fas fa-flask" style="font-size: 36px; opacity: 0.3; display: block; margin-bottom: 12px;"></i>No lab results available</p>'}
                        </div>

                        <!-- Imaging Results Section -->
                        <div style="margin-bottom: 32px;">
                            <h3 style="color: var(--dark-pink); padding-bottom: 12px; border-bottom: 2px solid var(--light-pink); margin-bottom: 20px;">
                                <i class="fas fa-x-ray"></i> Recent Imaging Results
                            </h3>
                            ${imagingResults.length > 0 ? `
                            <div style="overflow-x: auto;">
                                <table class="patients-table" style="font-size: 14px;">
                                    <thead>
                                        <tr>
                                            <th>Modality</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Findings</th>
                                            <th>File</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${imagingResults.slice(0, 5).map(img => `
                                            <tr>
                                                <td><strong>${img.imagingModality}</strong></td>
                                                <td>${img.imagingDate}</td>
                                                <td><span class="status-badge ${(img.status || 'Completed').toLowerCase()}">${img.status || 'Completed'}</span></td>
                                                <td>${img.imagingFindings}</td>
                                                <td>
                                                    ${img.fileData ? `
                                                        <button class="btn btn-sm" style="padding: 4px 8px; font-size: 12px; background: var(--info-blue); color: white;" 
                                                                onclick="fileStorage.viewFile('imagingResults', '${img.id}')">View</button>
                                                    ` : '-'}
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                                ${imagingResults.length > 5 ? `<p style="text-align: center; margin-top: 12px; color: #666; font-size: 14px;"><i class="fas fa-info-circle"></i> Showing 5 of ${imagingResults.length} records. View all in Imaging Results page.</p>` : ''}
                            </div>
                            ` : '<p style="text-align: center; padding: 32px; color: #999;"><i class="fas fa-x-ray" style="font-size: 36px; opacity: 0.3; display: block; margin-bottom: 12px;"></i>No imaging results available</p>'}
                        </div>

                        <!-- Prescriptions Section -->
                        <div style="margin-bottom: 32px;">
                            <h3 style="color: var(--dark-pink); padding-bottom: 12px; border-bottom: 2px solid var(--light-pink); margin-bottom: 20px;">
                                <i class="fas fa-prescription"></i> Recent Prescriptions
                            </h3>
                            ${prescriptions.length > 0 ? `
                            <div style="overflow-x: auto;">
                                <table class="patients-table" style="font-size: 14px;">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Medication</th>
                                            <th>Dosage</th>
                                            <th>Frequency</th>
                                            <th>Prescribed By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${prescriptions.slice(0, 5).map(med => `
                                            <tr>
                                                <td>${med.prescribedDate}</td>
                                                <td><strong>${med.medicationName}</strong></td>
                                                <td>${med.dosage}</td>
                                                <td>${med.frequency}</td>
                                                <td>${med.prescribedBy}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                                ${prescriptions.length > 5 ? `<p style="text-align: center; margin-top: 12px; color: #666; font-size: 14px;"><i class="fas fa-info-circle"></i> Showing 5 of ${prescriptions.length} records. View all in Prescriptions page.</p>` : ''}
                            </div>
                            ` : '<p style="text-align: center; padding: 32px; color: #999;"><i class="fas fa-prescription" style="font-size: 36px; opacity: 0.3; display: block; margin-bottom: 12px;"></i>No prescriptions recorded</p>'}
                        </div>

                        <!-- Drug Dispensing Section -->
                        <div>
                            <h3 style="color: var(--dark-pink); padding-bottom: 12px; border-bottom: 2px solid var(--light-pink); margin-bottom: 20px;">
                                <i class="fas fa-pills"></i> Recent Drug Dispensing
                            </h3>
                            ${dispensing.length > 0 ? `
                            <div style="overflow-x: auto;">
                                <table class="patients-table" style="font-size: 14px;">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Drug Name</th>
                                            <th>Quantity</th>
                                            <th>Batch Number</th>
                                            <th>Dispensed By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${dispensing.slice(0, 5).map(d => `
                                            <tr>
                                                <td>${d.dispensingDate}</td>
                                                <td><strong>${d.drugName}</strong></td>
                                                <td>${d.quantity}</td>
                                                <td>${d.batchNumber || 'N/A'}</td>
                                                <td>${d.dispensedBy}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                                ${dispensing.length > 5 ? `<p style="text-align: center; margin-top: 12px; color: #666; font-size: 14px;"><i class="fas fa-info-circle"></i> Showing 5 of ${dispensing.length} records.</p>` : ''}
                            </div>
                            ` : '<p style="text-align: center; padding: 32px; color: #999;"><i class="fas fa-pills" style="font-size: 36px; opacity: 0.3; display: block; margin-bottom: 12px;"></i>No drug dispensing records</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Billing Content - Show patient's own billing receipt
    getBillingContent() {
        const patientId = this.currentUser.patientId;
        
        if (!patientId) {
            return `
                <div class="billing-management">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="fas fa-file-invoice-dollar"></i>
                                My Billing
                            </h3>
                        </div>
                        <div class="card-content">
                            <p style="text-align: center; padding: 40px; color: var(--text-light);">
                                <i class="fas fa-exclamation-circle" style="font-size: 48px; margin-bottom: 20px; display: block;"></i>
                                No patient ID associated with this account.
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }

        // Get patient billing data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id === patientId);
        
        if (!patient) {
            return `
                <div class="billing-management">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="fas fa-file-invoice-dollar"></i>
                                My Billing
                            </h3>
                        </div>
                        <div class="card-content">
                            <p style="text-align: center; padding: 40px; color: var(--text-light);">
                                <i class="fas fa-exclamation-circle" style="font-size: 48px; margin-bottom: 20px; display: block;"></i>
                                Patient record not found.
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }

        if (!patient.billing) {
            return `
                <div class="billing-management">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="fas fa-file-invoice-dollar"></i>
                                My Billing
                            </h3>
                        </div>
                        <div class="card-content">
                            <p style="text-align: center; padding: 40px; color: var(--text-light);">
                                <i class="fas fa-info-circle" style="font-size: 48px; margin-bottom: 20px; display: block;"></i>
                                No billing information available at this time.
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }

        const billing = patient.billing;
        
        // After returning the HTML, we'll need to attach the download event listener
        // Store patient data temporarily for the download function
        setTimeout(() => {
            this.attachBillingDownloadListener(patient);
        }, 0);
        
        return `
            <div class="billing-management">
                <div class="card">
                    <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 class="card-title">
                            <i class="fas fa-file-invoice-dollar"></i>
                            My Billing Statement
                        </h3>
                        <button class="btn btn-success" id="downloadPatientBillingBtn">
                            <i class="fas fa-download"></i>
                            <span id="downloadPatientBillingText">Download PDF</span>
                            <span id="downloadPatientBillingSpinner" style="display: none;">
                                <i class="fas fa-spinner fa-spin"></i>
                            </span>
                        </button>
                    </div>
                    <div class="card-content" style="padding: 30px;">
                        <!-- Wrap content in div for downloading -->
                        <div id="patientBillingContent">
                            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid var(--dark-pink);">
                                <h1 style="margin: 0; color: var(--dark-pink);">HILAX HOSPITAL</h1>
                                <p style="margin: 5px 0; color: #666;">Management System</p>
                                <p style="margin: 0; font-size: 14px; color: #999;">Official Billing Statement</p>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                                <div>
                                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">PATIENT INFORMATION</p>
                                    <p style="margin: 0; font-weight: 600;">${patient.fullName}</p>
                                    <p style="margin: 0; color: #666;">ID: ${patient.id}</p>
                                    <p style="margin: 0; color: #666;">Age: ${patient.age}</p>
                                </div>
                                <div style="text-align: right;">
                                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">BILLING DATE</p>
                                    <p style="margin: 0; font-weight: 600;">${new Date(billing.date).toLocaleDateString()}</p>
                                    <p style="margin: 0; color: #666;">${new Date(billing.date).toLocaleTimeString()}</p>
                                </div>
                            </div>

                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                <thead>
                                    <tr style="background: var(--light-pink);">
                                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--dark-pink);">Description</th>
                                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--dark-pink);">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${billing.roomCharges > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">Room Charges</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #f0f0f0;">₱${billing.roomCharges.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td></tr>` : ''}
                                    ${billing.consultationFee > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">Consultation Fee</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #f0f0f0;">₱${billing.consultationFee.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td></tr>` : ''}
                                    ${billing.labTests > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">Laboratory Tests</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #f0f0f0;">₱${billing.labTests.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td></tr>` : ''}
                                    ${billing.medications > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">Medications</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #f0f0f0;">₱${billing.medications.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td></tr>` : ''}
                                    ${billing.procedures > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">Procedures/Surgeries</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #f0f0f0;">₱${billing.procedures.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td></tr>` : ''}
                                    ${billing.imaging > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">Imaging/Radiology</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #f0f0f0;">₱${billing.imaging.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td></tr>` : ''}
                                    ${billing.otherCharges > 0 ? `<tr><td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">Other Charges</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #f0f0f0;">₱${billing.otherCharges.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td></tr>` : ''}
                                </tbody>
                            </table>

                            <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-weight: 600;">Subtotal:</span>
                                    <span style="font-weight: 600;">₱${billing.subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                </div>
                                ${billing.discount > 0 ? `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #28a745;">
                                    <span style="font-weight: 600;">Discount (${billing.discount}%):</span>
                                    <span style="font-weight: 600;">-₱${billing.discountAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                </div>
                                ` : ''}
                                <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 2px solid var(--dark-pink); margin-top: 8px;">
                                    <span style="font-size: 20px; font-weight: 700;">TOTAL AMOUNT DUE:</span>
                                    <span style="font-size: 20px; font-weight: 700; color: var(--dark-pink);">₱${billing.total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                </div>
                            </div>

                            ${billing.notes ? `
                            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                <p style="margin: 0; font-weight: 600; color: #856404; margin-bottom: 5px;">Notes:</p>
                                <p style="margin: 0; color: #856404;">${billing.notes}</p>
                            </div>
                            ` : ''}

                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
                                <p style="margin: 0;">Thank you for choosing HiLax Hospital</p>
                                <p style="margin: 5px 0 0 0;">For inquiries, please contact our billing department</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Add this helper method to attach the download event listener
    attachBillingDownloadListener(patient) {
        const downloadBtn = document.getElementById('downloadPatientBillingBtn');
        if (!downloadBtn) return;

        // Remove any existing listener
        const newBtn = downloadBtn.cloneNode(true);
        downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);

        // Add new listener
        newBtn.addEventListener('click', async () => {
            const downloadText = document.getElementById('downloadPatientBillingText');
            const downloadSpinner = document.getElementById('downloadPatientBillingSpinner');
            
            // Disable button and show loading
            newBtn.disabled = true;
            if (downloadText) downloadText.style.display = 'none';
            if (downloadSpinner) downloadSpinner.style.display = 'inline';

            try {
                // Get the billing content element
                const billingContent = document.getElementById('patientBillingContent');
                
                if (!billingContent) {
                    throw new Error('Billing content not found');
                }

                // Create canvas from the billing content
                const canvas = await html2canvas(billingContent, {
                    scale: 2, // Higher quality
                    backgroundColor: '#ffffff',
                    logging: false,
                    useCORS: true
                });

                // Convert canvas to image
                const imgData = canvas.toDataURL('image/png');

                // Create PDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                // Calculate dimensions to fit the page
                const imgWidth = 190; // A4 width in mm minus margins
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // Add image to PDF
                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

                // Generate filename with patient info and timestamp
                const timestamp = new Date().toISOString().slice(0, 10);
                const patientName = patient.fullName.replace(/\s+/g, '_');
                const filename = `HiLax_Billing_${patientName}_${patient.id}_${timestamp}.pdf`;

                // Download the PDF
                pdf.save(filename);

                if (this.showNotification) {
                    this.showNotification('Billing statement downloaded successfully!', 'success');
                }
            } catch (error) {
                console.error('Error generating PDF:', error);
                if (this.showNotification) {
                    this.showNotification('Failed to download billing statement. Please try again.', 'error');
                } else {
                    alert('Failed to download billing statement. Please try again.');
                }
            } finally {
                // Re-enable button and hide loading
                newBtn.disabled = false;
                if (downloadText) downloadText.style.display = 'inline';
                if (downloadSpinner) downloadSpinner.style.display = 'none';
            }
        });
    }

    // Awards Carousel
    getAwardsCarousel() {
        // Load awards from localStorage
        let awards = [];
        try {
            const stored = localStorage.getItem('hospitalAwards');
            if (stored) {
                awards = JSON.parse(stored);
            } else {
                // Initialize default awards if none exist
                awards = [
                    {
                        id: 1,
                        title: 'Excellence in Healthcare Award',
                        description: 'Recognized for outstanding patient care and medical innovation',
                        image: './images/award1.png'
                    },
                    {
                        id: 2,
                        title: 'Best Hospital Facility Award',
                        description: 'Awarded for state-of-the-art medical equipment and infrastructure',
                        image: './images/award2.png'
                    },
                    {
                        id: 3,
                        title: 'Patient Satisfaction Award',
                        description: 'Highest patient satisfaction rating in the region for exceptional care',
                        image: './images/award3.png'
                    }
                ];
                localStorage.setItem('hospitalAwards', JSON.stringify(awards));
            }
        } catch (error) {
            console.error('Error loading awards:', error);
        }

        const awardsSlides = awards.map((award, index) => `
            <div class="award-slide ${index === 0 ? 'active' : ''}">
                <img src="${award.image}" alt="${award.title}" onerror="this.src='https://via.placeholder.com/1024x1024/d4a5a5/ffffff?text=${encodeURIComponent(award.title)}'">
                <div class="award-caption">
                    <h4>${award.title}</h4>
                    <p>${award.description}</p>
                </div>
            </div>
        `).join('');

        const indicators = awards.map((award, index) => 
            `<span class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></span>`
        ).join('');

        return `
            <div class="awards-carousel-wrapper">
                <div class="awards-carousel-container">
                    <h3 class="awards-title">
                        <i class="fas fa-trophy"></i>
                        Hospital Awards & Recognition
                    </h3>
                    <div class="awards-carousel">
                        <div class="carousel-track">
                            ${awardsSlides}
                        </div>
                        ${awards.length > 1 ? `
                        <button class="carousel-btn prev" aria-label="Previous award">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="carousel-btn next" aria-label="Next award">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <div class="carousel-indicators">
                            ${indicators}
                        </div>
                        ` : ''}
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

    // Vital Signs Content for Patient (view their own vital signs only)
    getVitalSignsContent() {
        const patientId = this.currentUser.patientId || 'P001';

        // Get patient data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        let patient = patients.find(p => p.id === patientId);

        // Fallback to sample data
        if (!patient) {
            const fallbackPatients = [
                { id: 'P001', fullName: 'Miranda, Hebrew T.', age: 19, status: 'Active', doctor: 'Dr. Sta. Maria' },
                { id: 'P002', fullName: 'Sta.Maria, Rizza M.', age: 20, status: 'Admitted', doctor: 'Dr. Sta. Maria' },
                { id: 'P003', fullName: 'Puquiz, Daniel T.', age: 21, status: 'Active', doctor: 'Dr. Salvador' }
            ];
            patient = fallbackPatients.find(p => p.id === patientId) || fallbackPatients[0];
        }

        // Get vital signs for this patient
        const allVitalSigns = JSON.parse(localStorage.getItem('vitalSigns') || '[]');
        const patientVitalSigns = allVitalSigns.filter(vs => vs.patientId === patientId);

        return `
            <div class="vital-signs-management">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-heartbeat"></i>
                            My Vital Signs
                        </h3>
                    </div>
                    <div class="card-content">
                        <!-- Patient Info Display -->
                        <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin: 0 0 10px 0; color: var(--dark-pink); font-size: 16px;">
                                <i class="fas fa-user"></i> Patient Information
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> ${patient.id}</div>
                                <div><strong>Name:</strong> ${patient.fullName}</div>
                                <div><strong>Age:</strong> ${patient.age}</div>
                                <div><strong>Physician:</strong> ${patient.doctor || 'Not Assigned'}</div>
                            </div>
                        </div>

                        <!-- Vital Signs History -->
                        <div style="margin-top: 32px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--light-pink);">
                                <i class="fas fa-history"></i> Vital Signs History
                            </h4>
                            ${patientVitalSigns.length > 0 ? `
                            <div style="overflow-x: auto;">
                                <table class="patients-table" style="min-width: 900px;">
                                    <thead>
                                        <tr>
                                            <th style="width: 11%;">Date</th>
                                            <th style="width: 10%;">Time</th>
                                            <th style="width: 13%;">BP (mmHg)</th>
                                            <th style="width: 10%;">HR (bpm)</th>
                                            <th style="width: 10%;">Temp (°C)</th>
                                            <th style="width: 9%;">RR (breaths/min)</th>
                                            <th style="width: 11%;">SpO2 (%)</th>
                                            <th style="width: 10%;">Pain</th>
                                            <th style="width: 16%;">Recorded By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${patientVitalSigns.map((vs, index) => `
                                            <tr style="border-top: ${index > 0 ? '8px solid #fff' : '0'}; background: #fafafa;">
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${vs.recordedDate}</td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${vs.recordedTime}</td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;"><strong>${vs.bloodPressure}</strong></td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${vs.heartRate}</td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${vs.temperature}</td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${vs.respiratoryRate}</td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${vs.oxygenSaturation}%</td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${vs.painLevel !== null ? vs.painLevel + '/10' : '-'}</td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${vs.recordedBy}</td>
                                            </tr>
                                            ${vs.notes ? `
                                            <tr style="background: #fafafa;">
                                                <td colspan="9" style="text-align: left; padding: 12px 12px 14px 12px; border-left: 4px solid var(--dark-pink); border-bottom: 2px solid #e0e0e0; background: #fff3f8;">
                                                    <strong style="color: var(--dark-pink);">Notes:</strong> ${vs.notes}
                                                </td>
                                            </tr>
                                            ` : `
                                            <tr style="background: #fafafa;">
                                                <td colspan="9" style="padding: 0; border-bottom: 2px solid #e0e0e0; height: 4px;"></td>
                                            </tr>
                                            `}
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                            ` : `
                            <div style="text-align: center; padding: 40px; color: #999;">
                                <i class="fas fa-heartbeat" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                                <p style="font-size: 16px;">No vital signs recorded yet.</p>
                            </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Lab Results Content for Patient (view their own results only)
    getLabResultsContent() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const patientId = currentUser.patientId || 'P001';

        let patients = [];
        try {
            const stored = localStorage.getItem('patients');
            if (stored) {
                patients = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading patients:', e);
        }

        const patient = patients.find(p => p.id === patientId) || {
            id: patientId,
            fullName: currentUser.name || 'Unknown Patient',
            age: 19,
            status: 'Active',
            doctor: 'Dr. Sta. Maria'
        };

        const allLabResults = JSON.parse(localStorage.getItem('labResults') || '[]');
        const myLabResults = allLabResults.filter(lab => lab.patientId === patientId);

        let historyRows = '';
        if (myLabResults.length > 0) {
            myLabResults.forEach((lab, index) => {
                historyRows += `
                    <tr style="border-top: ${index > 0 ? '8px solid #fff' : '0'}; background: #fafafa;">
                        <td style="border-top: 2px solid #e0e0e0; padding-top: 14px; padding: 12px;">${lab.testType}</td>
                        <td style="border-top: 2px solid #e0e0e0; padding-top: 14px; padding: 12px;">${lab.testDate}</td>
                        <td style="border-top: 2px solid #e0e0e0; padding-top: 14px; padding: 12px;">${lab.status || 'Completed'}</td>
                        <td style="border-top: 2px solid #e0e0e0; padding-top: 14px; padding: 12px;">${lab.performedBy || 'Lab Staff'}</td>
                        <td style="border-top: 2px solid #e0e0e0; padding-top: 14px; padding: 12px;">${lab.recordedDate}</td>
                        <td style="border-top: 2px solid #e0e0e0; padding-top: 14px; padding: 12px;">
                            ${lab.fileData ? `
                                <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px; background: var(--info-blue); color: white; margin-right: 4px;" 
                                        onclick="fileStorage.viewFile('labResults', '${lab.id}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px; background: var(--dark-pink); color: white;" 
                                        onclick="fileStorage.downloadFile('labResults', '${lab.id}')">
                                    <i class="fas fa-download"></i>
                                </button>
                            ` : '<span style="color: #999; font-size: 12px;">-</span>'}
                        </td>
                    </tr>
                `;
                if (lab.resultDetails) {
                    historyRows += `
                        <tr style="background: #fafafa;">
                            <td colspan="6" style="padding: 12px 12px 14px 12px; background: #fff3f8; font-size: 13px; text-align: left; border-left: 4px solid var(--dark-pink); border-bottom: 2px solid #e0e0e0;">
                                <strong style="color: var(--dark-pink);">Results:</strong> ${lab.resultDetails}
                                ${lab.fileData ? `<br><small style="color: #666; margin-top: 6px; display: inline-block;"><i class="fas fa-paperclip"></i> ${lab.fileData.fileName} <span style="color: #999;">(${(lab.fileData.fileSize / 1024).toFixed(1)} KB)</span></small>` : ''}
                            </td>
                        </tr>
                    `;
                } else {
                    historyRows += `
                        <tr style="background: #fafafa;">
                            <td colspan="6" style="padding: 0; border-bottom: 2px solid #e0e0e0; height: 4px;"></td>
                        </tr>
                    `;
                }
            });
        } else {
            historyRows = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No lab results available</td></tr>';
        }

        return `
            <div class="lab-results-management">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-flask"></i>
                            My Laboratory Results
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin-bottom: 10px; color: var(--dark-pink);">
                                <i class="fas fa-user-injured"></i> ${patient.fullName}
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> ${patient.id}</div>
                                <div><strong>Age:</strong> ${patient.age}</div>
                                <div><strong>Status:</strong> ${patient.status}</div>
                                <div><strong>Doctor:</strong> ${patient.doctor}</div>
                            </div>
                        </div>

                        <h4 style="color: var(--dark-pink); margin-bottom: 16px;">
                            <i class="fas fa-history"></i> Lab Results History
                        </h4>
                        <div style="overflow-x: auto;">
                            <table class="patients-table" style="width: 100%;">
                                <thead>
                                    <tr>
                                        <th style="padding: 12px;">Test Type</th>
                                        <th style="padding: 12px;">Test Date</th>
                                        <th style="padding: 12px;">Status</th>
                                        <th style="padding: 12px;">Performed By</th>
                                        <th style="padding: 12px;">Recorded Date</th>
                                        <th style="padding: 12px;">File</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${historyRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Prescriptions Content for Patient (view their own prescriptions only)
    getPrescriptionsContent() {
        const patientId = this.currentUser.patientId || 'P001';

        // Get patient data
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        let patient = patients.find(p => p.id === patientId);

        // Fallback to sample data
        if (!patient) {
            const fallbackPatients = [
                { id: 'P001', fullName: 'Miranda, Hebrew T.', age: 19, status: 'Active', doctor: 'Dr. Sta. Maria' },
                { id: 'P002', fullName: 'Sta.Maria, Rizza M.', age: 20, status: 'Admitted', doctor: 'Dr. Sta. Maria' },
                { id: 'P003', fullName: 'Puquiz, Daniel T.', age: 21, status: 'Active', doctor: 'Dr. Salvador' }
            ];
            patient = fallbackPatients.find(p => p.id === patientId) || fallbackPatients[0];
        }

        // Get prescriptions for this patient
        const allPrescriptions = JSON.parse(localStorage.getItem('medications') || '[]');
        const patientPrescriptions = allPrescriptions.filter(med => med.patientId === patientId);

        return `
            <div class="prescriptions-management">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-prescription"></i>
                            My Prescriptions
                        </h3>
                    </div>
                    <div class="card-content">
                        <!-- Patient Info Display -->
                        <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                            <h4 style="margin: 0 0 10px 0; color: var(--dark-pink); font-size: 16px;">
                                <i class="fas fa-user"></i> Patient Information
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                <div><strong>Patient ID:</strong> ${patient.id}</div>
                                <div><strong>Name:</strong> ${patient.fullName}</div>
                                <div><strong>Age:</strong> ${patient.age}</div>
                                <div><strong>Physician:</strong> ${patient.doctor || 'Not Assigned'}</div>
                            </div>
                        </div>

                        <!-- Prescriptions History -->
                        <div style="margin-top: 32px;">
                            <h4 style="color: var(--dark-pink); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--light-pink);">
                                <i class="fas fa-history"></i> Prescription History
                            </h4>
                            ${patientPrescriptions.length > 0 ? `
                            <div style="overflow-x: auto;">
                                <table class="patients-table" style="min-width: 900px;">
                                    <thead>
                                        <tr>
                                            <th style="width: 15%;">Date Prescribed</th>
                                            <th style="width: 20%;">Medication</th>
                                            <th style="width: 12%;">Dosage</th>
                                            <th style="width: 12%;">Frequency</th>
                                            <th style="width: 10%;">Route</th>
                                            <th style="width: 10%;">Duration</th>
                                            <th style="width: 21%;">Prescribed By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${patientPrescriptions.map((med, index) => `
                                            <tr style="border-top: ${index > 0 ? '8px solid #fff' : '0'}; background: #fafafa;">
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${med.prescribedDate} ${med.prescribedTime || ''}</td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;"><strong>${med.medicationName}</strong></td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${med.dosage}</td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${med.frequency}</td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${med.route}</td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${med.duration || '-'}</td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${med.prescribedBy}</td>
                                            </tr>
                                            ${med.notes ? `
                                            <tr style="background: #fafafa;">
                                                <td colspan="7" style="text-align: left; padding: 12px 12px 14px 12px; border-left: 4px solid var(--dark-pink); border-bottom: 2px solid #e0e0e0; background: #fff3f8;">
                                                    <strong style="color: var(--dark-pink);">Instructions:</strong> ${med.notes}
                                                </td>
                                            </tr>
                                            ` : `
                                            <tr style="background: #fafafa;">
                                                <td colspan="7" style="padding: 0; border-bottom: 2px solid #e0e0e0; height: 4px;"></td>
                                            </tr>
                                            `}
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                            ` : `
                            <div style="text-align: center; padding: 40px; color: #999;">
                                <i class="fas fa-prescription" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                                <p style="font-size: 16px;">No prescriptions recorded yet.</p>
                            </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Imaging Results Content (Own Results Only)
    getImagingResultsContent() {
        const allImagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');
        const myImagingResults = allImagingResults.filter(img => img.patientId === this.currentUser.patientId);

        return `
            <div class="imaging-results-view">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-x-ray"></i> My Imaging Results
                        </h3>
                    </div>
                    <div class="card-content">
                        <div class="info-banner" style="background: #f0f8ff; padding: 16px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid var(--dark-pink);">
                            <p style="margin: 0; color: #555;">
                                <i class="fas fa-info-circle" style="color: var(--dark-pink);"></i>
                                View your imaging results and download images shared by your radiology technologist.
                            </p>
                        </div>

                        <div class="imaging-history">
                            ${myImagingResults.length > 0 ? `
                            <div style="overflow-x: auto;">
                                <table class="patients-table">
                                    <thead>
                                        <tr>
                                            <th>Modality</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>File</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${myImagingResults.map((result, index) => `
                                            <tr style="border-top: ${index > 0 ? '8px solid #fff' : '0'}; background: #fafafa;">
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;"><strong>${result.imagingModality}</strong></td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">${result.imagingDate}</td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;"><span class="status-badge ${result.status.toLowerCase().replace(' ', '-')}">${result.status}</span></td>
                                                <td style="border-top: 2px solid #e0e0e0; padding-top: 14px;">
                                                    ${result.fileData ? `
                                                        <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px; background: var(--info-blue); color: white; margin-right: 4px;" 
                                                                onclick="fileStorage.viewFile('imagingResults', '${result.id}')">
                                                            <i class="fas fa-eye"></i> View
                                                        </button>
                                                        <button class="btn btn-sm" style="padding: 5px 10px; font-size: 12px;" 
                                                                onclick="fileStorage.downloadFile('imagingResults', '${result.id}')">
                                                            <i class="fas fa-download"></i> Download
                                                        </button>
                                                    ` : '<span style="color: #999; font-size: 12px;">No file</span>'}
                                                </td>
                                            </tr>
                                            ${result.imagingFindings ? `
                                            <tr style="background: #fafafa;">
                                                <td colspan="4" style="text-align: left; padding: 12px 12px 14px 12px; border-left: 4px solid var(--dark-pink); border-bottom: 2px solid #e0e0e0; background: #fff3f8;">
                                                    <strong style="color: var(--dark-pink);">Findings:</strong> ${result.imagingFindings}
                                                </td>
                                            </tr>
                                            ` : `
                                            <tr style="background: #fafafa;">
                                                <td colspan="4" style="padding: 0; border-bottom: 2px solid #e0e0e0; height: 4px;"></td>
                                            </tr>
                                            `}
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                            ` : `
                            <div style="text-align: center; padding: 40px; color: #999;">
                                <i class="fas fa-x-ray" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                                <p style="font-size: 16px;">No imaging results recorded yet.</p>
                            </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Imaging Orders Content (for backwards compatibility)
    getImagingOrdersContent() {
        return this.getImagingResultsContent();
    }
}
