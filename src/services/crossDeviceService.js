// Cross-Device Menu Service
// Uses JSONBin.io free API for cross-device synchronization
// No authentication required for public bins

class CrossDeviceService {
    constructor() {
        // Public JSONBin - anyone can read/write
        // You can create your own at https://jsonbin.io
        this.BIN_ID = '67824f8ead19ca34f8d6f0a7' // Replace with your bin ID
        this.API_URL = `https://api.jsonbin.io/v3/b/${this.BIN_ID}`
        this.cache = null
        this.lastFetch = null
        this.cacheTimeout = 5000 // 5 seconds
        this.refreshInterval = null
    }

    // Initialize the service
    async initialize() {
        console.log('🚀 Initializing Cross-Device Menu Service...')

        // Start auto-refresh
        this.startAutoRefresh()

        // Load initial data
        return await this.loadMenuData()
    }

    // Load menu data from JSONBin
    async loadMenuData() {
        try {
            console.log('📡 Loading menu from cloud...')

            const response = await fetch(`${this.API_URL}/latest`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            const menuData = data.record

            // Update cache
            this.cache = menuData
            this.lastFetch = Date.now()

            // Save backup locally
            localStorage.setItem('menuDataBackup', JSON.stringify(menuData))

            console.log('✅ Menu loaded from cloud:', menuData.items?.length, 'items')
            return menuData

        } catch (error) {
            console.error('❌ Error loading from cloud:', error)
            return this.getFallbackData()
        }
    }

    // Save menu data to JSONBin
    async saveMenuData(items) {
        try {
            console.log('💾 Saving', items.length, 'items to cloud...')

            const menuData = {
                lastUpdated: new Date().toISOString(),
                syncId: Date.now(),
                categories: this.getCategories(),
                items: items
            }

            const response = await fetch(this.API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menuData)
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            // Update cache
            this.cache = menuData
            this.lastFetch = Date.now()

            // Save backup locally
            localStorage.setItem('menuItems', JSON.stringify(items))
            localStorage.setItem('menuDataBackup', JSON.stringify(menuData))

            // Broadcast to local tabs
            window.dispatchEvent(new CustomEvent('menuUpdated', {
                detail: menuData
            }))

            console.log('✅ Menu saved to cloud successfully!')

            return {
                success: true,
                message: '🚀 Menu updated! Changes are live across ALL devices instantly!'
            }

        } catch (error) {
            console.error('❌ Error saving to cloud:', error)

            // Fallback to local storage
            localStorage.setItem('menuItems', JSON.stringify(items))

            return {
                success: false,
                message: `❌ Failed to sync to cloud: ${error.message}. Saved locally.`
            }
        }
    }

    // Start auto-refresh for real-time updates
    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval)
        }

        console.log('🔄 Starting auto-refresh every 10 seconds...')

        this.refreshInterval = setInterval(async () => {
            try {
                const newData = await this.loadMenuData()

                // Check if data has changed
                const currentSyncId = localStorage.getItem('lastSyncId')
                if (newData.syncId && newData.syncId.toString() !== currentSyncId) {
                    localStorage.setItem('lastSyncId', newData.syncId.toString())

                    console.log('📱 New data detected! Broadcasting update...')

                    // Dispatch update event
                    window.dispatchEvent(new CustomEvent('menuUpdated', {
                        detail: newData
                    }))
                }
            } catch (error) {
                console.warn('⚠️ Auto-refresh error:', error)
            }
        }, 10000) // Check every 10 seconds
    }

    // Stop auto-refresh
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval)
            this.refreshInterval = null
        }
    }

    // Get menu categories
    getCategories() {
        return [
            { id: 'all', name: 'All Items', icon: '🍽️' },
            { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
            { id: 'lunch', name: 'Lunch', icon: '🌞' },
            { id: 'dinner', name: 'Dinner', icon: '🌙' },
            { id: 'drinks', name: 'Drinks', icon: '🥤' },
            { id: 'desserts', name: 'Desserts', icon: '🍰' }
        ]
    }

    // Get fallback data
    getFallbackData() {
        // Try localStorage backup
        const backup = localStorage.getItem('menuDataBackup')
        if (backup) {
            try {
                return JSON.parse(backup)
            } catch (e) {
                console.warn('⚠️ Invalid backup data')
            }
        }

        // Try regular localStorage
        const savedItems = localStorage.getItem('menuItems')
        if (savedItems) {
            try {
                return {
                    items: JSON.parse(savedItems),
                    categories: this.getCategories(),
                    lastUpdated: new Date().toISOString(),
                    syncId: Date.now()
                }
            } catch (e) {
                console.warn('⚠️ Invalid saved items')
            }
        }

        // Return default data
        return this.getDefaultData()
    }

    // Get default menu data
    getDefaultData() {
        return {
            lastUpdated: new Date().toISOString(),
            syncId: Date.now(),
            categories: this.getCategories(),
            items: []
        }
    }

    // Get service status
    getStatus() {
        return {
            isConfigured: true,
            hasCache: !!this.cache,
            autoRefresh: !!this.refreshInterval,
            method: 'JSONBin Cloud Storage'
        }
    }

    // Cleanup
    cleanup() {
        this.stopAutoRefresh()
    }
}

// Export singleton instance
export const crossDeviceService = new CrossDeviceService()
export default crossDeviceService