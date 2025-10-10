# Snuggle Read - University Bookstore Frontend

## 🎓 Project Overview
Snuggle Read is a comprehensive e-commerce bookstore platform designed specifically for university students. The application provides both student shopping features and admin book management capabilities.

## ✨ Features

### Student Features
- **User Authentication**: Login/Register with university email validation
- **Book Browsing**: Browse books by genre with search and sorting
- **Shopping Cart**: Add/remove books with automatic student discounts (5%)
- **Order Management**: Track order history and status
- **University Benefits**: Student discounts, free shipping, priority support

### Admin Features
- **Book Management**: Full CRUD operations for book inventory
- **File Upload**: Upload book cover images via multipart form
- **Inventory Control**: Manage stock quantities and pricing
- **Genre Management**: Organize books by categories
- **Statistics Dashboard**: View sales and inventory metrics

### Technical Features
- **Responsive Design**: Mobile-friendly university-themed interface
- **Context Management**: React Context for authentication and cart state
- **API Integration**: Axios for backend communication
- **Error Handling**: Comprehensive error management and validation
- **Demo Mode**: Fallback when backend API is unavailable

## 🛠 Technology Stack
- **React 18.2.0**: Modern React with functional components and hooks
- **React Router 6.8.1**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **Context API**: State management for auth and cart
- **CSS3**: Custom styling with university branding

## 📚 Book Genres
The platform supports 8+ book genres:
- Academic Textbooks
- Science & Technology
- Literature & Fiction
- Business & Economics
- History & Politics
- Health & Medicine
- Arts & Design
- Engineering

## 🎨 Design Theme
- **Colors**: University blue (#2a5298) and green (#27ae60)
- **Typography**: Clean, academic-focused fonts
- **Layout**: Card-based design with responsive grid
- **Icons**: Educational and book-themed emojis
- **Branding**: "Snuggle Read" with university messaging

## 👥 User Types

This application supports multiple user roles (for example: Student/Customer and Admin). Admin accounts are intended to be provisioned securely through the backend or via a protected admin interface. Do not publish real credentials in source code or public docs.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📁 Project Structure
```
src/
├── components/
│   └── Header.js           # Navigation with cart and auth
├── context/
│   ├── AuthContext.js      # User authentication state
│   └── CartContext.js      # Shopping cart state
├── pages/
│   ├── Home.js            # University welcome page
│   ├── Login.js           # Authentication with demo accounts
│   ├── Register.js        # Student registration
│   ├── Books.js           # Book browsing and shopping
│   ├── Cart.js            # Shopping cart management
│   ├── Orders.js          # Order history and tracking
│   └── AdminDashboard.js  # Admin book management
├── services/
│   └── api.js             # API service layer
├── utils/
│   └── helpers.js         # Utility functions
├── App.js                 # Main app with routing
├── App.css               # University-themed styles
└── index.js              # React app entry point
```

## 🔌 Backend Integration
The frontend integrates with a Spring Boot backend that provides:
- User authentication and registration
- Book CRUD operations with file upload
- Order processing and management
- Contact information handling

## 📱 Responsive Features
- Mobile-optimized navigation
- Touch-friendly cart controls
- Responsive book grid layout
- Adaptive forms and modals
- University-themed mobile experience

## 🎯 University Focus
- Student email validation (.ac.za domains)
- Academic book categories
- Student discount system
- University branding and messaging
- Educational support features

## 🔧 Development Notes
- Uses React functional components with hooks
- Context API for global state management
- Error boundaries for robust error handling
- Demo mode for development without backend
- Comprehensive form validation
- Accessibility considerations

## 📋 Future Enhancements
- Payment gateway integration
- Real-time inventory updates
- Book recommendation system
- Multi-language support
- Advanced search filters
- Social features and reviews