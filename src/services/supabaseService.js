import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

class SupabaseService {
    constructor() {
        this.supabase = null
        this.isInitialized = false
        this.cache = null
        this.lastFetch = null
        this.cacheTimeout = 5000 // 5 seconds
    }

    // Initialize Supabase client
    async initialize() {
        try {
            console.log('🔧 Initializing Supabase...')
            console.log('📍 URL:', SUPABASE_URL)
            console.log('🔑 Key:', SUPABASE_ANON_KEY ? 'Present' : 'Missing')

            if (!SUPABASE_URL || !SUPABASE_ANON_KEY ||
                SUPABASE_URL === 'YOUR_SUPABASE_URL' ||
                SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
                console.warn('⚠️ Supabase not configured. Using fallback data.')
                return this.getFallbackData()
            }

            this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
            this.isInitialized = true

            console.log('✅ Supabase initialized successfully')

            // Test connection
            const { data, error } = await this.supabase.from('menu_items').select('count', { count: 'exact' })
            if (error) {
                console.error('❌ Supabase connection test failed:', error)
            } else {
                console.log('✅ Supabase connection test passed')
            }

            // Set up real-time subscription
            this.setupRealtimeSubscription()

            // Load initial data
            return await this.loadMenuData()
        } catch (error) {
            console.error('❌ Supabase initialization failed:', error)
            return this.getFallbackData()
        }
    }

    // Set up real-time subscription for menu updates
    setupRealtimeSubscription() {
        if (!this.supabase) return

        try {
            this.supabase
                .channel('menu_updates')
                .on('postgres_changes',
                    { event: '*', schema: 'public', table: 'menu_items' },
                    (payload) => {
                        console.log('🔄 Real-time update received:', payload)
                        this.handleRealtimeUpdate(payload)
                    }
                )
                .subscribe((status) => {
                    console.log('📡 Real-time subscription status:', status)
                })

            console.log('👂 Real-time subscription active')
        } catch (error) {
            console.warn('⚠️ Real-time subscription failed:', error)
        }
    }

    // Handle real-time updates
    handleRealtimeUpdate(payload) {
        // Clear cache to force fresh data load
        this.cache = null
        this.lastFetch = null

        // Dispatch update event
        window.dispatchEvent(new CustomEvent('menuUpdated', {
            detail: { type: 'realtime', payload }
        }))
    }

    // Load menu data
    async loadMenuData() {
        try {
            // Check cache first
            if (this.cache && this.lastFetch && (Date.now() - this.lastFetch < this.cacheTimeout)) {
                return this.cache
            }

            if (!this.supabase) {
                return this.getFallbackData()
            }

            const { data, error } = await this.supabase
                .from('menu_items')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('❌ Error loading menu from Supabase:', error)
                return this.getFallbackData()
            }

            const menuData = {
                lastUpdated: new Date().toISOString(),
                categories: this.getCategories(),
                items: data || []
            }

            // Update cache
            this.cache = menuData
            this.lastFetch = Date.now()

            // Save backup to localStorage
            localStorage.setItem('menuDataBackup', JSON.stringify(menuData))

            console.log('✅ Menu loaded from Supabase:', data?.length, 'items')
            return menuData

        } catch (error) {
            console.error('❌ Error loading menu:', error)
            return this.getFallbackData()
        }
    }

    // Save menu data
    async saveMenuData(items) {
        try {
            console.log('💾 Attempting to save', items.length, 'items to Supabase')
            console.log('🔧 Supabase client:', this.supabase ? 'Available' : 'Not available')
            console.log('✅ Initialized:', this.isInitialized)

            if (!this.supabase) {
                throw new Error('Supabase not initialized')
            }

            // Test basic connection first
            console.log('🧪 Testing Supabase connection...')
            const { data: testData, error: testError } = await this.supabase
                .from('menu_items')
                .select('count', { count: 'exact' })

            if (testError) {
                console.error('❌ Connection test failed:', testError)
                throw new Error(`Connection failed: ${testError.message}`)
            }

            console.log('✅ Connection test passed, current items:', testData)

            // Clear existing items
            const { error: deleteError } = await this.supabase
                .from('menu_items')
                .delete()
                .neq('id', 0) // Delete all items

            if (deleteError) {
                console.warn('⚠️ Error clearing existing items:', deleteError)
            }

            // Insert new items
            const itemsToInsert = items.map(item => ({
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                image: item.image || null,
                featured: item.featured || false,
                original_id: item.id // Keep original ID for reference
            }))

            const { data, error } = await this.supabase
                .from('menu_items')
                .insert(itemsToInsert)
                .select()

            if (error) {
                throw error
            }

            // Clear cache to force refresh
            this.cache = null
            this.lastFetch = null

            // Save backup locally
            localStorage.setItem('menuItems', JSON.stringify(items))

            console.log('✅ Menu saved to Supabase:', data?.length, 'items')

            return {
                success: true,
                message: '🚀 Menu updated! Changes are live across all devices instantly!'
            }

        } catch (error) {
            console.error('❌ Error saving menu:', error)

            // Fallback to local storage
            localStorage.setItem('menuItems', JSON.stringify(items))

            return {
                success: false,
                message: '❌ Failed to sync with Supabase. Saved locally. Check your connection and Supabase setup.'
            }
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
        // Try localStorage backup first
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
                    lastUpdated: new Date().toISOString()
                }
            } catch (e) {
                console.warn('⚠️ Invalid saved items')
            }
        }

        // Return default data
        return {
            lastUpdated: new Date().toISOString(),
            categories: this.getCategories(),
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

    // Get service status
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            hasSupabase: !!this.supabase,
            isConfigured: SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY',
            hasCache: !!this.cache
        }
    }

    // Cleanup
    cleanup() {
        if (this.supabase) {
            this.supabase.removeAllChannels()
        }
    }
}

// Export singleton instance
export const supabaseService = new SupabaseService()
export default supabaseService