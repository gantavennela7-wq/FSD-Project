# EduVibe - Full-Stack MERN Learning Management System (LMS)

EduVibe is a feature-packed, production-grade **Learning Management System (LMS)** built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js). It supports role-based authorization for **Students** and **Admins / Instructors**, providing an intuitive learning platform with interactive lesson tracking, live statistics, course management, and rich responsive aesthetics.

---

## 🌟 Features

### 👨‍🎓 Student Features
- **Account Registration & Authentication**: Secure registration and JWT-based login with password hashing.
- **Course Catalog & Search**: Browse, search by keyword, and filter courses by category and skill level.
- **Course Enrollment**: One-click enrollment into training courses with duplicate enrollment prevention.
- **Student Dashboard**: Live summary metrics (Total Enrolled, Completed, In Progress, Average Progress %).
- **Interactive Course Learning Workspace**: Self-paced lesson navigation with interactive check-offs, dynamic progress bar calculation, and completion status.
- **My Enrolled Courses**: Track all registered courses, filter by progress status, and resume learning anytime.
- **Profile Management**: View account role/email and update full name.

### 🛡️ Admin / Instructor Features
- **Admin Analytics Dashboard**: Real-time stats (Total Students, Total Courses, Total Enrollments, Completed Courses) and live tables for recent courses, students, and enrollments.
- **Course CRUD Management**: Add new courses with default or custom lesson modules, edit course details, search/filter, and delete courses with a confirmation modal.
- **Student Management**: View all registered students, search by name/email, track registration dates, and inspect student enrollment details.
- **Protected Authorization**: Role-based access control prohibiting students from accessing administrative pages and APIs.

---

## 🚀 Technologies Used

- **Frontend**: React 18, Vite, React Router DOM v6, Axios, Lucide React (Icons)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose ORM)
- **Authentication**: JSON Web Tokens (JWT) & `bcryptjs` for salted password hashing
- **Styling**: Custom Vanilla CSS Design System with warm neutral aesthetics, sleek typography, responsive card layouts, and modal popups.

---

## 📁 Project Structure

```
Project/
├── client/                     # Frontend React + Vite Application
│   ├── src/
│   │   ├── assets/             # Media and static assets
│   │   ├── components/         # Reusable UI components (Navbar, Footer, CourseCard, etc.)
│   │   ├── context/            # AuthContext for global user state
│   │   ├── pages/              # View pages (Home, Courses, Dashboard, Learning, Admin, etc.)
│   │   ├── routes/             # AppRoutes configuration & ProtectedRoute guards
│   │   ├── services/           # Centralized Axios API service layer
│   │   ├── App.jsx             # Main Application layout wrapper
│   │   ├── index.css           # Custom CSS Design System
│   │   └── main.jsx            # Vite React entry point
│   ├── .env                    # Frontend environment variables
│   ├── index.html              # Main HTML template with SEO meta tags
│   └── package.json            # Client dependencies
│
├── server/                     # Backend Node.js + Express API Server
│   ├── config/                 # Mongoose database connection setup
│   ├── controllers/            # Route controllers (Auth, Course, Enrollment, Admin, User)
│   ├── middleware/             # JWT auth verification, admin guard, error handling
│   ├── models/                 # Mongoose schemas (User, Course, Enrollment)
│   ├── routes/                 # API route definitions
│   ├── utils/                  # Database seed script
│   ├── .env                    # Server environment configuration
│   ├── server.js               # Main Express application entry point
│   └── package.json            # Server dependencies
│
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## 🔑 Sample Login Credentials

The database comes seeded with sample test accounts:

### 🛡️ Admin Account
- **Email**: `admin@lms.com`
- **Password**: `admin123`
- **Role**: `admin`

### 👨‍🎓 Student Accounts
- **Email**: `student@lms.com`
- **Password**: `student123`
- **Role**: `student`

- **Email**: `jane@lms.com`
- **Password**: `student123`
- **Role**: `student`

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/lms_db
JWT_SECRET=super_secret_lms_jwt_key_2026
NODE_ENV=development
```

### Frontend (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📦 Installation & Setup Instructions

### 1. Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: Running locally on `mongodb://127.0.0.1:27017`

### 2. Backend Setup
```bash
cd server
npm install
npm run seed      # Seeds 5 sample courses, admin user, and sample student accounts
npm run dev       # Starts backend API on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev       # Starts Vite dev server on http://localhost:5173
```

---

## 📡 Backend API Overview

### Authentication
- `POST /api/auth/register` — Register a new student account
- `POST /api/auth/login` — Authenticate user and issue JWT
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Courses
- `GET /api/courses` — Get all courses (supports `search`, `category`, and `level` query parameters)
- `GET /api/courses/:id` — Get course details by ID
- `POST /api/courses` — Create a new course *(Admin only)*
- `PUT /api/courses/:id` — Edit an existing course *(Admin only)*
- `DELETE /api/courses/:id` — Delete a course *(Admin only)*

### Enrollments
- `POST /api/enrollments` — Enroll current student in a course
- `GET /api/enrollments/my` — Get all enrolled courses for logged-in student
- `GET /api/enrollments/:id` — Get enrollment details with lesson progress
- `PUT /api/enrollments/:id/progress` — Toggle lesson completion & auto-calculate progress %

### Admin Analytics & Management
- `GET /api/admin/stats` — Aggregate metrics & recent activity data *(Admin only)*
- `GET /api/admin/students` — List all registered students & enrollment counts *(Admin only)*

### Profile
- `GET /api/users/profile` — Get user profile info
- `PUT /api/users/profile` — Update user profile name

---

## 🔮 Future Enhancements
- Video streaming integration (HLS / Cloudinary video hosting).
- Quizzes & interactive assignments per module.
- Downloadable PDF completion certificates.
- Instructor dashboard for multi-instructor course management.
