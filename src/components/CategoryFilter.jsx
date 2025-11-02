import { motion } from 'framer-motion'

const CategoryFilter = ({ categories, activeCategory, setActiveCategory }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
        >
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory('all')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeCategory === 'all'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-dark-100'
                    }`}
            >
                All Items
            </motion.button>

            {categories.map((category) => (
                <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${activeCategory === category.id
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                        : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-dark-100'
                        }`}
                >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                </motion.button>
            ))}
        </motion.div>
    )
}

export default CategoryFilter