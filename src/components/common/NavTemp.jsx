import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <div className="w-full overflow-auto">
      <div className="w-full bg-[#8bbce6f3]">
        <div className="p-3 flex justify-between items-center">
          <h1 className="text-4xl font-semibold">
            <Link to="/">Claricom</Link>
          </h1>

          <ul className="flex gap-14 font-bold items-center justify-center text-[20px]">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>

          <Link to="/signup">
            <button className="border border-transparent m-4 p-2 rounded-lg bg-[#f7DBEA] font-bold w-40">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Nav
