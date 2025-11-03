# 🚀 Restaurant Menu - Supabase Setup Guide

This guide will help you set up Supabase for real-time menu synchronization across all devices.

## 📋 Prerequisites

- Node.js installed
- A Supabase account (free tier available)

## 🎯 Step 1: Create Supabase Project

1. **Go to [Supabase](https://supabase.com)**
2. **Sign up/Login** to your account
3. **Create a new project**:
   - Project name: `restaurant-menu`
   - Database password: Choose a strong password
   - Region: Select closest to your location
4. **Wait for project setup** (takes 1-2 minutes)

## 🗄️ Step 2: Create Database Table

1. **Go to SQL Editor** in your Supabase dashboard
2. **Run this SQL command** to create the menu table:

```sql
-- Create menu_items table
CREATE TABLE menu_items (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    featured BOOLEAN DEFAULT false,
    original_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
-- In production, you should create more restrictive policies
CREATE POLICY "Allow all operations on menu_items" ON menu_items
    FOR ALL USING (true) WITH CHECK (true);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
```

3. **Click "Run"** to execute the SQL

## 🔑 Step 3: Get Your Credentials

1. **Go to Settings → API** in your Supabase dashboard
2. **Copy these values**:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## ⚙️ Step 4: Configure Your App

1. **Create a `.env` file** in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. **Replace the placeholder values** with your actual Supabase credentials

## 🚀 Step 5: Start Your App

```bash
npm run dev
```

## ✅ Step 6: Test the Setup

1. **Open the app** in your browser
2. **Go to Admin Panel** (`/admin`)
3. **Login** with password: `admin123`
4. **Add a menu item** - you should see: "🚀 Menu updated! Changes are live across all devices instantly!"
5. **Open another browser tab** - changes should appear immediately
6. **Check Supabase dashboard** - data should appear in the `menu_items` table

## 🔧 Troubleshooting

### ❌ "Supabase not configured" message
- Check your `.env` file exists and has correct values
- Restart your development server after adding `.env`

### ❌ "Failed to sync with Supabase" message
- Verify your Supabase URL and key are correct
- Check if the `menu_items` table exists in your database
- Ensure RLS policies are set up correctly

### ❌ Real-time updates not working
- Verify you ran the `ALTER PUBLICATION` command
- Check browser console for subscription errors
- Try refreshing the page

## 🎉 Features You Get

✅ **Real-time Sync**: Changes appear instantly on all devices
✅ **Offline Support**: App works offline with localStorage backup
✅ **Admin Authentication**: Secure device-based admin access
✅ **Automatic Backups**: Data is automatically backed up locally
✅ **Scalable**: Supabase handles unlimited concurrent users
✅ **Free Tier**: 50,000 monthly active users included

## 📊 Supabase Dashboard Features

- **Table Editor**: View and edit menu items directly
- **Real-time Logs**: See all database operations
- **API Documentation**: Auto-generated API docs
- **Authentication**: Add user login if needed later
- **Storage**: Add image uploads if needed later

## 🔒 Security Notes

The current setup uses permissive RLS policies for simplicity. For production:

1. **Create admin-only policies**:
```sql
-- Drop the permissive policy
DROP POLICY "Allow all operations on menu_items" ON menu_items;

-- Create read-only policy for public
CREATE POLICY "Allow read access to menu_items" ON menu_items
    FOR SELECT USING (true);

-- Create admin-only write policy (requires authentication)
CREATE POLICY "Allow admin write access to menu_items" ON menu_items
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
```

2. **Set up proper authentication** for admin users

## 💡 Next Steps

- **Custom Domain**: Set up custom domain in Supabase settings
- **Image Storage**: Use Supabase Storage for menu item images
- **Analytics**: Add Supabase Analytics to track usage
- **Backup**: Set up automated database backups

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Supabase project is active
3. Ensure all SQL commands were executed successfully
4. Check that your `.env` file is properly formatted

---

**🎊 Congratulations!** Your restaurant menu now has real-time synchronization across all devices!