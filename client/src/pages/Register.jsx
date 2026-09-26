import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, Mail, Lock, Phone, Briefcase, GraduationCap, Award, Calendar, Layers, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('student'); // 'student' | 'faculty'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    department: '',
    branch: '',
    year: '',
    semester: '',
    facultyId: '',
    designation: '',
    qualification: '',
    specialization: '',
    experience: '',
    phone: ''
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

    const {
      name,
      email,
      password,
      confirmPassword,
      studentId,
      branch,
      year,
      semester,
      facultyId,
      department,
      designation,
      qualification,
      specialization,
      experience,
      phone
    } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all basic required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (role === 'faculty') {
      if (!department || !designation) {
        setError('Please provide your department and academic designation.');
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === 'student' && {
          studentId: studentId ? studentId.trim() : '',
          phone: phone ? phone.trim() : '',
          department: department ? department.trim() : '',
          branch: branch ? branch.trim() : '',
          year: year ? year.trim() : '',
          semester: semester ? semester.trim() : '',
          yearSemester: year && semester ? `${year} / Sem ${semester}` : year || semester || ''
        }),
        ...(role === 'faculty' && {
          facultyId: facultyId || `FAC-${Date.now().toString().slice(-4)}`,
          department,
          designation,
          qualification,
          specialization,
          experience,
          phone
        })
      };

      await register(payload);

      if (role === 'faculty') {
        navigate('/faculty/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div className="card" style={{ ...styles.authCard, maxWidth: '680px' }}>
        <div style={styles.cardHeader}>
          <div style={styles.logoIcon}>
            <BookOpen size={24} color="#FFFFFF" />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Create Account</h2>
          <p style={{ color: '#78716C', fontSize: '0.9rem' }}>Join EduVibe LMS and start your educational journey</p>

          {/* Role Toggle Selector */}
          <div style={styles.roleToggle}>
            <button
              type="button"
              style={{
                ...styles.roleBtn,
                ...(role === 'student' ? styles.roleBtnActive : {})
              }}
              onClick={() => setRole('student')}
            >
              <User size={16} /> Student Account
            </button>
            <button
              type="button"
              style={{
                ...styles.roleBtn,
                ...(role === 'faculty' ? styles.roleBtnActive : {})
              }}
              onClick={() => setRole('faculty')}
            >
              <GraduationCap size={16} /> Faculty / Instructor
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Core Info Grid */}
          <div className={role === 'faculty' ? 'grid-2' : ''}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#78716C" style={styles.inputIcon} />
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder={role === 'faculty' ? 'Dr. Alan Turing' : 'John Doe'}
                  value={formData.name}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
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
          </div>

          <div className={role === 'faculty' ? 'grid-2' : ''}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#78716C" style={styles.inputIcon} />
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#78716C" style={styles.inputIcon} />
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Student Specific Fields */}
          {role === 'student' && (
            <div style={styles.facultyFieldsContainer}>
              <div style={styles.sectionDivider}>
                <ShieldCheck size={16} color="#B87333" />
                <span>Student Academic Details</span>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Student ID</label>
                  <div style={{ position: 'relative' }}>
                    <Layers size={18} color="#78716C" style={styles.inputIcon} />
                    <input
                      type="text"
                      name="studentId"
                      className="form-input"
                      placeholder="e.g. STU-2026-001 (optional)"
                      value={formData.studentId}
                      onChange={handleChange}
                      style={{ paddingLeft: '2.5rem' }}
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
                      placeholder="e.g. +1 555-0123"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{ paddingLeft: '2.5rem' }}
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
                      placeholder="e.g. Computer Science & Engineering"
                      value={formData.department}
                      onChange={handleChange}
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Branch / Major</label>
                  <div style={{ position: 'relative' }}>
                    <GraduationCap size={18} color="#78716C" style={styles.inputIcon} />
                    <input
                      type="text"
                      name="branch"
                      className="form-input"
                      placeholder="e.g. Information Technology"
                      value={formData.branch}
                      onChange={handleChange}
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} color="#78716C" style={styles.inputIcon} />
                    <input
                      type="text"
                      name="year"
                      className="form-input"
                      placeholder="e.g. 3rd Year"
                      value={formData.year}
                      onChange={handleChange}
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <div style={{ position: 'relative' }}>
                    <Award size={18} color="#78716C" style={styles.inputIcon} />
                    <input
                      type="text"
                      name="semester"
                      className="form-input"
                      placeholder="e.g. Semester 5"
                      value={formData.semester}
                      onChange={handleChange}
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Faculty Specific Fields */}
          {role === 'faculty' && (
            <div style={styles.facultyFieldsContainer}>
              <div style={styles.sectionDivider}>
                <ShieldCheck size={16} color="#B87333" />
                <span>Faculty & Academic Credentials</span>
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
                      placeholder="e.g. FAC-1001 (optional)"
                      value={formData.facultyId}
                      onChange={handleChange}
                      style={{ paddingLeft: '2.5rem' }}
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
                      placeholder="e.g. +1 555-0199"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <div style={{ position: 'relative' }}>
                    <Briefcase size={18} color="#78716C" style={styles.inputIcon} />
                    <input
                      type="text"
                      name="department"
                      className="form-input"
                      placeholder="e.g. Computer Science & Eng."
                      value={formData.department}
                      onChange={handleChange}
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Designation *</label>
                  <div style={{ position: 'relative' }}>
                    <Award size={18} color="#78716C" style={styles.inputIcon} />
                    <input
                      type="text"
                      name="designation"
                      className="form-input"
                      placeholder="e.g. Associate Professor"
                      value={formData.designation}
                      onChange={handleChange}
                      style={{ paddingLeft: '2.5rem' }}
                      required
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
                      placeholder="e.g. Ph.D. in Computer Science"
                      value={formData.qualification}
                      onChange={handleChange}
                      style={{ paddingLeft: '2.5rem' }}
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
                      placeholder="e.g. 7 Years"
                      value={formData.experience}
                      onChange={handleChange}
                      style={{ paddingLeft: '2.5rem' }}
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
                  placeholder="e.g. Full Stack Development, Cloud Architecture, Artificial Intelligence"
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1.25rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : (
              <>
                Register as {role === 'faculty' ? 'Faculty Member' : 'Student'} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={styles.footerNote}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#B87333', fontWeight: '700' }}>
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    padding: '3rem 1.5rem 5rem 1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '75vh'
  },
  authCard: {
    width: '100%',
    padding: '2.25rem',
    transition: 'all 0.3s ease'
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '1.75rem'
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
  roleToggle: {
    display: 'flex',
    backgroundColor: '#F3EFEA',
    borderRadius: '10px',
    padding: '4px',
    marginTop: '1.25rem',
    gap: '4px'
  },
  roleBtn: {
    flex: 1,
    padding: '0.6rem 0.8rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    fontSize: '0.88rem',
    fontWeight: '600',
    color: '#78716C',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.45rem',
    transition: 'all 0.2s'
  },
  roleBtnActive: {
    backgroundColor: '#FFFFFF',
    color: '#1C1917',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
  },
  facultyFieldsContainer: {
    marginTop: '0.75rem',
    paddingTop: '1rem',
    borderTop: '1px solid #E7E5E4'
  },
  sectionDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.82rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#B87333',
    marginBottom: '1rem',
    letterSpacing: '0.5px'
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
  }
};

export default Register;
