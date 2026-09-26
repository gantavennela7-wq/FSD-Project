import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User as UserIcon, LogOut, Menu, X, Shield, LayoutDashboard, BookmarkCheck, Users } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={styles.header}>
      <div className="container" style={styles.navContainer}>
        {/* Brand Logo */}
        <Link to="/" style={styles.logo} onClick={() => setIsMobileOpen(false)}>
          <div style={styles.logoIcon}>
            <BookOpen size={22} color="#FFFFFF" />
          </div>
          <span style={styles.logoText}>EduVibe <span style={styles.logoSub}>LMS</span></span>
        </Link>

        {/* Mobile Toggle */}
        <button
          style={styles.mobileToggle}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <nav style={{ ...styles.nav, ...(isMobileOpen ? styles.navMobileActive : {}) }}>
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                style={{ ...styles.link, ...(isActive('/') ? styles.activeLink : {}) }}
                onClick={() => setIsMobileOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/courses"
                style={{ ...styles.link, ...(isActive('/courses') ? styles.activeLink : {}) }}
                onClick={() => setIsMobileOpen(false)}
              >
                Courses
              </Link>
              <Link
                to="/about"
                style={{ ...styles.link, ...(isActive('/about') ? styles.activeLink : {}) }}
                onClick={() => setIsMobileOpen(false)}
              >
                About
              </Link>
              <div style={styles.authButtons}>
                <Link
                  to="/login"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
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
                style={{ ...styles.link, ...(isActive('/student/dashboard') ? styles.activeLink : {}) }}
                onClick={() => setIsMobileOpen(false)}
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link
                to="/courses"
                style={{ ...styles.link, ...(isActive('/courses') ? styles.activeLink : {}) }}
                onClick={() => setIsMobileOpen(false)}
              >
                <BookOpen size={16} /> All Courses
              </Link>
              <Link
                to="/student/my-courses"
                style={{ ...styles.link, ...(isActive('/student/my-courses') ? styles.activeLink : {}) }}
                onClick={() => setIsMobileOpen(false)}
              >
                <BookmarkCheck size={16} /> My Courses
              </Link>
              <Link
                to="/student/profile"
                style={{ ...styles.link, ...(isActive('/student/profile') ? styles.activeLink : {}) }}
                onClick={() => setIsMobileOpen(false)}
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
          ) : isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                style={{ ...styles.link, ...(isActive('/admin/dashboard') ? styles.activeLink : {}) }}
                onClick={() => setIsMobileOpen(false)}
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link
                to="/admin/courses"
                style={{ ...styles.link, ...(isActive('/admin/courses') ? styles.activeLink : {}) }}
                onClick={() => setIsMobileOpen(false)}
              >
                <BookOpen size={16} /> Courses
              </Link>
              <Link
                to="/admin/students"
                style={{ ...styles.link, ...(isActive('/admin/students') ? styles.activeLink : {}) }}
                onClick={() => setIsMobileOpen(false)}
              >
                <Users size={16} /> Students
              </Link>
              <Link
                to="/admin/profile"
                style={{ ...styles.link, ...(isActive('/admin/profile') ? styles.activeLink : {}) }}
                onClick={() => setIsMobileOpen(false)}
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
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E7E5E4',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '72px'
  },
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
    justifyContent: 'center'
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
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
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
  },
  mobileToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#1C1917',
    '@media (maxWidth: 768px)': {
      display: 'block'
    }
  }
};

export default Navbar;
