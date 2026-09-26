import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User as UserIcon, LogOut, Menu, X, Shield, LayoutDashboard, BookmarkCheck, Users } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isFaculty, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileOpen(false);
  };

  const getHomeRoute = () => {
    if (!isAuthenticated) return '/';
    if (isAdmin) return '/admin/dashboard';
    if (isFaculty) return '/faculty/dashboard';
    return '/student/dashboard';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to={getHomeRoute()} style={styles.logo} onClick={() => setIsMobileOpen(false)}>
          <div style={styles.logoIcon}>
            <BookOpen size={22} color="#FFFFFF" />
          </div>
          <span style={styles.logoText}>EduVibe <span style={styles.logoSub}>LMS</span></span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          className="navbar-toggle-btn"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileOpen ? <X size={26} color="#1C1917" /> : <Menu size={26} color="#1C1917" />}
        </button>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav-desktop">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                style={{ ...styles.link, ...(isActive('/') ? styles.activeLink : {}) }}
              >
                Home
              </Link>
              <Link
                to="/courses"
                style={{ ...styles.link, ...(isActive('/courses') ? styles.activeLink : {}) }}
              >
                Courses
              </Link>
              <Link
                to="/about"
                style={{ ...styles.link, ...(isActive('/about') ? styles.activeLink : {}) }}
              >
                About
              </Link>
              <div style={styles.authButtons}>
                <Link
                  to="/login"
                  className="btn btn-secondary btn-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                >
                  Get Started
                </Link>
              </div>
            </>
          ) : isStudent ? (
            <>
              <Link
                to="/student/dashboard"
                style={{ ...styles.link, ...(isActive('/student/dashboard') ? styles.activeLink : {}) }}
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link
                to="/courses"
                style={{ ...styles.link, ...(isActive('/courses') ? styles.activeLink : {}) }}
              >
                <BookOpen size={16} /> All Courses
              </Link>
              <Link
                to="/student/my-courses"
                style={{ ...styles.link, ...(isActive('/student/my-courses') ? styles.activeLink : {}) }}
              >
                <BookmarkCheck size={16} /> My Courses
              </Link>
              <Link
                to="/student/profile"
                style={{ ...styles.link, ...(isActive('/student/profile') ? styles.activeLink : {}) }}
              >
                <UserIcon size={16} /> Profile
              </Link>
              <div style={styles.userInfo}>
                <span className="badge badge-primary">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title="Logout"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : isFaculty ? (
            <>
              <Link
                to="/faculty/dashboard"
                style={{ ...styles.link, ...(isActive('/faculty/dashboard') ? styles.activeLink : {}) }}
              >
                <LayoutDashboard size={16} /> Faculty Dashboard
              </Link>
              <Link
                to="/faculty/courses"
                style={{ ...styles.link, ...(isActive('/faculty/courses') ? styles.activeLink : {}) }}
              >
                <BookOpen size={16} /> My Courses
              </Link>
              <Link
                to="/faculty/students"
                style={{ ...styles.link, ...(isActive('/faculty/students') ? styles.activeLink : {}) }}
              >
                <Users size={16} /> Students
              </Link>
              <Link
                to="/faculty/profile"
                style={{ ...styles.link, ...(isActive('/faculty/profile') ? styles.activeLink : {}) }}
              >
                <UserIcon size={16} /> Profile
              </Link>
              <div style={styles.userInfo}>
                <span className="badge badge-info" style={{ backgroundColor: '#FBF4ED', color: '#B87333', border: '1px solid #E7E5E4' }}>
                  Faculty: {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title="Logout"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                style={{ ...styles.link, ...(isActive('/admin/dashboard') ? styles.activeLink : {}) }}
              >
                <LayoutDashboard size={16} /> Admin Dashboard
              </Link>
              <Link
                to="/admin/courses"
                style={{ ...styles.link, ...(isActive('/admin/courses') ? styles.activeLink : {}) }}
              >
                <BookOpen size={16} /> Courses
              </Link>
              <Link
                to="/admin/faculty"
                style={{ ...styles.link, ...(isActive('/admin/faculty') ? styles.activeLink : {}) }}
              >
                <Users size={16} /> Faculty
              </Link>
              <Link
                to="/admin/students"
                style={{ ...styles.link, ...(isActive('/admin/students') ? styles.activeLink : {}) }}
              >
                <Users size={16} /> Students
              </Link>
              <Link
                to="/admin/profile"
                style={{ ...styles.link, ...(isActive('/admin/profile') ? styles.activeLink : {}) }}
              >
                <UserIcon size={16} /> Profile
              </Link>
              <div style={styles.userInfo}>
                <span className="badge badge-warning">
                  <Shield size={12} style={{ marginRight: 4 }} /> Admin
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title="Logout"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : null}
        </nav>
      </div>

      {/* Mobile Drawer (Visible when isMobileOpen is true on smaller screens) */}
      {isMobileOpen && (
        <div className="navbar-mobile-drawer">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                className={`navbar-mobile-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`navbar-mobile-link ${isActive('/courses') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                Courses
              </Link>
              <Link
                to="/about"
                className={`navbar-mobile-link ${isActive('/about') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                About Us
              </Link>
              <div className="navbar-mobile-auth">
                <Link
                  to="/login"
                  className="btn btn-secondary btn-lg"
                  style={{ width: '100%' }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </>
          ) : isStudent ? (
            <>
              <Link
                to="/student/dashboard"
                className={`navbar-mobile-link ${isActive('/student/dashboard') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <LayoutDashboard size={18} /> Student Dashboard
              </Link>
              <Link
                to="/courses"
                className={`navbar-mobile-link ${isActive('/courses') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <BookOpen size={18} /> All Courses
              </Link>
              <Link
                to="/student/my-courses"
                className={`navbar-mobile-link ${isActive('/student/my-courses') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <BookmarkCheck size={18} /> My Enrolled Courses
              </Link>
              <Link
                to="/student/profile"
                className={`navbar-mobile-link ${isActive('/student/profile') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <UserIcon size={18} /> My Account Profile
              </Link>
              <div className="navbar-mobile-user">
                <span className="badge badge-primary">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </>
          ) : isFaculty ? (
            <>
              <Link
                to="/faculty/dashboard"
                className={`navbar-mobile-link ${isActive('/faculty/dashboard') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <LayoutDashboard size={18} /> Faculty Dashboard
              </Link>
              <Link
                to="/faculty/courses"
                className={`navbar-mobile-link ${isActive('/faculty/courses') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <BookOpen size={18} /> My Courses
              </Link>
              <Link
                to="/faculty/students"
                className={`navbar-mobile-link ${isActive('/faculty/students') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <Users size={18} /> Students
              </Link>
              <Link
                to="/faculty/profile"
                className={`navbar-mobile-link ${isActive('/faculty/profile') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <UserIcon size={18} /> Faculty Profile
              </Link>
              <div className="navbar-mobile-user">
                <span className="badge badge-info" style={{ backgroundColor: '#FBF4ED', color: '#B87333', border: '1px solid #E7E5E4' }}>
                  Faculty: {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </>
          ) : isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                className={`navbar-mobile-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <LayoutDashboard size={18} /> Admin Dashboard
              </Link>
              <Link
                to="/admin/courses"
                className={`navbar-mobile-link ${isActive('/admin/courses') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <BookOpen size={18} /> Manage Courses
              </Link>
              <Link
                to="/admin/faculty"
                className={`navbar-mobile-link ${isActive('/admin/faculty') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <Users size={18} /> Manage Faculty
              </Link>
              <Link
                to="/admin/students"
                className={`navbar-mobile-link ${isActive('/admin/students') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <Users size={18} /> Manage Students
              </Link>
              <Link
                to="/admin/profile"
                className={`navbar-mobile-link ${isActive('/admin/profile') ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <UserIcon size={18} /> Admin Profile
              </Link>
              <div className="navbar-mobile-user">
                <span className="badge badge-warning">
                  <Shield size={12} style={{ marginRight: 4 }} /> Admin
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}
    </header>
  );
};

const styles = {
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none'
  },
  logoIcon: {
    backgroundColor: '#3D291F',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  logoText: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: '-0.5px'
  },
  logoSub: {
    color: '#B87333',
    fontWeight: '600',
    fontSize: '1.1rem'
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#57534E',
    transition: 'color 0.2s ease',
    textDecoration: 'none'
  },
  activeLink: {
    color: '#3D291F',
    fontWeight: '700'
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginLeft: '0.5rem'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginLeft: '0.5rem'
  }
};

export default Navbar;
