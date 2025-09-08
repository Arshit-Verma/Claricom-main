import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const Sponsor = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [sponsorRequests, setSponsorRequests] = useState([])
  const [suggestedStudents, setSuggestedStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      fetchSponsorData()
    }
  }, [currentUser])

  const fetchSponsorData = async () => {
    try {
      // Create sponsor profile if it doesn't exist
      const sponsorDoc = await getDoc(doc(db, 'sponsors', currentUser.uid))
      if (!sponsorDoc.exists()) {
        await setDoc(doc(db, 'sponsors', currentUser.uid), {
          sponsorId: currentUser.uid,
          email: currentUser.email,
          createdAt: new Date().toISOString(),
          status: 'active'
        })
      }

      // Fetch sponsor requests
      await fetchSponsorRequests()
      
      // Fetch suggested students
      await fetchSuggestedStudents()
    } catch (error) {
      console.error('Error fetching sponsor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSponsorRequests = async () => {
    try {
      const requestsQuery = query(collection(db, 'sponsorRequests'))
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
      
      setSponsorRequests(requests)
    } catch (error) {
      console.error('Error fetching sponsor requests:', error)
    }
  }

  const fetchSuggestedStudents = async () => {
    try {
      // Fetch students with low income who might need sponsorship
      const usersQuery = query(collection(db, 'users'))
      const usersSnapshot = await getDocs(usersQuery)
      
      const suggestions = []
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data()
        
        // Suggest students with income less than 50000 or who have completed quiz
        if (userData.incomePerAnnum && parseInt(userData.incomePerAnnum) < 50000) {
          // Check if student has completed quiz
          const quizDoc = await getDoc(doc(db, 'quizResults', userDoc.id))
          if (quizDoc.exists()) {
            suggestions.push({
              id: userDoc.id,
              ...userData,
              quizData: quizDoc.data()
            })
          }
        }
      }
      
      setSuggestedStudents(suggestions.slice(0, 10)) // Limit to 10 suggestions
    } catch (error) {
      console.error('Error fetching suggested students:', error)
    }
  }

  const handleSponsorStudent = async (studentId) => {
    try {
      await setDoc(doc(db, 'sponsorships', `${currentUser.uid}_${studentId}`), {
        sponsorId: currentUser.uid,
        studentId: studentId,
        status: 'active',
        createdAt: new Date().toISOString(),
        amount: 0 // This would be set based on the donation
      })
      
      alert('Student sponsorship initiated! You can now proceed to donate.')
    } catch (error) {
      console.error('Error creating sponsorship:', error)
      alert('Error creating sponsorship. Please try again.')
    }
  }

  const handleDonate = () => {
    // Redirect to a payment platform (in real implementation, this would be PayPal, Stripe, etc.)
    window.open('https://www.paypal.com/donate', '_blank')
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

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Sponsor Dashboard</h1>
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600"
        >
          Back
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Requests Section */}
        <div className="bg-white border rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Sponsorship Requests</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {sponsorRequests.length > 0 ? (
              sponsorRequests.map((request) => (
                <div key={request.id} className="bg-gray-50 p-4 rounded-lg border">
                  <p className="font-semibold">Student ID: {request.studentId.substring(0, 8)}...</p>
                  <p className="text-sm text-gray-600">Email: {request.studentInfo?.email}</p>
                  <p className="text-sm text-gray-600">Income: ₹{request.studentInfo?.incomePerAnnum}</p>
                  <p className="text-sm text-gray-600">
                    Requested: {new Date(request.requestDate).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleSponsorStudent(request.studentId)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600"
                  >
                    Sponsor
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border text-center">
                <p className="text-gray-600">No sponsorship requests at the moment</p>
                <p className="text-sm text-gray-500 mt-2">
                  Student sponsorship requests will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Students Section */}
        <div className="bg-white border rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Suggested Students</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {suggestedStudents.length > 0 ? (
              suggestedStudents.map((student) => (
                <div key={student.id} className="bg-gray-50 p-4 rounded-lg border">
                  <p className="font-semibold">Student: {student.username}</p>
                  <p className="text-sm text-gray-600">Email: {student.email}</p>
                  <p className="text-sm text-gray-600">Income: ₹{student.incomePerAnnum}</p>
                  <p className="text-sm text-gray-600">
                    Quiz Completed: {student.quizData ? 'Yes' : 'No'}
                  </p>
                  <button
                    onClick={() => handleSponsorStudent(student.id)}
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-green-600"
                  >
                    Sponsor
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border text-center">
                <p className="text-gray-600">No student suggestions available</p>
                <p className="text-sm text-gray-500 mt-2">
                  Student recommendations will be shown here based on their needs and profiles.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Donation Section */}
        <div className="bg-white border rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-purple-600">Make a Donation</h2>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-lg mb-4">
              Support underprivileged students by making a general donation to our platform.
            </p>
            <button
              onClick={handleDonate}
              className="bg-purple-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-600"
            >
              Donate Now
            </button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Donation Impact</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• ₹500 - Provides study materials for 1 month</li>
              <li>• ₹1,000 - Covers internet access for learning</li>
              <li>• ₹5,000 - Sponsors a student for 3 months</li>
              <li>• ₹10,000 - Provides comprehensive support</li>
            </ul>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white border rounded-lg p-6 shadow-lg lg:col-span-3">
          <h2 className="text-2xl font-bold mb-4 text-orange-600">Your Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-700">0</div>
              <p className="text-sm text-gray-600">Students Sponsored</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-700">₹0</div>
              <p className="text-sm text-gray-600">Total Donated</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-700">0</div>
              <p className="text-sm text-gray-600">Active Sponsorships</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-700">0</div>
              <p className="text-sm text-gray-600">Lives Impacted</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Statistics will be updated as you start sponsoring students and making donations once Firebase is configured.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sponsor
