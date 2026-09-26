import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { User, Mail, Shield, Save, CheckCircle, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Password update states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setLoading(true);

    try {
      await updateProfile({ name: name.trim() });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await authService.updatePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });

      setPasswordMessage(res.message || 'Password updated successfully.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setPasswordMessage(''), 4000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password. Current password may be incorrect.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="section-title">My Account Profile</h1>
          <p className="section-subtitle">Manage your personal information and account security.</p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          {/* User Avatar Circle */}
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>{user?.name}</h3>
              <span className={`badge ${user?.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                {user?.role === 'admin' ? 'Administrator Account' : 'Student Account'}
              </span>
            </div>
          </div>

          {/* Section: Profile Information */}
          <div style={{ marginTop: '2rem' }}>
            <h4 style={styles.sectionHeader}>Profile Information</h4>

            {message && (
              <div className="alert alert-success">
                <CheckCircle size={18} /> {message}
              </div>
            )}
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#78716C" style={styles.inputIcon} />
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#78716C" style={styles.inputIcon} />
                  <input
                    type="email"
                    className="form-input"
                    value={user?.email || ''}
                    disabled
                    style={{ paddingLeft: '2.5rem', backgroundColor: '#F3EFEA', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Account Role (Read-only)</label>
                <div style={{ position: 'relative' }}>
                  <Shield size={18} color="#78716C" style={styles.inputIcon} />
                  <input
                    type="text"
                    className="form-input"
                    value={user?.role === 'admin' ? 'Admin' : 'Student'}
                    disabled
                    style={{ paddingLeft: '2.5rem', backgroundColor: '#F3EFEA', cursor: 'not-allowed' }}
                  />
                </div>
                <small style={{ color: '#78716C', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  Roles are managed by system security policies and cannot be modified directly.
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={loading}
              >
                {loading ? 'Saving Changes...' : (
                  <>
                    <Save size={18} /> Update Profile Name
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Section: Security / Update Password */}
          <div style={styles.securitySection}>
            <h4 style={styles.sectionHeader}>
              <KeyRound size={20} color="#B87333" style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Security & Password
            </h4>
            <p style={{ color: '#78716C', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Ensure your account is secure with a strong password.
            </p>

            {passwordMessage && (
              <div className="alert alert-success">
                <CheckCircle size={18} /> {passwordMessage}
              </div>
            )}
            {passwordError && <div className="alert alert-error">{passwordError}</div>}

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Current Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#78716C" style={styles.inputIcon} />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    className="form-input"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeBtn}
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? <EyeOff size={18} color="#78716C" /> : <Eye size={18} color="#78716C" />}
                  </button>
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
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
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
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
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
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Updating Password...' : (
                  <>
                    <KeyRound size={18} /> Update Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    paddingBottom: '1.75rem',
    borderBottom: '1px solid #E7E5E4'
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#3D291F',
    color: '#FFFFFF',
    fontSize: '1.75rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionHeader: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center'
  },
  securitySection: {
    marginTop: '2.5rem',
    paddingTop: '2rem',
    borderTop: '1px solid #E7E5E4'
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
  }
};

export default Profile;
