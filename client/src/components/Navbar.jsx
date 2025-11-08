import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Kian Car Yard
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/listings" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Browse Cars
            </Link>
            <Link to="/admin/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Login
            </Link>
            <Link to="/sell" className="btn-primary">
              Sell Your Car
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/listings"
              className="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Browse Cars
            </Link>
            <Link
              to="/admin/login"
              className="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/sell"
              className="block px-3 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sell Your Car
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar