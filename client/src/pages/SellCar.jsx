import { useState } from 'react'
import { Upload, DollarSign, Sparkles, X } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
const SellCar = () => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    price: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Sedan', 
    color: '',
    description: '',
    location: '',
    phone: '',
    email: ''
  })

  const [estimatedPrice, setEstimatedPrice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState([])

  const availableFeatures = [
    'Air Conditioning',
    'Bluetooth',
    'Reverse Camera',
    'Cruise Control',
    'Leather Seats',
    'Sunroof',
    'Alloy Wheels',
    'ABS Brakes',
    'Airbags',
    'Power Windows',
    'Central Locking',
    'Navigation System',
    'Heated Seats',
    'Parking Sensors',
    'Keyless Entry',
    'Apple CarPlay',
    'Android Auto',
    'Roof Rack',
    'Tow Bar',
    'Electric Seats'
  ]

  const toggleFeature = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature))
    } else {
      setSelectedFeatures([...selectedFeatures, feature])
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    
    if (uploadedImages.length + files.length > 5) {
      toast.warning('Maximum 10 images allowed')
      return
    }

    setUploading(true)
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setUploadedImages([...uploadedImages, ...response.data.images])
      setUploading(false)
      toast.success('Images uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      setUploading(false)
      toast.error('Error uploading images')
    }
  }

  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  const estimatePrice = async () => {
    if (!formData.make || !formData.model || !formData.year || !formData.mileage) {
      toast.error('Please fill in make, model, year, and mileage to get an estimate')
      return
    }

    setLoading(true)
    
    try {
      const response = await axios.post('/api/estimate-price', {
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        color: formData.color
      })
      
      setEstimatedPrice(response.data)
      setFormData({ ...formData, price: response.data.estimatedPrice.toString() })
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
      toast.error('Failed to estimate price')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (uploadedImages.length === 0) {
      toast.warning('Please upload at least one image of your car')
      return
    }
    
    try {
      await axios.post('/api/cars', {
        ...formData,
        features: selectedFeatures,
        images: uploadedImages
      })
      toast.success('Car submitted for approval! Admin will review it soon.')
      // Reset form
      setFormData({
        make: '', model: '', year: '', mileage: '', price: '',
        transmission: 'Automatic', fuelType: 'Petrol', bodyType: 'Sedan', color: '',
        description: '', location: '', phone: '', email: ''
      })
      setEstimatedPrice(null)
      setSelectedFeatures([])
      setUploadedImages([])
    } catch (error) {
      console.error('Error listing car:', error)
      alert('Error submitting car')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Sell Your Car</h1>
        <p className="text-xl text-gray-600">
          List your car in minutes and reach thousands of potential buyers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8">
        {/* AI Price Estimator Box */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-xl mb-8">
          <div className="flex items-center mb-4">
            <Sparkles className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-bold text-primary-900">AI Price Estimator</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Fill in your car details below and click estimate to get an AI-powered price suggestion
          </p>
          
          {estimatedPrice && (
            <div className="bg-white p-4 rounded-lg mb-4 space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">AI Estimated Market Value</div>
                <div className="text-3xl font-bold text-primary-600">
                  ${estimatedPrice.estimatedPrice.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Range: ${estimatedPrice.minPrice.toLocaleString()} - ${estimatedPrice.maxPrice.toLocaleString()}
                </div>
              </div>
              
              <div className="flex gap-2 text-xs">
                <span className={`px-2 py-1 rounded ${
                  estimatedPrice.confidence === 'high' ? 'bg-green-100 text-green-800' :
                  estimatedPrice.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {estimatedPrice.confidence} confidence
                </span>
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">
                  Market: {estimatedPrice.marketTrend}
                </span>
              </div>
              
              {estimatedPrice.reasoning && (
                <div className="text-xs text-gray-600 italic border-l-2 border-primary-600 pl-3">
                  💡 {estimatedPrice.reasoning}
                </div>
              )}
            </div>
          )}
          
          <button
            type="button"
            onClick={estimatePrice}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Calculating...' : 'Estimate Price'}
          </button>
        </div>

        {/* Car Details */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Car Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Make *</label>
              <input
                type="text"
                name="make"
                required
                placeholder="e.g., Toyota"
                className="input-field"
                value={formData.make}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Model *</label>
              <input
                type="text"
                name="model"
                required
                placeholder="e.g., Camry"
                className="input-field"
                value={formData.model}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Year *</label>
              <input
                type="number"
                name="year"
                required
                min="1990"
                max={new Date().getFullYear() + 1}
                placeholder="e.g., 2020"
                className="input-field"
                value={formData.year}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mileage (km) *</label>
              <input
                type="number"
                name="mileage"
                required
                placeholder="e.g., 50000"
                className="input-field"
                value={formData.mileage}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price ($) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  required
                  placeholder="e.g., 25000"
                  className="input-field pl-10"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Color *</label>
              <input
                type="text"
                name="color"
                required
                placeholder="e.g., Silver"
                className="input-field"
                value={formData.color}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Transmission *</label>
              <select
                name="transmission"
                required
                className="input-field"
                value={formData.transmission}
                onChange={handleChange}
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fuel Type *</label>
              <select
                name="fuelType"
                required
                className="input-field"
                value={formData.fuelType}
                onChange={handleChange}
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Body Type *</label>
            <select
              name="bodyType"
              required
              className="input-field"
              value={formData.bodyType}
              onChange={handleChange}
            >
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
              <option value="Wagon">Wagon</option>
              <option value="Ute">Ute</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              name="description"
              required
              rows="5"
              placeholder="Describe your car's condition, features, service history, etc."
              className="input-field"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location *</label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g., Sydney, NSW"
              className="input-field"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Contact Info */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g., 0412 345 678"
                  className="input-field"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your@email.com"
                  className="input-field"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <p className="text-gray-600 mb-4">Select all features that apply to your car</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableFeatures.map((feature) => (
                <label
                  key={feature}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedFeatures.includes(feature)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className={`text-sm ${
                    selectedFeatures.includes(feature) ? 'font-semibold text-primary-900' : 'text-gray-700'
                  }`}>
                    {feature}
                  </span>
                </label>
              ))}
            </div>
            
            {selectedFeatures.length > 0 && (
              <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                <p className="text-sm font-semibold text-primary-900 mb-2">
                  Selected Features ({selectedFeatures.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedFeatures.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-primary-600 text-white rounded-full text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Photo Upload */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-2xl font-bold mb-4">Car Photos *</h2>
            <div className="border-2 border-dashed border-primary-300 rounded-xl p-8 bg-primary-50">
              <div className="text-center mb-4">
                <Upload className="h-12 w-12 text-primary-600 mx-auto mb-3" />
                <p className="text-gray-700 font-medium mb-2">Upload photos of your car</p>
                <p className="text-sm text-gray-600 mb-4">Maximum 10 images (JPG, PNG, WEBP)</p>
                
                <label className="btn-primary cursor-pointer inline-block">
                  <Upload className="h-5 w-5 inline mr-2" />
                  Choose Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading || uploadedImages.length >= 5}
                  />
                </label>
              </div>
              
              {uploading && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary-600 mx-auto"></div>
                  <p className="text-primary-600 mt-2">Uploading images...</p>
                </div>
              )}
              
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`Car photo ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-primary-600 text-white text-xs px-2 py-0.5 rounded">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full btn-primary text-lg py-4 mt-8"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'List My Car'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SellCar