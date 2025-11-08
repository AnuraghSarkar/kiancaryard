#!/bin/bash

echo "🚗 AutoDeals - Quick Start Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please edit server/.env with your MongoDB connection string"
fi
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd server && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd client && npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
