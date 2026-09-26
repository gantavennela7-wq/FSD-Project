import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Save, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
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
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0' }}>
      <div className="container" style={{ maxWidth: '650px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="section-title">My Account Profile</h1>
          <p className="section-subtitle">Manage your personal information and profile details.</p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          {message && (
            <div className="alert alert-success">
              <CheckCircle size={18} /> {message}
            </div>
          )}
          {error && <div className="alert alert-error">{error}</div>}

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

          <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
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
              style={{ width: '100%', marginTop: '1.5rem' }}
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
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)'
  }
};

export default Profile;
