import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Smartphone, CreditCard, Phone, Copy } from 'lucide-react'
import { restaurantConfig } from '../data/menuData'
import toast from 'react-hot-toast'

const Payment = () => {
    const handleTelebirrPayment = () => {
        const telebirrUrl = `${restaurantConfig.payment.telebirr.link}?phone=${restaurantConfig.payment.telebirr.phone}&merchant=${restaurantConfig.name}`

        toast.success('Redirecting to Telebirr...')

        // Simulate redirect after a short delay
        setTimeout(() => {
            window.open(telebirrUrl, '_blank')
        }, 1000)
    }

    const handleCBEPayment = () => {
        const cbeUrl = `${restaurantConfig.payment.cbe.link}?account=${restaurantConfig.payment.cbe.account}&merchant=${restaurantConfig.name}`

        toast.success('Redirecting to CBE Mobile Banking...')

        // Simulate redirect after a short delay
        setTimeout(() => {
            window.open(cbeUrl, '_blank')
        }, 1000)
    }

    const copyAccountNumber = () => {
        navigator.clipboard.writeText(restaurantConfig.payment.cbe.account)
        toast.success('Account number copied to clipboard!')
    }

    const callTelebirr = () => {
        window.location.href = `tel:${restaurantConfig.payment.telebirr.phone}`
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-24 pb-12"
        >
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Menu</span>
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Choose Your <span className="text-primary-500">Payment Method</span>
                    </h1>
                    <p className="text-dark-300 text-lg max-w-2xl mx-auto">
                        Select your preferred payment option for a seamless dining experience at {restaurantConfig.name}
                    </p>
                </motion.div>

                {/* Payment Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Telebirr Payment */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-effect rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                            <Smartphone className="w-10 h-10 text-white" />
                        </motion.div>

                        <h3 className="text-2xl font-bold text-white mb-4">Telebirr</h3>
                        <p className="text-dark-300 mb-6 leading-relaxed">
                            Pay securely with Ethiopia's leading mobile payment platform
                        </p>

                        <div className="space-y-4">
                            <div className="bg-dark-800/50 rounded-lg p-4 mb-6">
                                <p className="text-dark-400 text-sm mb-2">Restaurant Phone:</p>
                                <div className="flex items-center justify-center space-x-2">
                                    <p className="text-primary-400 font-mono text-lg font-bold">
                                        {restaurantConfig.payment.telebirr.phone}
                                    </p>
                                    <button
                                        onClick={callTelebirr}
                                        className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                                    >
                                        <Phone className="w-4 h-4 text-primary-400" />
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleTelebirrPayment}
                                className="btn-payment w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            >
                                <CreditCard className="w-6 h-6 mr-3" />
                                Pay with Telebirr
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* CBE Mobile Banking */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-effect rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                            <span className="text-3xl">🏦</span>
                        </motion.div>

                        <h3 className="text-2xl font-bold text-white mb-4">CBE Mobile Banking</h3>
                        <p className="text-dark-300 mb-6 leading-relaxed">
                            Transfer directly using Commercial Bank of Ethiopia mobile banking
                        </p>

                        <div className="space-y-4">
                            <div className="bg-dark-800/50 rounded-lg p-4 mb-6">
                                <p className="text-dark-400 text-sm mb-2">Account Number:</p>
                                <div className="flex items-center justify-center space-x-2">
                                    <p className="text-primary-400 font-mono text-lg font-bold">
                                        {restaurantConfig.payment.cbe.account}
                                    </p>
                                    <button
                                        onClick={copyAccountNumber}
                                        className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                                    >
                                        <Copy className="w-4 h-4 text-primary-400" />
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCBEPayment}
                                className="btn-payment w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            >
                                <Smartphone className="w-6 h-6 mr-3" />
                                CBE Mobile Banking
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Payment Instructions */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-effect rounded-2xl p-8"
                >
                    <h3 className="text-2xl font-bold text-primary-400 mb-6 text-center">Payment Instructions</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                <Smartphone className="w-5 h-5 text-blue-500" />
                                <span>Telebirr Payment</span>
                            </h4>
                            <ol className="text-dark-300 space-y-2 text-sm">
                                <li className="flex items-start space-x-2">
                                    <span className="bg-primary-500 text-dark-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                                    <span>Click "Pay with Telebirr" button above</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="bg-primary-500 text-dark-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                                    <span>You'll be redirected to Telebirr payment page</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="bg-primary-500 text-dark-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                                    <span>Enter your Telebirr PIN to complete payment</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="bg-primary-500 text-dark-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                                    <span>Show confirmation to restaurant staff</span>
                                </li>
                            </ol>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                <span className="text-green-500">🏦</span>
                                <span>CBE Mobile Banking</span>
                            </h4>
                            <ol className="text-dark-300 space-y-2 text-sm">
                                <li className="flex items-start space-x-2">
                                    <span className="bg-primary-500 text-dark-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                                    <span>Open your CBE mobile banking app</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="bg-primary-500 text-dark-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                                    <span>Select "Transfer" or "Send Money"</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="bg-primary-500 text-dark-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                                    <span>Enter account number: {restaurantConfig.payment.cbe.account}</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="bg-primary-500 text-dark-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                                    <span>Complete transfer and show receipt</span>
                                </li>
                            </ol>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                        <p className="text-primary-300 text-sm text-center">
                            🔒 All payments are secure and encrypted. For any payment issues, please contact our staff at {restaurantConfig.phone}
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default Payment