import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import GoogleSheetsService from './services/googleSheets.js';
import { menuData, generateMenuItems } from './menu-data.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const googleSheets = new GoogleSheetsService();

// Middleware
app.use(cors());
app.use(express.json());

// Simple admin authentication middleware
const adminAuth = (req, res, next) => {
    const adminPassword = req.headers['admin-password'];
    if (adminPassword === process.env.ADMIN_PASSWORD || adminPassword === 'admin123') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Routes
app.get('/api/menu', async (req, res) => {
    try {
        // Try to get data from Google Sheets first
        const sheetItems = await googleSheets.getMenuItems();
        const categories = await googleSheets.getCategories();

        if (sheetItems.length > 0) {
            res.json({
                categories,
                items: sheetItems
            });
        } else {
            // Fallback to local data
            const completeMenuData = {
                ...menuData,
                items: [...menuData.items, ...generateMenuItems()]
            };
            res.json(completeMenuData);
        }
    } catch (error) {
        console.error('Error fetching menu:', error);
        // Fallback to local data
        const completeMenuData = {
            ...menuData,
            items: [...menuData.items, ...generateMenuItems()]
        };
        res.json(completeMenuData);
    }
});

app.post('/api/pay/telebirr', (req, res) => {
    const { itemId, amount, customerPhone } = req.body;

    // Mock Telebirr payment response
    const mockTelebirrLink = `https://telebirr.et/payment?amount=${amount}&merchant=restaurant123&ref=${Date.now()}`;

    res.json({
        success: true,
        paymentUrl: mockTelebirrLink,
        transactionId: `TXN_${Date.now()}`,
        message: 'Payment initiated successfully'
    });
});

app.post('/api/pay/mobile-banking', (req, res) => {
    const { itemId, amount, customerPhone } = req.body;

    // Mobile banking response with actual account details
    res.json({
        success: true,
        ussdCode: '*847*0941165124#',
        accountNumber: '1000580304641',
        message: 'Use the USSD code or account number for mobile banking payment'
    });
});

// Admin Routes
app.get('/api/admin/menu', adminAuth, async (req, res) => {
    try {
        const items = await googleSheets.getMenuItems();
        const categories = await googleSheets.getCategories();
        res.json({ items, categories });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

app.post('/api/admin/menu', adminAuth, async (req, res) => {
    try {
        const result = await googleSheets.addMenuItem(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add menu item' });
    }
});

app.put('/api/admin/menu/:id', adminAuth, async (req, res) => {
    try {
        const result = await googleSheets.updateMenuItem(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update menu item' });
    }
});

app.delete('/api/admin/menu/:id', adminAuth, async (req, res) => {
    try {
        const result = await googleSheets.deleteMenuItem(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
    console.log('Login attempt:', req.body);
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    console.log('Comparing passwords:', { provided: password, expected: adminPassword });

    if (password === adminPassword) {
        console.log('Login successful');
        res.json({ success: true, message: 'Login successful' });
    } else {
        console.log('Login failed - invalid password');
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend is running!',
        timestamp: new Date().toISOString(),
        adminPassword: process.env.ADMIN_PASSWORD || 'admin123'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});