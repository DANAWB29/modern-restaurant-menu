import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown, CreditCard } from 'lucide-react'
import BackgroundSlideshow from '../components/BackgroundSlideshow'
import FeaturedCarousel from '../components/FeaturedCarousel'
import MenuCard from '../components/MenuCard'
import MenuFilters from '../components/MenuFilters'
import { sampleMenuItems, menuCategories, restaurantConfig } from '../data/menuData'
import reliableMenuService from '../services/reliableMenuService'
import toast from 'react-hot-toast'

const Home = () => {
    const [menuItems, setMenuItems] = useState(sampleMenuItems)
    const [categories, setCategories] = useState(menuCategories)
    const [activeCategory, setActiveCategory] = useState('all')
    const [priceRange, setPriceRange] = useState({ id: 'all', label: 'All Prices', min: 0, max: Infinity })
    const [loading, setLoading] = useState(true)

    // Get featured items
    const featuredItems = menuItems.filter(item => item.featured)

    // Filter menu items with safety checks
    const filteredItems = menuItems.filter(item => {
        if (!item) return false

        const matchesCategory = activeCategory === 'all' || item.category === activeCategory
        const matchesPrice = item.price >= priceRange.min && item.price <= priceRange.max
        return matchesCategory && matchesPrice
    })



    // Load menu items from real-time service
    useEffect(() => {
        initializeRealtimeMenu()

        // Listen for real-time menu updates
        const handleMenuUpdate = (event) => {
            console.log('🔄 Home.jsx received menu update:', event.detail)
            const newData = event.detail
            if (newData.items) {
                setMenuItems(newData.items)
                console.log('📱 Menu items updated in Home.jsx:', newData.items.length, 'items')
            }
            if (newData.categories) {
                setCategories(newData.categories)
            }
        }

        window.addEventListener('menuUpdated', handleMenuUpdate)

        return () => {
            window.removeEventListener('menuUpdated', handleMenuUpdate)
            if (reliableMenuService.cleanup) {
                reliableMenuService.cleanup()
            }
        }
    }, [])

    const initializeRealtimeMenu = async () => {
        try {
            const data = await reliableMenuService.initialize()
            if (data.items) {
                setMenuItems(data.items)
            }
            if (data.categories) {
                setCategories(data.categories)
            }
        } catch (error) {
            console.error('Error loading menu:', error)
            toast.error('Failed to load latest menu. Using cached version.')
        } finally {
            setLoading(false)
        }
    }

    const scrollToMenu = () => {
        document.getElementById('menu-section')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
        >
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <BackgroundSlideshow />

                <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                            Welcome to{' '}
                            <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                                {restaurantConfig.name}
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-dark-200 mb-12 leading-relaxed">
                            {restaurantConfig.description}
                        </p>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={scrollToMenu}
                                className="btn-primary"
                            >
                                <span>Explore Menu</span>
                            </motion.button>

                            <Link to="/payment">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-secondary flex items-center space-x-3"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    <span>Payment</span>
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>


                </div>
            </section>

            {/* Featured Carousel Section */}
            <section className="py-20 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 to-dark-900" />
                <div className="container mx-auto px-4 relative z-10">
                    <FeaturedCarousel featuredItems={featuredItems} />
                </div>
            </section>

            {/* Menu Section */}
            <section id="menu-section" className="py-20 bg-dark-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Our <span className="text-primary-500">Menu</span>
                        </h2>
                        <p className="text-dark-300 text-lg max-w-2xl mx-auto">
                            Discover our carefully curated selection of dishes, crafted with passion and the finest ingredients
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <MenuFilters
                        categories={categories}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                    />

                    {/* Results Count */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-8 text-center"
                    >
                        <p className="text-dark-400">
                            Showing {filteredItems.length} delicious {filteredItems.length === 1 ? 'dish' : 'dishes'}
                        </p>
                    </motion.div>

                    {/* Menu Grid */}
                    {filteredItems.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredItems.map((item, index) => (
                                <MenuCard key={item.id} item={item} index={index} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16"
                        >
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-dark-200 mb-2">No dishes found</h3>
                            <p className="text-dark-400 mb-6">
                                Try adjusting your filters to discover more delicious options
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setActiveCategory('all')
                                    setPriceRange({ id: 'all', min: 0, max: Infinity })
                                }}
                                className="btn-primary"
                            >
                                Clear All Filters
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </section>
        </motion.div>
    )
}

export default Home