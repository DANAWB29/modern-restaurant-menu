import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, LogOut, Shield, AlertTriangle, Download, RefreshCw } from 'lucide-react'
import { sampleMenuItems, menuCategories } from '../data/menuData'
import reliableMenuService from '../services/reliableMenuService'
import toast from 'react-hot-toast'

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [menuItems, setMenuItems] = useState(sampleMenuItems)
    const [editingItem, setEditingItem] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [deviceId, setDeviceId] = useState('')
    const [isRestaurantDevice, setIsRestaurantDevice] = useState(false)
    const [showDeviceSetup, setShowDeviceSetup] = useState(false)

    const [realtimeStatus, setRealtimeStatus] = useState(null)

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        price: '',
        category: 'breakfast',
        image: '',
        featured: false
    })

    // Check authentication on mount
    useEffect(() => {
        const savedAuth = localStorage.getItem('adminAuthenticated')
        if (savedAuth === 'true') {
            setIsAuthenticated(true)
            loadMenuItems()
        }
    }, [])

    const loadMenuItems = async () => {
        try {
            const data = await reliableMenuService.loadMenuData()
            if (data.items) {
                setMenuItems(data.items)
            } else {
                setMenuItems(sampleMenuItems)
            }
        } catch (error) {
            console.error('Error loading menu items:', error)
            // Fallback to localStorage
            const savedItems = localStorage.getItem('menuItems')
            if (savedItems) {
                setMenuItems(JSON.parse(savedItems))
            } else {
                setMenuItems(sampleMenuItems)
            }
        }
    }

    const saveMenuItems = async (items) => {
        try {
            // Always save locally first
            localStorage.setItem('menuItems', JSON.stringify(items))
            setMenuItems(items)

            // Save with Supabase service
            const result = await reliableMenuService.saveMenuData(items)

            console.log('🔍 Save result:', result)

            if (result.success) {
                // Update the local state immediately
                setMenuItems(items)
                toast.success(result.message)
            } else {
                // Supabase sync failed, show the actual error
                console.error('❌ Menu save failed:', result.message)
                toast.error(`Save Error: ${result.message}`)
                downloadMenuFile(items)
            }
        } catch (error) {
            console.error('Error saving menu items:', error)
            // Even if everything fails, try to save locally
            try {
                localStorage.setItem('menuItems', JSON.stringify(items))
                setMenuItems(items)
                downloadMenuFile(items)
                toast.success('Menu saved locally with backup file download.')
            } catch (localError) {
                toast.error('Failed to save menu: ' + error.message)
            }
        }
    }

    const downloadMenuFile = (items) => {
        const menuData = {
            lastUpdated: new Date().toISOString(),
            categories: [
                { id: 'all', name: 'All Items', icon: '🍽️' },
                { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
                { id: 'lunch', name: 'Lunch', icon: '🌞' },
                { id: 'dinner', name: 'Dinner', icon: '🌙' },
                { id: 'drinks', name: 'Drinks', icon: '🥤' },
                { id: 'desserts', name: 'Desserts', icon: '🍰' }
            ],
            items: items
        }

        const dataStr = JSON.stringify(menuData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)

        const link = document.createElement('a')
        link.href = url
        link.download = 'menu-data.json'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }





    const handleLogin = () => {
        // Simple password check - works on all devices
        const validPasswords = ['admin123', 'restaurant2024', 'golden_spoon_admin']

        if (validPasswords.includes(password)) {
            setIsAuthenticated(true)
            localStorage.setItem('adminAuthenticated', 'true')
            loadMenuItems()
            toast.success('Welcome to Restaurant Admin Panel!')
        } else {
            toast.error('Invalid password.')
        }
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        localStorage.removeItem('adminAuthenticated')
        setPassword('')
        toast.success('Logged out successfully')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.name || !formData.description || !formData.price) {
            toast.error('Please fill in all required fields')
            return
        }

        const itemData = {
            ...formData,
            id: editingItem ? editingItem.id : Date.now(),
            price: parseFloat(formData.price),
            featured: formData.featured
        }

        let updatedItems
        if (editingItem) {
            updatedItems = menuItems.map(item =>
                item.id === editingItem.id ? itemData : item
            )
            toast.success('Menu item updated successfully!')
        } else {
            updatedItems = [...menuItems, itemData]
            toast.success('New menu item added successfully!')
        }

        saveMenuItems(updatedItems)
        resetForm()
    }

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return

        const updatedItems = menuItems.filter(item => item.id !== id)
        saveMenuItems(updatedItems)
        toast.success('Menu item deleted successfully!')
    }

    const handleEdit = (item) => {
        setEditingItem(item)
        setFormData({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            category: item.category,
            image: item.image,
            featured: item.featured || false
        })
        setShowAddForm(true)
    }

    const resetForm = () => {
        setFormData({
            id: '',
            name: '',
            description: '',
            price: '',
            category: 'breakfast',
            image: '',
            featured: false
        })
        setEditingItem(null)
        setShowAddForm(false)
    }

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-effect rounded-2xl p-8 w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        >
                            <span className="text-2xl">🔐</span>
                        </motion.div>
                        <h1 className="text-3xl font-bold text-primary-400 mb-2">Restaurant Admin</h1>
                        <p className="text-dark-300">Enter your password to continue.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-4 bg-dark-800/50 border border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white pr-12"
                                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-dark-200"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogin}
                            className="w-full btn-primary"
                        >
                            Access Admin Panel
                        </motion.button>
                    </div>


                </motion.div>
            </div>
        )
    }

    // Admin Dashboard
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen pt-24 pb-12"
        >
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Menu <span className="text-primary-500">Management</span>
                        </h1>
                        <p className="text-dark-300">Manage your restaurant's menu items</p>
                    </motion.div>

                    <div className="flex space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddForm(true)}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Item</span>
                        </motion.button>



                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={loadMenuItems}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center space-x-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Refresh</span>
                        </motion.button>



                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="btn-secondary flex items-center space-x-2"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </motion.button>
                    </div>
                </div>

                {/* Sync Status Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="glass-effect rounded-xl p-4 mb-8 border border-green-500/20"
                >
                    <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-green-400" />
                        <div>
                            <h3 className="text-green-400 font-semibold">Real-Time Sync Active</h3>
                            <p className="text-dark-400 text-sm">
                                🚀 Changes sync instantly across all browser tabs!
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    {menuCategories.slice(1).map((category, index) => {
                        const count = menuItems.filter(item => item.category === category.id).length
                        return (
                            <div key={category.id} className="glass-effect rounded-xl p-6 text-center">
                                <div className="text-3xl mb-2">{category.icon}</div>
                                <div className="text-2xl font-bold text-primary-400">{count}</div>
                                <div className="text-dark-300 text-sm">{category.name}</div>
                            </div>
                        )
                    })}
                </motion.div>



                {/* Add/Edit Form Modal */}
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-effect rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                                </h2>
                                <button
                                    onClick={resetForm}
                                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-dark-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-white font-semibold mb-2">
                                            Item Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                                            placeholder="e.g., Golden Pancakes"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white font-semibold mb-2">
                                            Price ($) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                                            placeholder="12.99"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                                        placeholder="Describe your delicious dish..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-white font-semibold mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                                        >
                                            {menuCategories.slice(1).map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-end">
                                        <label className="flex items-center space-x-3 text-white">
                                            <input
                                                type="checkbox"
                                                checked={formData.featured}
                                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                                className="w-5 h-5 text-primary-500 bg-dark-800 border-dark-600 rounded focus:ring-primary-500"
                                            />
                                            <span className="font-semibold">Featured Item</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">
                                        Image
                                    </label>

                                    {/* Image Preview */}
                                    {formData.image && (
                                        <div className="mb-3">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-xl"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop'
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* File Upload */}
                                    <div className="space-y-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                    // Check file size (max 2MB)
                                                    if (file.size > 2 * 1024 * 1024) {
                                                        toast.error('Image too large! Please use an image under 2MB.')
                                                        return
                                                    }

                                                    // Convert to base64
                                                    const reader = new FileReader()
                                                    reader.onloadend = () => {
                                                        setFormData({ ...formData, image: reader.result })
                                                        toast.success('Image uploaded successfully!')
                                                    }
                                                    reader.onerror = () => {
                                                        toast.error('Failed to upload image')
                                                    }
                                                    reader.readAsDataURL(file)
                                                }
                                            }}
                                            className="w-full px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-dark-900 hover:file:bg-primary-600 file:cursor-pointer"
                                        />

                                        <div className="text-center text-dark-400 text-sm">OR</div>

                                        <input
                                            type="url"
                                            value={formData.image?.startsWith('data:') ? '' : formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="https://images.unsplash.com/..."
                                            className="w-full px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                                        />
                                    </div>

                                    <p className="text-dark-400 text-sm mt-2">
                                        Upload an image (max 2MB) or paste an image URL from Unsplash.
                                    </p>
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="btn-primary flex items-center space-x-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>{editingItem ? 'Update Item' : 'Add Item'}</span>
                                    </motion.button>

                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {/* Menu Items Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-effect rounded-2xl overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-dark-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-white font-semibold">Item</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold">Category</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold">Price</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-dark-400">
                                            <div className="text-6xl mb-4">🍽️</div>
                                            <p className="text-lg">No menu items yet</p>
                                            <p className="text-sm">Add your first menu item to get started!</p>
                                        </td>
                                    </tr>
                                ) : (
                                    menuItems.map((item, index) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-t border-dark-700 hover:bg-dark-800/30 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src={item.image || 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=80&h=80&fit=crop'}
                                                        alt={item.name}
                                                        className="w-16 h-16 rounded-xl object-cover"
                                                    />
                                                    <div>
                                                        <div className="font-semibold text-white text-lg">{item.name}</div>
                                                        <div className="text-dark-400 text-sm line-clamp-2 max-w-xs">
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-dark-700 text-primary-400 px-3 py-1 rounded-full text-sm font-medium capitalize">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-primary-400 font-bold text-lg">
                                                ${item.price}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.featured && (
                                                    <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-dark-900 px-3 py-1 rounded-full text-xs font-bold">
                                                        ⭐ Featured
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleEdit(item)}
                                                        className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4 text-white" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-3 bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-white" />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default Admin