import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-md mx-auto mb-8"
        >
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search delicious dishes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-dark-800/50 border border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark-100 placeholder-dark-400 backdrop-blur-sm"
                />
                {searchTerm && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </motion.button>
                )}
            </div>
        </motion.div>
    )
}

export default SearchBar