import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Eye, LogOut, Upload, X } from 'lucide-react'
import axios from 'axios'
import EnquiriesTab from '../components/EnquiriesTab'
import DashboardStats from '../components/DashboardStats'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [cars, setCars] = useState([])
  const [activeTab, setActiveTab] = useState('cars')
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [editUploadedImages, setEditUploadedImages] = useState([])
  
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Sedan',
    color: '',
    description: '',
    location: '',
    phone: '',
    email: ''
  })

  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [editFeatures, setEditFeatures] = useState([])

  const availableFeatures = [
    'Air Conditioning', 'Bluetooth', 'Reverse Camera', 'Cruise Control',
    'Leather Seats', 'Sunroof', 'Alloy Wheels', 'ABS Brakes',
    'Airbags', 'Power Windows', 'Central Locking', 'Navigation System',
    'Heated Seats', 'Parking Sensors', 'Keyless Entry', 'Apple CarPlay',
    'Android Auto', 'Roof Rack', 'Tow Bar', 'Electric Seats'
  ]

  const toggleFeature = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature))
    } else {
      setSelectedFeatures([...selectedFeatures, feature])
    }
  }

  const toggleEditFeature = (feature) => {
    if (editFeatures.includes(feature)) {
      setEditFeatures(editFeatures.filter(f => f !== feature))
    } else {
      setEditFeatures([...editFeatures, feature])
    }
  }

  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('isAdmin')) {
      navigate('/admin/login')
    }
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const response = await axios.get('/api/admin/cars')
      setCars(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  // Handle image upload
  const handleImageUpload = async (e, isEdit = false) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    
    if (files.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }

    setUploading(true)
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      if (isEdit) {
        setEditUploadedImages([...editUploadedImages, ...response.data.images])
      } else {
        setUploadedImages([...uploadedImages, ...response.data.images])
      }
      
      setUploading(false)
      toast.success('Images uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      setUploading(false)
      toast.error('Error uploading images')
    }
  }

  const removeImage = (index, isEdit = false) => {
    if (isEdit) {
      setEditUploadedImages(editUploadedImages.filter((_, i) => i !== index))
    } else {
      setUploadedImages(uploadedImages.filter((_, i) => i !== index))
    }
  }

  const updateCarStatus = async (id, status) => {
    try {
      await axios.put(`/api/cars/${id}/status`, { status })
      fetchCars()
      toast.success(`Car ${status}!`)
    } catch (error) {
      console.error(error)
    }
  }

  const addCar = async (e) => {
    e.preventDefault()
    
    if (uploadedImages.length === 0) {
      toast.warning('Please upload at least one image')
      return
    }
    
    try {
      await axios.post('/api/cars', {
        ...newCar,
        features: selectedFeatures,
        images: uploadedImages
      })
      setShowForm(false)
      setNewCar({
        make: '', model: '', year: '', price: '', mileage: '',
        transmission: 'Automatic', fuelType: 'Petrol', bodyType: 'Sedan', color: '',
        description: '', location: '', phone: '', email: ''
      })
      setSelectedFeatures([])
      setUploadedImages([])
      fetchCars()
      toast.success('Car added successfully! 🚗')
    } catch (error) {
      console.error(error)
      toast.error('Error adding car')
    }
  }

  const startEdit = (car) => {
    setEditingCar(car._id)
    setEditForm({
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      transmission: car.transmission,
      fuelType: car.fuelType,
      bodyType: car.bodyType || 'Sedan',
      color: car.color,
      description: car.description,
      location: car.location,
      phone: car.phone,
      email: car.email
    })
    setEditFeatures(car.features || [])
    setEditUploadedImages(car.images || [])
    setShowForm(false)
  }

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const updateCar = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`/api/cars/${editingCar}`, {
        ...editForm,
        features: editFeatures,
        images: editUploadedImages
      })
      setEditingCar(null)
      setEditForm({})
      setEditFeatures([])
      setEditUploadedImages([])
      fetchCars()
      toast.success('Car updated successfully! ✨')
    } catch (error) {
      console.error(error)
      toast.error('Error updating car')
    }
  }

  const cancelEdit = () => {
    setEditingCar(null)
    setEditForm({})
    setEditUploadedImages([])
  }

  const handleInputChange = (e) => {
    setNewCar({ ...newCar, [e.target.name]: e.target.value })
  }

const deleteCar = (id) => {
  toast.custom((t) => (
    <div className="bg-white p-4 rounded-lg shadow-lg border flex flex-col gap-3 text-sm">
      <p>Are you sure you want to delete this car?</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={async () => {
            toast.dismiss(t.id)
            try {
              await axios.delete(`/api/cars/${id}`)
              fetchCars()
              toast.success('Car deleted successfully 🚗💨')
            } catch (error) {
              console.error(error)
              toast.error('Error deleting car')
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          No
        </button>
      </div>
    </div>
  ))
}


  const logout = () => {
    localStorage.removeItem('isAdmin')
    navigate('/')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={logout} className="btn-secondary">
          <LogOut className="h-5 w-5 mr-2 inline" />
          Logout
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('cars')}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === 'cars' ? 'bg-primary-600 text-white' : 'bg-gray-200'
          }`}
        >
          Cars ({cars.length})
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === 'enquiries' ? 'bg-primary-600 text-white' : 'bg-gray-200'
          }`}
        >
          Enquiries
        </button>
      </div>

      <div className="mb-8">
        <DashboardStats />
      </div>

      {activeTab === 'cars' ? (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">All Listings ({cars.length})</h2>
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="btn-primary"
            >
              {showForm ? 'Cancel' : '+ Add New Car'}
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Add New Car</h3>
              <form onSubmit={addCar} className="grid grid-cols-2 gap-4">
                {/* Image Upload Section */}
                <div className="col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
                  <label className="block text-sm font-medium mb-3">
                    <Upload className="h-5 w-5 inline mr-2" />
                    Upload Car Images (Max 5)
                  </label>
                  
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="mb-4"
                    disabled={uploading}
                  />
                  
                  {uploading && <p className="text-primary-600">Uploading...</p>}
                  
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-4">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="relative">
                          <img src={img} alt={`Upload ${index + 1}`} className="w-full h-20 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeImage(index, false)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rest of the form fields... */}
                <input type="text" name="make" placeholder="Make" required className="input-field" value={newCar.make} onChange={handleInputChange} />
                <input type="text" name="model" placeholder="Model" required className="input-field" value={newCar.model} onChange={handleInputChange} />
                <input type="number" name="year" placeholder="Year" required className="input-field" value={newCar.year} onChange={handleInputChange} />
                <input type="number" name="price" placeholder="Price" required className="input-field" value={newCar.price} onChange={handleInputChange} />
                <input type="number" name="mileage" placeholder="Mileage (km)" required className="input-field" value={newCar.mileage} onChange={handleInputChange} />
                <input type="text" name="color" placeholder="Color" required className="input-field" value={newCar.color} onChange={handleInputChange} />
                
                <select name="transmission" className="input-field" value={newCar.transmission} onChange={handleInputChange}>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
                
                <select name="fuelType" className="input-field" value={newCar.fuelType} onChange={handleInputChange}>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
                
                <select name="bodyType" className="input-field" value={newCar.bodyType} onChange={handleInputChange}>
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
                
                <input type="text" name="location" placeholder="Location" required className="input-field" value={newCar.location} onChange={handleInputChange} />
                <textarea name="description" placeholder="Description" required className="input-field col-span-2" rows="3" value={newCar.description} onChange={handleInputChange} />
                <input type="tel" name="phone" placeholder="Phone" required className="input-field" value={newCar.phone} onChange={handleInputChange} />
                <input type="email" name="email" placeholder="Email" required className="input-field" value={newCar.email} onChange={handleInputChange} />
                
                <div className="col-span-2 border-t pt-4">
                  <label className="block text-sm font-medium mb-2">Features</label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded">
                    {availableFeatures.map((feature) => (
                      <label key={feature} className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" checked={selectedFeatures.includes(feature)} onChange={() => toggleFeature(feature)} className="rounded" />
                        <span>{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <button type="submit" className="btn-primary col-span-2" disabled={uploading}>
                  Add Car
                </button>
              </form>
            </div>
          )}

          {/* Edit form with same image upload - similar structure */}
          {editingCar && (
            <div className="mb-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-blue-900">Edit Car</h3>
                <button onClick={cancelEdit} className="text-red-600 hover:text-red-800 font-semibold">Cancel</button>
              </div>
              <form onSubmit={updateCar} className="grid grid-cols-2 gap-4">
                {/* Image Upload Section for Edit */}
                <div className="col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
                  <label className="block text-sm font-medium mb-3">
                    <Upload className="h-5 w-5 inline mr-2" />
                    Update Car Images
                  </label>
                  
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="mb-4"
                    disabled={uploading}
                  />
                  
                  {uploading && <p className="text-primary-600">Uploading...</p>}
                  
                  {editUploadedImages.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-4">
                      {editUploadedImages.map((img, index) => (
                        <div key={index} className="relative">
                          <img src={img} alt={`Upload ${index + 1}`} className="w-full h-20 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeImage(index, true)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Same form fields as Add form... */}
                <input type="text" name="make" placeholder="Make" required className="input-field" value={editForm.make} onChange={handleEditChange} />
                <input type="text" name="model" placeholder="Model" required className="input-field" value={editForm.model} onChange={handleEditChange} />
                <input type="number" name="year" placeholder="Year" required className="input-field" value={editForm.year} onChange={handleEditChange} />
                <input type="number" name="price" placeholder="Price" required className="input-field" value={editForm.price} onChange={handleEditChange} />
                <input type="number" name="mileage" placeholder="Mileage (km)" required className="input-field" value={editForm.mileage} onChange={handleEditChange} />
                <input type="text" name="color" placeholder="Color" required className="input-field" value={editForm.color} onChange={handleEditChange} />
                
                <select name="transmission" className="input-field" value={editForm.transmission} onChange={handleEditChange}>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
                
                <select name="fuelType" className="input-field" value={editForm.fuelType} onChange={handleEditChange}>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
                
                <select name="bodyType" className="input-field" value={editForm.bodyType} onChange={handleEditChange}>
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
                
                <input type="text" name="location" placeholder="Location" required className="input-field" value={editForm.location} onChange={handleEditChange} />
                <textarea name="description" placeholder="Description" required className="input-field col-span-2" rows="3" value={editForm.description} onChange={handleEditChange} />
                <input type="tel" name="phone" placeholder="Phone" required className="input-field" value={editForm.phone} onChange={handleEditChange} />
                <input type="email" name="email" placeholder="Email" required className="input-field" value={editForm.email} onChange={handleEditChange} />
                
                <div className="col-span-2 border-t pt-4">
                  <label className="block text-sm font-medium mb-2">Features</label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded">
                    {availableFeatures.map((feature) => (
                      <label key={feature} className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" checked={editFeatures.includes(feature)} onChange={() => toggleEditFeature(feature)} className="rounded" />
                        <span>{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <button type="submit" className="btn-primary col-span-2">Update Car</button>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Car</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Year</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Views</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <tr key={car._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{car.make} {car.model}</td>
                    <td className="p-3">${car.price?.toLocaleString()}</td>
                    <td className="p-3">{car.year}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        car.status === 'approved' ? 'bg-green-100 text-green-800' :
                        car.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {car.status}
                      </span>
                    </td>
                    <td className="p-3">{car.views || 0}</td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      {car.status === 'pending' && (
                        <>
                          <button onClick={() => updateCarStatus(car._id, 'approved')} className="text-green-600 hover:text-green-800 text-xs font-semibold">✓ Approve</button>
                          <button onClick={() => updateCarStatus(car._id, 'rejected')} className="text-red-600 hover:text-red-800 text-xs font-semibold">✗ Reject</button>
                        </>
                      )}
                      <button onClick={() => startEdit(car)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold">✏️ Edit</button>
                      <button onClick={() => navigate(`/car/${car._id}`)} className="text-primary-600 hover:text-primary-800"><Eye className="h-5 w-5 inline" /></button>
                      <button onClick={() => deleteCar(car._id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-5 w-5 inline" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EnquiriesTab />
      )}
    </div>
  )
}

export default AdminDashboard