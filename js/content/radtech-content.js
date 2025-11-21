// RadTech Content Module

class RadTechContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    // Dashboard Content for Radiologic Technologists
    getDashboardContent() {
        const stats = this.getDynamicStats();
        const sharedContent = new SharedContent(this.currentUser);
        
        return `
            <div class="dashboard-overview">
                ${this.getBentoBanner()}
                <div class="dashboard-flex-row">
                    ${sharedContent.getAnnouncementsSection()}
                    <div class="dashboard-cards-wrapper">
                        <div class="cards-grid">
                            <div class="card stat-card">
                                <div class="card-header">
                                    <div class="stat-info">
                                        <div class="card-icon">
                                            <i class="fas fa-clock"></i>
                                        </div>
                                        <h3 class="card-title">Pending Imaging Orders</h3>
                                    </div>
                                    <div class="stat-number">${stats.pendingImagingOrders}</div>
                                </div>
                                <div class="card-content">
                                    <p>Patients awaiting imaging results</p>
                                    <button class="btn-view-stat" data-page="imaging-orders">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                </div>
                            </div>
                            <div class="card stat-card">
                                <div class="card-header">
                                    <div class="stat-info">
                                        <div class="card-icon">
                                            <i class="fas fa-x-ray"></i>
                                        </div>
                                        <h3 class="card-title">Imaging Completed</h3>
                                    </div>
                                    <div class="stat-number">${stats.imagingCompleted}</div>
                                </div>
                                <div class="card-content">
                                    <p>Total imaging results recorded</p>
                                    <button class="btn-view-stat" data-page="imaging-orders">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                </div>
                            </div>
                            <div class="card stat-card">
                                <div class="card-header">
                                    <div class="stat-info">
                                        <div class="card-icon">
                                            <i class="fas fa-hourglass-half"></i>
                                        </div>
                                        <h3 class="card-title">Pending Review</h3>
                                    </div>
                                    <div class="stat-number">${stats.pendingReview}</div>
                                </div>
                                <div class="card-content">
                                    <p>Imaging results awaiting review</p>
                                    <button class="btn-view-stat" data-page="imaging-orders">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ${sharedContent.getSocialFooter()}
            </div>
        `;
    }

    // Get Dynamic Stats
    getDynamicStats() {
        let imagingCompleted = 0;
        let pendingImagingOrders = 0;
        let pendingReview = 0;

        // Get imaging completed
        try {
            const imagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');
            imagingCompleted = imagingResults.length;
            
            // Count pending review
            pendingReview = imagingResults.filter(img => img.status === 'Pending Review').length;
        } catch (e) {
            console.error('Error loading imaging results:', e);
        }

        // Calculate pending imaging orders (patients with no imaging results)
        try {
            const patients = JSON.parse(localStorage.getItem('patients') || '[]');
            const imagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');
            
            pendingImagingOrders = patients.filter(patient => {
                const hasImaging = imagingResults.some(img => img.patientId === patient.id);
                return !hasImaging;
            }).length;
        } catch (e) {
            console.error('Error calculating pending imaging orders:', e);
        }

        return {
            pendingImagingOrders,
            imagingCompleted,
            pendingReview
        };
    }

    // Imaging Orders Content (General Imaging Results)
    getImagingOrdersContent() {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const imagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');

        let summaryRows = '';
        patients.forEach(patient => {
            const patientImaging = imagingResults.filter(img => img.patientId === patient.id);
            const latest = patientImaging[0];

            if (latest) {
                summaryRows += `
                    <tr>
                        <td style="width: 10%;">${patient.id}</td>
                        <td style="width: 20%;">${patient.fullName}</td>
                        <td style="width: 15%;">${latest.imagingModality}</td>
                        <td style="width: 12%;">${latest.imagingDate}</td>
                        <td style="width: 10%;">${latest.status || 'Completed'}</td>
                        <td style="width: 12%;">
                            <button class="btn btn-sm btn-view-more-imaging" data-patient-id="${patient.id}">
                                <i class="fas fa-eye"></i> View More
                            </button>
                        </td>
                    </tr>
                `;
            } else {
                summaryRows += `
                    <tr>
                        <td style="width: 10%;">${patient.id}</td>
                        <td style="width: 20%;">${patient.fullName}</td>
                        <td colspan="3" style="text-align: center; color: #999;">No imaging results</td>
                        <td style="width: 12%;">-</td>
                    </tr>
                `;
            }
        });

        return `
            <div class="imaging-orders-management">
                <!-- Summary Table -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            Imaging Results Summary
                        </h3>
                    </div>
                    <div class="card-content">
                        <div style="overflow-x: auto;">
                            <table class="patients-table" style="min-width: 900px;">
                                <thead>
                                    <tr>
                                        <th style="width: 10%;">Patient ID</th>
                                        <th style="width: 20%;">Name</th>
                                        <th style="width: 15%;">Modality</th>
                                        <th style="width: 12%;">Date</th>
                                        <th style="width: 10%;">Status</th>
                                        <th style="width: 12%;">Actions</th>
                                    </tr>
                                </thead>
                            </table>
                            <div style="max-height: 180px; overflow-y: auto;">
                                <table class="patients-table" style="min-width: 900px;">
                                    <tbody>
                                        ${summaryRows || '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No imaging results recorded yet</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Detailed Entry Form -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-x-ray"></i>
                            Imaging Orders
                        </h3>
                    </div>
                            <div class="card-content">
                                <!-- Patient Selection -->
                                <div class="patient-selector" style="margin-bottom: 24px; padding: 20px; background: var(--light-pink); border-radius: 8px;">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label for="imagingPatient" style="font-weight: 600; margin-bottom: 8px; display: block;">
                                            <i class="fas fa-user-injured"></i> Select Patient
                                        </label>
                                        <select id="imagingPatient" class="form-control" required style="font-size: 14px;">
                                            <option value="">-- Select a patient --</option>
                                            ${patients.map(patient => 
                                                `<option value="${patient.id}">${patient.id} - ${patient.fullName}</option>`
                                            ).join('')}
                                        </select>
                                    </div>
                                </div>

                                <!-- Patient Info Display (hidden until patient selected) -->
                                <div id="selectedPatientInfoImaging" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--dark-pink); border-radius: 4px;">
                                    <h4 style="margin: 0 0 10px 0; color: var(--dark-pink); font-size: 16px;">
                                        <i class="fas fa-user"></i> Patient Information
                                    </h4>
                                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                        <div><strong>Patient ID:</strong> <span id="selectedPatientIdImaging"></span></div>
                                        <div><strong>Name:</strong> <span id="selectedPatientNameImaging"></span></div>
                                        <div><strong>Age:</strong> <span id="selectedPatientAgeImaging"></span></div>
                                        <div><strong>Physician:</strong> <span id="selectedPatientDoctorImaging"></span></div>
                                    </div>
                                </div>

                                <!-- Imaging Form -->
                                <form id="newImagingForm" style="display: none;">
                                    <div class="form-section" style="margin-bottom: 24px;">
                                        <h4 style="color: var(--dark-pink); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--light-pink);">
                                            <i class="fas fa-x-ray"></i> Imaging Information
                                        </h4>
                                        
                                        <div class="form-row" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;">
                                            <div class="form-group">
                                                <label for="imagingModality">
                                                    <i class="fas fa-image"></i> Imaging Modality *
                                                </label>
                                                <select id="imagingModality" class="form-control" required>
                                                    <option value="">-- Select modality --</option>
                                                    <option value="X-Ray">X-Ray</option>
                                                    <option value="CT Scan">CT Scan</option>
                                                    <option value="MRI">MRI</option>
                                                    <option value="Ultrasound">Ultrasound</option>
                                                    <option value="Mammography">Mammography</option>
                                                    <option value="Fluoroscopy">Fluoroscopy</option>
                                                    <option value="PET Scan">PET Scan</option>
                                                    <option value="Bone Densitometry">Bone Densitometry</option>
                                                    <option value="Angiography">Angiography</option>
                                                </select>
                                                <small style="color: #666; display: block; margin-top: 4px;">Select the type of imaging procedure</small>
                                            </div>

                                            <div class="form-group">
                                                <label for="imagingDate">
                                                    <i class="fas fa-calendar"></i> Imaging Date *
                                                </label>
                                                <input type="date" id="imagingDate" class="form-control" required>
                                                <small style="color: #666; display: block; margin-top: 4px;">Date when imaging was performed</small>
                                            </div>
                                        </div>

                                        <div class="form-row" style="display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 16px;">
                                            <div class="form-group">
                                                <label for="imagingStatus">
                                                    <i class="fas fa-info-circle"></i> Status *
                                                </label>
                                                <select id="imagingStatus" class="form-control" required>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Pending Review">Pending Review</option>
                                                    <option value="Requires Follow-up">Requires Follow-up</option>
                                                </select>
                                                <small style="color: #666; display: block; margin-top: 4px;">Current status of the imaging result</small>
                                            </div>
                                        </div>

                                        <div class="form-group" style="margin-bottom: 16px;">
                                            <label for="imagingFindings">
                                                <i class="fas fa-notes-medical"></i> Findings *
                                            </label>
                                            <textarea id="imagingFindings" class="form-control" rows="4" placeholder="Enter detailed imaging findings and observations..." required style="resize: vertical;"></textarea>
                                            <small style="color: #666; display: block; margin-top: 4px;">Describe the imaging results and any notable observations</small>
                                        </div>

                                        <div class="form-group" style="margin-bottom: 16px;">
                                            <label for="imagingFile">
                                                <i class="fas fa-file-upload"></i> Upload Image File
                                            </label>
                                            <input type="file" id="imagingFile" style="display: none;" accept=".pdf,.jpg,.jpeg,.png,.dicom,.dcm">
                                            <button type="button" class="btn btn-secondary" onclick="document.getElementById('imagingFile').click()" style="width: 100%; text-align: left; display: flex; justify-content: space-between; align-items: center; padding: 10px 16px;">
                                                <span id="imagingFileName" style="color: #666;">No file chosen</span>
                                                <i class="fas fa-upload"></i>
                                            </button>
                                            <small style="color: #666; display: block; margin-top: 4px;">Supported formats: PDF, JPG, PNG, DICOM</small>
                                        </div>
                                    </div>

                                    <div class="form-actions" style="display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid #e0e0e0;">
                                        <button type="submit" class="btn btn-primary" style="flex: 1;">
                                            <i class="fas fa-save"></i> Save Imaging Result
                                        </button>
                                        <button type="button" class="btn btn-secondary" id="clearImagingForm" style="flex: 1;">
                                            <i class="fas fa-times"></i> Clear Form
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <!-- Imaging History Card -->
                        <div class="card" id="imagingHistoryCard" style="display: none;">
                            <div class="card-header">
                                <h3 class="card-title">
                                    <i class="fas fa-history"></i> Imaging History
                                </h3>
                            </div>
                            <div class="card-content">
                                <div id="imagingHistoryTable">
                                    <p style="text-align: center; color: #999; padding: 20px;">Select a patient to view imaging history.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Image Archive Content
    getImageArchiveContent() {
        const imagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');
        const resultsWithFiles = imagingResults.filter(img => img.fileData);
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');

        return `
            <div class="image-archive-management">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-images"></i>
                            Image Archive
                        </h3>
                    </div>
                            <div class="card-content">
                                ${resultsWithFiles.length > 0 ? `
                                    <div class="image-archive-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                                        ${resultsWithFiles.map(result => {
                                            const patient = patients.find(p => p.id === result.patientId);
                                            return `
                                                <div class="archive-item" style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; background: white; transition: box-shadow 0.3s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
                                                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                                                        <div style="width: 50px; height: 50px; background: var(--light-pink); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                                            <i class="fas fa-file-image" style="font-size: 24px; color: var(--dark-pink);"></i>
                                                        </div>
                                                        <div style="flex: 1;">
                                                            <strong style="display: block; color: #333;">${result.imagingModality}</strong>
                                                            <small style="color: #666;">${result.imagingDate}</small>
                                                        </div>
                                                    </div>
                                                    <div style="margin-bottom: 12px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                                                        <div style="font-size: 13px; margin-bottom: 4px;">
                                                            <i class="fas fa-user" style="color: var(--dark-pink); width: 16px;"></i>
                                                            <strong>${patient ? patient.fullName : 'Unknown'}</strong>
                                                        </div>
                                                        <div style="font-size: 12px; color: #666;">
                                                            <i class="fas fa-id-badge" style="width: 16px;"></i> ${result.patientId}
                                                        </div>
                                                    </div>
                                                    <div style="margin-bottom: 12px;">
                                                        <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                                                            <i class="fas fa-paperclip"></i> ${result.fileData.fileName}
                                                        </div>
                                                        <div style="font-size: 12px; color: #999;">
                                                            <i class="fas fa-hdd"></i> ${(result.fileData.fileSize / 1024).toFixed(1)} KB
                                                        </div>
                                                    </div>
                                                    <button class="btn" style="width: 100%; font-size: 13px; margin-bottom: 8px; background: var(--info-blue); color: white;" onclick="fileStorage.viewFile('imagingResults', '${result.id}')">
                                                        <i class="fas fa-eye"></i> View Image
                                                    </button>
                                                    <button class="btn btn-secondary" style="width: 100%; font-size: 13px;" onclick="fileStorage.downloadFile('imagingResults', '${result.id}')">
                                                        <i class="fas fa-download"></i> Download
                                                    </button>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                ` : `
                                    <div style="text-align: center; padding: 60px 20px; color: #999;">
                                        <i class="fas fa-folder-open" style="font-size: 64px; margin-bottom: 20px; opacity: 0.3;"></i>
                                        <p style="font-size: 18px; margin-bottom: 8px;">No images in archive</p>
                                        <p style="font-size: 14px;">Upload images through Imaging Orders to build your archive</p>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Impressions Content
    getImpressionsContent() {
        const imagingResults = JSON.parse(localStorage.getItem('imagingResults') || '[]');
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');

        return `
            <div class="impressions-management">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-clipboard-list"></i>
                            Imaging Impressions
                        </h3>
                    </div>
                            <div class="card-content">
                                ${imagingResults.length > 0 ? `
                                    <div style="max-height: 600px; overflow-y: auto;">
                                        ${imagingResults.map(result => {
                                            const patient = patients.find(p => p.id === result.patientId);
                                            return `
                                                <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: white;">
                                                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                                                        <div>
                                                            <h4 style="margin: 0 0 8px 0; color: var(--dark-pink);">
                                                                <i class="fas fa-user-injured"></i> ${patient ? patient.fullName : 'Unknown Patient'}
                                                            </h4>
                                                            <div style="display: flex; gap: 16px; font-size: 13px; color: #666;">
                                                                <span><i class="fas fa-id-badge"></i> ${result.patientId}</span>
                                                                <span><i class="fas fa-x-ray"></i> ${result.imagingModality}</span>
                                                                <span><i class="fas fa-calendar"></i> ${result.imagingDate}</span>
                                                            </div>
                                                        </div>
                                                        <span class="status-badge ${result.status.toLowerCase().replace(' ', '-')}">${result.status}</span>
                                                    </div>
                                                    <div style="background: #f8f9fa; padding: 16px; border-radius: 6px; border-left: 4px solid var(--dark-pink);">
                                                        <div style="margin-bottom: 8px;">
                                                            <strong style="color: var(--dark-pink);"><i class="fas fa-notes-medical"></i> Findings:</strong>
                                                        </div>
                                                        <p style="margin: 0; line-height: 1.6; color: #333;">${result.imagingFindings}</p>
                                                    </div>
                                                    <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #999;">
                                                        <span><i class="fas fa-user-md"></i> Performed by: ${result.performedBy}</span>
                                                        <span><i class="fas fa-clock"></i> ${result.recordedDate} ${result.recordedTime}</span>
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                ` : `
                                    <div style="text-align: center; padding: 60px 20px; color: #999;">
                                        <i class="fas fa-clipboard" style="font-size: 64px; margin-bottom: 20px; opacity: 0.3;"></i>
                                        <p style="font-size: 18px; margin-bottom: 8px;">No impressions available</p>
                                        <p style="font-size: 14px;">Record imaging findings through Imaging Orders</p>
                                    </div>
                                `}
                            </div>
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
