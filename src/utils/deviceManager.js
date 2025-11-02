// Device Management Utility
// Handles device-specific menu storage and restaurant device registration

export class DeviceManager {
    constructor() {
        this.deviceId = this.getOrCreateDeviceId()
    }

    // Generate or retrieve device ID
    getOrCreateDeviceId() {
        let deviceId = localStorage.getItem('deviceId')
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
            localStorage.setItem('deviceId', deviceId)
        }
        return deviceId
    }

    // Check if current device is registered as restaurant device
    isRestaurantDevice() {
        const restaurantDeviceId = localStorage.getItem('restaurantDeviceId')
        return restaurantDeviceId === this.deviceId
    }

    // Register current device as restaurant device
    registerAsRestaurantDevice() {
        localStorage.setItem('restaurantDeviceId', this.deviceId)
        return true
    }

    // Get device-specific menu items
    getMenuItems() {
        const deviceKey = `menuItems_${this.deviceId}`
        const savedItems = localStorage.getItem(deviceKey)
        return savedItems ? JSON.parse(savedItems) : null
    }

    // Save device-specific menu items
    saveMenuItems(items) {
        const deviceKey = `menuItems_${this.deviceId}`
        localStorage.setItem(deviceKey, JSON.stringify(items))

        // Also update global menu for this device
        if (this.isRestaurantDevice()) {
            localStorage.setItem('menuItems', JSON.stringify(items))
        }
    }

    // Get menu items for display (restaurant device gets custom, others get default)
    getDisplayMenuItems(defaultItems) {
        const restaurantDeviceId = localStorage.getItem('restaurantDeviceId')

        if (restaurantDeviceId) {
            // There's a restaurant device, load its menu
            const deviceKey = `menuItems_${restaurantDeviceId}`
            const restaurantMenu = localStorage.getItem(deviceKey)

            if (restaurantMenu) {
                return JSON.parse(restaurantMenu)
            }
        }

        // Fallback to default items
        return defaultItems
    }

    // Clear device registration (for testing/reset)
    clearDeviceRegistration() {
        localStorage.removeItem('restaurantDeviceId')
        localStorage.removeItem('adminAuthenticated')
    }

    // Get device info for display
    getDeviceInfo() {
        return {
            deviceId: this.deviceId,
            isRestaurantDevice: this.isRestaurantDevice(),
            registeredRestaurantDevice: localStorage.getItem('restaurantDeviceId')
        }
    }
}

// Export singleton instance
export const deviceManager = new DeviceManager()