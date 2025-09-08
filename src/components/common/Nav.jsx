import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Nav = () => {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <div className="w-full overflow-auto">
      <div className="w-full bg-[#8bbce6f3]">
        <div className="p-3 flex justify-between items-center">
          <h1 className="text-4xl font-semibold">
            <Link to="/">Claricom</Link>
          </h1>

          <ul className="flex gap-14 font-bold items-center justify-center text-[20px]">
            <li><Link to="/">Home</Link></li>
            {currentUser ? (
              <>
                <li><Link to="/student">Student</Link></li>
                <li><Link to="/mentor">Mentor</Link></li>
                <li><Link to="/sponsor">Sponsor</Link></li>
              </>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}
          </ul>

          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">Welcome, {currentUser.email}</span>
              <button 
                onClick={handleLogout}
                className="border border-transparent m-4 p-2 rounded-lg bg-[#f7DBEA] font-bold w-40"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/signup">
              <button className="border border-transparent m-4 p-2 rounded-lg bg-[#f7DBEA] font-bold w-40">
                Sign Up
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Nav