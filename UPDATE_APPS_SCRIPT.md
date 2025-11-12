# 🔧 Update Your Google Apps Script

To enable automatic cross-device sync, update your Google Apps Script with this simplified code:

## 📝 **Complete Apps Script Code:**

```javascript
// Restaurant Menu Google Apps Script API
// Handles menu item CRUD operations - CORS-free version

function doPost(e) {
  try {
    // Handle form data (no CORS issues)
    const action = e.parameter.action;
    const data = {
      action: action,
      data: JSON.parse(e.parameter.data || '[]')
    };
    
    // Get the spreadsheet (replace with your Sheet ID)
    const SHEET_ID = '1NLg6RnP0LkRJaSJSgHuVnWIAjphF-L2foopiVach0Js';
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName('menu_items');
    
    if (action === 'updateMenu') {
      return updateMenuItems(sheet, data.data);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: 'Unknown action'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function updateMenuItems(sheet, menuItems) {
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
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Menu updated successfully'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 🚀 **How to Update:**

1. **Go to your Google Apps Script**: https://script.google.com
2. **Open your existing project**: "Restaurant Menu API"
3. **Select all the old code** (Ctrl+A)
4. **Delete it and paste the new code above**
5. **Save** (Ctrl+S)
6. **Deploy new version**:
   - Click "Deploy" → "Manage deployments"
   - Click the "Edit" icon (pencil)
   - Change "Version" to "New version"
   - Click "Deploy"

## ✅ **After Update:**

Your app will now:
- ✅ **Save changes to Google Sheets** automatically
- ✅ **Sync across ALL devices** within 10 seconds
- ✅ **No CORS errors** (uses form data instead of JSON)
- ✅ **Work on any device** worldwide

## 🧪 **Test It:**

1. **Update your Apps Script** with the code above
2. **Go to admin panel**: http://localhost:5173/admin
3. **Add/edit a menu item**
4. **Check your Google Sheet** - changes should appear!
5. **Open app on another device** - changes appear within 10 seconds!

---

**This will give you TRUE cross-device automatic sync!** 🎉
