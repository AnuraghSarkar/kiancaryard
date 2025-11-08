import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import Groq from 'groq-sdk'
import { upload } from './config/cloudinary.js'
dotenv.config()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/used-cars'
    await mongoose.connect(mongoURI)
    console.log('✅ MongoDB Connected')
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message)
    process.exit(1)
  }
}

// Car Schema
const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number, required: true },
  transmission: { type: String, required: true },
  fuelType: { type: String, required: true },
  bodyType: { type: String },
  color: String,
  description: String,
  location: String,
  phone: String,
  email: String,
  images: [String],
  features: [String],
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

const Car = mongoose.model('Car', carSchema)

// Enquiry Schema
const enquirySchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  carDetails: String,
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new', enum: ['new', 'contacted', 'closed'] },
  createdAt: { type: Date, default: Date.now }
})

const Enquiry = mongoose.model('Enquiry', enquirySchema)

// ========================
// ROUTES
// ========================

// Get all cars with filters (public - only approved)
app.get('/api/cars', async (req, res) => {
  try {
    const { make, minPrice, maxPrice, minYear, maxYear, search } = req.query
    
    let query = { status: 'approved' }
    
    if (make) query.make = new RegExp(make, 'i')
    if (minPrice) query.price = { ...query.price, $gte: parseInt(minPrice) }
    if (maxPrice) query.price = { ...query.price, $lte: parseInt(maxPrice) }
    if (minYear) query.year = { ...query.year, $gte: parseInt(minYear) }
    if (maxYear) query.year = { ...query.year, $lte: parseInt(maxYear) }
    if (search) {
      query.$or = [
        { make: new RegExp(search, 'i') },
        { model: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ]
    }

    const cars = await Car.find(query).sort({ createdAt: -1 })
    res.json(cars)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all cars for admin (including pending)
app.get('/api/admin/cars', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 })
    res.json(cars)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get popular cars (most viewed) - MUST BE BEFORE /api/cars/:id
app.get('/api/cars/popular', async (req, res) => {
  try {
    const popularCars = await Car.find({ status: 'approved' })
      .sort({ views: -1 })
      .limit(4)
    res.json(popularCars)
  } catch (error) {
    console.error('Popular cars error:', error)
    res.status(500).json({ message: error.message })
  }
})

// Get similar cars - MUST BE BEFORE /api/cars/:id
app.get('/api/cars/similar/:id', async (req, res) => {
  try {
    const currentCar = await Car.findById(req.params.id)
    if (!currentCar) {
      return res.status(404).json({ message: 'Car not found' })
    }

    const { make, price, bodyType } = req.query
    
    const priceMin = price * 0.8
    const priceMax = price * 1.2

    const similarCars = await Car.find({
      _id: { $ne: req.params.id },
      status: 'approved',
      $or: [
        { make: make },
        { price: { $gte: priceMin, $lte: priceMax } },
        { bodyType: bodyType }
      ]
    })
    .limit(3)
    
    res.json(similarCars)
  } catch (error) {
    console.error('Similar cars error:', error)
    res.status(500).json({ message: error.message })
  }
})

// Get single car
app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
    if (!car) {
      return res.status(404).json({ message: 'Car not found' })
    }
    
    // Increment views
    car.views += 1
    await car.save()
    
    res.json(car)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Approve/Reject car
app.put('/api/cars/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    res.json(car)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new car listing
app.post('/api/cars', async (req, res) => {
  try {
    const car = new Car(req.body)
    const newCar = await car.save()
    res.status(201).json(newCar)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update car listing
app.put('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!car) {
      return res.status(404).json({ message: 'Car not found' })
    }
    res.json(car)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete car listing
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id)
    if (!car) {
      return res.status(404).json({ message: 'Car not found' })
    }
    res.json({ message: 'Car deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// AI Price Estimation
app.post('/api/estimate-price', async (req, res) => {
  try {
    const { make, model, year, mileage, transmission, fuelType, color } = req.body
    
    const prompt = `You are an Australian used car market expert. Estimate the current market price in AUD for:
    
Make: ${make}
Model: ${model}
Year: ${year}
Mileage: ${mileage} km
Transmission: ${transmission}
Fuel Type: ${fuelType}
Color: ${color}

Consider:
- Current Australian market trends (2024-2025)
- Depreciation based on age and mileage
- Popular colors and transmissions add value
- Hybrid/Electric premium
- Condition assumed as "good"

Return ONLY a JSON object with this exact format (no markdown, no extra text):
{
  "estimatedPrice": [number],
  "minPrice": [number],
  "maxPrice": [number],
  "confidence": "[high/medium/low]",
  "marketTrend": "[increasing/stable/declining]",
  "reasoning": "[brief 1-sentence explanation]"
}`

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 500
    })

    const response = chatCompletion.choices[0]?.message?.content
    
    let priceData
    try {
      priceData = JSON.parse(response)
    } catch (e) {
      console.error('JSON parse error, using fallback')
      const numbers = response.match(/\d+/g)
      priceData = {
        estimatedPrice: parseInt(numbers[0]) || 25000,
        minPrice: parseInt(numbers[1]) || 20000,
        maxPrice: parseInt(numbers[2]) || 30000,
        confidence: 'medium',
        marketTrend: 'stable',
        reasoning: 'AI estimation based on market data'
      }
    }

    priceData.factors = {
      basePrice: priceData.estimatedPrice,
      ageDepreciation: `${new Date().getFullYear() - year} years old`,
      mileageImpact: `${mileage.toLocaleString()} km`,
      transmissionBonus: transmission === 'Automatic' ? 'Standard' : 'Manual',
      fuelTypeBonus: fuelType === 'Hybrid' || fuelType === 'Electric' ? 'Premium' : 'Standard'
    }

    res.json(priceData)
    
  } catch (error) {
    console.error('Groq API Error:', error)
    
    const { year, mileage } = req.body
    const basePrice = 30000
    const yearDiff = new Date().getFullYear() - year
    const estimated = Math.max(10000, basePrice - (yearDiff * 2000) - (mileage / 10000 * 1000))
    
    res.json({
      estimatedPrice: Math.round(estimated),
      minPrice: Math.round(estimated * 0.9),
      maxPrice: Math.round(estimated * 1.1),
      confidence: 'medium',
      marketTrend: 'stable',
      reasoning: 'Basic estimation (AI unavailable)',
      factors: {
        basePrice: basePrice,
        ageDepreciation: `${yearDiff} years old`,
        mileageImpact: `${mileage.toLocaleString()} km`,
        transmissionBonus: 'Standard',
        fuelTypeBonus: 'Standard'
      }
    })
  }
})

// Create enquiry
app.post('/api/enquiries', async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body)
    const newEnquiry = await enquiry.save()
    res.status(201).json(newEnquiry)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get all enquiries (admin)
app.get('/api/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 })
    res.json(enquiries)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update enquiry status
app.put('/api/enquiries/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    res.json(enquiry)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get dashboard statistics
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalCars = await Car.countDocuments()
    const pendingCars = await Car.countDocuments({ status: 'pending' })
    const approvedCars = await Car.countDocuments({ status: 'approved' })
    const rejectedCars = await Car.countDocuments({ status: 'rejected' })
    
    const totalEnquiries = await Enquiry.countDocuments()
    const newEnquiries = await Enquiry.countDocuments({ status: 'new' })
    
    const mostViewedCar = await Car.findOne().sort({ views: -1 }).limit(1)
    
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentCars = await Car.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    })
    
    res.json({
      totalCars,
      pendingCars,
      approvedCars,
      rejectedCars,
      totalEnquiries,
      newEnquiries,
      mostViewedCar: mostViewedCar ? {
        name: `${mostViewedCar.year} ${mostViewedCar.make} ${mostViewedCar.model}`,
        views: mostViewedCar.views
      } : null,
      recentCars
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Upload car images
app.post('/api/upload', upload.array('images', 5), async (req, res) => {
  try {
    const imageUrls = req.files.map(file => file.path)
    res.json({ 
      success: true, 
      images: imageUrls 
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Connect to DB and start server
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
})