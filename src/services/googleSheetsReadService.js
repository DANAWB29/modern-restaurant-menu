// Google Sheets Read-Only Service
// Reads menu data from public Google Sheet
// All devices read from the same sheet = cross-device sync!

class GoogleSheetsReadService {
    constructor() {
        // Your Google Sheet ID
        this.SHEET_ID = '1NLg6RnP0LkRJaSJSgHuVnWIAjphF-L2foopiVach0Js'
        this.cache = null
        this.lastFetch = null
        this.cacheTimeout = 10000 // 10 seconds
        this.refreshInterval = null
    }

    // Initialize the service
    async initialize() {
        console.log('🚀 Initializing Google Sheets service...')

        // Start auto-refresh
        this.startAutoRefresh()

        // Load initial data
        return await this.loadMenuData()
    }

    // Load menu data from Google Sheets
    async loadMenuData() {
        try {
            console.log('📡 Loading menu from Google Sheets...')

            // Use Google Sheets public API (no auth needed)
            const url = `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/gviz/tq?tqx=out:json&sheet=menu_items`

            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            // Parse Google Sheets response (it's wrapped in a function call)
            const text = await response.text()
            const jsonString = text.substring(47).slice(0, -2) // Remove wrapper
            const data = JSON.parse(jsonString)

            // Convert to our format
            const menuItems = this.parseGoogleSheetsData(data)

            const menuData = {
                lastUpdated: new Date().toISOString(),
                syncId: Date.now(),
                categories: this.getCategories(),
                items: menuItems
            }

            // Update cache
            this.cache = menuData
            this.lastFetch = Date.now()

            // Save backup locally
            localStorage.setItem('menuDataBackup', JSON.stringify(menuData))

            console.log('✅ Menu loaded from Google Sheets:', menuItems.length, 'items')
            return menuData

        } catch (error) {
            console.error('❌ Error loading from Google Sheets:', error)
            return this.getFallbackData()
        }
    }

    // Parse Google Sheets data
    parseGoogleSheetsData(data) {
        try {
            const rows = data.table.rows
            const menuItems = []

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i]
                if (row.c && row.c.length >= 6) {
                    const item = {
                        id: row.c[0]?.v || Date.now() + i,
                        name: row.c[1]?.v || '',
                        description: row.c[2]?.v || '',
                        price: parseFloat(row.c[3]?.v) || 0,
                        category: row.c[4]?.v || 'lunch',
                        image: row.c[5]?.v || '',
                        featured: row.c[6]?.v === 'TRUE' || row.c[6]?.v === true
                    }

                    if (item.name && item.price > 0) {
                        menuItems.push(item)
                    }
                }
            }

            return menuItems
        } catch (error) {
            console.error('❌ Error parsing Google Sheets data:', error)
            return []
        }
    }

    // Save menu data to Google Sheets via Apps Script
    async saveMenuData(items) {
        try {
            console.log('💾 Saving', items.length, 'items to Google Sheets...')

            // Your Google Apps Script URL
            const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwKjkuFG-ek1cwW_94k3Te7pQ0cfDSOsfmROykxrEcq4EW_CEDKTxtX6Eca1gD1gMgp/exec'

            // Prepare data for Google Sheets
            const sheetsData = items.map(item => ({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                image: item.image || '',
                featured: item.featured ? 'TRUE' : 'FALSE'
            }))

            // Use form data to avoid CORS preflight
            const formData = new URLSearchParams()
            formData.append('action', 'updateMenu')
            formData.append('data', JSON.stringify(sheetsData))

            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (result.success) {
                // Clear cache to force refresh
                this.cache = null
                this.lastFetch = null

                // Save backup locally
                localStorage.setItem('menuItems', JSON.stringify(items))

                // Create menu data
                const menuData = {
                    lastUpdated: new Date().toISOString(),
                    syncId: Date.now(),
                    categories: this.getCategories(),
                    items: items
                }

                localStorage.setItem('menuDataBackup', JSON.stringify(menuData))

                // Broadcast to other tabs
                window.dispatchEvent(new CustomEvent('menuUpdated', {
                    detail: menuData
                }))

                console.log('✅ Menu saved to Google Sheets!')

                return {
                    success: true,
                    message: '🚀 Menu updated! Changes are live across ALL devices within 10 seconds!'
                }
            } else {
                throw new Error(result.error || 'Unknown error')
            }

        } catch (error) {
            console.error('❌ Error saving to Google Sheets:', error)

            // Fallback to local storage
            localStorage.setItem('menuItems', JSON.stringify(items))

            return {
                success: false,
                message: `❌ Failed to sync to Google Sheets: ${error.message}. Saved locally.`
            }
        }
    }

    // Start auto-refresh
    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval)
        }

        console.log('🔄 Starting auto-refresh every 10 seconds...')

        this.refreshInterval = setInterval(async () => {
            try {
                const newData = await this.loadMenuData()

                // Check if data changed
                const currentSyncId = localStorage.getItem('lastSyncId')
                if (newData.syncId && newData.syncId.toString() !== currentSyncId) {
                    localStorage.setItem('lastSyncId', newData.syncId.toString())

                    console.log('📱 New data from Google Sheets! Broadcasting...')

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

    // Get categories
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
        const backup = localStorage.getItem('menuDataBackup')
        if (backup) {
            try {
                return JSON.parse(backup)
            } catch (e) {
                console.warn('⚠️ Invalid backup')
            }
        }

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

        return {
            lastUpdated: new Date().toISOString(),
            syncId: Date.now(),
            categories: this.getCategories(),
            items: []
        }
    }

    // Get status
    getStatus() {
        return {
            isConfigured: true,
            hasCache: !!this.cache,
            autoRefresh: !!this.refreshInterval,
            method: 'Google Sheets (Read-Only)'
        }
    }

    // Cleanup
    cleanup() {
        this.stopAutoRefresh()
    }
}

// Export singleton
export const googleSheetsReadService = new GoogleSheetsReadService()
export default googleSheetsReadService