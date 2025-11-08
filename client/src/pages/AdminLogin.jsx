import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'

const AdminLogin = () => {
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'Seresht@Mos@'|| password === 'Sur@sh@123') {
      localStorage.setItem('isAdmin', 'true')
      navigate('/admin/dashboard')
    } else {
      alert('Wrong password!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="card p-8 w-full max-w-md">
        <Lock className="h-12 w-12 mx-auto mb-4 text-primary-600" />
        <h1 className="text-2xl font-bold text-center mb-6">Kian Car Yard</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter admin password"
            className="input-field mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin