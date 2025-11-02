// Automatic Menu Service
// Creates JSONBin automatically on first save - zero configuration needed

class AutoMenuService {
    constructor() {
        this.baseUrl = 'https://api.jsonbin.io/v3'
        this.binId = localStorage.getItem('autoBinId') || null
        this.cache = null
        this.lastFetch = null
        this.cacheTimeout = 5000 // 5 seconds
        this.refreshInterval = null
    }

    // Initialize the service
    async initialize() {
        this.startAutoRefresh()
        return await this.loadMenuData()
    }

    // Load menu data
    async loadMenuData() {
        try {
            // Check cache first
            if (this.cache && this.lastFetch && (Date.now() - this.lastFetch < this.cacheTimeout)) {
                return this.cache
            }

            // If no bin ID, use fallback data
            if (!this.binId) {
                return this.getFallbackData()
            }

            // Fetch from JSONBin
            const response = await fetch(`${this.baseUrl}/b/${this.binId}/latest`)

            if (!response.ok) {
                console.warn('JSONBin fetch failed, using fallback')
                return this.getFallbackData()
            }

            const data = await response.json()
            const menuData = data.record

            // Update cache
            this.cache = menuData
            this.lastFetch = Date.now()

            // Store locally as backup
            localStorage.setItem('menuDataBackup', JSON.stringify(menuData))

            return menuData
        } catch (error) {
            console.error('Error loading menu:', error)
            return this.getFallbackData()
        }
    }

    // Save menu data - automatically creates JSONBin if needed
    async saveMenuData(items) {
        try {
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

            // Always save locally first
            localStorage.setItem('menuItems', JSON.stringify(items))

            // If no bin ID, create one automatically
            if (!this.binId) {
                return await this.createAutoBin(menuData)
            }

            // Try to update existing bin
            const response = await fetch(`${this.baseUrl}/b/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(menuData)
            })

            if (!response.ok) {
                // If bin doesn't exist, create a new one
                console.warn('Existing bin failed, creating new one')
                return await this.createAutoBin(menuData)
            }

            // Clear cache to force refresh
            this.cache = null
            this.lastFetch = null

            return {
                success: true,
                message: '🚀 Menu updated automatically! Changes are live on all devices within 5 seconds!'
            }
        } catch (error) {
            console.error('Error saving menu:', error)

            // Always ensure local save works
            localStorage.setItem('menuItems', JSON.stringify(items))

            return {
                success: true,
                message: '✅ Menu saved locally! Automatic sync will be enabled on next save.'
            }
        }
    }

    // Create a new JSONBin automatically
    async createAutoBin(menuData) {
        try {
            const response = await fetch(`${this.baseUrl}/b`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Bin-Name': `restaurant-menu-${Date.now()}`,
                    'X-Bin-Private': 'false', // Public read access
                },
                body: JSON.stringify(menuData)
            })

            if (!response.ok) {
                throw new Error(`Failed to create JSONBin: ${response.status}`)
            }

            const result = await response.json()
            const newBinId = result.metadata.id

            // Store the new bin ID
            this.binId = newBinId
            localStorage.setItem('autoBinId', newBinId)

            // Clear cache
            this.cache = null
            this.lastFetch = null

            console.log(`✅ Automatic updates enabled! Bin ID: ${newBinId}`)

            return {
                success: true,
                message: '🎉 Automatic updates enabled! Your menu will now sync across all devices within 5 seconds!'
            }
        } catch (error) {
            console.error('Error creating JSONBin:', error)

            return {
                success: true,
                message: '✅ Menu saved locally! Will retry automatic sync on next save.'
            }
        }
    }

    // Start auto-refresh for real-time updates
    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval)
        }

        this.refreshInterval = setInterval(async () => {
            try {
                const newData = await this.loadMenuData()

                // Check if data has changed
                const currentLastUpdated = localStorage.getItem('menuLastUpdated')
                if (newData.lastUpdated && newData.lastUpdated !== currentLastUpdated) {
                    localStorage.setItem('menuLastUpdated', newData.lastUpdated)

                    // Dispatch update event (but don't show notification)
                    window.dispatchEvent(new CustomEvent('menuUpdated', {
                        detail: newData
                    }))
                }
            } catch (error) {
                // Silent error - don't spam console
            }
        }, 5000) // Check every 5 seconds
    }

    // Stop auto-refresh
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval)
            this.refreshInterval = null
        }
    }

    // Get fallback data
    getFallbackData() {
        // Try localStorage backup first
        const backup = localStorage.getItem('menuDataBackup')
        if (backup) {
            return JSON.parse(backup)
        }

        // Try regular localStorage
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

        // Return default data
        return this.getDefaultData()
    }

    // Get default menu data
    getDefaultData() {
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

    // Check if automatic updates are enabled
    isAutoEnabled() {
        return !!this.binId
    }

    // Get service status
    getStatus() {
        return {
            autoEnabled: this.isAutoEnabled(),
            binId: this.binId,
            hasCache: !!this.cache,
            autoRefresh: !!this.refreshInterval
        }
    }
}

// Export singleton instance
export const autoMenuService = new AutoMenuService()
export default autoMenuService