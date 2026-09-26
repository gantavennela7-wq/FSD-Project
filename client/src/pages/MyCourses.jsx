import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentService } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookOpen, PlayCircle, PlusCircle, CheckCircle2 } from 'lucide-react';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const data = await enrollmentService.getMyEnrollments();
        setEnrollments(data);
      } catch (err) {
        console.error('Failed to load my courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const filteredEnrollments = enrollments.filter((item) => {
    if (filterStatus === 'Completed') return item.status === 'Completed';
    if (filterStatus === 'In Progress') return item.status === 'In Progress';
    return true;
  });

  if (loading) {
    return <LoadingSpinner message="Loading your courses catalog..." />;
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title">My Enrolled Courses</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Access all your registered learning programs and continuous coursework.
            </p>
          </div>
          <Link to="/courses" className="btn btn-primary">
            <PlusCircle size={18} /> Enroll in New Course
          </Link>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          {['All', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              className={`btn btn-sm ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus(status)}
            >
              {status} ({status === 'All' ? enrollments.length : enrollments.filter((e) => e.status === status).length})
            </button>
          ))}
        </div>

        {/* Grid List */}
        {filteredEnrollments.length > 0 ? (
          <div className="grid-3">
            {filteredEnrollments.map((item) => {
              const course = item.course || {};
              return (
                <div key={item._id} className="card card-hover" style={styles.courseCard}>
                  <div style={styles.imgContainer}>
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                      alt={course.title}
                      style={styles.thumbnail}
                    />
                    <span
                      className={`badge ${item.status === 'Completed' ? 'badge-success' : 'badge-primary'}`}
                      style={styles.statusBadge}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div style={styles.body}>
                    <h3 style={styles.title}>{course.title || 'Course Title'}</h3>
                    <p style={styles.instructor}>Instructor: {course.instructor || 'Staff'}</p>

                    <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <ProgressBar progress={item.progress} />
                      </div>

                      <Link
                        to={`/student/course/${course._id || item._id}`}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                      >
                        <PlayCircle size={16} /> Continue Learning
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <BookOpen size={48} color="#A8A29E" style={{ marginBottom: '1rem' }} />
            <h3>No courses found for this filter</h3>
            <p style={{ color: '#78716C', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              {filterStatus === 'Completed'
                ? "You haven't completed any courses yet. Keep learning!"
                : "No active courses match the selected criteria."}
            </p>
            <Link to="/courses" className="btn btn-primary">
              Explore Courses Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  courseCard: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: 0
  },
  imgContainer: {
    position: 'relative',
    height: '160px',
    backgroundColor: '#F3EFEA'
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  statusBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
  },
  body: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: '700',
    marginBottom: '0.4rem'
  },
  instructor: {
    fontSize: '0.85rem',
    color: '#78716C'
  }
};

export default MyCourses;
