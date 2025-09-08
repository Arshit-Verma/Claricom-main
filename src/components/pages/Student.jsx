import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const Student = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [quizResult, setQuizResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mentorRequestStatus, setMentorRequestStatus] = useState('')

  useEffect(() => {
    if (currentUser) {
      fetchQuizResult()
    }
  }, [currentUser])

  const fetchQuizResult = async () => {
    try {
      const quizDoc = await getDoc(doc(db, 'quizResults', currentUser.uid))
      if (quizDoc.exists()) {
        setQuizResult(quizDoc.data())
      }
    } catch (error) {
      console.error('Error fetching quiz result:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFindMentor = async () => {
    if (!quizResult) {
      alert('Please complete the quiz first to get matched with a mentor.')
      return
    }

    try {
      setMentorRequestStatus('Creating mentor request...')
      
      // Create mentor request in Firestore
      await setDoc(doc(db, 'mentorRequests', `${currentUser.uid}_${Date.now()}`), {
        studentId: currentUser.uid,
        diagnosisType: quizResult.diagnosis,
        status: 'pending',
        requestDate: new Date().toISOString(),
        studentEmail: currentUser.email
      })
      
      setMentorRequestStatus('Mentor request created! You will be notified when a mentor accepts your request.')
    } catch (error) {
      console.error('Error creating mentor request:', error)
      setMentorRequestStatus('Failed to create mentor request. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10">
      <h1 className="text-4xl font-bold text-center mb-8">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Diagnosis Section */}
        <div className="bg-white border rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Diagnosis</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            {quizResult ? (
              <>
                <p className="text-lg font-semibold">Learning Profile: {quizResult.diagnosis}</p>
                <p className="mt-2 text-gray-700">
                  Quiz completed on: {new Date(quizResult.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => navigate('/student-quiz')}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600"
                >
                  Retake Quiz
                </button>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">Learning Profile: (To be determined)</p>
                <p className="mt-2 text-gray-700">
                  Complete the quiz to get your personalized learning profile and recommendations.
                </p>
                <button
                  onClick={() => navigate('/student-quiz')}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600"
                >
                  Take Quiz
                </button>
              </>
            )}
          </div>
        </div>

        {/* Find Mentor Section */}
        <div className="bg-white border rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Find Mentor</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-lg font-semibold">Connect with a mentor</p>
            <p className="text-gray-700 mt-2 mb-4">
              Get personalized guidance from experienced mentors who understand your learning style.
            </p>
            {mentorRequestStatus && (
              <p className="text-sm text-blue-600 mb-4">{mentorRequestStatus}</p>
            )}
            <button
              onClick={handleFindMentor}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600"
            >
              Find Mentor
            </button>
          </div>
        </div>

        {/* Roadmap Section */}
        <div className="bg-white border rounded-lg p-6 shadow-lg lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-purple-600">Roadmap</h2>
          <div className="bg-purple-50 p-4 rounded-lg">
            {quizResult?.roadmap ? (
              <div className="text-gray-700 whitespace-pre-wrap">
                {quizResult.roadmap}
              </div>
            ) : (
              <>
                <p className="text-gray-700">
                  Your personalized learning roadmap will appear here after completing the quiz.
                  This will include:
                </p>
                <ul className="mt-4 list-disc list-inside text-gray-700">
                  <li>Customized study strategies</li>
                  <li>Recommended learning resources</li>
                  <li>Career guidance based on your profile</li>
                  <li>Daily study tips and techniques</li>
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Progress Chart Section */}
        <div className="bg-white border rounded-lg p-6 shadow-lg lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-orange-600">My Progress Chart</h2>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-center text-gray-600 py-8">
              Your progress tracking will be displayed here once you start your learning journey.
            </p>
            <p className="text-sm text-gray-600 mt-4">
              Track your learning progress over time. Your progress will be updated as you complete activities and achieve milestones.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Student
