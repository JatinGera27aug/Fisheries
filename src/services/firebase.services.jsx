import { db } from '../firebaseConfig';
import { COLLECTIONS } from './schema';
import { validateData } from '../utils/validators';
import app from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    // deleteDoc,
    query,
    where,
    orderBy,
    // limit,
    serverTimestamp 
} from 'firebase/firestore';

// Water Quality Data Services
export const waterQualityService = {
    async addWaterQualityData(data) {
        // Get current user
        const auth = getAuth(app);
        const currentUser = auth.currentUser;
            
        if (!currentUser) {
            throw new Error('User not authenticated');
        }
        try {
            // Validate data before adding
            const { isValid, errors } = validateData(data, 'waterQuality');
            if (!isValid) {
                throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
            }

            const docRef = await addDoc(collection(db, COLLECTIONS.WATER_QUALITY), {
                ...data,
                timestamp: serverTimestamp(),
                status: calculateWaterQualityStatus(data),
                lastUpdatedBy: data.lastUpdatedBy || 'system'
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding water quality data:', error);
            throw error;
        }
    },

    async getWaterQualityData (filters = {}) {
        try {
            // Get current user
            // const auth = getAuth(app);
            // const currentUser = auth.currentUser;
            
            // if (!currentUser) {
            //     throw new Error('User not authenticated');
            // }
            // Start with base collection reference
            let q = query(
                collection(db, 'WaterQualityData'), 
                // Always order by timestamp first
                orderBy('timestamp', 'desc')
            );
            
            // If location is specified and not 'all', add location filter
            if (filters.location && filters.location !== 'all') {
                console.log('Location filter:', filters.location);
                // Combine location filter with existing query
                q = query(
                    collection(db, 'WaterQualityData'), 
                    // where('createdBy', '==', currentUser.uid),
                    where('location', '==', filters.location),
                    orderBy('timestamp', 'desc')
                );
            }
            
            // If time range is specified, add time filter
            if (filters.timeRange) {
                const now = new Date();
                let timeAgo;
                
                switch (filters.timeRange) {
                    case '24h':
                        timeAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                        break;
                    case '7d':
                        timeAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        break;
                    case '30d':
                        timeAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        break;
                    default:
                        timeAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                }
                
                // If location filter is already applied
                if (filters.location && filters.location !== 'all') {
                    console.log('Time filter:', filters.timeRange);
                    console.log('location:', filters.location);
                    q = query(
                        collection(db, 'WaterQualityData'), 
                        where('location', '==', filters.location),
                        where('timestamp', '>=', timeAgo),
                        orderBy('timestamp', 'desc')
                    );
                } else {
                    // If no location filter
                    q = query(
                        collection(db, 'WaterQualityData'), 
                        where('timestamp', '>=', timeAgo),
                        orderBy('timestamp', 'desc')
                    );
                }
            }
            
            // Execute the query
            const querySnapshot = await getDocs(q);
            
            // Map documents to array
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp
            }));
        } catch (error) {
            console.error('Error fetching water quality data:', error);
            throw error;
        }
    },

    // Method to get unique locations
    async getUniqueLocations () {
        try {
            // Fetch all documents to extract unique locations
            const querySnapshot = await getDocs(collection(db, 'WaterQualityData'));
            
            // Use Set to get unique locations
            const locations = new Set();
            querySnapshot.docs.forEach(doc => {
                const location = doc.data().location;
                if (location) locations.add(location);
            });
            
            return Array.from(locations);
        } catch (error) {
            console.error('Error fetching unique locations:', error);
            return [];
        }
    },

    async updateWaterQualityData(id, data) {
        try {
            // Validate update data
            const { isValid, errors } = validateData(data, 'waterQuality');
            if (!isValid) {
                throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
            }

            const docRef = doc(db, COLLECTIONS.WATER_QUALITY, id);
            await updateDoc(docRef, {
                ...data,
                lastUpdated: serverTimestamp(),
                status: calculateWaterQualityStatus(data)
            });
        } catch (error) {
            console.error('Error updating water quality data:', error);
            throw error;
        }
    }
};

// Disease Outbreak Services
export const diseaseOutbreakService = {
    async getDiseaseOutbreakData (filters = {}) {
        try {
            // Start with base collection reference
            let q = query(
                collection(db, 'DiseaseOutbreak'), 
                // Always order by date reported first
                orderBy('dateReported', 'desc')
            );
            
            // If location is specified and not 'all', add location filter
            if (filters.location && filters.location !== 'all') {
                q = query(
                    collection(db, 'DiseaseOutbreak'), 
                    where('location', '==', filters.location),
                    orderBy('dateReported', 'desc')
                );
            }
            
            // If time range is specified, add time filter
            if (filters.timeRange) {
                const now = new Date();
                let timeAgo;
                
                switch (filters.timeRange) {
                    case '24h':
                        timeAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                        break;
                    case '7d':
                        timeAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        break;
                    case '30d':
                        timeAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        break;
                    default:
                        timeAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                }
                
                // If location filter is already applied
                if (filters.location && filters.location !== 'all') {
                    q = query(
                        collection(db, 'DiseaseOutbreak'), 
                        where('location', '==', filters.location),
                        where('dateReported', '>=', timeAgo),
                        orderBy('dateReported', 'desc')
                    );
                } else {
                    // If no location filter
                    q = query(
                        collection(db, 'DiseaseOutbreak'), 
                        where('dateReported', '>=', timeAgo),
                        orderBy('dateReported', 'desc')
                    );
                }
            }
            
            // Execute the query
            const querySnapshot = await getDocs(q);
            
            // Map documents to array
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                dateReported: doc.data().dateReported
            }));
        } catch (error) {
            console.error('Error fetching disease outbreak data:', error);
            throw error;
        }
    },

    // Method to get unique locations
    async getUniqueLocations () {
        try {
            // Fetch all documents to extract unique locations
            const querySnapshot = await getDocs(collection(db, 'DiseaseOutbreak'));
            
            // Use Set to get unique locations
            const locations = new Set();
            querySnapshot.docs.forEach(doc => {
                const location = doc.data().location;
                if (location) locations.add(location);
            });
            
            return Array.from(locations);
        } catch (error) {
            console.error('Error fetching unique locations:', error);
            return [];
        }
    },

    // Method to add new disease outbreak
    async addDiseaseOutbreakData (data) {
        try {
            const docRef = await addDoc(collection(db, 'DiseaseOutbreak'), {
                ...data,
                dateReported: serverTimestamp()
            });
            return docRef;
        } catch (error) {
            console.error('Error adding disease outbreak data:', error);
            throw error;
        }
    }
};

// Alert Services
export const alertService = {
    async createAlert(data) {
        try {
            const docRef = await addDoc(collection(db, COLLECTIONS.ALERTS), {
                ...data,
                timestamp: serverTimestamp(),
                status: 'new'
            });

            // If alert is critical, trigger notification
            if (data.severity === 'high') {
                await this.triggerNotification(docRef.id, data);
            }

            return docRef.id;
        } catch (error) {
            console.error('Error creating alert:', error);
            throw error;
        }
    },

    async getAlerts(filters = {}) {
        try {
            let q = collection(db, COLLECTIONS.ALERTS);
            
            if (filters.status) {
                q = query(q, where('status', '==', filters.status));
            }
            if (filters.severity) {
                q = query(q, where('severity', '==', filters.severity));
            }
            
            q = query(q, orderBy('timestamp', 'desc'));
            
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching alerts:', error);
            throw error;
        }
    },

    async triggerNotification(alertId, alertData) {
        // Implement notification logic here (email, SMS, etc.)
        console.log(`Triggering notification for alert ${alertId}:`, alertData);
    }
};

// Helper Functions
function calculateWaterQualityStatus(data) {
    const { pH, oxygenLevel, temperature } = data;
    
    // Critical conditions
    if (
        oxygenLevel < 5 || 
        pH < 6 || 
        pH > 9 ||
        temperature < 20 ||
        temperature > 30
    ) {
        return 'critical';
    }
    
    // Warning conditions
    if (
        oxygenLevel < 7 || 
        pH < 6.5 || 
        pH > 8.5 ||
        temperature < 22 ||
        temperature > 28
    ) {
        return 'warning';
    }
    
    return 'normal';
}

// Export helper functions if needed elsewhere
export const helpers = {
    calculateWaterQualityStatus
};