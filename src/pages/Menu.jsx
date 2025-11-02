import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MenuCard from '../components/MenuCard'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import PriceFilter from '../components/PriceFilter'
import LoadingSpinner from '../components/LoadingSpinner'

const Menu = () => {
    const [menuData, setMenuData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')
    const [priceRange, setPriceRange] = useState({ id: 'all', min: 0, max: Infinity })

    useEffect(() => {
        fetchMenuData()
    }, [])

    const fetchMenuData = async () => {
        try {
            const response = await fetch('/api/menu')
            const data = await response.json()
            setMenuData(data)
        } catch (error) {
            console.error('Error fetching menu:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredItems = menuData?.items?.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory
        const matchesPrice = item.price >= priceRange.min && item.price <= priceRange.max

        return matchesSearch && matchesCategory && matchesPrice
    }) || []

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen py-8"
        >
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-dark-100 mb-4">
                        Our <span className="text-primary-500">Menu</span>
                    </h1>
                    <p className="text-dark-300 text-lg max-w-2xl mx-auto">
                        Discover our carefully curated selection of dishes made with the finest ingredients
                    </p>
                </motion.div>

                {/* Search Bar */}
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {/* Filters */}
                <div className="mb-8">
                    <CategoryFilter
                        categories={menuData?.categories || []}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                    />

                    <PriceFilter
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                    />
                </div>

                {/* Results Count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6"
                >
                    <p className="text-dark-400 text-center">
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
                            Try adjusting your search or filter criteria
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setSearchTerm('')
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
        </motion.div>
    )
}

export default Menu