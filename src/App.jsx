import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import Nav from './components/common/Nav'
import Hero from './components/pages/Hero'
import StudentQuiz from './components/pages/StudentQuiz'
import Mentor from './components/pages/Mentor'
import Sponsor from './components/pages/Sponsor'
import Login from './components/pages/Login'
import Signup from './components/pages/Signup'
import Student from './components/pages/Student'

const router = createBrowserRouter([
  { path: '/', element: <><Nav /><Hero /></> },
  { path: '/student-quiz', element: <><Nav /><StudentQuiz /></> },
  { path: '/mentor', element: <><Nav /><Mentor /></> },
  { path: '/sponsor', element: <><Nav /><Sponsor /></> },
  { path: '/login', element: <><Nav /><Login /></> },
  { path: '/signup', element: <><Nav /><Signup /></> },
  { path: '/student', element: <><Nav /><Student /></> },
])

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </AuthProvider>
  )
}

export default App
