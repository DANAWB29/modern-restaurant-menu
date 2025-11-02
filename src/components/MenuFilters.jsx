import { motion } from 'framer-motion'
import { DollarSign } from 'lucide-react'

const MenuFilters = ({
    categories,
    activeCategory,
    setActiveCategory,
    priceRange,
    setPriceRange
}) => {
    const priceRanges = [
        { id: 'all', label: 'All Prices', min: 0, max: Infinity },
        { id: 'budget', label: 'Under $15', min: 0, max: 15 },
        { id: 'mid', label: '$15 - $25', min: 15, max: 25 },
        { id: 'premium', label: 'Above $25', min: 25, max: Infinity }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 space-y-8"
        >
            {/* Category Filters */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <span>🍽️</span>
                    <span>Categories</span>
                </h3>

                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                        <motion.button
                            key={category.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveCategory(category.id)}
                            className={`filter-button ${activeCategory === category.id ? 'filter-active' : 'filter-inactive'
                                }`}
                        >
                            <span className="mr-2">{category.icon}</span>
                            <span>{category.name}</span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Price Range Filters */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-primary-500" />
                    <span>Price Range</span>
                </h3>

                <div className="flex flex-wrap gap-3">
                    {priceRanges.map((range) => (
                        <motion.button
                            key={range.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setPriceRange(range)}
                            className={`filter-button ${priceRange.id === range.id ? 'filter-active' : 'filter-inactive'
                                }`}
                        >
                            {range.label}
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default MenuFilters