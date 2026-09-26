import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Public Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Courses from '../pages/Courses';
import CourseDetails from '../pages/CourseDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';

// Protected Student Pages
import StudentDashboard from '../pages/StudentDashboard';
import MyCourses from '../pages/MyCourses';
import CourseLearning from '../pages/CourseLearning';

// Protected Faculty Pages
import FacultyDashboard from '../pages/FacultyDashboard';
import FacultyCourses from '../pages/FacultyCourses';
import FacultyCourseDetails from '../pages/FacultyCourseDetails';
import FacultyStudents from '../pages/FacultyStudents';
import FacultyProfile from '../pages/FacultyProfile';

// Protected Admin Pages
import AdminDashboard from '../pages/AdminDashboard';
import AdminCourses from '../pages/AdminCourses';
import AdminFaculty from '../pages/AdminFaculty';
import AdminStudents from '../pages/AdminStudents';

// Shared Protected Pages
import Profile from '../pages/Profile';

// Route Guard
import ProtectedRoute from '../components/ProtectedRoute';

// Guard that redirects logged-in users directly to their dashboard
const PublicOnlyRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === 'faculty') {
      return <Navigate to="/faculty/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <Home />
          </PublicOnlyRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetails />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPassword />
          </PublicOnlyRoute>
        }
      />

      {/* Protected Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/my-courses"
        element={
          <ProtectedRoute allowedRole="student">
            <MyCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/course/:id"
        element={
          <ProtectedRoute allowedRole="student">
            <CourseLearning />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRole="student">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Protected Faculty Routes */}
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute allowedRole="faculty">
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/courses"
        element={
          <ProtectedRoute allowedRole="faculty">
            <FacultyCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/courses/:id"
        element={
          <ProtectedRoute allowedRole="faculty">
            <FacultyCourseDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/students"
        element={
          <ProtectedRoute allowedRole="faculty">
            <FacultyStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/profile"
        element={
          <ProtectedRoute allowedRole="faculty">
            <FacultyProfile />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/faculty"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminFaculty />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRole="admin">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
