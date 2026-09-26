import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentService, attendanceService } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import AttendanceCalendar from '../components/AttendanceCalendar';
import LearningMilestones from '../components/LearningMilestones';
import AIAssistantModal from '../components/AIAssistantModal';
import {
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  PlayCircle,
  PlusCircle,
  Flame,
  Calendar as CalendarIcon,
  Activity,
  Award,
  Sparkles,
  Bot,
  Compass,
  ArrowRight
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAIOpen, setIsAIOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [enrollmentData, attData] = await Promise.all([
          enrollmentService.getMyEnrollments(),
          attendanceService.getMyStats().catch((err) => {
            console.error('Attendance fetch error:', err);
            return null;
          })
        ]);
        setEnrollments(enrollmentData);
        setAttendanceStats(attData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute Summary Statistics
  const totalEnrolled = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.status === 'Completed').length;
  const inProgressCourses = enrollments.filter((e) => e.status === 'In Progress').length;
  const averageProgress = totalEnrolled > 0
    ? Math.round(enrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalEnrolled)
    : 0;

  // Primary active course to feature in "Continue Learning"
  const activeCourseItem = enrollments.find((e) => e.status === 'In Progress') || enrollments[0];

  const currentStreak = attendanceStats?.currentStreak || 0;
  const longestStreak = attendanceStats?.longestStreak || 0;
  const monthlyAtt = attendanceStats?.monthlyAttendance || {
    activeDays: 0,
    daysInMonth: 30,
    currentDay: 25,
    attendancePercentage: 0
  };
  const learningAct = attendanceStats?.learningActivity || {
    totalLearningDays: 0,
    totalLessonsCompleted: 0
  };
  const milestones = attendanceStats?.milestones || [];

  if (loading) {
    return <LoadingSpinner message="Opening your learning hub..." />;
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }} className="digital-library-bg">
      <div className="container">
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-primary" style={{ padding: '0.2rem 0.6rem' }}>
                <BookOpen size={13} style={{ marginRight: 4 }} /> Student Learning Space
              </span>
              {currentStreak > 0 && (
                <span className="badge badge-warning" style={{ padding: '0.2rem 0.6rem' }}>
                  🔥 {currentStreak} Day Streak
                </span>
              )}
            </div>
            <h1 className="section-title">Welcome back, {user?.name || 'Student'}! 👋</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Here is your personal learning overview, course progress, and daily achievements.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsAIOpen(true)}
              className="btn btn-secondary"
              style={{ gap: '0.4rem', borderColor: '#B87333', color: '#B87333' }}
            >
              <Bot size={18} />
              <span>Ask AI Assistant</span>
              <Sparkles size={14} color="#B87333" />
            </button>
            <Link to="/courses" className="btn btn-primary">
              <PlusCircle size={18} /> Explore Courses
            </Link>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Featured "CONTINUE LEARNING" Hero Banner */}
        {activeCourseItem && (
          <div
            className="card card-hover"
            style={{
              background: 'linear-gradient(135deg, #3D291F 0%, #261A14 100%)',
              color: '#FFFFFF',
              padding: '1.75rem 2rem',
              marginBottom: '2.5rem',
              borderRadius: '16px',
              display: 'grid',
              gridTemplateColumns: '1.4fr 0.8fr',
              gap: '2rem',
              alignItems: 'center',
              boxShadow: '0 10px 30px rgba(61, 41, 31, 0.25)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <span style={{ backgroundColor: 'rgba(184, 115, 51, 0.3)', color: '#FBBF24', fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ▶ Resume Current Lesson
                </span>
                <span style={{ color: '#D6D3D1', fontSize: '0.82rem' }}>
                  {activeCourseItem.course?.category || 'Online Course'}
                </span>
              </div>
              <h2 style={{ color: '#FFFFFF', fontSize: '1.65rem', marginBottom: '0.5rem', fontWeight: '800' }}>
                {activeCourseItem.course?.title || 'Interactive Course'}
              </h2>
              <p style={{ color: '#E7E5E4', fontSize: '0.92rem', marginBottom: '1.25rem', maxWidth: '540px' }}>
                Instructor: {activeCourseItem.course?.instructor || 'Staff'} • {activeCourseItem.course?.lessons?.length || 5} Interactive Lessons
              </p>

              <div style={{ maxWidth: '420px', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#E7E5E4' }}>
                  <span>Course Progress</span>
                  <strong>{activeCourseItem.progress || 0}%</strong>
                </div>
                <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${activeCourseItem.progress || 0}%`, backgroundColor: '#FBBF24', borderRadius: '999px', transition: 'width 0.4s ease' }} />
                </div>
              </div>

              <Link
                to={`/student/course/${activeCourseItem.course?._id || activeCourseItem._id}`}
                className="btn btn-primary"
                style={{ backgroundColor: '#B87333', borderColor: '#B87333', color: '#FFFFFF', fontWeight: '700' }}
              >
                <PlayCircle size={18} /> Continue Learning in Classroom <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={activeCourseItem.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                alt={activeCourseItem.course?.title}
                style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>
        )}

        {/* Existing 4 Core Summary Stat Cards */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          <DashboardCard
            title="Total Enrolled"
            value={totalEnrolled}
            icon={BookOpen}
            subtext="Enrolled Courses"
            color="#3D291F"
          />
          <DashboardCard
            title="Completed"
            value={completedCourses}
            icon={CheckCircle}
            subtext="Finished Programs"
            color="#15803D"
          />
          <DashboardCard
            title="In Progress"
            value={inProgressCourses}
            icon={Clock}
            subtext="Active Programs"
            color="#B87333"
          />
          <DashboardCard
            title="Average Progress"
            value={`${averageProgress}%`}
            icon={TrendingUp}
            subtext="Overall Completion"
            color="#0369A1"
          />
        </div>

        {/* Learning Streak & Attendance Cards Section (3 Cards) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {/* Card 1: Learning Streak */}
          <div className="card" style={styles.featureCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={styles.cardHeaderLabel}>Learning Streak</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1C1917', margin: '0.35rem 0 0.2rem 0' }}>
                  {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
                </h3>
              </div>
              <div style={{ ...styles.iconBox, backgroundColor: '#FEF3C7' }}>
                <Flame size={22} color="#B45309" fill="#B45309" />
              </div>
            </div>
            <div style={styles.cardFooter}>
              <span style={{ fontSize: '0.85rem', color: '#78716C' }}>
                Longest Streak: <strong>{longestStreak} {longestStreak === 1 ? 'Day' : 'Days'}</strong>
              </span>
            </div>
          </div>

          {/* Card 2: Learning Attendance */}
          <div className="card" style={styles.featureCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={styles.cardHeaderLabel}>Learning Attendance</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1C1917', margin: '0.35rem 0 0.2rem 0' }}>
                  {monthlyAtt.activeDays} / {monthlyAtt.currentDay} Days
                </h3>
              </div>
              <div style={{ ...styles.iconBox, backgroundColor: '#DCFCE7' }}>
                <CalendarIcon size={22} color="#15803D" />
              </div>
            </div>
            <div style={styles.cardFooter}>
              <span style={{ fontSize: '0.85rem', color: '#15803D', fontWeight: '700' }}>
                {monthlyAtt.attendancePercentage}% Attendance this Month
              </span>
            </div>
          </div>

          {/* Card 3: Learning Activity */}
          <div className="card" style={styles.featureCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={styles.cardHeaderLabel}>Learning Activity</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1C1917', margin: '0.35rem 0 0.2rem 0' }}>
                  {learningAct.totalLearningDays} Days
                </h3>
              </div>
              <div style={{ ...styles.iconBox, backgroundColor: '#FBF4ED' }}>
                <Activity size={22} color="#B87333" />
              </div>
            </div>
            <div style={styles.cardFooter}>
              <span style={{ fontSize: '0.85rem', color: '#78716C' }}>
                Lessons Completed: <strong>{learningAct.totalLessonsCompleted}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Attendance Calendar and Milestones Grid */}
        <div className="grid-2" style={{ marginBottom: '3rem' }}>
          <AttendanceCalendar />
          <LearningMilestones milestones={milestones} />
        </div>

        {/* Enrolled Courses List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>My Active Courses</h2>
            {enrollments.length > 0 && (
              <Link to="/student/my-courses" className="btn btn-secondary btn-sm">
                View All Enrolled ({enrollments.length})
              </Link>
            )}
          </div>

          {enrollments.length > 0 ? (
            <div className="grid-2">
              {enrollments.map((item) => {
                const course = item.course || {};
                return (
                  <div key={item._id} className="card card-hover" style={styles.courseItemCard}>
                    <div style={styles.thumbnailWrapper}>
                      <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                        alt={course.title}
                        style={styles.thumbnail}
                      />
                    </div>
                    <div style={styles.itemContent}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span className={`badge ${item.status === 'Completed' ? 'badge-success' : 'badge-primary'}`}>
                          {item.status}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#78716C' }}>{course.category}</span>
                      </div>

                      <h3 style={styles.courseTitle}>{course.title || 'Course Details'}</h3>
                      <p style={styles.instructor}>Instructor: {course.instructor || 'Staff'}</p>

                      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <ProgressBar progress={item.progress} />
                        </div>

                        <Link
                          to={`/student/course/${course._id || item._id}`}
                          className="btn btn-primary btn-sm"
                          style={{ width: '100%', marginTop: '0.75rem' }}
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
              <h3>No enrolled courses yet</h3>
              <p style={{ color: '#78716C', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                You haven't enrolled in any courses yet. Browse our catalog and start learning today!
              </p>
              <Link to="/courses" className="btn btn-primary btn-lg">
                Browse Courses Now
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        course={activeCourseItem?.course}
        currentLesson={activeCourseItem?.course?.lessons?.[0]}
      />
    </div>
  );
};

const styles = {
  featureCard: {
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E7E5E4'
  },
  cardHeaderLabel: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#78716C',
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  },
  iconBox: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  cardFooter: {
    marginTop: '0.75rem',
    paddingTop: '0.65rem',
    borderTop: '1px solid #F3EFEA'
  },
  courseItemCard: {
    display: 'flex',
    gap: '1.25rem',
    padding: '1.25rem'
  },
  thumbnailWrapper: {
    width: '130px',
    height: '130px',
    borderRadius: '10px',
    overflow: 'hidden',
    flexShrink: 0
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  courseTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginTop: '0.4rem',
    marginBottom: '0.2rem',
    lineHeight: '1.3'
  },
  instructor: {
    fontSize: '0.85rem',
    color: '#78716C'
  }
};

export default StudentDashboard;
