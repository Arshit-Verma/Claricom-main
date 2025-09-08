import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Simple components without Firebase for testing
const SimpleNav = () => (
  <div className="w-full bg-[#8bbce6f3] p-3">
    <h1 className="text-4xl font-semibold">Claricom</h1>
  </div>
)

const SimpleHero = () => (
  <div className='flex flex-col items-center mt-10 gap-6'>
    <h1 className='font-bold text-5xl'>Building Futures, One Mind at a Time</h1>
    <p className='font-semibold text-2xl'>A safe space to learn, grow, and succeed — together.</p>
    <div className="text-green-600 font-bold">✅ Basic routing is working!</div>
  </div>
)

const SimpleLogin = () => (
  <div className="flex flex-col items-center mt-10 gap-6">
    <h1 className="text-4xl font-bold">Login Page</h1>
    <p>This is a test login page without Firebase</p>
  </div>
)

const router = createBrowserRouter([
  { path: '/', element: <><SimpleNav /><SimpleHero /></> },
  { path: '/login', element: <><SimpleNav /><SimpleLogin /></> },
])

function SimpleApp() {
  return <RouterProvider router={router} />
}

export default SimpleApp
