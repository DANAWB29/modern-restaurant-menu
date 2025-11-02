import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Instagram, Facebook, Twitter, Youtube } from 'lucide-react'
import { restaurantConfig } from '../data/menuData'

const Footer = () => {
    const socialIcons = {
        instagram: Instagram,
        facebook: Facebook,
        twitter: Twitter,
        youtube: Youtube
    }

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="glass-effect border-t border-dark-700 mt-20"
        >
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Restaurant Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h3 className="text-2xl font-bold text-primary-400">{restaurantConfig.name}</h3>
                        <p className="text-dark-300 leading-relaxed">
                            {restaurantConfig.description}. Experience culinary excellence with our carefully crafted dishes made from the finest ingredients.
                        </p>

                        {/* Social Media */}
                        <div className="flex space-x-4">
                            {Object.entries(restaurantConfig.social).map(([platform, link]) => {
                                const IconComponent = socialIcons[platform]
                                return (
                                    <motion.a
                                        key={platform}
                                        href={link}
                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 bg-dark-700 hover:bg-primary-500 rounded-xl transition-all duration-300 group"
                                    >
                                        <IconComponent className="w-5 h-5 text-primary-400 group-hover:text-dark-900" />
                                    </motion.a>
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-primary-400">Contact Us</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-dark-200 font-semibold">Location</p>
                                    <p className="text-dark-300 text-sm">{restaurantConfig.address}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-dark-200 font-semibold">Phone</p>
                                    <a
                                        href={`tel:${restaurantConfig.phone}`}
                                        className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
                                    >
                                        {restaurantConfig.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Opening Hours */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-primary-400">Opening Hours</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <Clock className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                                <div className="text-sm">
                                    <div className="text-dark-200 font-semibold mb-1">Monday - Friday</div>
                                    <div className="text-dark-300">{restaurantConfig.hours.weekdays}</div>

                                    <div className="text-dark-200 font-semibold mt-3 mb-1">Saturday - Sunday</div>
                                    <div className="text-dark-300">{restaurantConfig.hours.weekends}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="border-t border-dark-700 mt-12 pt-8 text-center"
                >
                    <p className="text-dark-400 text-sm">
                        © 2024 {restaurantConfig.name}. All rights reserved. Crafted with ❤️ for exceptional dining experiences.
                    </p>
                </motion.div>
            </div>
        </motion.footer>
    )
}

export default Footer