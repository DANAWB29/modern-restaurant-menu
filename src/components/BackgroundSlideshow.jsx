import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { restaurantImages } from '../data/menuData'

const BackgroundSlideshow = () => {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === restaurantImages.length - 1 ? 0 : prevIndex + 1
            )
        }, 5000) // Change image every 5 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src={restaurantImages[currentIndex]}
                        alt={`Restaurant ambiance ${currentIndex + 1}`}
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 hero-gradient" />
                </motion.div>
            </AnimatePresence>

            {/* Slide indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {restaurantImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-primary-500 scale-125'
                                : 'bg-white/30 hover:bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}

export default BackgroundSlideshow