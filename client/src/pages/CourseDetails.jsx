import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService, enrollmentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Clock, User, Users, BookOpen, CheckCircle, ArrowLeft, ShieldCheck, PlayCircle } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const courseData = await courseService.getById(id);
        setCourse(courseData);

        // If logged in student, check if already enrolled
        if (isAuthenticated && isStudent) {
          try {
            const userEnrollments = await enrollmentService.getMyEnrollments();
            const existing = userEnrollments.find(
              (e) => (e.course?._id || e.course) === id
            );
            if (existing) {
              setEnrollment(existing);
            }
          } catch (eErr) {
            console.error('Error fetching user enrollment state:', eErr);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, isAuthenticated, isStudent]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    if (!isStudent) {
      setError('Admins cannot enroll in student courses.');
      return;
    }

    setEnrolling(true);
    setError('');
    setSuccess('');

    try {
      const res = await enrollmentService.enroll(id);
      setSuccess('Enrolled successfully! Redirecting to your learning workspace...');
      setEnrollment(res.enrollment);
      setTimeout(() => {
        navigate(`/student/course/${id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading course workspace..." />;
  }

  if (error && !course) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="alert alert-error">{error}</div>
        <Link to="/courses" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Back Link */}
        <Link to="/courses" style={styles.backLink}>
          <ArrowLeft size={16} /> Back to All Courses
        </Link>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="grid-2" style={{ gap: '3rem', alignItems: 'flex-start' }}>
          {/* Main Details */}
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <span className="badge badge-primary">{course.category}</span>
              <span
                className={`badge ${
                  course.level === 'Beginner'
                    ? 'badge-success'
                    : course.level === 'Intermediate'
                    ? 'badge-warning'
                    : 'badge-info'
                }`}
              >
                {course.level}
              </span>
            </div>

            <h1 style={{ marginBottom: '1.25rem', fontSize: '2.5rem', lineHeight: '1.2' }}>
              {course.title}
            </h1>

            <p style={{ color: '#57534E', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.7' }}>
              {course.description}
            </p>

            {/* Course Meta Info */}
            <div style={styles.metaBox}>
              <div style={styles.metaCell}>
                <User size={20} color="#B87333" />
                <div>
                  <span style={styles.metaLabel}>Instructor</span>
                  <p style={styles.metaValue}>{course.instructorName || course.instructor || 'EduVibe Faculty'}</p>
                </div>
              </div>

              <div style={styles.metaCell}>
                <Clock size={20} color="#B87333" />
                <div>
                  <span style={styles.metaLabel}>Duration</span>
                  <p style={styles.metaValue}>{course.duration}</p>
                </div>
              </div>

              <div style={styles.metaCell}>
                <Users size={20} color="#B87333" />
                <div>
                  <span style={styles.metaLabel}>Students Enrolled</span>
                  <p style={styles.metaValue}>{course.enrolledCount || 0} Students</p>
                </div>
              </div>
            </div>

            {/* What You'll Learn / Objectives */}
            {(course.learningObjectives || course.skills?.length > 0) && (
              <div className="card" style={{ marginTop: '2rem', padding: '1.75rem', backgroundColor: '#FAF8F5' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>What You'll Learn</h3>
                
                {course.learningObjectives && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                    {course.learningObjectives.split(/[\n•;]+/).filter(Boolean).map((obj, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                        <CheckCircle size={17} color="#15803D" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '0.92rem', color: '#1C1917', lineHeight: '1.5' }}>
                          {obj.trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {course.skills && course.skills.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E7E5E4' }}>
                    <strong style={{ fontSize: '0.82rem', color: '#78716C', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                      Skills You Will Gain:
                    </strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {course.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="badge badge-primary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Prerequisites */}
            {course.prerequisites && (
              <div style={{ marginTop: '1.75rem', padding: '1.25rem 1.5rem', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E7E5E4' }}>
                <strong style={{ fontSize: '0.85rem', color: '#78716C', textTransform: 'uppercase' }}>
                  Prerequisites:
                </strong>
                <p style={{ fontSize: '0.95rem', color: '#1C1917', marginTop: '0.25rem', margin: 0 }}>
                  {course.prerequisites}
                </p>
              </div>
            )}

            {/* Course Modules / Syllabus Overview */}
            <div style={{ marginTop: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>
                  Course Curriculum & Modules
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#78716C' }}>
                  {course.lessons?.length || 0} Lessons
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {course.lessons && course.lessons.length > 0 ? (
                  course.lessons.map((lesson, idx) => (
                    <div key={idx} className="card" style={styles.lessonRow}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <PlayCircle size={20} color="#3D291F" />
                        <div>
                          <h4 style={{ fontSize: '0.98rem', fontWeight: '600' }}>{lesson.title}</h4>
                          <span style={{ fontSize: '0.8rem', color: '#78716C' }}>
                            {lesson.moduleName || 'Module 1'}
                          </span>
                        </div>
                      </div>
                      <span className="badge badge-info">{lesson.duration || '15 mins'}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#78716C' }}>No lessons uploaded for this course yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Card / Enrollment Box */}
          <div className="card" style={styles.sidebarCard}>
            <img
              src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
              alt={course.title}
              style={styles.cardThumbnail}
            />

            <div style={{ padding: '1.5rem' }}>
              {enrollment ? (
                <div style={{ textAlign: 'center' }}>
                  <div className="alert alert-success" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                    <CheckCircle size={18} /> Already Enrolled
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#78716C', marginBottom: '1.25rem' }}>
                    Current Progress: <strong>{enrollment.progress}%</strong>
                  </p>
                  <Link to={`/student/course/${course._id}`} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                    <BookOpen size={18} /> Go to My Course
                  </Link>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Free Lifetime Access</h3>
                  <p style={{ color: '#78716C', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Enroll now to unlock full course lessons, self-paced progress tracking, and complete hands-on material.
                  </p>
                  <button
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>

                  <div style={styles.featureList}>
                    <div style={styles.featureLine}>
                      <ShieldCheck size={16} color="#15803D" /> 100% Free Lifetime Access
                    </div>
                    <div style={styles.featureLine}>
                      <ShieldCheck size={16} color="#15803D" /> Self-Paced Learning Modules
                    </div>
                    <div style={styles.featureLine}>
                      <ShieldCheck size={16} color="#15803D" /> Course Completion Tracking
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#78716C',
    fontWeight: '600',
    fontSize: '0.9rem',
    marginBottom: '2rem'
  },
  metaBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    backgroundColor: '#FFFFFF',
    padding: '1.25rem',
    borderRadius: '12px',
    border: '1px solid #E7E5E4'
  },
  metaCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  metaLabel: {
    fontSize: '0.78rem',
    color: '#78716C',
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  metaValue: {
    fontWeight: '700',
    color: '#1C1917',
    fontSize: '0.95rem'
  },
  lessonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.25rem'
  },
  sidebarCard: {
    padding: 0,
    overflow: 'hidden',
    position: 'sticky',
    top: '100px'
  },
  cardThumbnail: {
    width: '100%',
    height: '220px',
    objectFit: 'cover'
  },
  featureList: {
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid #E7E5E4',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem'
  },
  featureLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#57534E',
    fontWeight: '500'
  }
};

export default CourseDetails;
