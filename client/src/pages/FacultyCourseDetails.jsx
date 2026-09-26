import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { facultyService, attendanceService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Clock,
  Users,
  Star,
  PlayCircle,
  Video,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ListOrdered,
  Flame,
  Calendar,
  Activity,
  GraduationCap
} from 'lucide-react';

const FacultyCourseDetails = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [attendanceAnalytics, setAttendanceAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Lesson Modal states
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
  const [isEditLessonModalOpen, setIsEditLessonModalOpen] = useState(false);
  const [isDeleteLessonModalOpen, setIsDeleteLessonModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    moduleName: 'Module 1: Getting Started',
    content: '',
    description: '',
    videoUrl: '',
    duration: '15 mins',
    order: 1
  });

  const [lessonSubmitting, setLessonSubmitting] = useState(false);
  const [lessonFormError, setLessonFormError] = useState('');

  const fetchCourseDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const [courseData, attData] = await Promise.all([
        facultyService.getCourseById(id),
        attendanceService.getFacultyCourseAttendance(id).catch((e) => {
          console.error('Course attendance fetch error:', e);
          return null;
        })
      ]);
      setCourse(courseData);
      setAttendanceAnalytics(attData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load faculty course details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const handleOpenAddLesson = () => {
    const nextOrder = (course?.lessons?.length || 0) + 1;
    setLessonFormData({
      title: '',
      moduleName: `Module ${Math.ceil(nextOrder / 3)}: Advanced Topics`,
      content: '',
      description: '',
      videoUrl: '',
      duration: '20 mins',
      order: nextOrder
    });
    setLessonFormError('');
    setIsAddLessonModalOpen(true);
  };

  const handleOpenEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setLessonFormData({
      title: lesson.title || '',
      moduleName: lesson.moduleName || 'Module 1: Essentials',
      content: lesson.content || lesson.description || '',
      description: lesson.description || lesson.content || '',
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration || '15 mins',
      order: lesson.order || 1
    });
    setLessonFormError('');
    setIsEditLessonModalOpen(true);
  };

  const handleOpenDeleteLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsDeleteLessonModalOpen(true);
  };

  const handleLessonChange = (e) => {
    setLessonFormData({
      ...lessonFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddLessonSubmit = async (e) => {
    e.preventDefault();
    setLessonFormError('');

    if (!lessonFormData.title) {
      setLessonFormError('Lesson title is required.');
      return;
    }

    setLessonSubmitting(true);
    try {
      await facultyService.addLesson(id, lessonFormData);
      setIsAddLessonModalOpen(false);
      setActionSuccess('Lesson added to curriculum successfully!');
      setTimeout(() => setActionSuccess(''), 3000);
      fetchCourseDetails();
    } catch (err) {
      setLessonFormError(err.response?.data?.message || 'Failed to add lesson.');
    } finally {
      setLessonSubmitting(false);
    }
  };

  const handleEditLessonSubmit = async (e) => {
    e.preventDefault();
    setLessonFormError('');

    if (!lessonFormData.title) {
      setLessonFormError('Lesson title is required.');
      return;
    }

    setLessonSubmitting(true);
    try {
      await facultyService.updateLesson(id, selectedLesson._id, lessonFormData);
      setIsEditLessonModalOpen(false);
      setActionSuccess('Lesson updated successfully!');
      setTimeout(() => setActionSuccess(''), 3000);
      fetchCourseDetails();
    } catch (err) {
      setLessonFormError(err.response?.data?.message || 'Failed to update lesson.');
    } finally {
      setLessonSubmitting(false);
    }
  };

  const handleDeleteLessonSubmit = async () => {
    if (!selectedLesson) return;
    setLessonSubmitting(true);
    try {
      await facultyService.deleteLesson(id, selectedLesson._id);
      setIsDeleteLessonModalOpen(false);
      setActionSuccess('Lesson removed from curriculum.');
      setTimeout(() => setActionSuccess(''), 3000);
      fetchCourseDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete lesson.');
    } finally {
      setLessonSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading course management console..." />;
  }

  if (error || !course) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="alert alert-error">{error || 'Course not found'}</div>
        <Link to="/faculty/courses" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to My Courses
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    category,
    level,
    duration,
    thumbnail,
    rating = 4.8,
    enrolledCount = 0,
    lessons = [],
    enrolledStudents = [],
    prerequisites,
    learningObjectives
  } = course;

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Back navigation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/faculty/courses" style={styles.backLink}>
            <ArrowLeft size={16} /> Back to My Courses
          </Link>
        </div>

        {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}

        {/* Course Header Banner */}
        <div className="card" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <img
              src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
              alt={title}
              style={styles.courseBannerImg}
            />

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">{category}</span>
                <span
                  className={`badge ${
                    level === 'Beginner' ? 'badge-success' : level === 'Intermediate' ? 'badge-warning' : 'badge-info'
                  }`}
                >
                  {level}
                </span>
                <span className="badge badge-info" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={12} fill="#0369A1" /> {rating} Rating
                </span>
              </div>

              <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{title}</h1>
              <p style={{ color: '#57534E', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {description}
              </p>

              {/* Summary Stats Pill Box */}
              <div style={styles.statsPillGrid}>
                <div style={styles.statPill}>
                  <Clock size={16} color="#B87333" />
                  <span>Duration: <strong>{duration}</strong></span>
                </div>
                <div style={styles.statPill}>
                  <BookOpen size={16} color="#3D291F" />
                  <span>Lessons: <strong>{lessons.length} Modules</strong></span>
                </div>
                <div style={styles.statPill}>
                  <Users size={16} color="#0369A1" />
                  <span>Enrolled: <strong>{enrolledCount} Students</strong></span>
                </div>
              </div>
            </div>
          </div>

          {(prerequisites || learningObjectives) && (
            <div style={styles.extraInfoBox}>
              {prerequisites && (
                <div>
                  <strong style={{ fontSize: '0.85rem', color: '#78716C', textTransform: 'uppercase' }}>Prerequisites:</strong>
                  <p style={{ fontSize: '0.92rem', color: '#1C1917', marginTop: '0.2rem' }}>{prerequisites}</p>
                </div>
              )}
              {learningObjectives && (
                <div style={{ marginTop: '0.75rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#78716C', textTransform: 'uppercase' }}>Learning Objectives:</strong>
                  <p style={{ fontSize: '0.92rem', color: '#1C1917', marginTop: '0.2rem' }}>{learningObjectives}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 1: Lesson & Curriculum Management */}
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={{ fontSize: '1.3rem' }}>Course Curriculum & Lessons ({lessons.length})</h3>
              <p style={{ color: '#78716C', fontSize: '0.88rem', margin: 0 }}>
                Add, organize, and update lecture modules for your enrolled students.
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleOpenAddLesson}>
              <Plus size={16} /> Add New Lesson
            </button>
          </div>

          {lessons.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {lessons.map((lesson, idx) => (
                <div key={lesson._id || idx} style={styles.lessonItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={styles.orderBadge}>
                      {lesson.order || idx + 1}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '1rem' }}>{lesson.title}</strong>
                        {lesson.videoUrl && (
                          <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                            <Video size={11} style={{ marginRight: 3 }} /> Video Link
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.82rem', color: '#78716C', display: 'block', marginTop: '0.2rem' }}>
                        {lesson.moduleName || 'Module 1'} • Duration: {lesson.duration || '15 mins'}
                      </span>
                      {lesson.content && (
                        <p style={{ fontSize: '0.85rem', color: '#57534E', marginTop: '0.4rem', lineHeight: '1.4' }}>
                          {lesson.content.length > 120 ? `${lesson.content.substring(0, 120)}...` : lesson.content}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenEditLesson(lesson)}
                      title="Edit Lesson"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleOpenDeleteLesson(lesson)}
                      title="Delete Lesson"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <PlayCircle size={40} color="#A8A29E" style={{ marginBottom: '0.75rem' }} />
              <h4>No Lessons Created Yet</h4>
              <p style={{ color: '#78716C', margin: '0.5rem 0 1.25rem 0' }}>
                Add lessons and modules to this course so your students can begin learning.
              </p>
              <button className="btn btn-primary" onClick={handleOpenAddLesson}>
                <Plus size={16} /> Add First Lesson
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Course Learning Attendance & Engagement Analytics */}
        {attendanceAnalytics?.stats && (
          <div className="card" style={{ marginBottom: '2.5rem' }}>
            <div style={styles.sectionHeader}>
              <div>
                <h3 style={{ fontSize: '1.3rem' }}>Learning Attendance & Student Activity</h3>
                <p style={{ color: '#78716C', fontSize: '0.88rem', margin: 0 }}>
                  Real-time learning participation, streaks, and attendance for this course.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div style={styles.facultyStatCard}>
                <span style={styles.facultyStatLabel}>Active Learners</span>
                <strong style={{ fontSize: '1.5rem', color: '#1C1917' }}>
                  {attendanceAnalytics.stats.activeLearners} / {attendanceAnalytics.stats.totalStudents}
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '0.2rem' }}>Engaged students</span>
              </div>

              <div style={styles.facultyStatCard}>
                <span style={styles.facultyStatLabel}>Average Progress</span>
                <strong style={{ fontSize: '1.5rem', color: '#0369A1' }}>
                  {attendanceAnalytics.stats.averageProgress}%
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '0.2rem' }}>Syllabus completion</span>
              </div>

              <div style={styles.facultyStatCard}>
                <span style={styles.facultyStatLabel}>Avg Learning Attendance</span>
                <strong style={{ fontSize: '1.5rem', color: '#15803D' }}>
                  {attendanceAnalytics.stats.averageAttendance}%
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '0.2rem' }}>Daily activity rate</span>
              </div>

              <div style={styles.facultyStatCard}>
                <span style={styles.facultyStatLabel}>On Learning Streaks</span>
                <strong style={{ fontSize: '1.5rem', color: '#B45309' }}>
                  {attendanceAnalytics.stats.streakStudentsCount}
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '0.2rem' }}>Consistent daily learners</span>
              </div>

              <div style={styles.facultyStatCard}>
                <span style={styles.facultyStatLabel}>Course Completed</span>
                <strong style={{ fontSize: '1.5rem', color: '#3D291F' }}>
                  {attendanceAnalytics.stats.completedStudentsCount}
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '0.2rem' }}>Graduated learners</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Enrolled Students & Progress */}
        <div className="card">
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={{ fontSize: '1.3rem' }}>Enrolled Students ({enrolledStudents.length})</h3>
              <p style={{ color: '#78716C', fontSize: '0.88rem', margin: 0 }}>
                View student progression, streaks, and completion status in this specific course.
              </p>
            </div>
          </div>

          {enrolledStudents.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>Email Address</th>
                    <th style={styles.th}>Streak</th>
                    <th style={styles.th}>Progress</th>
                    <th style={styles.th}>Lessons Completed</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledStudents.map((st) => {
                    const studentAnalytics = attendanceAnalytics?.students?.find(
                      (s) => s.studentId === st.studentId || s.email === st.email
                    );
                    const studentStreak = studentAnalytics?.currentStreak || 0;

                    return (
                      <tr key={st.enrollmentId || st.studentId} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={styles.studentAvatar}>
                              {st.name?.charAt(0).toUpperCase() || 'S'}
                            </div>
                            <strong>{st.name}</strong>
                          </div>
                        </td>
                        <td style={styles.td}>{st.email}</td>
                        <td style={styles.td}>
                          {studentStreak > 0 ? (
                            <span className="badge badge-warning" style={{ fontSize: '0.78rem' }}>
                              🔥 {studentStreak} {studentStreak === 1 ? 'Day' : 'Days'}
                            </span>
                          ) : (
                            <span style={{ color: '#A8A29E', fontSize: '0.82rem' }}>-</span>
                          )}
                        </td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={styles.miniProgressBar}>
                              <div
                                style={{
                                  ...styles.miniProgressFill,
                                  width: `${st.progress}%`,
                                  backgroundColor: st.progress === 100 ? '#15803D' : '#3D291F'
                                }}
                              />
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{st.progress}%</span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          {st.completedLessonsCount} / {st.totalLessonsCount} Lessons
                        </td>
                        <td style={styles.td}>
                          <span
                            className={`badge ${
                              st.status === 'Completed' || st.progress === 100
                                ? 'badge-success'
                                : 'badge-primary'
                            }`}
                          >
                            {st.status === 'Completed' || st.progress === 100 ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Users size={40} color="#A8A29E" style={{ marginBottom: '0.75rem' }} />
              <h4>No Enrollments Yet</h4>
              <p style={{ color: '#78716C', marginTop: '0.5rem' }}>
                Students who enroll in this course will be listed here with their live progress.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Lesson Modal */}
      <Modal isOpen={isAddLessonModalOpen} onClose={() => setIsAddLessonModalOpen(false)} title="Add Lesson to Syllabus">
        {lessonFormError && <div className="alert alert-error">{lessonFormError}</div>}
        <form onSubmit={handleAddLessonSubmit}>
          <div className="form-group">
            <label className="form-label">Lesson Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={lessonFormData.title}
              onChange={handleLessonChange}
              placeholder="e.g. Lesson 3: Database Indexing & Optimizations"
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Module / Section Name</label>
              <input
                type="text"
                name="moduleName"
                className="form-input"
                value={lessonFormData.moduleName}
                onChange={handleLessonChange}
                placeholder="e.g. Module 2: Advanced Backend"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration</label>
              <input
                type="text"
                name="duration"
                className="form-input"
                value={lessonFormData.duration}
                onChange={handleLessonChange}
                placeholder="e.g. 25 mins"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Video URL (Optional)</label>
              <input
                type="url"
                name="videoUrl"
                className="form-input"
                value={lessonFormData.videoUrl}
                onChange={handleLessonChange}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lesson Order</label>
              <input
                type="number"
                name="order"
                className="form-input"
                value={lessonFormData.order}
                onChange={handleLessonChange}
                min={1}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Lesson Content / Description</label>
            <textarea
              name="content"
              className="form-textarea"
              value={lessonFormData.content}
              onChange={handleLessonChange}
              placeholder="Key concepts, syllabus notes, coding instructions..."
              rows={4}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddLessonModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={lessonSubmitting}>
              {lessonSubmitting ? 'Adding...' : 'Add Lesson'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Lesson Modal */}
      <Modal isOpen={isEditLessonModalOpen} onClose={() => setIsEditLessonModalOpen(false)} title="Edit Lesson Details">
        {lessonFormError && <div className="alert alert-error">{lessonFormError}</div>}
        <form onSubmit={handleEditLessonSubmit}>
          <div className="form-group">
            <label className="form-label">Lesson Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={lessonFormData.title}
              onChange={handleLessonChange}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Module / Section Name</label>
              <input
                type="text"
                name="moduleName"
                className="form-input"
                value={lessonFormData.moduleName}
                onChange={handleLessonChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration</label>
              <input
                type="text"
                name="duration"
                className="form-input"
                value={lessonFormData.duration}
                onChange={handleLessonChange}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Video URL (Optional)</label>
              <input
                type="url"
                name="videoUrl"
                className="form-input"
                value={lessonFormData.videoUrl}
                onChange={handleLessonChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lesson Order</label>
              <input
                type="number"
                name="order"
                className="form-input"
                value={lessonFormData.order}
                onChange={handleLessonChange}
                min={1}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Lesson Content / Description</label>
            <textarea
              name="content"
              className="form-textarea"
              value={lessonFormData.content}
              onChange={handleLessonChange}
              rows={4}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditLessonModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={lessonSubmitting}>
              {lessonSubmitting ? 'Saving...' : 'Save Lesson'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Lesson Confirmation Modal */}
      <Modal isOpen={isDeleteLessonModalOpen} onClose={() => setIsDeleteLessonModalOpen(false)} title="Delete Lesson">
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <AlertTriangle size={48} color="#B91C1C" style={{ marginBottom: '1rem' }} />
          <h3>Delete Lesson?</h3>
          <p style={{ color: '#78716C', margin: '0.5rem 0 1.5rem 0' }}>
            Are you sure you want to remove <strong>"{selectedLesson?.title}"</strong> from this course syllabus?
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => setIsDeleteLessonModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDeleteLessonSubmit} disabled={lessonSubmitting}>
              {lessonSubmitting ? 'Deleting...' : 'Yes, Remove Lesson'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: '#78716C',
    fontWeight: '600',
    fontSize: '0.9rem',
    textDecoration: 'none'
  },
  courseBannerImg: {
    width: '180px',
    height: '140px',
    borderRadius: '12px',
    objectFit: 'cover'
  },
  statsPillGrid: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  statPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.5rem 0.85rem',
    borderRadius: '8px',
    backgroundColor: '#FAF8F5',
    border: '1px solid #E7E5E4',
    fontSize: '0.88rem',
    color: '#1C1917'
  },
  extraInfoBox: {
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid #E7E5E4',
    backgroundColor: '#FAF8F5',
    padding: '1rem 1.25rem',
    borderRadius: '8px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #E7E5E4',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  lessonItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    backgroundColor: '#FAF8F5',
    borderRadius: '10px',
    border: '1px solid #E7E5E4',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  orderBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#3D291F',
    color: '#FFFFFF',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
    textAlign: 'left'
  },
  th: {
    padding: '0.85rem 1rem',
    borderBottom: '2px solid #E7E5E4',
    backgroundColor: '#FAF8F5',
    color: '#78716C',
    fontWeight: '700',
    fontSize: '0.8rem',
    textTransform: 'uppercase'
  },
  td: {
    padding: '0.95rem 1rem',
    borderBottom: '1px solid #E7E5E4'
  },
  tr: {
    transition: 'background-color 0.15s'
  },
  studentAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3D291F',
    color: '#FFFFFF',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem'
  },
  miniProgressBar: {
    width: '80px',
    height: '6px',
    borderRadius: '9999px',
    backgroundColor: '#E7E5E4',
    overflow: 'hidden'
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.3s ease'
  },
  facultyStatCard: {
    padding: '1.25rem',
    borderRadius: '10px',
    backgroundColor: '#FAF8F5',
    border: '1px solid #E7E5E4',
    display: 'flex',
    flexDirection: 'column'
  },
  facultyStatLabel: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#78716C',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    marginBottom: '0.35rem'
  }
};

export default FacultyCourseDetails;
