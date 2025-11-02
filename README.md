# 🍽️ Modern Restaurant Menu Web App

A beautiful, responsive 3-page digital restaurant menu application built with React, Tailwind CSS, and Framer Motion. Perfect for restaurants looking to provide a modern digital dining experience.

## ✨ Features

### 🏠 **Home Page**
- **Animated Hero Section** with background slideshow of restaurant images
- **Two Action Buttons**: "Explore Menu" (smooth scroll) and "Payment" (page redirect)
- **Featured Carousel** showcasing chef's special dishes
- **Complete Menu Section** with filtering and search capabilities
- **Like System** - customers can like items (stored locally, simulates database)
- **Responsive Design** - works perfectly on all devices

### 💳 **Payment Page**
- **Two Payment Methods**: Telebirr and CBE Mobile Banking
- **Direct Integration**: Click-to-call and account number copying
- **Clear Instructions** for both payment methods
- **Secure Design** with professional layout

### ⚙️ **Admin Panel**
- **Password Protected** access (demo: `admin123` or `restaurant2024`)
- **Full CRUD Operations**: Add, Edit, Delete menu items
- **Form Validation** and user-friendly interface
- **Local Storage** - no backend required for demo
- **Real-time Updates** - changes reflect immediately

### 🎨 **Design Features**
- **Dark Theme** with golden accent colors
- **Smooth Animations** using Framer Motion
- **Glass Morphism** effects and modern UI
- **Responsive Layout** for all screen sizes
- **Professional Typography** and spacing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/modern-restaurant-menu.git
cd modern-restaurant-menu

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### 🌐 Live Demo
- **Live App**: [https://your-app-name.vercel.app](https://your-app-name.vercel.app)
- **Admin Panel**: [https://your-app-name.vercel.app/admin](https://your-app-name.vercel.app/admin) (Password: `admin123`)

### 🚀 Deploy Your Own
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/modern-restaurant-menu)

## 📁 Project Structure

```
modern-restaurant-menu/
├── src/
│   ├── components/
│   │   ├── BackgroundSlideshow.jsx
│   │   ├── FeaturedCarousel.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── MenuCard.jsx
│   │   └── MenuFilters.jsx
│   ├── data/
│   │   └── menuData.js
│   ├── pages/
│   │   ├── Admin.jsx
│   │   ├── Home.jsx
│   │   └── Payment.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎯 Customization Guide

### 🏷️ **Restaurant Branding**
Edit `src/data/menuData.js`:

```javascript
export const restaurantConfig = {
  name: 'Your Restaurant Name',
  tagline: 'Your Tagline',
  description: 'Your description',
  phone: '+1 (555) 123-4567',
  address: 'Your Address',
  // ... more settings
}
```

### 🎨 **Theme Colors**
Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#f59e0b', // Change this for different brand color
    600: '#d97706',
    // ... other shades
  }
}
```

### 🍽️ **Menu Items**
Edit `src/data/menuData.js`:

```javascript
export const sampleMenuItems = [
  {
    id: 1,
    name: 'Your Dish Name',
    price: 12.99,
    category: 'breakfast', // breakfast, lunch, dinner, drinks, desserts
    description: 'Your description',
    image: 'https://your-image-url.com',
    featured: true // Show in carousel
  },
  // ... more items
]
```

### 💳 **Payment Configuration**
Update payment details in `src/data/menuData.js`:

```javascript
payment: {
  telebirr: {
    phone: 'your-telebirr-number',
    link: 'https://telebirr.et/payment'
  },
  cbe: {
    account: 'your-account-number',
    link: 'https://cbe.com.et/mobile-banking'
  }
}
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📱 Features in Detail

### **Like System**
- Customers can like/unlike menu items
- Like counts are stored in localStorage
- "Most Liked" badges appear on popular items
- Simulates a real database for demo purposes

### **Admin Panel**
- Access: `/admin`
- Default passwords: `admin123` or `restaurant2024`
- Add new menu items with image URLs
- Edit existing items
- Delete items with confirmation
- Mark items as "Featured" for carousel display

### **Responsive Design**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly buttons and interactions
- Optimized images and performance

### **Animations**
- Page transitions with Framer Motion
- Hover effects on cards and buttons
- Smooth scrolling navigation
- Loading animations and micro-interactions

## 🎨 Design System

### **Colors**
- **Primary**: Golden yellow (#f59e0b)
- **Background**: Dark navy (#0f172a, #1e293b)
- **Text**: Light gray (#f8fafc)
- **Accent**: Various shades of primary color

### **Typography**
- **Font**: Inter (system fallback)
- **Headings**: Bold, large sizes
- **Body**: Regular weight, good contrast
- **Code**: Monospace for technical elements

### **Components**
- **Glass Effect**: Backdrop blur with transparency
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Gradient backgrounds, hover effects
- **Forms**: Clean inputs with focus states

## 🔒 Security Notes

- Admin panel uses simple password authentication
- All data stored in localStorage (client-side only)
- No sensitive data transmission
- Perfect for demo and development purposes

## 📈 Performance

- **Optimized Images**: Lazy loading and proper sizing
- **Code Splitting**: React Router for page-based splits
- **Animations**: Hardware-accelerated CSS transforms
- **Bundle Size**: Minimal dependencies for fast loading

## 🌟 Future Enhancements

- Real backend integration
- User authentication system
- Order management
- Payment gateway integration
- Multi-language support
- Analytics dashboard

## 🚀 Deployment

This app is ready for deployment on Vercel, Netlify, or any static hosting service.

### Quick Deploy to Vercel:
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Deploy automatically!

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For customization services or support:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🌟 Features Showcase

- ✅ **Responsive Design** - Works on all devices
- ✅ **Modern UI/UX** - Dark theme with golden accents
- ✅ **Smooth Animations** - Framer Motion powered
- ✅ **Admin Panel** - Easy menu management
- ✅ **Like System** - Customer engagement
- ✅ **Payment Integration** - Telebirr & CBE ready
- ✅ **SEO Optimized** - Fast loading and indexed
- ✅ **PWA Ready** - Can be installed as app

---

**Built with ❤️ for amazing restaurant experiences**

### 🎯 Perfect for:
- Restaurants and cafes
- Food trucks
- Catering services
- Hotel dining
- Event venues

**Ready to customize and deploy!** 🚀