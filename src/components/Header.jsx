import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Crown } from 'lucide-react'
import { restaurantConfig } from '../data/menuData'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Payment', path: '/payment' },
        { name: 'Admin', path: '/admin' },
    ]

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 w-full z-50 glass-effect"
        >
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg"
                        >
                            <Crown className="w-8 h-8 text-dark-900" />
                        </motion.div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                                {restaurantConfig.name}
                            </h1>
                            <p className="text-xs text-dark-400 -mt-1">{restaurantConfig.tagline}</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`relative px-4 py-2 rounded-lg transition-all duration-300 font-semibold ${location.pathname === item.path
                                        ? 'text-primary-400'
                                        : 'text-dark-300 hover:text-primary-400'
                                    }`}
                            >
                                {item.name}
                                {location.pathname === item.path && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary-500/10 rounded-lg border border-primary-500/30"
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-dark-700 transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden mt-4 py-4 border-t border-dark-700"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-4 py-3 rounded-lg transition-all duration-300 font-semibold ${location.pathname === item.path
                                        ? 'text-primary-400 bg-primary-500/10'
                                        : 'text-dark-300 hover:text-primary-400 hover:bg-dark-700'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </motion.nav>
                )}
            </div>
        </motion.header>
    )
}

export default Header