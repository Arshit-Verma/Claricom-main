const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin (you would need to add your service account key)
// const serviceAccount = require('./path-to-your-service-account-key.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   projectId: 'claricom-793e4'
// });

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '<write your key here>');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Claricom Backend API is running!' });
});

// Generate roadmap using Gemini AI
app.post('/api/generate-roadmap', async (req, res) => {
  try {
    const { diagnosisType, studentInfo } = req.body;
    
    const prompt = `Generate a comprehensive study roadmap and career guidance for a student diagnosed with ${diagnosisType}. 
    Include specific learning strategies, recommended subjects, career paths, and daily study tips. 
    Make it encouraging and practical. Format the response in a structured way with clear sections.
    
    Student Information: ${JSON.stringify(studentInfo)}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const roadmap = response.text();
    
    res.json({ success: true, roadmap });
  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ success: false, error: 'Failed to generate roadmap' });
  }
});

// Generate progress insights
app.post('/api/generate-progress-insights', async (req, res) => {
  try {
    const { progressData, diagnosisType } = req.body;
    
    const prompt = `Based on the following progress data for a student with ${diagnosisType}, 
    provide insights and recommendations for improvement:
    
    Progress Data: ${JSON.stringify(progressData)}
    
    Please provide:
    1. Current performance analysis
    2. Areas of strength
    3. Areas for improvement
    4. Specific recommendations
    5. Next week's goals`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();
    
    res.json({ success: true, insights });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ success: false, error: 'Failed to generate insights' });
  }
});

// Calculate diagnosis based on quiz answers
app.post('/api/calculate-diagnosis', (req, res) => {
  try {
    const { answers } = req.body;
    
    // Count "yes" responses (looking for positive indicators)
    const yesCount = Object.values(answers).reduce((count, answer) => {
      const lowerAnswer = answer.toLowerCase();
      return lowerAnswer.includes('yes') || lowerAnswer.includes('often') || 
             lowerAnswer.includes('always') || lowerAnswer.includes('frequently') ? count + 1 : count;
    }, 0);

    let diagnosis;
    if (yesCount <= 5) {
      diagnosis = 'Dyslexic';
    } else if (yesCount <= 7) {
      diagnosis = 'ADHD';
    } else {
      diagnosis = 'Autism';
    }
    
    res.json({ success: true, diagnosis, yesCount });
  } catch (error) {
    console.error('Error calculating diagnosis:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate diagnosis' });
  }
});

// Get mentor recommendations based on diagnosis
app.post('/api/recommend-mentors', async (req, res) => {
  try {
    const { diagnosisType } = req.body;
    
    // In a real application, this would query the database for available mentors
    const mentorRecommendations = {
      'ADHD': [
        { id: 1, name: 'Dr. Sarah Johnson', specialization: 'ADHD Support', experience: '5 years' },
        { id: 2, name: 'Prof. Michael Chen', specialization: 'Attention Management', experience: '7 years' },
        { id: 3, name: 'Ms. Lisa Williams', specialization: 'ADHD Learning Strategies', experience: '4 years' }
      ],
      'Dyslexic': [
        { id: 4, name: 'Dr. Emily Davis', specialization: 'Dyslexia Support', experience: '6 years' },
        { id: 5, name: 'Prof. Robert Miller', specialization: 'Reading Strategies', experience: '8 years' },
        { id: 6, name: 'Ms. Jennifer Brown', specialization: 'Dyslexia Intervention', experience: '5 years' }
      ],
      'Autism': [
        { id: 7, name: 'Dr. James Wilson', specialization: 'Autism Support', experience: '9 years' },
        { id: 8, name: 'Prof. Maria Garcia', specialization: 'Social Skills Training', experience: '6 years' },
        { id: 9, name: 'Ms. Amanda Taylor', specialization: 'Autism Learning Adaptation', experience: '7 years' }
      ]
    };
    
    const recommendations = mentorRecommendations[diagnosisType] || [];
    res.json({ success: true, mentors: recommendations });
  } catch (error) {
    console.error('Error getting mentor recommendations:', error);
    res.status(500).json({ success: false, error: 'Failed to get mentor recommendations' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});
