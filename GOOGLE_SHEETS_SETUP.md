# 📊 Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for your Digital Menu Admin Panel.

## 🎯 Overview

The admin panel can sync with Google Sheets, allowing you and your clients to manage menu items directly through a spreadsheet. Changes made in the sheet will reflect in your app automatically.

## 📋 Prerequisites

- Google account
- Google Cloud Console access
- Basic understanding of environment variables

## 🚀 Step-by-Step Setup

### 1. Create Google Sheet

1. **Create a new Google Sheet** with the following structure:

| A (ID) | B (Name) | C (Description) | D (Price) | E (Category) | F (Rating) | G (Image) | H (Popular) |
|--------|----------|-----------------|-----------|--------------|------------|-----------|-------------|
| 1 | Caesar Salad | Fresh romaine lettuce... | 12.99 | appetizers | 4.5 | https://... | TRUE |
| 2 | Grilled Salmon | Atlantic salmon... | 24.99 | mains | 4.8 | https://... | TRUE |

2. **Name your sheets:**
   - Main sheet: `Menu`
   - Categories sheet: `Categories` (optional)

3. **Copy the Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

### 2. Set Up Google Cloud Project

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**

2. **Create a new project** or select existing one

3. **Enable Google Sheets API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### 3. Create Service Account

1. **Go to "APIs & Services" > "Credentials"**

2. **Click "Create Credentials" > "Service Account"**

3. **Fill in details:**
   - Service account name: `menu-admin`
   - Description: `Service account for menu management`

4. **Click "Create and Continue"**

5. **Skip role assignment** (click "Continue")

6. **Click "Done"**

### 4. Generate Service Account Key

1. **Click on your service account** from the credentials list

2. **Go to "Keys" tab**

3. **Click "Add Key" > "Create New Key"**

4. **Select "JSON"** and click "Create"

5. **Download the JSON file** and save it as `service-account-key.json` in your `backend` folder

### 5. Share Google Sheet

1. **Open your Google Sheet**

2. **Click "Share" button**

3. **Add the service account email** (found in the JSON file as `client_email`)

4. **Give "Editor" permissions**

5. **Click "Send"**

### 6. Configure Environment Variables

1. **Copy `backend/.env.example` to `backend/.env`**

2. **Update the following variables:**
   ```env
   GOOGLE_SHEET_ID=your_actual_sheet_id_here
   GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./service-account-key.json
   ADMIN_PASSWORD=your_secure_password_here
   ```

### 7. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (if not done already)
cd ..
npm install
```

### 8. Test the Integration

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Go to `/admin` in your browser**

3. **Login with your admin password**

4. **Try adding/editing items** - they should sync with your Google Sheet!

## 📝 Sheet Format Details

### Menu Sheet Columns:

- **A (ID):** Unique identifier (number)
- **B (Name):** Item name (text)
- **C (Description):** Item description (text)
- **D (Price):** Price in dollars (number, e.g., 12.99)
- **E (Category):** Category ID (text: appetizers, mains, desserts, beverages)
- **F (Rating):** Rating out of 5 (number, e.g., 4.5)
- **G (Image):** Image URL (text, use Unsplash or your own images)
- **H (Popular):** Popular item flag (TRUE/FALSE)

### Categories Sheet (Optional):

| A (ID) | B (Name) | C (Icon) |
|--------|----------|----------|
| appetizers | Appetizers | 🥗 |
| mains | Main Courses | 🍽️ |
| desserts | Desserts | 🍰 |
| beverages | Beverages | 🥤 |

## 🔧 Troubleshooting

### Common Issues:

1. **"Error fetching menu items"**
   - Check if service account email is added to sheet with Editor permissions
   - Verify GOOGLE_SHEET_ID is correct
   - Ensure service-account-key.json file exists and is valid

2. **"Unauthorized" errors**
   - Check ADMIN_PASSWORD in .env file
   - Verify service account has proper permissions

3. **Items not syncing**
   - Check sheet column format matches exactly
   - Ensure data types are correct (numbers for price/rating)
   - Verify sheet names are "Menu" and "Categories"

### Testing Connection:

You can test if the Google Sheets connection works by:
1. Adding an item through the admin panel
2. Checking if it appears in your Google Sheet
3. Adding an item directly in the sheet
4. Refreshing the admin panel to see if it appears

## 🎉 Benefits

- **Real-time sync** between admin panel and Google Sheets
- **Easy collaboration** - multiple people can edit the sheet
- **Backup and version control** through Google Sheets history
- **Familiar interface** for non-technical users
- **Bulk operations** possible directly in the sheet

## 🔒 Security Notes

- Keep your service account JSON file secure and never commit it to version control
- Use a strong admin password
- Regularly review who has access to your Google Sheet
- Consider using environment-specific service accounts for production

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Test the Google Sheets API connection manually
4. Ensure your Google Cloud project has the Sheets API enabled

---

**Happy menu management! 🍽️**