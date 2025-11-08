import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const SimilarCars = ({ currentCarId, make, price, bodyType }) => {
  const [similarCars, setSimilarCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSimilarCars()
  }, [currentCarId])

  const fetchSimilarCars = async () => {
    try {
      const response = await axios.get(`/api/cars/similar/${currentCarId}`, {
        params: { make, price, bodyType }
      })
      setSimilarCars(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching similar cars:', error)
      setLoading(false)
    }
  }

  if (loading || similarCars.length === 0) {
    return null
  }

  return (
    <div className="mt-12 border-t pt-12">
      <h2 className="text-3xl font-bold mb-8">Similar Cars You Might Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {similarCars.map((car, index) => (
          <Link key={car._id} to={`/car/${car._id}`} className="card group">
            <div className="relative overflow-hidden">
              <img
                src={car.image[0]}
                alt={`${car.make} ${car.model}`}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ${car.price.toLocaleString()}
              </div>
              {car.bodyType && (
                <div className="absolute top-4 left-4 bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                  {car.bodyType}
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
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
    </div>
  )
}

export default SimilarCars