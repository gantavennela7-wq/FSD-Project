import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { email, newPassword, confirmPassword } = formData;

    if (!email.trim() || !newPassword || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.forgotPassword({
        email: email.trim(),
        newPassword,
        confirmPassword
      });

      setSuccess(true);
      setSuccessMsg(res.message || 'Password updated successfully. Please login with your new password.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div className="card" style={styles.authCard}>
        <div style={styles.cardHeader}>
          <div style={styles.logoIcon}>
            <KeyRound size={24} color="#FFFFFF" />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Forgot Password</h2>
          <p style={{ color: '#78716C', fontSize: '0.9rem' }}>
            Enter your account email and choose a new password
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={styles.successIconBox}>
              <CheckCircle size={48} color="#15803D" />
            </div>
            <div className="alert alert-success" style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
              {successMsg}
            </div>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={() => navigate('/login')}
            >
              <ArrowLeft size={18} /> Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Account Email Address *</label>
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
              <label className="form-label">New Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#78716C" style={styles.inputIcon} />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  className="form-input"
                  placeholder="Minimum 6 characters"
                  value={formData.newPassword}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeBtn}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff size={18} color="#78716C" /> : <Eye size={18} color="#78716C" />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#78716C" style={styles.inputIcon} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Re-enter new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeBtn}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} color="#78716C" /> : <Eye size={18} color="#78716C" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1.25rem' }}
              disabled={loading}
            >
              {loading ? 'Updating Password...' : (
                <>
                  Update Password <ArrowRight size={18} />
                </>
              )}
            </button>

            <div style={styles.footerNote}>
              <Link to="/login" style={{ color: '#B87333', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </form>
        )}
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
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerNote: {
    textAlign: 'center',
    marginTop: '1.75rem',
    fontSize: '0.9rem',
    color: '#78716C'
  },
  successIconBox: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem'
  }
};

export default ForgotPassword;
