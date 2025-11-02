import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

class GoogleSheetsService {
    constructor() {
        this.auth = null;
        this.sheets = null;
        this.spreadsheetId = process.env.GOOGLE_SHEET_ID;
        this.initialize();
    }

    async initialize() {
        try {
            // Only initialize if Google Sheets configuration is provided
            if (process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE) {
                this.auth = new google.auth.GoogleAuth({
                    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
                    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
                });

                this.sheets = google.sheets({ version: 'v4', auth: this.auth });
                console.log('✅ Google Sheets integration initialized');
            } else {
                console.log('⚠️  Google Sheets not configured - using local data only');
            }
        } catch (error) {
            console.error('❌ Error initializing Google Sheets:', error);
        }
    }

    async getMenuItems() {
        try {
            if (!this.sheets || !this.spreadsheetId) {
                return []; // Return empty array if not configured
            }

            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'Menu!A2:H', // Assuming headers in row 1, data starts from row 2
            });

            const rows = response.data.values || [];

            return rows.map((row, index) => ({
                id: parseInt(row[0]) || index + 1,
                name: row[1] || '',
                description: row[2] || '',
                price: parseFloat(row[3]) || 0,
                category: row[4] || 'mains',
                rating: parseFloat(row[5]) || 4.0,
                image: row[6] || 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
                popular: row[7]?.toLowerCase() === 'true' || false
            }));
        } catch (error) {
            console.error('Error fetching menu items:', error);
            return [];
        }
    }

    async addMenuItem(item) {
        try {
            if (!this.sheets || !this.spreadsheetId) {
                return { success: false, message: 'Google Sheets not configured' };
            }

            const values = [[
                item.id,
                item.name,
                item.description,
                item.price,
                item.category,
                item.rating,
                item.image,
                item.popular
            ]];

            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: 'Menu!A:H',
                valueInputOption: 'RAW',
                resource: { values }
            });

            return { success: true, message: 'Item added successfully' };
        } catch (error) {
            console.error('Error adding menu item:', error);
            return { success: false, message: 'Failed to add item' };
        }
    }

    async updateMenuItem(id, item) {
        try {
            // First, find the row with the matching ID
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'Menu!A:A',
            });

            const rows = response.data.values || [];
            const rowIndex = rows.findIndex(row => parseInt(row[0]) === parseInt(id));

            if (rowIndex === -1) {
                return { success: false, message: 'Item not found' };
            }

            const range = `Menu!A${rowIndex + 1}:H${rowIndex + 1}`;
            const values = [[
                item.id,
                item.name,
                item.description,
                item.price,
                item.category,
                item.rating,
                item.image,
                item.popular
            ]];

            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range,
                valueInputOption: 'RAW',
                resource: { values }
            });

            return { success: true, message: 'Item updated successfully' };
        } catch (error) {
            console.error('Error updating menu item:', error);
            return { success: false, message: 'Failed to update item' };
        }
    }

    async deleteMenuItem(id) {
        try {
            // Find the row with the matching ID
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'Menu!A:A',
            });

            const rows = response.data.values || [];
            const rowIndex = rows.findIndex(row => parseInt(row[0]) === parseInt(id));

            if (rowIndex === -1) {
                return { success: false, message: 'Item not found' };
            }

            // Delete the row
            await this.sheets.spreadsheets.batchUpdate({
                spreadsheetId: this.spreadsheetId,
                resource: {
                    requests: [{
                        deleteDimension: {
                            range: {
                                sheetId: 0, // Assuming first sheet
                                dimension: 'ROWS',
                                startIndex: rowIndex,
                                endIndex: rowIndex + 1
                            }
                        }
                    }]
                }
            });

            return { success: true, message: 'Item deleted successfully' };
        } catch (error) {
            console.error('Error deleting menu item:', error);
            return { success: false, message: 'Failed to delete item' };
        }
    }

    async getCategories() {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'Categories!A2:C', // Assuming categories sheet
            });

            const rows = response.data.values || [];

            return rows.map(row => ({
                id: row[0] || '',
                name: row[1] || '',
                icon: row[2] || '🍽️'
            }));
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Return default categories if sheet doesn't exist
            return [
                { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
                { id: 'mains', name: 'Main Courses', icon: '🍽️' },
                { id: 'desserts', name: 'Desserts', icon: '🍰' },
                { id: 'beverages', name: 'Beverages', icon: '🥤' }
            ];
        }
    }
}

export default GoogleSheetsService;