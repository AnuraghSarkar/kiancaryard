import { useState, useEffect } from 'react'
import { Mail, Phone, User } from 'lucide-react'
import axios from 'axios'

const EnquiriesTab = () => {
  const [enquiries, setEnquiries] = useState([])

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get('/api/enquiries')
      setEnquiries(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/enquiries/${id}`, { status })
      fetchEnquiries()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-4">
      {enquiries.map(enq => (
        <div key={enq._id} className="card p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-lg">{enq.carDetails}</h3>
              <p className="text-sm text-gray-500">
                {new Date(enq.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
        <button
            onClick={() => updateStatus(enq._id, 'new')}
            className={`px-3 py-1 rounded text-xs font-semibold ${
            enq.status === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
        >
            New
        </button>
        <button
            onClick={() => updateStatus(enq._id, 'contacted')}
            className={`px-3 py-1 rounded text-xs font-semibold ${
            enq.status === 'contacted' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
        >
            Contacted
        </button>
        <button
            onClick={() => updateStatus(enq._id, 'closed')}
            className={`px-3 py-1 rounded text-xs font-semibold ${
            enq.status === 'closed' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
        >
            Closed
        </button>
    </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-primary-600" />
              {enq.name}
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-primary-600" />
              {enq.email}
            </div>
            <div className="flex items-center col-span-2">
              <Phone className="h-4 w-4 mr-2 text-primary-600" />
              {enq.phone}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-700">{enq.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EnquiriesTab