// Global Menu Service
// Handles loading and saving menu data globally across all devices

class MenuService {
    constructor() {
        this.baseUrl = window.location.origin
        this.menuUrl = `${this.baseUrl}/menu-data.json`
        this.cache = null
        this.lastFetch = null
        this.cacheTimeout = 30000 // 30 seconds
    }

    // Load menu data from server (global)
    async loadMenuData() {
        try {
            // Check cache first
            if (this.cache && this.lastFetch && (Date.now() - this.lastFetch < this.cacheTimeout)) {
                return this.cache
            }

            const response = await fetch(this.menuUrl + '?t=' + Date.now()) // Cache busting
            if (!response.ok) {
                throw new Error('Failed to fetch menu data')
            }

            const data = await response.json()

            // Update cache
            this.cache = data
            this.lastFetch = Date.now()

            return data
        } catch (error) {
            console.error('Error loading menu data:', error)

            // Fallback to localStorage
            const localData = localStorage.getItem('menuItems')
            if (localData) {
                return {
                    items: JSON.parse(localData),
                    categories: [
                        { id: 'all', name: 'All Items', icon: '🍽️' },
                        { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
                        { id: 'lunch', name: 'Lunch', icon: '🌞' },
                        { id: 'dinner', name: 'Dinner', icon: '🌙' },
                        { id: 'drinks', name: 'Drinks', icon: '🥤' },
                        { id: 'desserts', name: 'Desserts', icon: '🍰' }
                    ]
                }
            }

            // Final fallback to sample data
            const { sampleMenuItems, menuCategories } = await import('../data/menuData.js')
            return {
                items: sampleMenuItems,
                categories: menuCategories
            }
        }
    }

    // Save menu data (for admin)
    async saveMenuData(items) {
        try {
            // For now, save to localStorage and show instructions
            // In production, this would save to your backend/database
            localStorage.setItem('menuItems', JSON.stringify(items))
            localStorage.setItem('menuLastUpdated', new Date().toISOString())

            // Clear cache to force refresh
            this.cache = null
            this.lastFetch = null

            // Show instructions for manual update
            this.showUpdateInstructions(items)

            return { success: true }
        } catch (error) {
            console.error('Error saving menu data:', error)
            return { success: false, error: error.message }
        }
    }

    // Show instructions for updating the global menu file
    showUpdateInstructions(items) {
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

        // Create downloadable JSON file
        const dataStr = JSON.stringify(menuData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)

        // Create download link
        const link = document.createElement('a')
        link.href = url
        link.download = 'menu-data.json'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        // Show instructions
        setTimeout(() => {
            alert(`📋 IMPORTANT: To update the menu globally for all devices:

1. A file 'menu-data.json' has been downloaded
2. Replace the file in your project's 'public' folder
3. Redeploy your website to Vercel/hosting service
4. All devices will see the updated menu!

For automatic updates, consider upgrading to a backend solution.`)
        }, 500)
    }

    // Check if menu data is stale
    async isMenuStale() {
        try {
            const response = await fetch(this.menuUrl, { method: 'HEAD' })
            const lastModified = response.headers.get('last-modified')
            const localLastUpdated = localStorage.getItem('menuLastUpdated')

            if (!localLastUpdated || !lastModified) return false

            return new Date(lastModified) > new Date(localLastUpdated)
        } catch (error) {
            return false
        }
    }

    // Force refresh menu data
    async refreshMenuData() {
        this.cache = null
        this.lastFetch = null
        return await this.loadMenuData()
    }
}

// Export singleton instance
export const menuService = new MenuService()
export default menuService