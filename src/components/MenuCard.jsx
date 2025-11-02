import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const MenuCard = ({ item, index }) => {
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)

    useEffect(() => {
        // Get likes from localStorage
        const likes = JSON.parse(localStorage.getItem('menuLikes') || '{}')
        const itemLikes = JSON.parse(localStorage.getItem('itemLikes') || '{}')

        setIsLiked(likes[item.id] || false)
        setLikeCount(itemLikes[item.id] || Math.floor(Math.random() * 50) + 10) // Random initial likes
    }, [item.id])

    const handleLike = () => {
        const likes = JSON.parse(localStorage.getItem('menuLikes') || '{}')
        const itemLikes = JSON.parse(localStorage.getItem('itemLikes') || '{}')

        const newLikedState = !isLiked
        const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1

        // Update state
        setIsLiked(newLikedState)
        setLikeCount(newLikeCount)

        // Update localStorage
        likes[item.id] = newLikedState
        itemLikes[item.id] = newLikeCount

        localStorage.setItem('menuLikes', JSON.stringify(likes))
        localStorage.setItem('itemLikes', JSON.stringify(itemLikes))

        // Show toast
        toast.success(newLikedState ? '❤️ Added to favorites!' : '💔 Removed from favorites')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="menu-card group"
        >
            {/* Like Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className="like-button"
            >
                <Heart
                    className={`w-5 h-5 transition-colors duration-300 ${isLiked
                        ? 'text-red-500 fill-current'
                        : 'text-white hover:text-red-400'
                        }`}
                />
            </motion.button>

            {/* Image */}
            <div className="relative overflow-hidden h-48">
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />

                {/* Category Badge */}
                <div className="absolute bottom-3 left-3">
                    <span className="bg-dark-800/80 backdrop-blur-sm text-primary-400 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                        {item.category}
                    </span>
                </div>

                {/* Like Count */}
                {likeCount > 0 && (
                    <div className="absolute bottom-3 right-3">
                        <span className="bg-red-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                            <Heart className="w-3 h-3 fill-current" />
                            <span>{likeCount}</span>
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                        {item.name}
                    </h3>
                    <span className="text-2xl font-bold text-primary-500">
                        ${item.price}
                    </span>
                </div>

                <p className="text-dark-300 text-sm leading-relaxed mb-4">
                    {item.description}
                </p>

                {/* Most Liked Badge */}
                {likeCount > 30 && (
                    <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            <Heart className="w-3 h-3 fill-current" />
                            <span>Most Liked</span>
                        </div>
                    </div>
                )}

                {/* Featured Badge */}
                {item.featured && (
                    <div className="flex items-center space-x-2">
                        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-dark-900 px-3 py-1 rounded-full text-xs font-bold">
                            ⭐ Chef's Special
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default MenuCard