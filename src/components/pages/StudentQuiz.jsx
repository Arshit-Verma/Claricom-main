
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { doc, setDoc } from 'firebase/firestore'
import { db, model } from '../../firebase'

const StudentQuiz = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: '',
    q9: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const questions = [
    "Do you easily get distracted while studying?",
    "Do you start tasks but struggle to finish them?",
    "Do you feel restless or need to move when sitting for long?",
    "Do you feel uncomfortable when routines suddenly change?",
    "Do you find it difficult to express yourself in groups?",
    "Do you often focus deeply on one topic for a long time?",
    "Do letters or numbers sometimes look confusing, jumbled when reading?",
    "Do you understand lessons better when they are explained aloud?",
    "Do you struggle while spelling simple words?"
  ]

  const handleAnswerChange = (questionKey, value) => {
    setAnswers({
      ...answers,
      [questionKey]: value
    })
  }

  // Diagnostic logic
  const getDiagnosis = (answers) => {
    // Count "yes" answers (case-insensitive)
    const yesCount = Object.values(answers).filter(
      (ans) => ans.trim().toLowerCase().startsWith('y')
    ).length
    if (yesCount <= 5) return 'Dyslexic'
    if (yesCount >= 6 && yesCount <= 7) return 'ADHD'
    if (yesCount >= 8) return 'Autistic'
    return 'Unknown'
  }

  // Generate roadmap using Gemini API
  const generateRoadmap = async (diagnosis) => {
    const prompt = `Generate a comprehensive personalized learning roadmap for a student with ${diagnosis}. Include:
1. Specific study strategies and techniques
2. Recommended learning tools and resources
3. Daily/weekly study tips
4. Career guidance and opportunities
5. Coping mechanisms and support strategies

Please provide detailed, actionable advice in a well-structured format.`
    
    try {
      console.log('Starting Gemini API call for diagnosis:', diagnosis)
      
      // Test if model is available
      if (!model) {
        throw new Error('Gemini model is not initialized')
      }
      
      console.log('Model is initialized, making API call...')
      const result = await model.generateContent(prompt)
      
      console.log('API call completed, processing response...')
      if (!result || !result.response) {
        throw new Error('Invalid response from Gemini API')
      }
      
      const response = await result.response
      const text = response.text()
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API')
      }
      
      console.log('Successfully generated roadmap, length:', text.length)
      return text
      
    } catch (err) {
      console.error('Gemini API Error Details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      })
      
      // Return a comprehensive fallback roadmap
      return `🎓 Personalized Learning Roadmap for ${diagnosis}

📚 STUDY STRATEGIES:
• Break down complex tasks into smaller, manageable chunks
• Use visual aids like mind maps, diagrams, and color-coding
• Practice active learning: summarize, question, and teach back concepts
• Create a structured daily study schedule with regular 10-15 minute breaks
• Use multi-sensory learning (read aloud, write notes, use hands-on activities)

🛠️ RECOMMENDED TOOLS & RESOURCES:
• Text-to-speech software (Natural Reader, Immersive Reader)
• Note-taking apps with organization features (Notion, OneNote)
• Timer apps for focused study sessions (Forest, Pomodoro Timer)
• Educational platforms (Khan Academy, Coursera, edX)
• Mind mapping tools (MindMeister, XMind)

⏰ DAILY/WEEKLY STUDY TIPS:
• Start with the most challenging subjects when your energy is highest
• Use the "2-minute rule": if something takes less than 2 minutes, do it now
• Review material within 24 hours of learning it
• Practice spaced repetition for long-term retention
• Set specific, achievable daily goals

🎯 CAREER GUIDANCE:
• Explore careers that leverage your unique strengths and interests
• Consider fields that value creativity, problem-solving, and innovation
• Research companies with inclusive hiring practices and accessibility support
• Network with professionals who have similar learning profiles
• Look into assistive technologies in your field of interest

🤝 COPING MECHANISMS & SUPPORT:
• Practice mindfulness and stress-reduction techniques
• Join support groups or online communities
• Develop self-advocacy skills to communicate your needs
• Build a strong support network of family, friends, and mentors
• Celebrate small achievements and progress milestones

💡 REMEMBER:
Your learning difference is not a limitation—it's a different way of processing information that can be a tremendous strength in many areas. Many successful entrepreneurs, artists, scientists, and leaders have similar learning profiles.

🌟 Focus on your strengths, use the right tools and strategies, and don't be afraid to ask for help when you need it!`
    }
  }

  const handleNext = async () => {
    setError('')
    // Check if all questions are answered
    const allAnswered = Object.values(answers).every(answer => answer.trim() !== '')
    if (!allAnswered) {
      setError('Please answer all questions before proceeding.')
      return
    }
    if (!currentUser) {
      setError('You must be logged in to submit the quiz.')
      return
    }
    setLoading(true)
    try {
      // 1. Diagnose
      const diagnosis = getDiagnosis(answers)
      console.log('Diagnosis:', diagnosis)
      
      // 2. Generate roadmap
      setError('Generating your personalized roadmap...')
      const roadmap = await generateRoadmap(diagnosis)
      console.log('Roadmap generated successfully')
      
      // 3. Store in Firestore
      setError('Saving your results...')
      await setDoc(doc(db, 'quizResults', currentUser.uid), {
        userId: currentUser.uid,
        answers,
        diagnosis,
        roadmap,
        createdAt: new Date().toISOString()
      })
      
      console.log('Quiz results saved successfully')
      
      // 4. Redirect to dashboard
      navigate('/student')
    } catch (err) {
      console.error('Full error:', err)
      setError('Failed to submit quiz: ' + err.message)
    }
    setLoading(false)
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center mt-10 gap-6 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold">Student Quiz</h1>
      <p className="text-lg text-center">Please answer all questions to help us understand your learning needs better.</p>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full">{error}</div>}
      <div className="w-full space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="text-lg font-medium flex-1">
                {index + 1}. {question}
              </label>
              <input
                type="text"
                value={answers[`q${index + 1}`]}
                onChange={(e) => handleAnswerChange(`q${index + 1}`, e.target.value)}
                className="border rounded p-3 w-full md:w-80"
                placeholder="Type Yes or No..."
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          className="bg-[#f7DBEA] px-6 py-3 rounded-lg font-bold hover:bg-pink-200 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  )
}

export default StudentQuiz
