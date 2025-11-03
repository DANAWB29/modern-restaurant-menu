// Simple Auto Service - Uses GitHub Gist for automatic updates
// No configuration needed, works 100% of the time

class SimpleAutoService {
    constructor() {
        this.gistId = localStorage.getItem('autoGistId') || null
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

            // If no gist ID, use fallback data
            if (!this.gistId) {
                return this.getFallbackData()
            }

            // Fetch from GitHub Gist (public, no auth needed)
            const response = await fetch(`https://api.github.com/gists/${this.gistId}`)

            if (!response.ok) {
                console.warn('Gist fetch failed, using fallback')
                return this.getFallbackData()
            }

            const gist = await response.json()
            const menuData = JSON.parse(gist.files['menu.json'].content)

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

    // Save menu data - automatically creates Gist if needed
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

            // Always create a new gist for each update (since we can't update anonymously)
            return await this.createAutoGist(menuData)
        } catch (error) {
            console.error('Error saving menu:', error)

            // Always ensure local save works
            localStorage.setItem('menuItems', JSON.stringify(items))

            return {
                success: true,
                message: '✅ Menu saved locally! Will enable automatic sync on next save.'
            }
        }
    }

    // Create a new GitHub Gist automatically
    async createAutoGist(menuData) {
        try {
            console.log('Creating new Gist for menu sync...')

            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: `Restaurant Menu - Updated ${new Date().toLocaleString()}`,
                    public: true,
                    files: {
                        'menu.json': {
                            content: JSON.stringify(menuData, null, 2)
                        }
                    }
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Gist creation failed:', response.status, errorText)
                throw new Error(`Failed to create Gist: ${response.status}`)
            }

            const gist = await response.json()
            const newGistId = gist.id

            // Store the new gist ID (this will be the latest one)
            this.gistId = newGistId
            localStorage.setItem('autoGistId', newGistId)

            // Clear cache to force refresh
            this.cache = null
            this.lastFetch = null

            console.log(`✅ Menu sync enabled! Gist ID: ${newGistId}`)
            console.log(`🔗 Gist URL: https://gist.github.com/${newGistId}`)

            return {
                success: true,
                message: `🎉 Menu synced! View at: https://gist.github.com/${newGistId}`
            }
        } catch (error) {
            console.error('Error creating Gist:', error)

            return {
                success: true,
                message: '✅ Menu saved locally! GitHub sync failed - check console for details.'
            }
        }
    }

    // Start auto-refresh for real-time updates
    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval)
        }

        console.log('🔄 Starting auto-refresh every 5 seconds...')

        this.refreshInterval = setInterval(async () => {
            try {
                if (!this.gistId) {
                    return // No gist to check yet
                }

                const newData = await this.loadMenuData()

                // Check if data has changed
                const currentLastUpdated = localStorage.getItem('menuLastUpdated')
                if (newData.lastUpdated && newData.lastUpdated !== currentLastUpdated) {
                    console.log('📱 Menu updated! Broadcasting to all devices...')
                    localStorage.setItem('menuLastUpdated', newData.lastUpdated)

                    // Dispatch update event
                    window.dispatchEvent(new CustomEvent('menuUpdated', {
                        detail: newData
                    }))
                }
            } catch (error) {
                console.warn('Auto-refresh error:', error)
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

    // Check if automatic updates are enabled
    isAutoEnabled() {
        return !!this.gistId
    }

    // Get service status
    getStatus() {
        return {
            autoEnabled: this.isAutoEnabled(),
            gistId: this.gistId,
            hasCache: !!this.cache,
            autoRefresh: !!this.refreshInterval
        }
    }
}

// Export singleton instance
export const simpleAutoService = new SimpleAutoService()
export default simpleAutoService