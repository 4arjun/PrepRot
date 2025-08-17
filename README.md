# PrepRot

**PrepRot** is a full-stack web platform built to simplify and accelerate technical interview preparation. It features curated DSA problem sets, mock interviews, interview experience sharing, and a referral program – all in one place.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Authentication](#authentication)

## Features
- **Mock Interviews**: Practice with peers matched by role and skill level for realistic interview simulations.
- **Curated DSA Problems**: Tackle structured problem sets to master core technical concepts.
- **AI-Powered Suggestions**: Get personalized problem recommendations tailored to your progress.
- **Progress Dashboard**: Track strengths, weaknesses, and growth with a visual analytics dashboard.
- **Round-Wise Insights**: Prepare for coding, HR, system design, and puzzle rounds with targeted resources.
- **Interview Experiences**: Learn from authentic stories shared by candidates from top tech companies.
- **Smart Filtering**: Filter problems and experiences by company, college, role, or difficulty.
- **Referral Program**: Submit your profile to connect with recruiters for job opportunities.
- **Leaderboard**: Link your LeetCode username to compare rankings with peers, college classmates, or globally.
- **ML-Powered Predictions**:
  - Suggests problems you're likely to solve next based on your performance.
  - Recommends challenging problems to accelerate your growth.

## Tech Stack
- **Frontend**: Next.js
- **Backend**: Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT tokens with Google OAuth integration

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- pip

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file with your configuration:
   ```env
   GOOGLE_OAUTH2_CLIENT_ID=your_google_client_id
   GOOGLE_OAUTH2_CLIENT_SECRET=your_google_client_secret
   GOOGLE_OAUTH2_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
   NEXT_PUBLIC_GOOGLE_AUTH_URL=https://accounts.google.com/o/oauth2/v2/auth
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
```
PrepRot/
├── backend/                 # Django REST API
│   ├── accounts/           # User authentication & management
│   ├── PrepRot/           # Django project settings
│   └── manage.py          # Django management script
├── frontend/              # Next.js application
│   ├── src/app/          # App router pages
│   │   ├── auth/         # Authentication pages
│   │   ├── home/         # Protected home page
│   │   ├── login/        # Login page
│   │   └── signup/       # User registration
│   └── lib/              # Utility functions & auth
└── README.md             # Project documentation
```

## Authentication

The application implements a comprehensive authentication system:

### Features
- **JWT Token Authentication**: Secure token-based authentication
- **Google OAuth Integration**: One-click login with Google
- **User Registration**: Traditional email/password signup
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Token Refresh**: Automatic token renewal for seamless experience

### Endpoints
- `POST /api/signup/` - User registration
- `POST /api/token/` - Login and token generation
- `POST /api/token/refresh/` - Token refresh
- `POST /api/token/verify/` - Token verification
- `POST /api/auth/google/` - Google OAuth callback

### Pages
- `/login` - User authentication
- `/signup` - New user registration
- `/home` - Protected dashboard (requires authentication)
- `/auth/callback` - Google OAuth callback handler

