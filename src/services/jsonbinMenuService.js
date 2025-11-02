// JSONBin Real-time Menu Service
// Uses JSONBin.io free service for automatic global updates

class JSONBinMenuService {
    constructor() {
        // JSONBin configuration - free service, no signup required for read
        this.binId = 'YOUR_BIN_ID' // You'll get this after creating a bin
        this.apiKey = 'YOUR_API_KEY' // Optional, for write access
        this.baseUrl = 'https://api.jsonbin.io/v3'

        this.cache = null
        this.lastFetch = null
        this.cacheTimeout = 5000 // 5 seconds
        this.refreshInterval = null
    }

    // Initialize the service
    async initialize() {
        // Start auto-refresh
        this.startAutoRefresh()
        return await this.loadMenuData()
    }

    // Load menu data from JSONBin
    async loadMenuData() {
        try {
            // Check cache first
            if (this.cache && this.lastFetch && (Date.now() - this.lastFetch < this.cacheTimeout)) {
                return this.cache
            }

            // If no bin ID configured, use fallback
            if (this.binId === 'YOUR_BIN_ID') {
                return this.getFallbackData()
            }

            const response = await fetch(`${this.baseUrl}/b/${this.binId}/latest`, {
                headers: {
                    'X-Master-Key': this.apiKey || '',
                }
            })

            if (!response.ok) {
                throw new Error(`JSONBin fetch failed: ${response.status}`)
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
            console.error('Error loading from JSONBin:', error)
            return this.getFallbackData()
        }
    }

    // Save menu data to JSONBin
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

            // If not configured, create a new bin automatically
            if (this.binId === 'YOUR_BIN_ID') {
                return await this.createNewBin(menuData)
            }

            // Update existing bin
            const response = await fetch(`${this.baseUrl}/b/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey || '',
                },
                body: JSON.stringify(menuData)
            })

            if (!response.ok) {
                throw new Error(`JSONBin save failed: ${response.status}`)
            }

            // Clear cache to force refresh
            this.cache = null
            this.lastFetch = null

            // Update local storage
            localStorage.setItem('menuItems', JSON.stringify(items))

            return {
                success: true,
                message: 'Menu updated successfully! Changes will appear on all devices within 5 seconds! 🚀'
            }
        } catch (error) {
            console.error('Error saving to JSONBin:', error)
            return this.fallbackSave(items)
        }
    }

    // Create a new JSONBin automatically
    async createNewBin(menuData) {
        try {
            const response = await fetch(`${this.baseUrl}/b`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Bin-Name': 'restaurant-menu-' + Date.now(),
                    'X-Bin-Private': 'false', // Public read access
                },
                body: JSON.stringify(menuData)
            })

            if (!response.ok) {
                throw new Error(`Failed to create JSONBin: ${response.status}`)
            }

            const result = await response.json()
            const newBinId = result.metadata.id

            // Update configuration
            this.binId = newBinId
            localStorage.setItem('jsonbinId', newBinId)

            // Show setup instructions
            this.showSetupInstructions(newBinId)

            return {
                success: true,
                message: 'Menu saved! New JSONBin created. Check console for setup instructions.'
            }
        } catch (error) {
            console.error('Error creating JSONBin:', error)
            return this.fallbackSave(menuData.items)
        }
    }

    // Show setup instructions
    showSetupInstructions(binId) {
        console.log(`
🎉 JSONBin Setup Complete!

Your menu is now stored at: https://api.jsonbin.io/v3/b/${binId}/latest

To enable automatic updates:
1. Update src/services/jsonbinMenuService.js
2. Change: this.binId = '${binId}'
3. Redeploy your app

Your menu will now update automatically across all devices!
    `)

        // Also show in alert
        setTimeout(() => {
            alert(`✅ Automatic updates enabled!

Your Bin ID: ${binId}

To make this permanent:
1. Update the binId in jsonbinMenuService.js
2. Redeploy your app

All devices will now sync automatically!`)
        }, 1000)
    }

    // Fallback save when JSONBin is not available
    fallbackSave(items) {
        localStorage.setItem('menuItems', JSON.stringify(items))
        return {
            success: true,
            message: 'Menu saved locally. JSONBin not configured for real-time updates.'
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

                    // Dispatch update event
                    window.dispatchEvent(new CustomEvent('menuUpdated', {
                        detail: newData
                    }))
                }
            } catch (error) {
                console.error('Auto-refresh error:', error)
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
                }
            ]
        }
    }

    // Check if service is configured
    isConfigured() {
        return this.binId !== 'YOUR_BIN_ID'
    }

    // Get service status
    getStatus() {
        return {
            configured: this.isConfigured(),
            binId: this.binId,
            hasCache: !!this.cache,
            autoRefresh: !!this.refreshInterval
        }
    }
}

// Export singleton instance
export const jsonbinMenuService = new JSONBinMenuService()
export default jsonbinMenuService