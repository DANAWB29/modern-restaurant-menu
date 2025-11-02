import { motion } from 'framer-motion'
import { ChefHat } from 'lucide-react'

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center">
            <div className="text-center">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity }
                    }}
                    className="inline-block p-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mb-4"
                >
                    <ChefHat className="w-8 h-8 text-white" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-primary-400 mb-2"
                >
                    Preparing Your Experience
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-dark-300"
                >
                    Loading delicious content...
                </motion.p>

                {/* Loading dots */}
                <div className="flex justify-center space-x-1 mt-4">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                            className="w-2 h-2 bg-primary-500 rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LoadingSpinner