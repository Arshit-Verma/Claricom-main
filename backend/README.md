# Claricom Backend API

This is the backend API for the Claricom education platform that helps address inequality in education for underprivileged students.

## Features

- User authentication and authorization
- Student quiz assessment and diagnosis
- AI-powered roadmap generation using Gemini API
- Mentor-student matching system
- Sponsor management system
- Progress tracking and insights

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the environment variables with your actual values

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check
- `GET /` - Basic API status
- `GET /api/health` - Detailed health check

### Student Services
- `POST /api/calculate-diagnosis` - Calculate learning diagnosis based on quiz answers
- `POST /api/generate-roadmap` - Generate personalized learning roadmap
- `POST /api/generate-progress-insights` - Generate progress insights and recommendations

### Mentor Services
- `POST /api/recommend-mentors` - Get mentor recommendations based on diagnosis

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port (default: 5000) | No |
| NODE_ENV | Environment (development/production) | No |
| GEMINI_API_KEY | Google Gemini AI API key | Yes |
| FIREBASE_PROJECT_ID | Firebase project ID | Yes |

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **AI Integration**: Google Gemini API
- **Authentication**: Firebase Auth

## Development

To run in development mode with auto-reload:
```bash
npm run dev
```

To run in production mode:
```bash
npm start
```

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and error messages.

## CORS

CORS is configured to allow requests from the frontend application. Update the `ALLOWED_ORIGINS` environment variable for production deployment.

## License

MIT License
