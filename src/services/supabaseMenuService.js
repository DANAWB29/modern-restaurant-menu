// Supabase Menu Service - Real-time database with zero configuration
// Free tier: 50,000 monthly active users, 500MB database, real-time subscriptions

class SupabaseMenuService {
    constructor() {
        // Supabase configuration - you'll get these from your Supabase project
        this.supabaseUrl = 'https://your-project.supabase.co'
        this.supabaseKey = 'your-anon-key-here'
        this.supabase = null
        this.subscription = null
    }

    // Initialize Supabase
    async initialize() {
        try {
            // Import Supabase client
            const { createClient } = await import('@supabase/supabase-js')

            // Create client
            this.supabase = createClient(this.supabaseUrl, this.supabaseKey)

            // Set up real-time subscription
            this.setupRealtimeSubscription()

            return await this.loadMenuData()
        } catch (error) {
            console.error('Supabase initialization failed:', error)
            return this.getFallbackData()
        }
    }

    // Set up real-time subscription for instant updates
    setupRealtimeSubscription() {
        if (!this.supabase) return

        this.subscription = this.supabase
            .channel('menu_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'menu_items' },
                (payload) => {
                    console.log('Real-time update received:', payload)
                    this.loadMenuData().then(data => {
                        window.dispatchEvent(new CustomEvent('menuUpdated', { detail: data }))
                    })
                }
            )
            .subscribe()
    }

    // Load menu data from Supabase
    async loadMenuData() {
        if (!this.supabase) return this.getFallbackData()

        try {
            const { data, error } = await this.supabase
                .from('menu_items')
                .select('*')
                .order('id', { ascending: true })

            if (error) throw error

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
                items: data || []
            }

            // Store locally as backup
            localStorage.setItem('menuDataBackup', JSON.stringify(menuData))

            return menuData
        } catch (error) {
            console.error('Error loading from Supabase:', error)
            return this.getFallbackData()
        }
    }

    // Save menu item to Supabase
    async saveMenuItem(item) {
        if (!this.supabase) {
            return { success: false, error: 'Supabase not initialized' }
        }

        try {
            const { data, error } = await this.supabase
                .from('menu_items')
                .upsert(item)
                .select()

            if (error) throw error

            return {
                success: true,
                message: '🚀 Menu updated instantly! All devices see changes immediately!',
                data
            }
        } catch (error) {
            console.error('Error saving to Supabase:', error)
            return { success: false, error: error.message }
        }
    }

    // Delete menu item from Supabase
    async deleteMenuItem(id) {
        if (!this.supabase) {
            return { success: false, error: 'Supabase not initialized' }
        }

        try {
            const { error } = await this.supabase
                .from('menu_items')
                .delete()
                .eq('id', id)

            if (error) throw error

            return {
                success: true,
                message: '✅ Menu item deleted! Change is live on all devices!'
            }
        } catch (error) {
            console.error('Error deleting from Supabase:', error)
            return { success: false, error: error.message }
        }
    }

    // Get fallback data
    getFallbackData() {
        const backup = localStorage.getItem('menuDataBackup')
        if (backup) return JSON.parse(backup)

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
            items: []
        }
    }

    // Check if configured
    isConfigured() {
        return this.supabaseUrl !== 'https://your-project.supabase.co'
    }

    // Cleanup
    cleanup() {
        if (this.subscription) {
            this.supabase.removeChannel(this.subscription)
        }
    }
}

export const supabaseMenuService = new SupabaseMenuService()
export default supabaseMenuService