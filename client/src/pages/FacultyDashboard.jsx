import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { facultyService } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookOpen, Users, BookmarkCheck, CheckCircle2, PlusCircle, ArrowRight, GraduationCap, Clock, Award } from 'lucide-react';

const FacultyDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await facultyService.getDashboard();
        setDashboardData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load faculty dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading faculty dashboard..." />;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const {
    totalCourses = 0,
    totalStudents = 0,
    totalEnrollments = 0,
    completedStudents = 0,
    myCourses = [],
    recentEnrollments = [],
    recentStudents = []
  } = dashboardData || {};

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-info">
                <GraduationCap size={13} style={{ marginRight: 4 }} /> Instructor Workspace
              </span>
            </div>
            <h1 className="section-title">Faculty Dashboard</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Monitor your assigned courses, active student enrollments, and syllabus progress.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/faculty/courses" className="btn btn-primary">
              <PlusCircle size={18} /> Manage My Courses
            </Link>
            <Link to="/faculty/students" className="btn btn-secondary">
              <Users size={18} /> View My Students
            </Link>
          </div>
        </div>

        {/* 4 Key Summary Metric Cards */}
        <div className="grid-4" style={{ marginBottom: '3rem' }}>
          <DashboardCard
            title="Total Courses"
            value={totalCourses}
            icon={BookOpen}
            subtext="Created Courses"
            color="#3D291F"
          />
          <DashboardCard
            title="Total Students"
            value={totalStudents}
            icon={Users}
            subtext="Unique Learners"
            color="#B87333"
          />
          <DashboardCard
            title="Total Enrollments"
            value={totalEnrollments}
            icon={BookmarkCheck}
            subtext="Active Course Seats"
            color="#0369A1"
          />
          <DashboardCard
            title="Completed Students"
            value={completedStudents}
            icon={CheckCircle2}
            subtext="Graduated Learners"
            color="#15803D"
          />
        </div>

        {/* Grid: My Courses Overview & Recent Students */}
        <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
          {/* My Courses */}
          <div className="card">
            <div style={styles.cardHeader}>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>My Courses</h3>
                <span style={{ fontSize: '0.8rem', color: '#78716C' }}>Your active teaching curriculum</span>
              </div>
              <Link to="/faculty/courses" style={styles.headerLink}>
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {myCourses.length > 0 ? (
              <div style={styles.list}>
                {myCourses.map((c) => (
                  <div key={c._id} style={styles.listItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={styles.iconCircle}>
                        <BookOpen size={16} color="#3D291F" />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.95rem', display: 'block' }}>{c.title}</strong>
                        <span style={styles.subLabel}>
                          {c.category} • {c.level} • {c.lessons?.length || 0} Lessons
                        </span>
                      </div>
                    </div>
                    <Link to={`/faculty/courses/${c._id}`} className="btn btn-secondary btn-sm">
                      Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <p style={{ color: '#78716C', marginBottom: '1rem' }}>No courses added under your faculty account yet.</p>
                <Link to="/faculty/courses" className="btn btn-primary btn-sm">
                  Create First Course
                </Link>
              </div>
            )}
          </div>

          {/* Recent Students */}
          <div className="card">
            <div style={styles.cardHeader}>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>Recent Enrolled Students</h3>
                <span style={{ fontSize: '0.8rem', color: '#78716C' }}>Students enrolled in your courses</span>
              </div>
              <Link to="/faculty/students" style={styles.headerLink}>
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {recentStudents.length > 0 ? (
              <div style={styles.list}>
                {recentStudents.map((st) => (
                  <div key={st._id} style={styles.listItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ ...styles.iconCircle, backgroundColor: '#FEF3C7' }}>
                        <Users size={16} color="#B45309" />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.95rem', display: 'block' }}>{st.name}</strong>
                        <span style={styles.subLabel}>
                          {st.email} • {st.enrolledCourse}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#78716C' }}>
                      {new Date(st.enrolledAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#78716C', padding: '2rem 0', textAlign: 'center' }}>
                No students enrolled in your courses yet.
              </p>
            )}
          </div>
        </div>

        {/* Recent Enrollments Activity Stream */}
        <div className="card">
          <div style={styles.cardHeader}>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>Recent Course Activity & Enrollments</h3>
              <span style={{ fontSize: '0.82rem', color: '#78716C' }}>Live enrollment registrations in your subjects</span>
            </div>
            <Link to="/faculty/students" style={styles.headerLink}>
              View All Students <ArrowRight size={14} />
            </Link>
          </div>

          {recentEnrollments.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>Email Address</th>
                    <th style={styles.th}>Course</th>
                    <th style={styles.th}>Progress</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Enrollment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnrollments.map((enr) => (
                    <tr key={enr._id} style={styles.tr}>
                      <td style={styles.td}>
                        <strong>{enr.student?.name || 'Unknown Student'}</strong>
                      </td>
                      <td style={styles.td}>{enr.student?.email || 'N/A'}</td>
                      <td style={styles.td}>{enr.course?.title || 'Unknown Course'}</td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: '600' }}>{enr.progress}%</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span
                          className={`badge ${
                            enr.status === 'Completed' || enr.progress === 100
                              ? 'badge-success'
                              : 'badge-primary'
                          }`}
                        >
                          {enr.status === 'Completed' || enr.progress === 100 ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      <td style={styles.td}>{new Date(enr.enrolledAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#78716C', padding: '2rem 0', textAlign: 'center' }}>
              No recent enrollment transactions recorded.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #E7E5E4'
  },
  headerLink: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#B87333',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem',
    borderRadius: '8px',
    backgroundColor: '#FAF8F5'
  },
  iconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#F4ECE6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subLabel: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#78716C'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
    textAlign: 'left'
  },
  th: {
    padding: '0.75rem 1rem',
    borderBottom: '2px solid #E7E5E4',
    color: '#78716C',
    fontWeight: '700',
    fontSize: '0.8rem',
    textTransform: 'uppercase'
  },
  td: {
    padding: '0.85rem 1rem',
    borderBottom: '1px solid #E7E5E4'
  },
  tr: {
    transition: 'background-color 0.15s'
  }
};

export default FacultyDashboard;
