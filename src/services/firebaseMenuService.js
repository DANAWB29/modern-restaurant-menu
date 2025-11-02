// Firebase Real-time Menu Service
// Uses Firebase Realtime Database for automatic global updates

class FirebaseMenuService {
    constructor() {
        // Firebase configuration - you'll get this from Firebase Console
        this.firebaseConfig = {
            apiKey: "your-api-key-here",
            authDomain: "your-project.firebaseapp.com",
            databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
            projectId: "your-project-id",
            storageBucket: "your-project.appspot.com",
            messagingSenderId: "123456789",
            appId: "your-app-id"
        }

        this.db = null
        this.isInitialized = false
        this.cache = null
        this.listeners = []
    }

    // Initialize Firebase
    async initialize() {
        if (this.isInitialized) return

        try {
            // Import Firebase dynamically
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js')
            const { getDatabase, ref, onValue, set, push } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js')

            // Initialize Firebase
            const app = initializeApp(this.firebaseConfig)
            this.db = getDatabase(app)
            this.isInitialized = true

            // Set up real-time listener
            this.setupRealtimeListener()

            console.log('Firebase initialized successfully')
            return await this.loadMenuData()
        } catch (error) {
            console.error('Firebase initialization failed:', error)
            return this.getFallbackData()
        }
    }

    // Set up real-time listener for menu updates
    setupRealtimeListener() {
        if (!this.db) return

        import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js').then(({ ref, onValue }) => {
            const menuRef = ref(this.db, 'menu')

            onValue(menuRef, (snapshot) => {
                const data = snapshot.val()
                if (data && data.items) {
                    this.cache = data

                    // Notify all listeners about the update
                    window.dispatchEvent(new CustomEvent('menuUpdated', {
                        detail: data
                    }))
                }
            })
        })
    }

    // Load menu data from Firebase
    async loadMenuData() {
        if (!this.isInitialized) {
            await this.initialize()
        }

        if (!this.db) {
            return this.getFallbackData()
        }

        try {
            const { ref, get } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js')
            const menuRef = ref(this.db, 'menu')
            const snapshot = await get(menuRef)

            if (snapshot.exists()) {
                const data = snapshot.val()
                this.cache = data
                return data
            } else {
                // Initialize with default data
                const defaultData = this.getDefaultMenuData()
                await this.saveMenuData(defaultData.items)
                return defaultData
            }
        } catch (error) {
            console.error('Error loading from Firebase:', error)
            return this.getFallbackData()
        }
    }

    // Save menu data to Firebase (triggers real-time updates)
    async saveMenuData(items) {
        if (!this.isInitialized) {
            await this.initialize()
        }

        if (!this.db) {
            return this.fallbackSave(items)
        }

        try {
            const { ref, set } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js')

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

            // Update local cache
            this.cache = menuData
            localStorage.setItem('menuItems', JSON.stringify(items))

            return {
                success: true,
                message: 'Menu updated successfully! Changes are live on all devices instantly! 🚀'
            }
        } catch (error) {
            console.error('Error saving to Firebase:', error)
            return this.fallbackSave(items)
        }
    }

    // Fallback save when Firebase is not available
    fallbackSave(items) {
        localStorage.setItem('menuItems', JSON.stringify(items))
        return {
            success: true,
            message: 'Menu saved locally. Firebase not configured for real-time updates.'
        }
    }

    // Get default menu data
    getDefaultMenuData() {
        return {
            lastUpdated: new Date().toISOString(),
            categories: [
                { id: 'all', name: 'All Items', icon: '🍽️' },
                { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
                { id: 'lunch', name: 'Lunch', icon: '🌞' },
                { id: 'dinner', name: 'Dinner', icon: '🌙' },
                { id: 'drinks', name: 'Drinks', icon: '🥤' },
                { id: 'desserts', name: 'Desserts', icon: '🍰' }
            ],
            items: [
                {
                    id: 1,
                    name: 'Golden Pancakes',
                    price: 12.99,
                    category: 'breakfast',
                    description: 'Fluffy pancakes with maple syrup and fresh berries',
                    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
                    featured: true
                },
                {
                    id: 2,
                    name: 'Gourmet Burger',
                    price: 18.99,
                    category: 'lunch',
                    description: 'Wagyu beef patty with truffle aioli, arugula, and aged cheddar',
                    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
                    featured: true
                },
                {
                    id: 3,
                    name: 'Grilled Salmon',
                    price: 28.99,
                    category: 'dinner',
                    description: 'Atlantic salmon with lemon herb butter and seasonal vegetables',
                    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
                    featured: true
                }
            ]
        }
    }

    // Get fallback data from localStorage or defaults
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

        return this.getDefaultMenuData()
    }

    // Check if Firebase is configured
    isConfigured() {
        return this.firebaseConfig.apiKey !== "your-api-key-here"
    }

    // Get service status
    getStatus() {
        return {
            configured: this.isConfigured(),
            initialized: this.isInitialized,
            connected: !!this.db,
            hasCache: !!this.cache
        }
    }
}

// Export singleton instance
export const firebaseMenuService = new FirebaseMenuService()
export default firebaseMenuService