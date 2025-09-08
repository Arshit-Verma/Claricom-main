import React from 'react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center mt-10 gap-10">
      <h1 className="text-5xl font-bold text-center">Building Futures, One Mind at a Time</h1>
      <p className="text-2xl text-center">A safe space to learn, grow, and succeed — together.</p>

      <div className="flex gap-10">
        <img src="./image 7.png" alt="" />
        <button
          onClick={() => navigate('/student-quiz')}
          className="bg-[#f7DBEA] px-6 py-3 rounded-lg font-bold"
        >
          Student
        </button>

        <img src="" alt="" />
        <button
          onClick={() => navigate('/mentor')}
          className="bg-[#f7DBEA] px-6 py-3 rounded-lg font-bold"
        >
          Mentor
        </button>

        <img src="" alt="" />
        <button
          onClick={() => navigate('/sponsor')}
          className="bg-[#f7DBEA] px-6 py-3 rounded-lg font-bold"
        >
          Sponsor
        </button>
      </div>
    </div>
  )
}

export default Landing
