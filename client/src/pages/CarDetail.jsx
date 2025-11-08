import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, Gauge, Calendar, Fuel, Settings, Shield, Phone, Mail } from 'lucide-react'
import axios from 'axios'
import SimilarCars from '../components/SimilarCars'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


const CarDetail = () => {
  const { id } = useParams()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const slideInterval = useRef(null)

  const [enquiry, setEnquiry] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  useEffect(() => {
    fetchCar()
  }, [id])

  const fetchCar = async () => {
    try {
      const response = await axios.get(`/api/cars/${id}`)
      setCar(response.data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const sendEnquiry = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/enquiries', {
        ...enquiry,
        carId: car._id,
        carDetails: `${car.year} ${car.make} ${car.model}`
      })
      alert('Enquiry sent successfully! Seller will contact you soon.')
      setShowEnquiry(false)
      setEnquiry({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error(error)
      alert('Error sending enquiry')
    }
  }

  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return ''
    let cleaned = phone.replace(/[\s\-\(\)]/g, '')
    if (cleaned.startsWith('0')) cleaned = '61' + cleaned.substring(1)
    if (!cleaned.startsWith('61')) cleaned = '61' + cleaned
    return cleaned
  }

  // autoplay carousel
  useEffect(() => {
    if (!car) return
    if (isHovered) {
      clearInterval(slideInterval.current)
      return
    }
    slideInterval.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carImages.length)
    }, 4000)
    return () => clearInterval(slideInterval.current)
  }, [car, isHovered])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Car not found</h1>
          <p className="text-gray-600">This car listing doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

const carImages = car.images || []
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
       {/* ✨ Sexy Image Carousel */}
          <div 
            className="card p-0 mb-6 overflow-hidden rounded-2xl shadow-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative group">
              <div className="relative w-full h-full overflow-hidden rounded-xl">
              <Zoom>
                <img
                  src={carImages[currentImageIndex]}
                  alt={`${car.make} ${car.model} view ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover rounded-xl transition-transform duration-700 ease-in-out hover:scale-105"
                />
              </Zoom>
            </div>
              {/* Prev Button */}
              <button
                onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? carImages.length - 1 : currentImageIndex - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={() => setCurrentImageIndex((currentImageIndex + 1) % carImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                {currentImageIndex + 1} / {carImages.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-gray-50">
              {carImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                    currentImageIndex === index 
                      ? 'ring-4 ring-primary-600 scale-105' 
                      : 'hover:opacity-75'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-24 h-20 object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Mobile Dots */}
            <div className="flex justify-center gap-2 pb-4 md:hidden">
              {carImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index 
                      ? 'bg-primary-600 w-6' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="card p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">
              {car.year} {car.make} {car.model}
            </h1>
            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="h-4 w-4 mr-2" />
              {car.location}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center">
                <Gauge className="h-5 w-5 mr-2 text-primary-600" />
                <div>
                  <div className="text-xs text-gray-500">Mileage</div>
                  <div className="font-semibold">{car.mileage.toLocaleString()} km</div>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                <div>
                  <div className="text-xs text-gray-500">Year</div>
                  <div className="font-semibold">{car.year}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary-600" />
                <div>
                  <div className="text-xs text-gray-500">Transmission</div>
                  <div className="font-semibold">{car.transmission}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Fuel className="h-5 w-5 mr-2 text-primary-600" />
                <div>
                  <div className="text-xs text-gray-500">Fuel Type</div>
                  <div className="font-semibold">{car.fuelType}</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{car.description}</p>
            </div>

            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Color</div>
                  <div className="font-semibold">{car.color || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Transmission</div>
                  <div className="font-semibold">{car.transmission}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fuel Type</div>
                  <div className="font-semibold">{car.fuelType}</div>
                </div>
              </div>
            </div>

            {car.features && car.features.length > 0 && (
              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Shield className="h-4 w-4 mr-2 text-primary-600" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <div className="text-3xl font-bold text-primary-600 mb-6">
              ${car.price.toLocaleString()}
            </div>

            <div className="flex flex-col gap-3">
  <button
    onClick={() => setShowEnquiry(true)}
    className="btn-primary"
  >
    <Mail className="h-5 w-5 mr-2 inline" />
    Send Enquiry
  </button>
  
    <div className="grid grid-cols-2 gap-3">
        <a href={`tel:${car.phone}`} className="btn-secondary text-center">
          <Phone className="h-5 w-5 mr-2 inline" />
          Call
        </a>
        <a 
          href={`https://wa.me/61434516688?text=Hi, I'm interested in the ${car.year} ${car.make} ${car.model} listed for $${car.price.toLocaleString()}. Can you provide more details?`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary bg-green-500 hover:bg-green-600 text-center"
        >
          <svg className="h-5 w-5 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </a>
      </div>
    </div>

            {showEnquiry && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-4">Send Enquiry</h3>
                <form onSubmit={sendEnquiry} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    className="input-field"
                    value={enquiry.name}
                    onChange={(e) => setEnquiry({...enquiry, name: e.target.value})}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    required
                    className="input-field"
                    value={enquiry.email}
                    onChange={(e) => setEnquiry({...enquiry, email: e.target.value})}
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    required
                    className="input-field"
                    value={enquiry.phone}
                    onChange={(e) => setEnquiry({...enquiry, phone: e.target.value})}
                  />
                  <textarea
                    placeholder="Your message..."
                    required
                    rows="3"
                    className="input-field"
                    value={enquiry.message}
                    onChange={(e) => setEnquiry({...enquiry, message: e.target.value})}
                  />
                  <button type="submit" className="w-full btn-primary">
                    Send Enquiry
                  </button>
                </form>
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="font-bold mb-4">Seller Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold">{car.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold">{car.email}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-primary-600 mr-3 mt-1" />
                  <div className="text-sm">
                    <div className="font-semibold text-primary-900 mb-1">Protected Purchase</div>
                    <div className="text-gray-700">
                      All transactions are secured and verified by Kian Car Yard to ensure a safe buying experience.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Similar Cars */}
      <SimilarCars 
        currentCarId={id} 
        make={car.make} 
        price={car.price}
        bodyType={car.bodyType}
      />
    </div>
  )
}

export default CarDetail