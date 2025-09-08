import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const Signup = () => {
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    phone: '',
    incomePerAnnum: ''
  });
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('')
      setLoading(true)
      
      // Create Firebase user
      const userCredential = await signup(formData.email, formData.password)
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username: formData.username,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        incomePerAnnum: formData.incomePerAnnum,
        createdAt: new Date().toISOString()
      })
      
      navigate('/')
    } catch (error) {
      setError('Failed to create an account: ' + error.message)
    }

    setLoading(false)
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-6 max-w-md mx-auto">
      <h1 className="text-4xl font-bold">Sign Up</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full">{error}</div>}
      
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          required
        />
        
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          required
        />
        
        <input
          type="date"
          name="dateOfBirth"
          placeholder="Date of Birth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          required
        />
        
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          required
        />
        
        <input
          type="number"
          name="incomePerAnnum"
          placeholder="Income Per Annum"
          value={formData.incomePerAnnum}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          required
        />
        
        <button
          type="submit"
          disabled={loading}
          className="bg-[#f7DBEA] px-6 py-3 rounded-lg font-bold mt-4 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      
      <p className="text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 underline">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Signup;
