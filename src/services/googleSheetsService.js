// Google Sheets Service - Real-time menu data management
// Uses Google Sheets API for reading and Google Apps Script for writing

class GoogleSheetsService {
    constructor() {
        // Replace with your actual Google Sheets ID and Apps Script URL
        this.SHEET_ID = '1NLg6RnP0LkRJaSJSgHuVnWIAjphF-L2foopiVach0Js'
        this.APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwKjkuFG-ek1cwW_94k3Te7pQ0cfDSOsfmROykxrEcq4EW_CEDKTxtX6Eca1gD1gMgp/exec'

        this.cache = null
        this.lastFetch = null
        this.cacheTimeout = 10000 // 10 seconds cache
        this.refreshInterval = null
    }

    // Initialize the service and start auto-refresh
    async initialize() {
        console.log('🚀 Initializing Google Sheets service...')

        // Start auto-refresh for real-time updates
        this.startAutoRefresh()

        // Load initial data
        return await this.loadMenuData()
    }

    // Load menu data from Google Sheets
    async loadMenuData() {
        try {
            // Check cache first
            if (this.cache && this.lastFetch && (Date.now() - this.lastFetch < this.cacheTimeout)) {
                console.log('📋 Using cached menu data')
                return this.cache
            }

            console.log('📡 Fetching menu data from Google Sheets...')

            // Check if configuration is set
            if (this.SHEET_ID === 'YOUR_GOOGLE_SHEET_ID') {
                console.warn('⚠️ Google Sheets not configured. Using fallback data.')
                return this.getFallbackData()
            }

            // Fetch data from Google Sheets using the public API
            const response = await fetch(
                `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/gviz/tq?tqx=out:json&sheet=menu_items`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            // Parse the Google Sheets response (it's wrapped in a function call)
            const text = await response.text()
            const jsonString = text.substring(47).slice(0, -2) // Remove wrapper
            const data = JSON.parse(jsonString)

            // Convert Google Sheets data to our format
            const menuItems = this.parseGoogleSheetsData(data)

            const menuData = {
                lastUpdated: new Date().toISOString(),
                categories: this.getCategories(),
                items: menuItems
            }

            // Update cache
            this.cache = menuData
            this.lastFetch = Date.now()

            // Save backup to localStorage
            localStorage.setItem('menuDataBackup', JSON.stringify(menuData))

            console.log('✅ Menu loaded from Google Sheets:', menuItems.length, 'items')
            return menuData

        } catch (error) {
            console.error('❌ Error loading menu from Google Sheets:', error)
            return this.getFallbackData()
        }
    }

    // Parse Google Sheets data format
    parseGoogleSheetsData(data) {
        try {
            const rows = data.table.rows
            const menuItems = []

            // Skip header row, process data rows
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i]
                if (row.c && row.c.length >= 6) {
                    const item = {
                        id: row.c[0]?.v || Date.now() + i, // ID
                        name: row.c[1]?.v || '', // Name
                        description: row.c[2]?.v || '', // Description
                        price: parseFloat(row.c[3]?.v) || 0, // Price
                        category: row.c[4]?.v || 'lunch', // Category
                        image: row.c[5]?.v || '', // Image URL
                        featured: row.c[6]?.v === 'TRUE' || false // Featured
                    }

                    // Only add items with valid name and price
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

    // Save menu data - Development mode (CORS workaround)
    async saveMenuData(items) {
        try {
            console.log('💾 Saving', items.length, 'items to Google Sheets...')

            // For development, we'll use a different approach
            // In production (when deployed), this will work fine

            // Always save locally first
            localStorage.setItem('menuItems', JSON.stringify(items))

            // Check if we're in development mode (localhost)
            const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

            if (isDevelopment) {
                console.log('🔧 Development mode detected - using local storage with sync simulation')

                // Simulate successful save and trigger real-time updates
                setTimeout(() => {
                    // Clear cache to force refresh
                    this.cache = null
                    this.lastFetch = null

                    // Create updated menu data
                    const menuData = {
                        lastUpdated: new Date().toISOString(),
                        categories: this.getCategories(),
                        items: items
                    }

                    // Update cache
                    this.cache = menuData
                    this.lastFetch = Date.now()

                    // Save backup
                    localStorage.setItem('menuDataBackup', JSON.stringify(menuData))

                    // Dispatch update event for real-time UI updates
                    window.dispatchEvent(new CustomEvent('menuUpdated', {
                        detail: menuData
                    }))

                    console.log('📱 Development sync completed - changes broadcasted')
                }, 500) // Small delay to simulate network request

                return {
                    success: true,
                    message: '🚀 Menu updated! (Development mode - changes are live locally. Deploy to production for full Google Sheets sync)'
                }
            }

            // Production mode - use JSONP approach to bypass CORS
            if (this.APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
                throw new Error('Google Apps Script URL not configured')
            }

            // Use JSONP approach to bypass CORS completely
            const success = await this.saveViaJSONP(items)

            if (success) {
                // Clear cache to force refresh
                this.cache = null
                this.lastFetch = null

                console.log('✅ Menu saved to Google Sheets successfully')

                return {
                    success: true,
                    message: '🚀 Menu updated! Changes are live across all devices instantly!'
                }
            } else {
                throw new Error('JSONP request failed')
            }

        } catch (error) {
            console.error('❌ Error saving to Google Sheets:', error)

            // Fallback to local storage
            localStorage.setItem('menuItems', JSON.stringify(items))

            return {
                success: false,
                message: `❌ Failed to sync with Google Sheets: ${error.message}. Saved locally.`
            }
        }
    }

    // Save via JSONP to bypass CORS (works in all environments)
    async saveViaJSONP(items) {
        return new Promise((resolve) => {
            try {
                // Prepare data for Google Sheets format
                const sheetsData = items.map(item => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    category: item.category,
                    image: item.image || '',
                    featured: item.featured ? 'TRUE' : 'FALSE'
                }))

                // Create callback function name
                const callbackName = 'menuCallback_' + Date.now()

                // Create global callback function
                window[callbackName] = (result) => {
                    // Clean up
                    document.head.removeChild(script)
                    delete window[callbackName]

                    resolve(result && result.success)
                }

                // Create script element for JSONP
                const script = document.createElement('script')

                // Encode data as URL parameters
                const params = new URLSearchParams({
                    action: 'updateMenu',
                    data: JSON.stringify(sheetsData),
                    callback: callbackName
                })

                script.src = `${this.APPS_SCRIPT_URL}?${params.toString()}`

                // Handle errors
                script.onerror = () => {
                    document.head.removeChild(script)
                    delete window[callbackName]
                    resolve(false)
                }

                // Add script to head to trigger request
                document.head.appendChild(script)

                // Timeout after 10 seconds
                setTimeout(() => {
                    if (window[callbackName]) {
                        document.head.removeChild(script)
                        delete window[callbackName]
                        resolve(false)
                    }
                }, 10000)

            } catch (error) {
                console.error('JSONP error:', error)
                resolve(false)
            }
        })
    }

    // Start auto-refresh for real-time updates
    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval)
        }

        console.log('🔄 Starting auto-refresh every 15 seconds...')

        this.refreshInterval = setInterval(async () => {
            try {
                const newData = await this.loadMenuData()

                // Check if data has changed
                const currentLastUpdated = localStorage.getItem('menuLastUpdated')
                if (newData.lastUpdated && newData.lastUpdated !== currentLastUpdated) {
                    localStorage.setItem('menuLastUpdated', newData.lastUpdated)

                    console.log('📱 Menu updated! Broadcasting to all components...')

                    // Dispatch update event for real-time UI updates
                    window.dispatchEvent(new CustomEvent('menuUpdated', {
                        detail: newData
                    }))
                }
            } catch (error) {
                console.warn('⚠️ Auto-refresh error:', error)
            }
        }, 15000) // Check every 15 seconds
    }

    // Stop auto-refresh
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval)
            this.refreshInterval = null
            console.log('⏹️ Auto-refresh stopped')
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

    // Get fallback data when Google Sheets is unavailable
    getFallbackData() {
        // Try localStorage backup first
        const backup = localStorage.getItem('menuDataBackup')
        if (backup) {
            try {
                console.log('📋 Using localStorage backup')
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
                    lastUpdated: new Date().toISOString()
                }
            } catch (e) {
                console.warn('⚠️ Invalid saved items')
            }
        }

        // Return default sample data
        console.log('📋 Using default sample data')
        return {
            lastUpdated: new Date().toISOString(),
            categories: this.getCategories(),
            items: [
                // Breakfast Items
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
                    name: 'Avocado Toast',
                    price: 9.99,
                    category: 'breakfast',
                    description: 'Sourdough bread topped with smashed avocado, cherry tomatoes, and feta',
                    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
                    featured: false
                },
                {
                    id: 3,
                    name: 'Eggs Benedict',
                    price: 14.99,
                    category: 'breakfast',
                    description: 'Poached eggs on English muffins with Canadian bacon and hollandaise',
                    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop',
                    featured: true
                },
                {
                    id: 4,
                    name: 'French Toast',
                    price: 11.99,
                    category: 'breakfast',
                    description: 'Thick-cut brioche with cinnamon, vanilla, and powdered sugar',
                    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop',
                    featured: false
                },

                // Lunch Items
                {
                    id: 5,
                    name: 'Gourmet Burger',
                    price: 18.99,
                    category: 'lunch',
                    description: 'Wagyu beef patty with truffle aioli, arugula, and aged cheddar',
                    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
                    featured: true
                },
                {
                    id: 6,
                    name: 'Caesar Salad',
                    price: 13.99,
                    category: 'lunch',
                    description: 'Crisp romaine lettuce with parmesan, croutons, and house Caesar dressing',
                    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
                    featured: false
                },
                {
                    id: 7,
                    name: 'Chicken Club Sandwich',
                    price: 15.99,
                    category: 'lunch',
                    description: 'Grilled chicken breast with bacon, lettuce, tomato, and mayo on sourdough',
                    image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop',
                    featured: false
                },
                {
                    id: 8,
                    name: 'Fish Tacos',
                    price: 16.99,
                    category: 'lunch',
                    description: 'Blackened mahi-mahi with cabbage slaw and chipotle crema',
                    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
                    featured: true
                },

                // Dinner Items
                {
                    id: 9,
                    name: 'Grilled Salmon',
                    price: 24.99,
                    category: 'dinner',
                    description: 'Atlantic salmon with lemon herb butter and seasonal vegetables',
                    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
                    featured: true
                },
                {
                    id: 10,
                    name: 'Ribeye Steak',
                    price: 32.99,
                    category: 'dinner',
                    description: '12oz prime ribeye with garlic mashed potatoes and asparagus',
                    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
                    featured: true
                },
                {
                    id: 11,
                    name: 'Lobster Risotto',
                    price: 28.99,
                    category: 'dinner',
                    description: 'Creamy arborio rice with fresh lobster, peas, and parmesan',
                    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop',
                    featured: false
                },

                // Drinks
                {
                    id: 12,
                    name: 'Fresh Orange Juice',
                    price: 4.99,
                    category: 'drinks',
                    description: 'Freshly squeezed Valencia oranges',
                    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop',
                    featured: false
                },
                {
                    id: 13,
                    name: 'Craft Coffee',
                    price: 3.99,
                    category: 'drinks',
                    description: 'Single-origin Ethiopian beans, expertly roasted',
                    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
                    featured: false
                },

                // Desserts
                {
                    id: 14,
                    name: 'Chocolate Lava Cake',
                    price: 8.99,
                    category: 'desserts',
                    description: 'Warm chocolate cake with molten center and vanilla ice cream',
                    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
                    featured: true
                },
                {
                    id: 15,
                    name: 'Tiramisu',
                    price: 7.99,
                    category: 'desserts',
                    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
                    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
                    featured: false
                }
            ]
        }
    }

    // Get service status
    getStatus() {
        return {
            isConfigured: this.SHEET_ID !== 'YOUR_GOOGLE_SHEET_ID' && this.APPS_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL',
            hasCache: !!this.cache,
            autoRefresh: !!this.refreshInterval,
            sheetId: this.SHEET_ID,
            appsScriptUrl: this.APPS_SCRIPT_URL
        }
    }

    // Cleanup
    cleanup() {
        this.stopAutoRefresh()
    }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService()
export default googleSheetsService