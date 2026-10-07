# 🤖 InterAlz — AI-Powered Interview Platform

**InterAlz** is an AI-powered technical interview platform designed to simulate a real-world technical interview experience.

The platform analyzes a candidate's resume, extracts their technical skills, generates personalized interview questions, provides coding challenges with test-case execution, conducts technical interviews through voice interaction, and generates an AI-powered performance report.

---

## 🚀 Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Secure access to interview-related APIs
- Authentication using HTTP cookies

### 📄 Resume Analysis

Users can upload their resume in PDF format.

InterAlz uses AI to analyze the resume and extract:

- Candidate name
- Total experience
- Previous roles and experience
- Programming languages
- Frameworks and libraries
- Databases and cloud technologies
- Development tools
- AI-related technologies

The extracted skills are then used to personalize the interview.

### 🧠 AI-Powered Interview Generation

InterAlz generates interview questions based on the candidate's extracted skills.

The interview contains:

- Multiple-choice questions
- Coding problems
- Technical interview questions

The system avoids generating questions unrelated to the candidate's identified technologies.

### 📝 MCQ Interview

The MCQ section contains multiple rounds of technical questions.

Each question contains:

- Question
- Four options
- Correct answer
- Explanation
- Topic
- Difficulty level

The platform also records the candidate's selected answers and calculates the score.

### 💻 Coding Interview

Candidates receive coding problems based on their technical profile.

The coding environment provides:

- Problem description
- Programming language selection
- Code editor
- Test cases
- Code execution
- Pass/fail results
- Score calculation
- Question completion tracking

The coding playground supports languages such as:

- JavaScript
- Python
- C++
- Java

### 🎤 AI Technical Interview

InterAlz also provides an interactive technical interview experience.

The system:

1. Generates technical questions.
2. Converts questions into speech.
3. Plays the question to the candidate.
4. Records the candidate's response.
5. Stores the response for evaluation.
6. Uses the collected answers during final evaluation.

### 🤖 AI Performance Evaluation

After completing the interview, InterAlz evaluates the candidate's overall performance.

The evaluation considers:

- MCQ performance
- Coding performance
- Technical interview answers

The AI generates a report containing:

- Overall performance
- Strengths
- Areas for improvement
- Technical concepts that need improvement
- Interview performance analysis
- Learning recommendations
- Relevant learning resources

---

## 🏗️ Project Architecture

InterAlz follows a **client-server architecture**.

```text
                    ┌──────────────────────┐
                    │      React Frontend  │
                    │                      │
                    │  Login / Resume      │
                    │  MCQ / Coding        │
                    │  Technical Interview│
                    │  Results             │
                    └──────────┬───────────┘
                               │
                         REST API / JWT
                               │
                    ┌──────────▼───────────┐
                    │   Node.js + Express  │
                    │       Backend        │
                    │                      │
                    │ Authentication       │
                    │ Resume Processing    │
                    │ Question Generation │
                    │ Code Execution       │
                    │ Answer Storage       │
                    │ Result Evaluation    │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
          ┌──────▼─────┐ ┌────▼──────┐ ┌────▼─────────┐
          │  MongoDB   │ │ Gemini AI  │ │ Code Runtime │
          │            │ │            │ │              │
          │ Users      │ │ Resume     │ │ Test Cases   │
          │ Questions  │ │ Questions  │ │ Code Output  │
          │ Results    │ │ Evaluation │ │              │
          └────────────┘ └────────────┘ └──────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router
- JavaScript
- CSS
- Monaco Editor
- Cookies for JWT storage

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- PDF parsing
- Child Process

### AI

- Google Gemini API
- AI-based resume analysis
- AI-generated interview questions
- AI-based interview performance evaluation

### Development Tools

- Git
- GitHub
- Postman
- VS Code

---

## 📁 Project Structure

```text
AI INTERVIEW APP/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── App.js
│   │
│   ├── public/
│   ├── package.json
│   └── .gitignore
│
├── backend/
│   ├── controllers/
│   │   ├── resumeController.js
│   │   ├── interviewController.js
│   │   ├── questionsController.js
│   │   ├── audioController.js
│   │   ├── resultController.js
│   │   └── runCode.js
│   │
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── uploads/
│   ├── prompts/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

> The exact folder structure may vary as the project evolves.

---

## 🔄 How InterAlz Works

### 1. User Authentication

```text
User
  ↓
Login / Sign Up
  ↓
Backend validates credentials
  ↓
JWT generated
  ↓
JWT stored in cookie
  ↓
Protected interview features available
```

### 2. Resume Processing

```text
Upload Resume
      ↓
PDF uploaded to backend
      ↓
PDF text extracted
      ↓
Gemini AI analyzes resume
      ↓
Technical skills extracted
      ↓
Skills stored for interview generation
```

### 3. Interview Generation

```text
Extracted Skills
       ↓
AI Prompt
       ↓
Gemini
       ↓
Personalized Questions
       ↓
MongoDB
       ↓
Candidate Interview
```

### 4. Interview Process

```text
                Interview
                    │
          ┌─────────┼─────────┐
          ↓         ↓         ↓
        MCQs      Coding    Technical
          │         │         │
          ↓         ↓         ↓
        Score    Test Cases  Audio Answers
          │         │         │
          └─────────┼─────────┘
                    ↓
              AI Evaluation
                    ↓
             Result Report
```

---

## 🔑 Authentication Flow

InterAlz uses JWT-based authentication.

```text
Login
  ↓
Server verifies credentials
  ↓
JWT generated
  ↓
JWT stored in cookie
  ↓
Client sends JWT with protected requests
  ↓
verifyCredentials middleware
  ↓
JWT verified
  ↓
User ID extracted
  ↓
Request continues
```

The JWT payload contains the authenticated user's information, allowing the backend to identify the user while accessing protected resources.

---

## 🗄️ Database

MongoDB is used as the primary database.

The application stores information such as:

- User accounts
- Extracted skills
- MCQ rounds
- MCQ answers
- Coding questions
- Coding scores
- Technical interview questions
- Technical interview answers
- Interview completion status
- Interview results

### Example Interview Data

```text
User
 │
 ├── MCQ Rounds
 │     ├── Questions
 │     ├── Answers
 │     └── Score
 │
 ├── Coding Questions
 │     ├── Code
 │     ├── Test Results
 │     └── Score
 │
 └── Technical Interview
       ├── Questions
       └── Candidate Answers
```

---

## 🧪 Code Execution

The coding section allows candidates to run their solutions against predefined test cases.

The backend:

```text
Candidate Code
      ↓
Selected Language
      ↓
Code Execution
      ↓
Test Cases
      ↓
Compare Expected vs Actual Output
      ↓
Pass / Fail
      ↓
Calculate Score
```

The platform can prevent the candidate from progressing when required test cases have not been successfully completed.

---

## 🎯 Personalized Interview

One of the main goals of InterAlz is to avoid giving every candidate the exact same interview.

For example:

```text
Resume
  ↓
JavaScript
React
Node.js
MongoDB
Redis
  ↓
Skill Extraction
  ↓
Personalized Interview
  ↓
JavaScript Questions
React Questions
Node.js Questions
MongoDB Questions
Redis Questions
```

This makes the interview more closely related to the candidate's actual technical background.

---

## 📊 Result Evaluation

InterAlz combines different parts of the interview before generating the final evaluation.

```text
MCQ Results
     │
     ├──────────┐
Coding Results │
     │          │
Technical      │
Answers        │
     │          │
     └────┬─────┘
          ↓
      Gemini AI
          ↓
  Performance Analysis
          ↓
 ┌───────────────────────┐
 │ Strengths             │
 │ Weak Areas            │
 │ Concepts to Improve   │
 │ Recommendations       │
 │ Learning Resources    │
 └───────────────────────┘
```

The goal is to identify **concept-level weaknesses**, rather than simply listing the questions the candidate answered incorrectly.

---

## 🔒 Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Never commit `.env` files to GitHub.

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/alameenmohamed444/interAlz.git
```

```bash
cd interAlz
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create:

```text
backend/.env
```

and add the required environment variables.

### 4. Start Backend

```bash
npm start
```

The backend runs on:

```text
http://localhost:3000
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start Frontend

```bash
npm start
```

The frontend runs on the configured React development port.

---

## 🔮 Future Improvements

Possible future improvements include:

- Refresh token authentication
- Docker-based isolated code execution
- More programming languages
- Advanced anti-cheating mechanisms
- Interview difficulty adjustment based on performance
- Voice-to-text technical answer analysis
- Detailed analytics dashboard
- Interview history
- Resume-to-job-description matching
- Job recommendation system
- Microservices architecture
- Redis caching
- Kafka-based event processing
- Real-time interview monitoring

---

## 🎓 What I Learned From This Project

Building InterAlz involved working with several real-world full-stack concepts:

- React application architecture
- REST API development
- JWT authentication
- Protected routes
- MongoDB and Mongoose
- Nested MongoDB document updates
- File uploads using Multer
- PDF processing
- AI API integration
- Prompt engineering
- Code execution
- Test-case evaluation
- Audio recording
- Browser speech synthesis
- API error handling
- Frontend-backend communication
- Git and GitHub

---

## 👨‍💻 Author

**Alameen M**

B.E. Computer Science and Engineering

Full Stack / MERN Developer

GitHub: [alameenmohamed444](https://github.com/alameenmohamed444)

LinkedIn: [Alameen M](https://linkedin.com/in/alameen-alameen)

---

## ⭐ Project

If you find this project interesting, consider giving the repository a ⭐.

**InterAlz — Practice. Interview. Improve.**
