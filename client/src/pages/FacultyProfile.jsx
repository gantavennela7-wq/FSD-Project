import React, { useState, useEffect } from 'react';
import { facultyService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Award,
  GraduationCap,
  Calendar,
  Layers,
  FileText,
  Save,
  CheckCircle,
  Shield,
  Camera
} from 'lucide-react';

const FacultyProfile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    facultyId: '',
    department: '',
    designation: '',
    qualification: '',
    specialization: '',
    experience: '',
    phone: '',
    bio: '',
    profilePhoto: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await facultyService.getProfile();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          facultyId: data.facultyId || '',
          department: data.department || '',
          designation: data.designation || '',
          qualification: data.qualification || '',
          specialization: data.specialization || '',
          experience: data.experience || '',
          phone: data.phone || '',
          bio: data.bio || '',
          profilePhoto: data.profilePhoto || ''
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch faculty profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.name.trim()) {
      setError('Full Name is required.');
      return;
    }

    setSaving(true);
    try {
      const updated = await facultyService.updateProfile(formData);
      setUser((prev) => ({ ...prev, ...updated }));
      setMessage('Faculty profile updated successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update faculty profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your faculty credentials..." />;
  }

  return (
    <div style={{ padding: '3.5rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="section-title">Faculty Member Profile</h1>
          <p className="section-subtitle">
            Manage your academic credentials, departmental info, and instructor profile.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          {message && (
            <div className="alert alert-success">
              <CheckCircle size={18} /> {message}
            </div>
          )}
          {error && <div className="alert alert-error">{error}</div>}

          {/* Header Avatar & Summary */}
          <div style={styles.avatarSection}>
            {formData.profilePhoto ? (
              <img
                src={formData.profilePhoto}
                alt={formData.name}
                style={styles.avatarImg}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div style={styles.avatar}>
                {formData.name?.charAt(0).toUpperCase() || 'F'}
              </div>
            )}

            <div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>{formData.name}</h3>
              <p style={{ color: '#78716C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {formData.designation || 'Faculty Instructor'}{' '}
                {formData.department ? `• ${formData.department}` : ''}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-info">
                  <GraduationCap size={12} style={{ marginRight: 4 }} /> Faculty Role
                </span>
                {formData.facultyId && (
                  <span className="badge badge-primary">ID: {formData.facultyId}</span>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#78716C" style={styles.inputIcon} />
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
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
                    name="email"
                    className="form-input"
                    value={formData.email}
                    disabled
                    style={{ paddingLeft: '2.5rem', backgroundColor: '#F3EFEA', cursor: 'not-allowed' }}
                  />
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Faculty ID</label>
                <div style={{ position: 'relative' }}>
                  <Layers size={18} color="#78716C" style={styles.inputIcon} />
                  <input
                    type="text"
                    name="facultyId"
                    className="form-input"
                    value={formData.facultyId}
                    onChange={handleChange}
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="e.g. FAC-1001"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} color="#78716C" style={styles.inputIcon} />
                  <input
                    type="text"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="e.g. +1 555-0199"
                  />
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Department</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={18} color="#78716C" style={styles.inputIcon} />
                  <input
                    type="text"
                    name="department"
                    className="form-input"
                    value={formData.department}
                    onChange={handleChange}
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="e.g. Computer Science"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Academic Designation</label>
                <div style={{ position: 'relative' }}>
                  <Award size={18} color="#78716C" style={styles.inputIcon} />
                  <input
                    type="text"
                    name="designation"
                    className="form-input"
                    value={formData.designation}
                    onChange={handleChange}
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="e.g. Professor / Associate Professor"
                  />
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Highest Qualification</label>
                <div style={{ position: 'relative' }}>
                  <GraduationCap size={18} color="#78716C" style={styles.inputIcon} />
                  <input
                    type="text"
                    name="qualification"
                    className="form-input"
                    value={formData.qualification}
                    onChange={handleChange}
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="e.g. Ph.D. in Software Architecture"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} color="#78716C" style={styles.inputIcon} />
                  <input
                    type="text"
                    name="experience"
                    className="form-input"
                    value={formData.experience}
                    onChange={handleChange}
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="e.g. 10 Years"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Specialization / Domain Expertise</label>
              <input
                type="text"
                name="specialization"
                className="form-input"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g. Distributed Cloud, React Systems, Algorithms"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Photo URL</label>
              <div style={{ position: 'relative' }}>
                <Camera size={18} color="#78716C" style={styles.inputIcon} />
                <input
                  type="url"
                  name="profilePhoto"
                  className="form-input"
                  value={formData.profilePhoto}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Biography</label>
              <textarea
                name="bio"
                className="form-textarea"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Brief educator summary, research interests, and teaching background..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Role (Read-only)</label>
              <div style={{ position: 'relative' }}>
                <Shield size={18} color="#78716C" style={styles.inputIcon} />
                <input
                  type="text"
                  className="form-input"
                  value="Faculty / Instructor"
                  disabled
                  style={{ paddingLeft: '2.5rem', backgroundColor: '#F3EFEA', cursor: 'not-allowed' }}
                />
              </div>
              <small style={{ color: '#78716C', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                Roles are managed by administrative authority and cannot be changed here.
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1.5rem' }}
              disabled={saving}
            >
              {saving ? 'Updating...' : (
                <>
                  <Save size={18} /> Save Faculty Profile
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
    gap: '1.5rem',
    paddingBottom: '1.75rem',
    borderBottom: '1px solid #E7E5E4',
    flexWrap: 'wrap'
  },
  avatar: {
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    backgroundColor: '#3D291F',
    color: '#FFFFFF',
    fontSize: '1.8rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarImg: {
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #3D291F'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)'
  }
};

export default FacultyProfile;
