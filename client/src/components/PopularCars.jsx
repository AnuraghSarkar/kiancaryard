import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import axios from 'axios'

const PopularCars = () => {
  const [popularCars, setPopularCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPopularCars()
  }, [])

  const fetchPopularCars = async () => {
    try {
      const response = await axios.get('/api/cars/popular')
      setPopularCars(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching popular cars:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading popular cars...</div>
  }

  if (popularCars.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {popularCars.map((car, index) => (
        <Link key={car._id} to={`/car/${car._id}`} className="card group">
          <div className="relative overflow-hidden">
            <img
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              ${car.price.toLocaleString()}
            </div>
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              🔥 HOT
            </div>
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {car.views || 0}
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold mb-2 group-hover:text-primary-600 transition-colors">
              {car.year} {car.make} {car.model}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>{car.mileage.toLocaleString()} km</div>
              <div>{car.transmission}</div>
              <div>{car.fuelType}</div>
              <div>{car.location}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default PopularCars