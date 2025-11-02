// Real-time Menu Service
// Uses GitHub API to store and sync menu data across all devices automatically

class RealtimeMenuService {
    constructor() {
        // GitHub configuration - you'll need to set these up
        this.githubOwner = 'DANAWB29' // Replace with your GitHub username
        this.githubRepo = 'modern-restaurant-menu' // Replace with your repo name
        this.githubToken = null // Will be set from environment or user input
        this.menuFilePath = 'public/menu-data.json'
        this.apiBase = 'https://api.github.com'

        // Cache settings
        this.cache = null
        this.lastFetch = null
        this.cacheTimeout = 10000 // 10 seconds

        // Auto-refresh settings
        this.refreshInterval = null
        this.isAutoRefreshEnabled = true
    }

    // Initialize the service
    async initialize() {
        // Try to get GitHub token from localStorage
        this.githubToken = localStorage.getItem('githubToken')

        if (!this.githubToken) {
            console.log('GitHub token not found. Admin features will be limited.')
        }

        // Start auto-refresh for all devices
        this.startAutoRefresh()

        return this.loadMenuData()
    }

    // Set GitHub token for admin operations
    setGitHubToken(token) {
        this.githubToken = token
        localStorage.setItem('githubToken', token)
    }

    // Load menu data from GitHub
    async loadMenuData() {
        try {
            // Check cache first
            if (this.cache && this.lastFetch && (Date.now() - this.lastFetch < this.cacheTimeout)) {
                return this.cache
            }

            // Fetch from GitHub raw content (public access, no token needed)
            const url = `https://raw.githubusercontent.com/${this.githubOwner}/${this.githubRepo}/main/${this.menuFilePath}?t=${Date.now()}`

            const response = await fetch(url, {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            })

            if (!response.ok) {
                throw new Error(`GitHub fetch failed: ${response.status}`)
            }

            const data = await response.json()

            // Update cache
            this.cache = data
            this.lastFetch = Date.now()

            // Store locally as backup
            localStorage.setItem('menuDataBackup', JSON.stringify(data))
            localStorage.setItem('menuLastUpdated', data.lastUpdated || new Date().toISOString())

            return data
        } catch (error) {
            console.error('Error loading menu from GitHub:', error)

            // Fallback to local backup
            const backup = localStorage.getItem('menuDataBackup')
            if (backup) {
                console.log('Using local backup menu data')
                return JSON.parse(backup)
            }

            // Final fallback to sample data
            const { sampleMenuItems, menuCategories } = await import('../data/menuData.js')
            return {
                items: sampleMenuItems,
                categories: menuCategories,
                lastUpdated: new Date().toISOString()
            }
        }
    }

    // Save menu data to GitHub (admin only)
    async saveMenuData(items) {
        if (!this.githubToken) {
            throw new Error('GitHub token required for saving. Please configure in admin panel.')
        }

        try {
            // Prepare the updated menu data
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

            // Get current file SHA (required for updates)
            const currentFile = await this.getCurrentFileSHA()

            // Update file on GitHub
            const updateUrl = `${this.apiBase}/repos/${this.githubOwner}/${this.githubRepo}/contents/${this.menuFilePath}`

            const response = await fetch(updateUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    message: `Update menu items - ${new Date().toLocaleString()}`,
                    content: btoa(JSON.stringify(menuData, null, 2)), // Base64 encode
                    sha: currentFile.sha
                })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(`GitHub API error: ${error.message}`)
            }

            // Clear cache to force refresh
            this.cache = null
            this.lastFetch = null

            // Update local storage
            localStorage.setItem('menuItems', JSON.stringify(items))
            localStorage.setItem('menuDataBackup', JSON.stringify(menuData))

            return { success: true, message: 'Menu updated successfully! Changes will appear on all devices within 10 seconds.' }
        } catch (error) {
            console.error('Error saving to GitHub:', error)
            return { success: false, error: error.message }
        }
    }

    // Get current file SHA from GitHub
    async getCurrentFileSHA() {
        const url = `${this.apiBase}/repos/${this.githubOwner}/${this.githubRepo}/contents/${this.menuFilePath}`

        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${this.githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to get file SHA: ${response.status}`)
        }

        return await response.json()
    }

    // Start auto-refresh for real-time updates
    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval)
        }

        this.refreshInterval = setInterval(async () => {
            if (this.isAutoRefreshEnabled) {
                try {
                    const newData = await this.loadMenuData()

                    // Check if data has changed
                    const currentLastUpdated = localStorage.getItem('menuLastUpdated')
                    if (newData.lastUpdated && newData.lastUpdated !== currentLastUpdated) {
                        // Dispatch custom event for components to listen to
                        window.dispatchEvent(new CustomEvent('menuUpdated', {
                            detail: newData
                        }))
                    }
                } catch (error) {
                    console.error('Auto-refresh error:', error)
                }
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

    // Enable/disable auto-refresh
    setAutoRefresh(enabled) {
        this.isAutoRefreshEnabled = enabled
        if (enabled) {
            this.startAutoRefresh()
        } else {
            this.stopAutoRefresh()
        }
    }

    // Force refresh menu data
    async forceRefresh() {
        this.cache = null
        this.lastFetch = null
        return await this.loadMenuData()
    }

    // Check if GitHub integration is configured
    isConfigured() {
        return !!(this.githubOwner && this.githubRepo && this.githubOwner !== 'YOUR_GITHUB_USERNAME')
    }

    // Check if admin can save (has token)
    canSave() {
        return !!(this.githubToken && this.isConfigured())
    }

    // Get configuration status
    getStatus() {
        return {
            configured: this.isConfigured(),
            canSave: this.canSave(),
            autoRefresh: this.isAutoRefreshEnabled,
            lastFetch: this.lastFetch,
            cacheAge: this.lastFetch ? Date.now() - this.lastFetch : null
        }
    }
}

// Export singleton instance
export const realtimeMenuService = new RealtimeMenuService()
export default realtimeMenuService