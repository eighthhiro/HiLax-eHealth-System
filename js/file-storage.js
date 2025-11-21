// IndexedDB File Storage Manager
class FileStorageManager {
    constructor() {
        this.dbName = 'HiLaxFileStorage';
        this.dbVersion = 1;
        this.db = null;
    }

    // Initialize IndexedDB
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores for different file types
                if (!db.objectStoreNames.contains('labResults')) {
                    db.createObjectStore('labResults', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('imagingResults')) {
                    db.createObjectStore('imagingResults', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('radiologyImages')) {
                    db.createObjectStore('radiologyImages', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('ctScans')) {
                    db.createObjectStore('ctScans', { keyPath: 'id' });
                }
            };
        });
    }

    // Save file to IndexedDB
    async saveFile(storeName, recordId, file) {
        if (!file) return null;

        try {
            await this.init();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = async (e) => {
                    const fileData = {
                        id: recordId,
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        data: e.target.result,
                        uploadDate: new Date().toISOString()
                    };

                    const transaction = this.db.transaction([storeName], 'readwrite');
                    const store = transaction.objectStore(storeName);
                    const request = store.put(fileData);

                    request.onsuccess = () => resolve({
                        fileId: recordId,
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type
                    });
                    request.onerror = () => reject(request.error);
                };

                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(file);
            });
        } catch (error) {
            console.error('Error saving file:', error);
            return null;
        }
    }

    // Get file from IndexedDB
    async getFile(storeName, recordId) {
        try {
            await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);
                const request = store.get(recordId);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Error getting file:', error);
            return null;
        }
    }

    // Delete file from IndexedDB
    async deleteFile(storeName, recordId) {
        try {
            await this.init();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.delete(recordId);

                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }

    // Download file from IndexedDB
    async downloadFile(storeName, recordId) {
        try {
            const fileData = await this.getFile(storeName, recordId);
            if (!fileData) {
                console.error('File not found');
                return;
            }

            const link = document.createElement('a');
            link.href = fileData.data;
            link.download = fileData.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }

    // View file in modal
    async viewFile(storeName, recordId) {
        try {
            const fileData = await this.getFile(storeName, recordId);
            if (!fileData) {
                console.error('File not found');
                return;
            }

            const modal = document.createElement('div');
            modal.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(0,0,0,0.95) !important; z-index: 99999 !important; padding: 0 !important; margin: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important;';
            
            const fileType = fileData.type.toLowerCase();
            let content = '';

            if (fileType.includes('pdf')) {
                // PDF viewer - full height with proper permissions
                content = `<iframe src="${fileData.data}" style="width: 100%; height: calc(100vh - 50px); border: none;" allow="fullscreen"></iframe>`;
            } else if (fileType.includes('image')) {
                // Image viewer - full height with proper scaling
                content = `<div style="width: 100%; height: calc(100vh - 50px); display: flex; align-items: center; justify-content: center; background: #000; overflow: auto;">
                    <img src="${fileData.data}" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="${fileData.name}">
                </div>`;
            } else {
                content = `<p style="text-align: center; padding: 40px; color: #666;">Preview not available for this file type. Please download to view.</p>`;
            }

            modal.innerHTML = `
                <div style="width: 100vw !important; height: 100vh !important; max-width: 100vw !important; max-height: 100vh !important; margin: 0 !important; border-radius: 0 !important; background: #000 !important; overflow: hidden !important; display: flex !important; flex-direction: column !important;">
                    <div style="padding: 12px 20px !important; background: #2c3e50 !important; color: white !important; display: flex !important; align-items: center !important; justify-content: space-between !important; height: 50px !important; flex-shrink: 0 !important;">
                        <div style="display: flex; align-items: center; gap: 12px; flex: 1; overflow: hidden;">
                            <i class="fas fa-file" style="font-size: 18px;"></i>
                            <h3 style="margin: 0; font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${fileData.name}</h3>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <button type="button" class="btn btn-sm" style="padding: 6px 12px; font-size: 12px; background: var(--info-blue); color: white;" onclick="fileStorage.downloadFile('${storeName}', '${recordId}')">
                                <i class="fas fa-download"></i> Download
                            </button>
                            <button id="closeFileViewerBtn" style="background: transparent; border: none; color: white; font-size: 28px; cursor: pointer; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">&times;</button>
                        </div>
                    </div>
                    <div style="padding: 0 !important; height: calc(100vh - 50px) !important; overflow: hidden !important; background: #000 !important; flex: 1 !important;">
                        ${content}
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const closeModal = () => modal.remove();
            document.getElementById('closeFileViewerBtn').addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            
            // ESC key to close
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);
        } catch (error) {
            console.error('Error viewing file:', error);
            alert('Error viewing file. Please try downloading instead.');
        }
    }
}

// Create global instance
const fileStorage = new FileStorageManager();
