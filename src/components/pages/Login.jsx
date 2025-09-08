import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await login(email, password)
      navigate('/')
    } catch (error) {
      setError('Failed to log in: ' + error.message)
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center mt-10 gap-6 max-w-md mx-auto">
      <h1 className="text-4xl font-bold">Login</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full">{error}</div>}
      
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded w-full"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#f7DBEA] px-6 py-3 rounded-lg font-bold mt-4 disabled:opacity-50"
        >
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
      
      <p className="text-center">
        Need an account?{' '}
        <Link to="/signup" className="text-blue-600 underline">
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default Login
