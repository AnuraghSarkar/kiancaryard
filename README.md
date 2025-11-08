# 🚗 AutoDeals - Used Cars Marketplace

A modern, full-stack MERN (MongoDB, Express, React, Node.js) application for buying and selling used cars with AI-powered price estimation.

## ✨ Features

### Frontend
- 🎨 **Modern UI** - Built with React, Tailwind CSS, and Framer Motion
- 🔍 **Advanced Search** - Filter by make, price, year, and more
- 💫 **Smooth Animations** - Beautiful transitions and interactions
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 🤖 **AI Price Estimator** - Smart price suggestions for sellers
- 🖼️ **Image Gallery** - Multiple photos per listing
- ⚡ **Fast Loading** - Optimized with Vite

### Backend
- 🔐 **RESTful API** - Clean and documented endpoints
- 💾 **MongoDB Database** - Scalable data storage
- 🔍 **Advanced Filtering** - Query cars by multiple parameters
- 📊 **Statistics** - Market insights and analytics
- 🤖 **AI Estimation** - Price prediction algorithm

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd used-cars-marketplace
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string
```

3. **Install Frontend Dependencies**
```bash
cd ../client
npm install
```

4. **Start Development Servers**

Terminal 1 - Backend:
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
# App runs on http://localhost:3000
```

5. **Open your browser** to `http://localhost:3000`

## 📦 Project Structure

```
used-cars-marketplace/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API calls
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Helper functions
│   ├── package.json
│   └── vite.config.js
│
└── server/                # Express Backend
    ├── server.js          # Main server file
    ├── package.json
    └── .env.example       # Environment variables template
```

## 🌐 Deployment Guide

### Option 1: Deploy to Vercel (Frontend) + Render (Backend)

#### Frontend (Vercel)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set build settings:
   - Framework: Vite
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`
5. Add environment variable:
   - `VITE_API_URL`: Your backend URL
6. Deploy!

#### Backend (Render)
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your repository
4. Settings:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Environment Variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `PORT`: 5000
5. Deploy!

### Option 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add MongoDB database
4. Deploy both frontend and backend
5. Set environment variables

### Option 3: Deploy to Netlify + MongoDB Atlas

#### Setup MongoDB Atlas
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster (free tier available)
3. Get connection string
4. Whitelist all IPs (0.0.0.0/0) for development

#### Frontend (Netlify)
```bash
cd client
npm run build
# Drag and drop dist/ folder to Netlify
```

#### Backend (Render/Heroku/Railway)
Follow backend deployment steps above

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cars
PORT=5000
JWT_SECRET=your_secret_key
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000  # Development
# VITE_API_URL=https://your-backend.com  # Production
```

## 📝 API Endpoints

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create new listing
- `PUT /api/cars/:id` - Update listing
- `DELETE /api/cars/:id` - Delete listing

### Utilities
- `POST /api/estimate-price` - Get AI price estimation
- `GET /api/stats` - Get marketplace statistics
- `GET /api/health` - Health check

### Query Parameters (GET /api/cars)
- `make` - Filter by make
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `minYear` - Minimum year
- `maxYear` - Maximum year
- `search` - Search term

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **CORS** - Cross-origin requests

## 🚀 Quick Deploy Commands

```bash
# Build frontend
cd client && npm run build

# Start production server
cd server && npm start
```

## 📱 Features Coming Soon

- [ ] Image upload (Cloudinary integration)
- [ ] User authentication
- [ ] Favorites/Watchlist
- [ ] Advanced ML price prediction
- [ ] Email notifications
- [ ] Chat between buyer/seller
- [ ] Payment integration
- [ ] Admin dashboard

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit PRs.

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🆘 Support

If you have questions:
1. Check existing issues on GitHub
2. Create a new issue with details
3. Reach out to the maintainers

---

Built with ❤️ using MERN Stack
