import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, attendanceService } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users,
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Shield,
  Flame,
  Calendar,
  Activity,
  Award
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [statsData, attStatsData] = await Promise.all([
          adminService.getStats(),
          attendanceService.getAdminStats().catch((err) => {
            console.error('Admin attendance stats error:', err);
            return null;
          })
        ]);
        setStats(statsData);
        setAttendanceStats(attStatsData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load administrator statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading administrator analytics..." />;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const {
    totalStudents = 0,
    totalFaculty = 0,
    totalCourses = 0,
    totalEnrollments = 0,
    completedCourses = 0,
    recentCourses = [],
    recentStudents = [],
    recentFaculty = [],
    recentEnrollments = []
  } = stats || {};

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-warning">
                <Shield size={12} style={{ marginRight: 4 }} /> Admin Panel
              </span>
            </div>
            <h1 className="section-title">Administrator Dashboard</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Live platform metrics, faculty workloads, student enrollments, and course management.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/admin/courses" className="btn btn-primary">
              <PlusCircle size={18} /> Manage Courses
            </Link>
            <Link to="/admin/faculty" className="btn btn-secondary">
              <Users size={18} /> Manage Faculty
            </Link>
            <Link to="/admin/students" className="btn btn-secondary">
              <Users size={18} /> View Students
            </Link>
          </div>
        </div>

        {/* Top Metric Cards (5 Cards) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          <DashboardCard
            title="Total Students"
            value={totalStudents}
            icon={Users}
            subtext="Registered Students"
            color="#3D291F"
          />
          <DashboardCard
            title="Total Faculty"
            value={totalFaculty}
            icon={Users}
            subtext="Active Instructors"
            color="#7C2D12"
          />
          <DashboardCard
            title="Total Courses"
            value={totalCourses}
            icon={BookOpen}
            subtext="Active Programs"
            color="#B87333"
          />
          <DashboardCard
            title="Total Enrollments"
            value={totalEnrollments}
            icon={BookmarkCheck}
            subtext="Student Registrations"
            color="#0369A1"
          />
          <DashboardCard
            title="Completed"
            value={completedCourses}
            icon={CheckCircle2}
            subtext="Finished Programs"
            color="#15803D"
          />
        </div>

        {/* Student Learning Activity & Attendance System Analytics */}
        {attendanceStats && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem' }}>Student Learning Activity & Attendance Metrics</h2>
              <p style={{ color: '#78716C', fontSize: '0.88rem', margin: 0 }}>
                Real-time LMS engagement, active daily streaks, and platform attendance analytics.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <DashboardCard
                title="Active Learners"
                value={attendanceStats.totalActiveLearners || 0}
                icon={Users}
                subtext="Engaged Students"
                color="#3D291F"
              />
              <DashboardCard
                title="Avg Attendance"
                value={`${attendanceStats.averageAttendance || 0}%`}
                icon={Calendar}
                subtext="Daily Active Rate"
                color="#15803D"
              />
              <DashboardCard
                title="Average Streak"
                value={`${attendanceStats.averageStreak || 0} Days`}
                icon={Flame}
                subtext="Continuous Learning"
                color="#B45309"
              />
              <DashboardCard
                title="Total Learning Days"
                value={attendanceStats.totalLearningDays || 0}
                icon={Activity}
                subtext="Platform Learning Days"
                color="#0369A1"
              />
              <DashboardCard
                title="Lessons Completed"
                value={attendanceStats.totalLessonsCompleted || 0}
                icon={Award}
                subtext="Course Modules Finished"
                color="#7C2D12"
              />
            </div>
          </div>
        )}

        {/* Dashboard Recent Tables Grid */}
        <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
          {/* Recent Courses */}
          <div className="card">
            <div style={styles.cardHeader}>
              <h3>Recent Courses</h3>
              <Link to="/admin/courses" style={styles.headerLink}>
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {recentCourses.length > 0 ? (
              <div style={styles.list}>
                {recentCourses.map((c) => (
                  <div key={c._id} style={styles.listItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={styles.iconCircle}>
                        <BookOpen size={16} color="#3D291F" />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.95rem' }}>{c.title}</strong>
                        <span style={styles.subLabel}>{c.category} • {c.level}</span>
                      </div>
                    </div>
                    <span className="badge badge-primary">{c.duration}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#78716C', padding: '1rem 0' }}>No courses added yet.</p>
            )}
          </div>

          {/* Recent Students */}
          <div className="card">
            <div style={styles.cardHeader}>
              <h3>Recent Registered Students</h3>
              <Link to="/admin/students" style={styles.headerLink}>
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {recentStudents.length > 0 ? (
              <div style={styles.list}>
                {recentStudents.map((s) => (
                  <div key={s._id} style={styles.listItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ ...styles.iconCircle, backgroundColor: '#FEF3C7' }}>
                        <Users size={16} color="#B45309" />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.95rem' }}>{s.name}</strong>
                        <span style={styles.subLabel}>{s.email}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#78716C' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#78716C', padding: '1rem 0' }}>No students registered yet.</p>
            )}
          </div>
        </div>

        {/* Recent Enrollments Stream */}
        <div className="card">
          <div style={styles.cardHeader}>
            <h3>Recent Enrollments Activity</h3>
            <span style={{ fontSize: '0.85rem', color: '#78716C' }}>Real-time updates</span>
          </div>

          {recentEnrollments.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Enrolled Course</th>
                    <th style={styles.th}>Progress</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnrollments.map((enr) => (
                    <tr key={enr._id} style={styles.tr}>
                      <td style={styles.td}>
                        <strong>{enr.student?.name || 'Unknown Student'}</strong>
                      </td>
                      <td style={styles.td}>{enr.student?.email || 'N/A'}</td>
                      <td style={styles.td}>{enr.course?.title || 'Deleted Course'}</td>
                      <td style={styles.td}>{enr.progress}%</td>
                      <td style={styles.td}>
                        <span className={`badge ${enr.status === 'Completed' ? 'badge-success' : 'badge-primary'}`}>
                          {enr.status}
                        </span>
                      </td>
                      <td style={styles.td}>{new Date(enr.enrolledAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#78716C', padding: '1rem 0' }}>No recent enrollment activity recorded.</p>
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

export default AdminDashboard;
