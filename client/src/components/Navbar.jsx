import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, User as UserIcon, LogOut, Menu, X, Shield, 
  LayoutDashboard, BookmarkCheck, Users, Bell, Check, CheckCheck, 
  Sparkles, Award, HelpCircle, ExternalLink 
} from 'lucide-react';
import { notificationService } from '../services/api';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isFaculty, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const notifRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationService.getNotifications();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif._id);
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    }
    setIsNotifOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const formatTimeAgo = (dateString) => {
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'quiz':
        return <HelpCircle size={16} color="#B87333" />;
      case 'course':
        return <Award size={16} color="#059669" />;
      case 'announcement':
        return <Sparkles size={16} color="#4F46E5" />;
      default:
        return <Bell size={16} color="#3D291F" />;
    }
  };

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

              {/* Notification Bell Component */}
              <div style={{ position: 'relative' }} ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  style={{
                    background: isNotifOpen ? '#EFEBE4' : 'transparent',
                    border: '1px solid #E7E5E4',
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    color: '#3D291F',
                    transition: 'all 0.2s'
                  }}
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#B87333',
                      color: '#FFFFFF',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      borderRadius: '10px',
                      padding: '1px 6px',
                      lineHeight: '1.2',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                    }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotifOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '340px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E7E5E4',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #E7E5E4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#FAF8F5'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Bell size={16} color="#3D291F" />
                        <span style={{ fontWeight: '700', color: '#3D291F', fontSize: '0.95rem' }}>Notifications</span>
                        {unreadCount > 0 && (
                          <span style={{
                            backgroundColor: '#B87333',
                            color: '#FFF',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '1px 6px',
                            borderRadius: '10px'
                          }}>
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#B87333',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <CheckCheck size={14} /> Mark all read
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '32px 16px', textAlign: 'center', color: '#78716C', fontSize: '0.9rem' }}>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => handleNotificationClick(notif)}
                            style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid #F5F5F4',
                              backgroundColor: notif.isRead ? '#FFFFFF' : '#FAF8F5',
                              cursor: 'pointer',
                              display: 'flex',
                              gap: '12px',
                              alignItems: 'flex-start',
                              transition: 'background 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = notif.isRead ? '#F9F8F6' : '#F4EFEA'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notif.isRead ? '#FFFFFF' : '#FAF8F5'}
                          >
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: '#F3EFEA',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px'
                            }}>
                              {getNotifIcon(notif.type)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{
                                  fontSize: '0.85rem',
                                  fontWeight: notif.isRead ? '600' : '700',
                                  color: '#1C1917'
                                }}>
                                  {notif.title}
                                </span>
                                {!notif.isRead && (
                                  <span style={{
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    backgroundColor: '#B87333',
                                    display: 'inline-block'
                                  }} />
                                )}
                              </div>
                              <p style={{
                                fontSize: '0.8rem',
                                color: '#57534E',
                                margin: '3px 0 5px 0',
                                lineHeight: '1.3'
                              }}>
                                {notif.message}
                              </p>
                              <span style={{ fontSize: '0.72rem', color: '#A8A29E' }}>
                                {formatTimeAgo(notif.createdAt)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

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

              {/* Notification Bell Component for Faculty */}
              <div style={{ position: 'relative' }} ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  style={{
                    background: isNotifOpen ? '#EFEBE4' : 'transparent',
                    border: '1px solid #E7E5E4',
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    color: '#3D291F',
                    transition: 'all 0.2s'
                  }}
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#B87333',
                      color: '#FFFFFF',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      borderRadius: '10px',
                      padding: '1px 6px',
                      lineHeight: '1.2'
                    }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '340px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E7E5E4',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #E7E5E4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#FAF8F5'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Bell size={16} color="#3D291F" />
                        <span style={{ fontWeight: '700', color: '#3D291F', fontSize: '0.95rem' }}>Notifications</span>
                        {unreadCount > 0 && (
                          <span style={{
                            backgroundColor: '#B87333',
                            color: '#FFF',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '1px 6px',
                            borderRadius: '10px'
                          }}>
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#B87333',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <CheckCheck size={14} /> Mark all read
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '32px 16px', textAlign: 'center', color: '#78716C', fontSize: '0.9rem' }}>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => handleNotificationClick(notif)}
                            style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid #F5F5F4',
                              backgroundColor: notif.isRead ? '#FFFFFF' : '#FAF8F5',
                              cursor: 'pointer',
                              display: 'flex',
                              gap: '12px',
                              alignItems: 'flex-start'
                            }}
                          >
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: '#F3EFEA',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {getNotifIcon(notif.type)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: notif.isRead ? '600' : '700', color: '#1C1917' }}>
                                  {notif.title}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.8rem', color: '#57534E', margin: '3px 0 5px 0' }}>
                                {notif.message}
                              </p>
                              <span style={{ fontSize: '0.72rem', color: '#A8A29E' }}>
                                {formatTimeAgo(notif.createdAt)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

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

              {/* Notification Bell Component for Admin */}
              <div style={{ position: 'relative' }} ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  style={{
                    background: isNotifOpen ? '#EFEBE4' : 'transparent',
                    border: '1px solid #E7E5E4',
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    color: '#3D291F',
                    transition: 'all 0.2s'
                  }}
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#B87333',
                      color: '#FFFFFF',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      borderRadius: '10px',
                      padding: '1px 6px',
                      lineHeight: '1.2'
                    }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '340px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E7E5E4',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #E7E5E4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#FAF8F5'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Bell size={16} color="#3D291F" />
                        <span style={{ fontWeight: '700', color: '#3D291F', fontSize: '0.95rem' }}>Notifications</span>
                        {unreadCount > 0 && (
                          <span style={{
                            backgroundColor: '#B87333',
                            color: '#FFF',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '1px 6px',
                            borderRadius: '10px'
                          }}>
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#B87333',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <CheckCheck size={14} /> Mark all read
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '32px 16px', textAlign: 'center', color: '#78716C', fontSize: '0.9rem' }}>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => handleNotificationClick(notif)}
                            style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid #F5F5F4',
                              backgroundColor: notif.isRead ? '#FFFFFF' : '#FAF8F5',
                              cursor: 'pointer',
                              display: 'flex',
                              gap: '12px',
                              alignItems: 'flex-start'
                            }}
                          >
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: '#F3EFEA',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {getNotifIcon(notif.type)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: notif.isRead ? '600' : '700', color: '#1C1917' }}>
                                  {notif.title}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.8rem', color: '#57534E', margin: '3px 0 5px 0' }}>
                                {notif.message}
                              </p>
                              <span style={{ fontSize: '0.72rem', color: '#A8A29E' }}>
                                {formatTimeAgo(notif.createdAt)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

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
