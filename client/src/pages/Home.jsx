import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Shield, DollarSign, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import PopularCars from '../components/PopularCars'
const Home = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Verified Listings',
      description: 'All cars are inspected and verified for quality'
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: 'Best Prices',
      description: 'Competitive pricing with transparent history'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Quick Process',
      description: 'Buy or sell in minutes, not days'
    }
  ]

  const popularSearches = ['Toyota Camry', 'Honda Civic', 'Mazda 3', 'Hyundai i30', 'Ford Ranger']

  return (
    <div>
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Find Your Perfect Car
          </motion.h1>
          
          <motion.p 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl mb-10 text-primary-100"
          >
            Australia's most trusted used car marketplace
          </motion.p>

          {/* Search Bar with AI Suggestions */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search by make, model, or keyword..."
                  className="w-full py-3 bg-transparent focus:outline-none text-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={() => navigate(`/listings?search=${searchQuery}`)}
                className="btn-primary whitespace-nowrap"
              >
                Search Cars
              </button>
            </div>

            {/* Popular Searches */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-primary-100 text-sm">Popular:</span>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/listings?search=${search}`)}
                  className="text-sm bg-primary-500/30 hover:bg-primary-500/50 px-3 py-1 rounded-full transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Cars Listed' },
              { number: '5,000+', label: 'Happy Customers' },
              { number: '500+', label: 'Dealers' },
              { number: '4.8/5', label: 'Average Rating' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cars Section */}
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">🔥 Most Popular Cars</h2>
          <p className="text-xl text-gray-600">Check out our most viewed vehicles</p>
        </motion.div>

        <PopularCars />
      </div>
    </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Kian Car Yard?</h2>
            <p className="text-xl text-gray-600">We make buying and selling cars simple, safe, and stress-free</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="card p-8 text-center hover:scale-105 transition-transform"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <TrendingUp className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Ready to Find Your Next Car?</h2>
            <p className="text-xl mb-8 text-primary-100">Browse thousands of verified listings from trusted sellers</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/listings" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Browse All Cars
              </Link>
              <Link to="/sell" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
                Sell Your Car
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home