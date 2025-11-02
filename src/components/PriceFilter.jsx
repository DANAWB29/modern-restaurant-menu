import { motion } from 'framer-motion'
import { DollarSign } from 'lucide-react'

const PriceFilter = ({ priceRange, setPriceRange }) => {
    const priceRanges = [
        { id: 'all', label: 'All Prices', min: 0, max: Infinity },
        { id: 'budget', label: 'Under $15', min: 0, max: 15 },
        { id: 'mid', label: '$15 - $25', min: 15, max: 25 },
        { id: 'premium', label: 'Above $25', min: 25, max: Infinity }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
        >
            <h3 className="text-lg font-semibold text-dark-200 mb-3 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-primary-500" />
                <span>Price Range</span>
            </h3>

            <div className="flex flex-wrap gap-2">
                {priceRanges.map((range) => (
                    <motion.button
                        key={range.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPriceRange(range)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${priceRange.id === range.id
                                ? 'bg-primary-500 text-white shadow-lg'
                                : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-dark-100'
                            }`}
                    >
                        {range.label}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    )
}

export default PriceFilter