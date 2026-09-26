import React, { useState, useEffect } from 'react';
import { facultyService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { Search, Users, Filter, BookOpen, Mail, Phone, Calendar, CheckCircle2, Clock, Eye } from 'lucide-react';

const FacultyStudents = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');

  // Student inspection modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const [studentsData, coursesData] = await Promise.all([
        facultyService.getStudents({
          courseId: selectedCourseFilter,
          search
        }),
        facultyService.getCourses()
      ]);
      setStudents(studentsData);
      setCourses(coursesData);
    } catch (err) {
      console.error('Failed to load faculty students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudentData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCourseFilter]);

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="section-title">My Enrolled Students</h1>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            Inspect active learners, course progress percentages, and lesson completion across your subjects.
          </p>
        </div>

        {/* Search & Course Filter Bar */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={18} color="#78716C" style={styles.searchIcon} />
              <input
                type="text"
                className="form-input"
                placeholder="Search student by name, email, or course title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div style={{ minWidth: '220px' }}>
              <select
                className="form-select"
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
              >
                <option value="All">All My Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Student Table / Cards */}
        {loading ? (
          <LoadingSpinner message="Loading enrolled student records..." />
        ) : students.length > 0 ? (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>Email Address</th>
                    <th style={styles.th}>Course</th>
                    <th style={styles.th}>Enrollment Date</th>
                    <th style={styles.th}>Learning Progress</th>
                    <th style={styles.th}>Status</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st) => (
                    <tr key={st.enrollmentId || st.studentId} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={styles.avatar}>
                            {st.name?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <div>
                            <strong style={{ fontSize: '0.95rem', display: 'block' }}>{st.name}</strong>
                            {st.phone && st.phone !== 'N/A' && (
                              <span style={{ fontSize: '0.78rem', color: '#78716C' }}>{st.phone}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>{st.email}</td>
                      <td style={styles.td}>
                        <strong style={{ color: '#1C1917' }}>{st.courseTitle}</strong>
                      </td>
                      <td style={styles.td}>{new Date(st.enrolledAt).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={styles.progressBarBg}>
                            <div
                              style={{
                                ...styles.progressBarFill,
                                width: `${st.progress}%`,
                                backgroundColor: st.progress === 100 ? '#15803D' : '#3D291F'
                              }}
                            />
                          </div>
                          <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{st.progress}%</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#78716C', display: 'block', marginTop: '0.2rem' }}>
                          {st.completedLessons} of {st.totalLessons} lessons completed
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span
                          className={`badge ${
                            st.status === 'Completed'
                              ? 'badge-success'
                              : st.status === 'In Progress'
                              ? 'badge-warning'
                              : 'badge-primary'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleViewStudent(st)}
                        >
                          <Eye size={14} /> View Progress
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Users size={48} color="#A8A29E" style={{ marginBottom: '1rem' }} />
            <h3>No students found</h3>
            <p style={{ color: '#78716C', marginTop: '0.5rem' }}>
              No students are currently enrolled matching your query.
            </p>
          </div>
        )}
      </div>

      {/* Student Progress Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Student Progress Breakdown"
      >
        {selectedStudent && (
          <div>
            <div style={styles.modalHeaderBox}>
              <div style={styles.largeAvatar}>
                {selectedStudent.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>{selectedStudent.name}</h3>
                <span className="badge badge-primary">{selectedStudent.courseTitle}</span>
              </div>
            </div>

            <div style={styles.detailGrid}>
              <div style={styles.detailRow}>
                <Mail size={16} color="#78716C" />
                <span>
                  <strong>Email:</strong> {selectedStudent.email}
                </span>
              </div>

              {selectedStudent.phone && selectedStudent.phone !== 'N/A' && (
                <div style={styles.detailRow}>
                  <Phone size={16} color="#78716C" />
                  <span>
                    <strong>Phone:</strong> {selectedStudent.phone}
                  </span>
                </div>
              )}

              <div style={styles.detailRow}>
                <Calendar size={16} color="#78716C" />
                <span>
                  <strong>Enrolled on:</strong> {new Date(selectedStudent.enrolledAt).toLocaleDateString()}
                </span>
              </div>

              <div style={styles.detailRow}>
                <BookOpen size={16} color="#78716C" />
                <span>
                  <strong>Course:</strong> {selectedStudent.courseTitle} ({selectedStudent.category})
                </span>
              </div>
            </div>

            {/* Visual Progress Bar Section */}
            <div style={styles.progressCardSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <strong style={{ fontSize: '0.9rem' }}>Syllabus Completion</strong>
                <span style={{ fontWeight: '700', color: selectedStudent.progress === 100 ? '#15803D' : '#3D291F' }}>
                  {selectedStudent.progress}%
                </span>
              </div>

              <div style={styles.progressBarBgLarge}>
                <div
                  style={{
                    ...styles.progressBarFill,
                    width: `${selectedStudent.progress}%`,
                    backgroundColor: selectedStudent.progress === 100 ? '#15803D' : '#3D291F'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.85rem', color: '#78716C' }}>
                <span>Completed Lessons: <strong>{selectedStudent.completedLessons}</strong></span>
                <span>Total Modules: <strong>{selectedStudent.totalLessons}</strong></span>
                <span>
                  Status:{' '}
                  <strong style={{ color: selectedStudent.progress === 100 ? '#15803D' : '#B45309' }}>
                    {selectedStudent.status}
                  </strong>
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const styles = {
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem'
  },
  th: {
    padding: '1rem 1.25rem',
    backgroundColor: '#FAF8F5',
    borderBottom: '2px solid #E7E5E4',
    color: '#78716C',
    fontWeight: '700',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    textAlign: 'left'
  },
  td: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #E7E5E4'
  },
  tr: {
    transition: 'background-color 0.15s'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#3D291F',
    color: '#FFFFFF',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem'
  },
  progressBarBg: {
    width: '90px',
    height: '6px',
    borderRadius: '9999px',
    backgroundColor: '#E7E5E4',
    overflow: 'hidden'
  },
  progressBarBgLarge: {
    width: '100%',
    height: '10px',
    borderRadius: '9999px',
    backgroundColor: '#E7E5E4',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.4s ease'
  },
  modalHeaderBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid #E7E5E4',
    marginBottom: '1.25rem'
  },
  largeAvatar: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    backgroundColor: '#3D291F',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: '1.4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    fontSize: '0.92rem',
    color: '#334155'
  },
  progressCardSection: {
    backgroundColor: '#FAF8F5',
    padding: '1.25rem',
    borderRadius: '10px',
    border: '1px solid #E7E5E4'
  }
};

export default FacultyStudents;
