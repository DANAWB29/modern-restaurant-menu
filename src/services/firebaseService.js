// Firebase Menu Service - Google's real-time database
// Free tier: 1GB storage, 10GB/month transfer, real-time updates

class FirebaseService {
    constructor() {
        // Firebase config - get from Firebase Console
        this.firebaseConfig = {
            apiKey: "your-api-key",
            authDomain: "your-project.firebaseapp.com",
            databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
            projectId: "your-project-id",
            storageBucket: "your-project.appspot.com",
            messagingSenderId: "123456789",
            appId: "your-app-id"
        }
        this.db = null
        this.isInitialized = false
    }

    // Initialize Firebase
    async initialize() {
        if (this.isInitialized) return await this.loadMenuData()

        try {
            // Import Firebase modules
            const { initializeApp } = await import('firebase/app')
            const { getDatabase, ref, onValue, set, push, remove } = await import('firebase/database')

            // Initialize Firebase
            const app = initializeApp(this.firebaseConfig)
            this.db = getDatabase(app)
            this.isInitialized = true

            // Set up real-time listener
            const menuRef = ref(this.db, 'menu')
            onValue(menuRef, (snapshot) => {
                const data = snapshot.val()
                if (data) {
                    window.dispatchEvent(new CustomEvent('menuUpdated', { detail: data }))
                }
            })

            return await this.loadMenuData()
        } catch (error) {
            console.error('Firebase initialization failed:', error)
            return this.getFallbackData()
        }
    }

    // Load menu data
    async loadMenuData() {
        if (!this.isInitialized) return this.getFallbackData()

        try {
            const { ref, get } = await import('firebase/database')
            const menuRef = ref(this.db, 'menu')
            const snapshot = await get(menuRef)

            if (snapshot.exists()) {
                return snapshot.val()
            } else {
                return this.getFallbackData()
            }
        } catch (error) {
            console.error('Error loading from Firebase:', error)
            return this.getFallbackData()
        }
    }

    // Save menu data
    async saveMenuData(items) {
        if (!this.isInitialized) {
            return { success: false, error: 'Firebase not initialized' }
        }

        try {
            const { ref, set } = await import('firebase/database')

            const menuData = {
                lastUpdated: new Date().toISOString(),
                categories: [
                    { id: 'all', name: 'All Items', icon: '🍽️' },
                    { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
                    { id: 'lunch', name: 'Lunch', icon: '🌞' },
                    { id: 'dinner', name: 'Dinner', icon: '🌙' },
                    { id: 'drinks', name: 'Drinks', icon: '🥤' },
                    { id: 'desserts', name: 'Desserts', icon: '🍰' }
                ],
                items: items
            }

            const menuRef = ref(this.db, 'menu')
            await set(menuRef, menuData)

            return {
                success: true,
                message: '🚀 Menu updated instantly! All devices see changes in real-time!'
            }
        } catch (error) {
            console.error('Error saving to Firebase:', error)
            return { success: false, error: error.message }
        }
    }

    // Get fallback data
    getFallbackData() {
        const savedItems = localStorage.getItem('menuItems')
        if (savedItems) {
            return {
                items: JSON.parse(savedItems),
                categories: [
                    { id: 'all', name: 'All Items', icon: '🍽️' },
                    { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
                    { id: 'lunch', name: 'Lunch', icon: '🌞' },
                    { id: 'dinner', name: 'Dinner', icon: '🌙' },
                    { id: 'drinks', name: 'Drinks', icon: '🥤' },
                    { id: 'desserts', name: 'Desserts', icon: '🍰' }
                ],
                lastUpdated: new Date().toISOString()
            }
        }
        return { items: [], categories: [], lastUpdated: new Date().toISOString() }
    }

    // Check if configured
    isConfigured() {
        return this.firebaseConfig.apiKey !== 'your-api-key'
    }
}

export const firebaseService = new FirebaseService()
export default firebaseService