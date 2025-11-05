# 🚀 Restaurant Menu - Google Sheets Setup Guide

This guide will help you set up Google Sheets for real-time menu synchronization across all devices - **completely FREE!**

## 📋 Prerequisites

- A Google account
- Basic understanding of Google Sheets and Google Apps Script

## 🎯 Step 1: Create Google Sheet

1. **Go to [Google Sheets](https://sheets.google.com)**
2. **Create a new spreadsheet**
3. **Name it**: `Restaurant Menu Database`
4. **Create a sheet named**: `menu_items`

## 🗄️ Step 2: Set Up Sheet Structure

In your `menu_items` sheet, create these columns in **Row 1** (headers):

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **id** | **name** | **description** | **price** | **category** | **image** | **featured** |

## 📝 Step 3: Add Sample Data

Add these 15 sample menu items (copy and paste into your sheet starting from row 2):

```
1	Golden Pancakes	Fluffy pancakes with maple syrup and fresh berries	12.99	breakfast	https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop	TRUE
2	Avocado Toast	Sourdough bread topped with smashed avocado, cherry tomatoes, and feta	9.99	breakfast	https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop	FALSE
3	Eggs Benedict	Poached eggs on English muffins with Canadian bacon and hollandaise	14.99	breakfast	https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop	TRUE
4	French Toast	Thick-cut brioche with cinnamon, vanilla, and powdered sugar	11.99	breakfast	https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop	FALSE
5	Gourmet Burger	Wagyu beef patty with truffle aioli, arugula, and aged cheddar	18.99	lunch	https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop	TRUE
6	Caesar Salad	Crisp romaine lettuce with parmesan, croutons, and house Caesar dressing	13.99	lunch	https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop	FALSE
7	Chicken Club Sandwich	Grilled chicken breast with bacon, lettuce, tomato, and mayo on sourdough	15.99	lunch	https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop	FALSE
8	Fish Tacos	Blackened mahi-mahi with cabbage slaw and chipotle crema	16.99	lunch	https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop	TRUE
9	Grilled Salmon	Atlantic salmon with lemon herb butter and seasonal vegetables	24.99	dinner	https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop	TRUE
10	Ribeye Steak	12oz prime ribeye with garlic mashed potatoes and asparagus	32.99	dinner	https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop	TRUE
11	Lobster Risotto	Creamy arborio rice with fresh lobster, peas, and parmesan	28.99	dinner	https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop	FALSE
12	Fresh Orange Juice	Freshly squeezed Valencia oranges	4.99	drinks	https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop	FALSE
13	Craft Coffee	Single-origin Ethiopian beans, expertly roasted	3.99	drinks	https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop	FALSE
14	Chocolate Lava Cake	Warm chocolate cake with molten center and vanilla ice cream	8.99	desserts	https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop	TRUE
15	Tiramisu	Classic Italian dessert with coffee-soaked ladyfingers and mascarpone	7.99	desserts	https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop	FALSE
```

**Tip:** Select all the data above, copy it, then paste it into your Google Sheet starting at cell A2. The data will automatically fill into the correct columns.

## 🔗 Step 4: Make Sheet Public

1. **Click "Share"** button (top right)
2. **Click "Change to anyone with the link"**
3. **Set permission to "Viewer"**
4. **Copy the share link** - it looks like:
   ```
   https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit?usp=sharing
   ```
5. **Extract the Sheet ID** (the part between `/d/` and `/edit`):
   ```
   1ABC123DEF456GHI789JKL
   ```

## ⚙️ Step 5: Create Google Apps Script

1. **Go to [Google Apps Script](https://script.google.com)**
2. **Create a new project**
3. **Name it**: `Restaurant Menu API`
4. **Replace the default code** with this:

```javascript
// Restaurant Menu Google Apps Script API
// Handles menu item CRUD operations with CORS support and JSONP

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    let data, action, callback;
    
    // Handle both POST (with CORS) and GET (JSONP) requests
    if (e.postData && e.postData.contents) {
      // POST request
      const postData = JSON.parse(e.postData.contents);
      action = postData.action;
      data = postData;
    } else {
      // GET request (JSONP)
      action = e.parameter.action;
      callback = e.parameter.callback;
      data = {
        action: action,
        data: JSON.parse(e.parameter.data || '[]')
      };
    }
    
    // Get the spreadsheet (replace with your Sheet ID)
    const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // Replace this!
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName('menu_items');
    
    if (action === 'updateMenu') {
      return updateMenuItems(sheet, data.data, callback);
    }
    
    const response = {success: false, error: 'Unknown action'};
    
    if (callback) {
      // JSONP response
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(response) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      // Regular JSON response
      return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function updateMenuItems(sheet, menuItems, callback) {
  try {
    // Clear existing data (keep headers)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    
    // Add new data
    if (menuItems && menuItems.length > 0) {
      const rows = menuItems.map(item => [
        item.id,
        item.name,
        item.description,
        item.price,
        item.category,
        item.image || '',
        item.featured
      ]);
      
      sheet.getRange(2, 1, rows.length, 7).setValues(rows);
    }
    
    const response = {success: true, message: 'Menu updated successfully'};
    
    if (callback) {
      // JSONP response
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(response) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      // Regular JSON response
      return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
      
  } catch (error) {
    const response = {success: false, error: error.toString()};
    
    if (callback) {
      // JSONP response
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(response) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      // Regular JSON response
      return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
  }
}

// Handle OPTIONS requests for CORS preflight
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

// Test function (optional)
function testAPI() {
  const testData = {
    action: 'updateMenu',
    data: [
      {
        id: 1,
        name: 'Test Item',
        description: 'Test Description',
        price: 9.99,
        category: 'lunch',
        image: '',
        featured: 'FALSE'
      }
    ]
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  console.log(result.getContent());
}
```

## 🚀 Step 6: Deploy Apps Script

1. **Replace `YOUR_GOOGLE_SHEET_ID`** in the script with your actual Sheet ID
2. **Click "Save"** (Ctrl+S)
3. **Click "Deploy"** → **"New deployment"**
4. **Set type to**: "Web app"
5. **Set execute as**: "Me"
6. **Set access to**: "Anyone"
7. **Click "Deploy"**
8. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/ABC123DEF456/exec
   ```

## 🔧 Step 7: Configure Your App

1. **Open** `src/services/googleSheetsService.js`
2. **Replace the placeholders**:

```javascript
// Replace these lines:
this.SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'
this.APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'

// With your actual values:
this.SHEET_ID = '1ABC123DEF456GHI789JKL'
this.APPS_SCRIPT_URL = 'https://script.google.com/macros/s/ABC123DEF456/exec'
```

## 🧪 Step 8: Test Your Setup

1. **Start your app**: `npm run dev`
2. **Go to Admin Panel**: http://localhost:5173/admin
3. **Login** with password: `admin123`
4. **Click "Test Sheets"** - you should see successful connection messages
5. **Try adding a menu item** - you should see: **"🚀 Menu updated! Changes are live across all devices instantly!"**
6. **Check your Google Sheet** - the new item should appear
7. **Open another browser tab** - changes should appear automatically

## ✅ Features You Get

✅ **Real-time Sync**: Changes appear instantly on all devices  
✅ **Completely Free**: No paid services required  
✅ **Offline Support**: App works offline with localStorage backup  
✅ **Admin Authentication**: Secure device-based admin access  
✅ **Automatic Backups**: Data is automatically backed up locally  
✅ **Scalable**: Google Sheets handles unlimited concurrent users  
✅ **Easy Management**: Edit menu directly in Google Sheets if needed  

## 🔧 Troubleshooting

### ❌ "Google Sheets not configured" message
- Check that you replaced both `SHEET_ID` and `APPS_SCRIPT_URL` in the service file
- Restart your development server after making changes

### ❌ "Failed to sync with Google Sheets" message
- Verify your Google Sheet is public (anyone with link can view)
- Check that your Apps Script is deployed as a web app with "Anyone" access
- Ensure the Sheet ID in your Apps Script matches your actual sheet

### ❌ Apps Script errors
- Make sure you replaced `YOUR_GOOGLE_SHEET_ID` in the Apps Script code
- Check that your sheet is named exactly `menu_items`
- Verify the column headers match exactly: id, name, description, price, category, image, featured

### ❌ Real-time updates not working
- Check browser console for error messages
- Verify the Google Sheets API is returning data (check Network tab in DevTools)
- Try refreshing the page

## 🎨 Customization

### **Change Categories**
Edit the `getCategories()` method in `googleSheetsService.js`:

```javascript
getCategories() {
    return [
        { id: 'all', name: 'All Items', icon: '🍽️' },
        { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
        { id: 'mains', name: 'Main Courses', icon: '🍖' },
        { id: 'desserts', name: 'Desserts', icon: '🍰' },
        { id: 'beverages', name: 'Beverages', icon: '🥤' }
    ]
}
```

### **Change Refresh Rate**
Edit the refresh interval in `googleSheetsService.js`:

```javascript
// Change from 15 seconds to 30 seconds
}, 30000) // Check every 30 seconds
```

### **Add More Fields**
1. Add columns to your Google Sheet
2. Update the `parseGoogleSheetsData()` method
3. Update the Apps Script to handle new fields

## 🚀 Deployment

When deploying to Vercel/Netlify:

1. **Make sure** your `googleSheetsService.js` has the correct IDs
2. **The app will work immediately** - no environment variables needed
3. **All users will see real-time updates** across all devices

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Google Sheet is accessible via the public link
3. Test your Apps Script using the `testAPI()` function
4. Ensure all IDs and URLs are correctly copied

---

**🎊 Congratulations!** Your restaurant menu now has real-time synchronization using Google Sheets - completely free!