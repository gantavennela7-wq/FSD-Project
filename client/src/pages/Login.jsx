import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogIn, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      
      // Redirect based on role
      const fromPath = location.state?.from?.pathname;
      if (fromPath && !fromPath.includes('/login') && !fromPath.includes('/register')) {
        navigate(fromPath);
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'faculty') {
        navigate('/faculty/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div className="card" style={styles.authCard}>
        <div style={styles.cardHeader}>
          <div style={styles.logoIcon}>
            <BookOpen size={24} color="#FFFFFF" />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Welcome Back</h2>
          <p style={{ color: '#78716C', fontSize: '0.9rem' }}>Sign in to continue your learning journey</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#78716C" style={styles.inputIcon} />
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#78716C" style={styles.inputIcon} />
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : (
              <>
                Log In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={styles.footerNote}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#B87333', fontWeight: '700' }}>
            Register here
          </Link>
        </div>

        {/* Demo Credentials Box */}
        <div style={styles.demoBox}>
          <strong style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#78716C' }}>Demo Credentials</strong>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '0.4rem' }}>
            <span>Student: <code>student@lms.com</code> / <code>student123</code></span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '0.25rem' }}>
            <span>Faculty: <code>faculty@lms.com</code> / <code>faculty123</code></span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '0.25rem' }}>
            <span>Admin: <code>admin@lms.com</code> / <code>admin123</code></span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    padding: '4rem 1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh'
  },
  authCard: {
    width: '100%',
    maxWidth: '440px',
    padding: '2.25rem'
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#3D291F',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem auto'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  footerNote: {
    textAlign: 'center',
    marginTop: '1.75rem',
    fontSize: '0.9rem',
    color: '#78716C'
  },
  demoBox: {
    marginTop: '1.75rem',
    padding: '0.85rem',
    backgroundColor: '#F3EFEA',
    borderRadius: '8px',
    border: '1px solid #E7E5E4'
  }
};

export default Login;
