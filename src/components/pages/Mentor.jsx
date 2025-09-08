import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const Mentor = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [mentorProfile, setMentorProfile] = useState(null)
  const [pendingRequests, setPendingRequests] = useState([])
  const [studentsCount, setStudentsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedSpecialty, setSelectedSpecialty] = useState('')

  const specialties = ['ADHD', 'Dyslexic', 'Autistic']

  useEffect(() => {
    if (currentUser) {
      fetchMentorData()
    }
  }, [currentUser])

  const fetchMentorData = async () => {
    try {
      // Check if mentor profile exists
      const mentorDoc = await getDoc(doc(db, 'mentors', currentUser.uid))
      if (mentorDoc.exists()) {
        const mentorData = mentorDoc.data()
        setMentorProfile(mentorData)
        setSelectedSpecialty(mentorData.specialty)
        
        // Fetch pending requests for this mentor's specialty
        await fetchPendingRequests(mentorData.specialty)
        
        // Count students this mentor is mentoring
        await countMentoringStudents()
      }
    } catch (error) {
      console.error('Error fetching mentor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingRequests = async (specialty) => {
    try {
      const requestsQuery = query(
        collection(db, 'mentorRequests'),
        where('diagnosisType', '==', specialty),
        where('status', '==', 'pending')
      )
      
      const requestsSnapshot = await getDocs(requestsQuery)
      const requests = []
      
      for (const requestDoc of requestsSnapshot.docs) {
        const requestData = requestDoc.data()
        
        // Get student details
        const studentDoc = await getDoc(doc(db, 'users', requestData.studentId))
        if (studentDoc.exists()) {
          requests.push({
            id: requestDoc.id,
            ...requestData,
            studentInfo: studentDoc.data()
          })
        }
      }
      
      setPendingRequests(requests)
    } catch (error) {
      console.error('Error fetching requests:', error)
    }
  }

  const countMentoringStudents = async () => {
    try {
      const mentorshipQuery = query(
        collection(db, 'mentorships'),
        where('mentorId', '==', currentUser.uid),
        where('status', '==', 'active')
      )
      
      const mentorshipSnapshot = await getDocs(mentorshipQuery)
      setStudentsCount(mentorshipSnapshot.size)
    } catch (error) {
      console.error('Error counting students:', error)
    }
  }

  const handleSpecialtySelection = async (specialty) => {
    try {
      // Create or update mentor profile
      await setDoc(doc(db, 'mentors', currentUser.uid), {
        mentorId: currentUser.uid,
        specialty: specialty,
        email: currentUser.email,
        createdAt: new Date().toISOString(),
        status: 'active'
      })
      
      setMentorProfile({ specialty })
      setSelectedSpecialty(specialty)
      
      // Fetch requests for this specialty
      await fetchPendingRequests(specialty)
      await countMentoringStudents()
    } catch (error) {
      console.error('Error setting specialty:', error)
      alert('Error setting specialty. Please try again.')
    }
  }

  const handleAcceptRequest = async (requestId, studentId) => {
    try {
      // Update request status
      await updateDoc(doc(db, 'mentorRequests', requestId), {
        status: 'accepted',
        mentorId: currentUser.uid,
        acceptedAt: new Date().toISOString()
      })
      
      // Create mentorship relationship
      await setDoc(doc(db, 'mentorships', `${currentUser.uid}_${studentId}`), {
        mentorId: currentUser.uid,
        studentId: studentId,
        status: 'active',
        createdAt: new Date().toISOString()
      })
      
      // Refresh data
      await fetchPendingRequests(selectedSpecialty)
      await countMentoringStudents()
      
      alert('Student request accepted successfully!')
    } catch (error) {
      console.error('Error accepting request:', error)
      alert('Error accepting request. Please try again.')
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  if (!mentorProfile) {
    return (
      <div className="flex flex-col items-center mt-10 gap-6 max-w-2xl mx-auto">
        <button
          onClick={handleBack}
          className="self-start bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600"
        >
          Back
        </button>
        
        <h1 className="text-4xl font-bold">Mentor Registration</h1>
        <p className="text-lg text-center">
          Please select your area of specialization to start mentoring students.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => handleSpecialtySelection(specialty)}
              className="bg-[#f7DBEA] p-6 rounded-lg font-bold text-lg hover:bg-pink-200 border-2 border-transparent hover:border-pink-300"
            >
              {specialty} Specialist
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Mentor Dashboard</h1>
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600"
        >
          Back
        </button>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <p className="text-lg font-semibold">
          Specialty: {selectedSpecialty} | Students Mentoring: {studentsCount}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Requests Section */}
        <div className="bg-white border rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Student Requests</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <div key={request.id} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Student ID: {request.studentId.substring(0, 8)}...</p>
                      <p className="text-sm text-gray-600">Email: {request.studentInfo.email}</p>
                      <p className="text-sm text-gray-600">Diagnosis: {request.diagnosisType}</p>
                      <p className="text-sm text-gray-600">
                        Requested: {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAcceptRequest(request.id, request.studentId)}
                      className="bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-green-600"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">No pending requests</p>
            )}
          </div>
        </div>

        {/* Number of Students Mentoring */}
        <div className="bg-white border rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Students Mentoring</h2>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-4xl font-bold text-green-700 mb-2">{studentsCount}</div>
            <p className="text-lg text-gray-700">Active Mentorships</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white border rounded-lg p-6 shadow-lg lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-purple-600">Mentor Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-[#f7DBEA] px-6 py-4 rounded-lg font-bold hover:bg-pink-200">
              Select Student
            </button>
            <button className="bg-[#f7DBEA] px-6 py-4 rounded-lg font-bold hover:bg-pink-200">
              Feedback
            </button>
            <button className="bg-[#f7DBEA] px-6 py-4 rounded-lg font-bold hover:bg-pink-200">
              Open Chat
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            These features are coming soon! Currently, you can accept student requests and view your mentoring statistics.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Mentor
