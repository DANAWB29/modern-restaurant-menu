import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const FeaturedCarousel = ({ featuredItems }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === featuredItems.length - 1 ? 0 : prevIndex + 1
            )
        }, 4000)

        return () => clearInterval(interval)
    }, [featuredItems.length])

    const nextSlide = () => {
        setCurrentIndex(currentIndex === featuredItems.length - 1 ? 0 : currentIndex + 1)
    }

    const prevSlide = () => {
        setCurrentIndex(currentIndex === 0 ? featuredItems.length - 1 : currentIndex - 1)
    }

    if (!featuredItems.length) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative max-w-4xl mx-auto"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Featured <span className="text-primary-400">Specialties</span>
                </h2>
                <p className="text-dark-200">Discover our chef's signature creations</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="relative"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 glass-effect overflow-hidden">
                            {/* Image */}
                            <div className="relative h-64 md:h-80">
                                <img
                                    src={featuredItems[currentIndex].image}
                                    alt={featuredItems[currentIndex].name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark-900/50" />
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col justify-center">
                                <div className="flex items-center space-x-2 mb-3">
                                    <Star className="w-5 h-5 text-primary-500 fill-current" />
                                    <span className="text-primary-400 font-semibold text-sm uppercase tracking-wide">
                                        Featured Special
                                    </span>
                                </div>

                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                    {featuredItems[currentIndex].name}
                                </h3>

                                <p className="text-dark-300 mb-6 leading-relaxed">
                                    {featuredItems[currentIndex].description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold text-primary-500">
                                        ${featuredItems[currentIndex].price}
                                    </span>
                                    <span className="text-sm text-dark-400 capitalize bg-dark-700 px-3 py-1 rounded-full">
                                        {featuredItems[currentIndex].category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-dark-800/80 hover:bg-dark-700 rounded-full transition-all duration-300 backdrop-blur-sm group"
                >
                    <ChevronLeft className="w-6 h-6 text-primary-400 group-hover:text-primary-300" />
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-dark-800/80 hover:bg-dark-700 rounded-full transition-all duration-300 backdrop-blur-sm group"
                >
                    <ChevronRight className="w-6 h-6 text-primary-400 group-hover:text-primary-300" />
                </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-6">
                {featuredItems.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-primary-500 scale-125'
                                : 'bg-dark-600 hover:bg-dark-500'
                            }`}
                    />
                ))}
            </div>
        </motion.div>
    )
}

export default FeaturedCarousel