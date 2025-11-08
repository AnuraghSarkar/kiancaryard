import { useState, useEffect } from 'react'
import { Car, Clock, CheckCircle, XCircle, Mail, Eye, TrendingUp } from 'lucide-react'
import axios from 'axios'

const DashboardStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats')
      setStats(response.data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading stats...</div>
  }

  if (!stats) return null

  const statCards = [
    {
      title: 'Total Cars',
      value: stats.totalCars,
      icon: <Car className="h-8 w-8" />,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pending Approval',
      value: stats.pendingCars,
      icon: <Clock className="h-8 w-8" />,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Approved',
      value: stats.approvedCars,
      icon: <CheckCircle className="h-8 w-8" />,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Rejected',
      value: stats.rejectedCars,
      icon: <XCircle className="h-8 w-8" />,
      color: 'bg-red-500',
      lightColor: 'bg-red-100',
      textColor: 'text-red-600'
    },
    {
      title: 'Total Enquiries',
      value: stats.totalEnquiries,
      icon: <Mail className="h-8 w-8" />,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'New Enquiries',
      value: stats.newEnquiries,
      icon: <Mail className="h-8 w-8" />,
      color: 'bg-pink-500',
      lightColor: 'bg-pink-100',
      textColor: 'text-pink-600'
    },
    {
      title: 'Added This Week',
      value: stats.recentCars,
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.lightColor} ${stat.textColor} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Most Viewed Car */}
      {stats.mostViewedCar && (
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">🏆 Most Viewed Car</h3>
              <p className="text-2xl font-semibold text-primary-600">{stats.mostViewedCar.name}</p>
              <p className="text-gray-600 mt-1">
                <Eye className="h-4 w-4 inline mr-1" />
                {stats.mostViewedCar.views} views
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardStats