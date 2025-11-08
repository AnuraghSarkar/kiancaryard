import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, Grid, List, ArrowUpDown } from 'lucide-react'
import axios from 'axios'

const Listings = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  
  const [filters, setFilters] = useState({
    make: '',
    bodyType: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    transmission: '',
    fuelType: ''
  })

  const [sortBy, setSortBy] = useState('recent') // recent, price-low, price-high, year-new, year-old, mileage

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const response = await axios.get('/api/cars')
      setCars(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching cars:', error)
      setLoading(false)
    }
  }
  let filteredCars = cars.filter(car => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        car.make.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        (car.description && car.description.toLowerCase().includes(query))
      if (!matchesSearch) return false
    }
    
    // Other filters
    if (filters.make && !car.make.toLowerCase().includes(filters.make.toLowerCase())) return false
    if (filters.bodyType && car.bodyType !== filters.bodyType) return false
    if (filters.transmission && car.transmission !== filters.transmission) return false
    if (filters.fuelType && car.fuelType !== filters.fuelType) return false
    if (filters.priceMin && car.price < parseInt(filters.priceMin)) return false
    if (filters.priceMax && car.price > parseInt(filters.priceMax)) return false
    if (filters.yearMin && car.year < parseInt(filters.yearMin)) return false
    if (filters.yearMax && car.year > parseInt(filters.yearMax)) return false
    return true
  })

  // Sorting
  if (sortBy === 'price-low') {
    filteredCars = [...filteredCars].sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-high') {
    filteredCars = [...filteredCars].sort((a, b) => b.price - a.price)
  } else if (sortBy === 'year-new') {
    filteredCars = [...filteredCars].sort((a, b) => b.year - a.year)
  } else if (sortBy === 'year-old') {
    filteredCars = [...filteredCars].sort((a, b) => a.year - b.year)
  } else if (sortBy === 'mileage') {
    filteredCars = [...filteredCars].sort((a, b) => a.mileage - b.mileage)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Cars</h1>
        <p className="text-gray-600">
          {searchQuery ? `Search results for "${searchQuery}"` : 'Find your perfect vehicle from our extensive collection'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <div className="flex items-center mb-6">
              <Filter className="h-5 w-5 mr-2 text-primary-600" />
              <h2 className="text-xl font-bold">Filters</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Make</label>
                <input
                  type="text"
                  placeholder="e.g., Toyota"
                  className="input-field"
                  value={filters.make}
                  onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Body Type</label>
                <select
                  className="input-field"
                  value={filters.bodyType}
                  onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
                >
                  <option value="">All Types</option>
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
                <label className="block text-sm font-medium mb-2">Transmission</label>
                <select
                  className="input-field"
                  value={filters.transmission}
                  onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fuel Type</label>
                <select
                  className="input-field"
                  value={filters.fuelType}
                  onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="input-field"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="input-field"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Year Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="input-field"
                    value={filters.yearMin}
                    onChange={(e) => setFilters({ ...filters, yearMin: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="input-field"
                    value={filters.yearMax}
                    onChange={(e) => setFilters({ ...filters, yearMax: e.target.value })}
                  />
                </div>
              </div>

              <button
                onClick={() => setFilters({ make: '', bodyType: '', transmission: '', fuelType: '', priceMin: '', priceMax: '', yearMin: '', yearMax: '' })}
                className="w-full btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Car Listings */}
        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-gray-600">{filteredCars.length} cars found</p>
            
            <div className="flex gap-3 items-center">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field py-2"
                >
                  <option value="recent">Most Recent</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="year-new">Year: Newest First</option>
                  <option value="year-old">Year: Oldest First</option>
                  <option value="mileage">Mileage: Low to High</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {filteredCars.map((car) => (
              <Link key={car._id} to={`/car/${car._id}`} className="card group">
                <div className="relative overflow-hidden">
                  <img src={car.images[0]}
              alt={`${car.make} ${car.model}`} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
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
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    <div>{car.mileage.toLocaleString()} km</div>
                    <div>{car.transmission}</div>
                    <div>{car.fuelType}</div>
                    <div>{car.location}</div>
                  </div>
                  {car.features && car.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {car.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Listings