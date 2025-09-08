# 🎓 Claricom - Building Futures, One Mind at a Time

Claricom is a comprehensive educational platform designed to address inequality in education for underprivileged students. The platform provides personalized learning solutions, mentor matching, and sponsorship opportunities to help students with different learning needs succeed.

## ✨ Live Demo

🌐 **[Visit Claricom Platform](https://your-deployed-url.com)** (Update this with your actual deployed URL)

## 🌟 Features

### For Students
- **Diagnostic Assessment**: 9-question quiz to identify learning profiles (ADHD, Dyslexia, Autism)
- **Personalized Roadmap**: AI-generated study plans and career guidance using Gemini API
- **Progress Tracking**: Visual charts to monitor learning progress over time
- **Mentor Matching**: Connect with specialized mentors based on diagnosis
- **Safe Learning Environment**: Supportive platform for students with diverse learning needs

### For Mentors
- **Specialization-Based Matching**: Choose expertise area (ADHD, Dyslexia, Autism)
- **Student Request Management**: View and accept student mentorship requests
- **Dashboard Analytics**: Track number of students being mentored
- **Communication Tools**: Feedback and chat features (coming soon)

### For Sponsors
- **Student Sponsorship**: Support students based on financial need
- **Donation Platform**: Direct donation integration with payment gateways
- **Impact Tracking**: Monitor sponsorship impact and statistics
- **Suggested Students**: AI-recommended students for sponsorship

## 🛠 Technology Stack

### Frontend
- **React 19.1.1** - Modern UI library
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization for progress charts
- **Firebase SDK** - Authentication and database

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Firebase Admin** - Server-side Firebase integration
- **Google Gemini AI** - AI-powered content generation
- **CORS** - Cross-origin resource sharing

### Database & Services
- **Firebase Firestore** - NoSQL document database
- **Firebase Authentication** - User authentication service
- **Google Gemini API** - AI roadmap and insights generation

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase account and project
- Google Gemini API key

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/claricom.git
cd claricom
```

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your actual values:
# - GEMINI_API_KEY=your_gemini_api_key
# - FIREBASE_PROJECT_ID=your_firebase_project_id

# Start the backend server
npm run dev
```

The backend API will be available at `http://localhost:5000`

### 4. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Update the Firebase configuration in `src/firebase.js`
4. Set up Firestore security rules (see below)

### 5. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Quiz results
    match /quizResults/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Mentor requests
    match /mentorRequests/{requestId} {
      allow read, write: if request.auth != null;
    }
    
    // Mentors
    match /mentors/{mentorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == mentorId;
    }
    
    // Sponsors
    match /sponsors/{sponsorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == sponsorId;
    }
    
    // Student progress
    match /studentProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📚 Application Flow

### Student Journey
1. **Landing Page** → Sign up/Login
2. **Student Quiz** → Answer 9 diagnostic questions
3. **Student Dashboard** → View diagnosis, roadmap, progress chart
4. **Find Mentor** → Request mentor based on diagnosis
5. **Progress Tracking** → Monitor learning journey

### Mentor Journey
1. **Landing Page** → Sign up/Login
2. **Mentor Registration** → Choose specialization (ADHD/Dyslexia/Autism)
3. **Mentor Dashboard** → View student requests, accept mentorships
4. **Student Management** → Track mentoring statistics

### Sponsor Journey
1. **Landing Page** → Sign up/Login
2. **Sponsor Dashboard** → View sponsorship requests and suggested students
3. **Sponsorship** → Select students to sponsor
4. **Donation** → Make direct donations via payment gateway

## 🧪 Diagnostic Logic

The platform uses a 9-question assessment to determine learning profiles:

- **≤ 5 "Yes" responses**: Dyslexic profile
- **5-7 "Yes" responses**: ADHD profile  
- **> 7 "Yes" responses**: Autism profile

Questions cover areas like attention, focus, reading difficulties, and social interactions.

## 🤖 AI Integration

### Gemini API Features
- **Personalized Roadmaps**: Generate study plans based on diagnosis
- **Progress Insights**: Analyze student progress and provide recommendations
- **Career Guidance**: Suggest career paths suitable for different learning profiles

## 🔧 API Endpoints

### Backend API Routes

#### Health & Status
- `GET /` - API status
- `GET /api/health` - Health check

#### Student Services  
- `POST /api/calculate-diagnosis` - Calculate learning diagnosis
- `POST /api/generate-roadmap` - Generate AI roadmap
- `POST /api/generate-progress-insights` - Get progress insights

#### Mentor Services
- `POST /api/recommend-mentors` - Get mentor recommendations

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessible Interface**: Designed for users with different learning needs
- **Visual Progress Tracking**: Interactive charts and graphs
- **Intuitive Navigation**: Clear user flow and easy-to-use interface

## 🔒 Security Features

- **Firebase Authentication**: Secure user authentication
- **Protected Routes**: Authentication required for sensitive pages
- **Data Validation**: Input validation on both frontend and backend
- **CORS Configuration**: Secure cross-origin requests

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend Deployment (Railway/Heroku)
```bash
cd backend
# Set environment variables
# Deploy according to platform instructions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent content generation
- Firebase for robust backend services
- React community for excellent documentation and tools
- Contributors and testers who helped improve the platform

## 📞 Support

For support, email support@claricom.com or join our Discord community.

## 🗺 Roadmap

- [ ] Real-time chat between mentors and students
- [ ] Mobile application (React Native)
- [ ] Advanced progress analytics
- [ ] Video calling integration
- [ ] Multilingual support
- [ ] AI-powered learning content recommendations
- [ ] Gamification features
- [ ] Parent/guardian dashboard

---

**Claricom** - Empowering every student to reach their potential, regardless of their learning differences.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
