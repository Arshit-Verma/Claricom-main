import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Hero = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const handleRoleButtonClick = (role) => {
    if (currentUser) {
      // User is logged in, navigate to appropriate page
      if (role === 'student') {
        navigate('/student-quiz')
      } else if (role === 'mentor') {
        navigate('/mentor')
      } else if (role === 'sponsor') {
        navigate('/sponsor')
      }
    } else {
      // User is not logged in, redirect to signup
      navigate('/signup')
    }
  }

  return (
    <div className='flex flex-col items-center mt-10 gap-6'>
      <div>
        <h1 className='font-bold text-5xl'>Building Futures, One Mind at a Time</h1>
      </div>

      <div className='font-semibold text-2xl'>
        A safe space to learn, grow, and succeed — together.
      </div>

      <div className='flex mt-7 gap-10 '>
        <div className='flex flex-col items-center'>
          <img src="./image 11.png" alt="" />
          <button
            onClick={() => handleRoleButtonClick('student')}
            className='border border-transparent m-4 p-2 rounded-lg bg-[#f7DBEA] font-bold w-40'
          >
            Student
          </button>
        </div>

        <div className='flex flex-col items-center'>
          <img src="./image 6.png" alt="" />
          <button
            onClick={() => handleRoleButtonClick('mentor')}
            className='border border-transparent m-4 p-2 rounded-lg bg-[#f7DBEA] font-bold w-40'
          >
            Mentor
          </button>
        </div>

        <div className='flex flex-col items-center'>
          <img src="./image 7.png" alt="" />
          <button
            onClick={() => handleRoleButtonClick('sponsor')}
            className='border border-transparent m-4 p-2 rounded-lg bg-[#f7DBEA] font-bold w-40'
          >
            Sponsor
          </button>
        </div>
      </div>

      <div className='flex gap-4 mt-6'>
        <button
          onClick={() => navigate('/login')}
          className='border border-transparent p-3 rounded-lg bg-blue-500 text-white font-bold w-32'
        >
          Login
        </button>
        <button
          onClick={() => navigate('/signup')}
          className='border border-transparent p-3 rounded-lg bg-green-500 text-white font-bold w-32'
        >
          Sign Up
        </button>
      </div>

      <div className='text-white text-2xl underline'>Help?</div>
    </div>
  )
}

export default Hero
