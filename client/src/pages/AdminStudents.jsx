import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { Search, Users, Mail, Calendar, BookOpen, Eye } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await adminService.getStudents({ search });
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="section-title">Student Management</h1>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            Inspect registered student profiles, registration dates, and course enrollments.
          </p>
        </div>

        {/* Search Input Card */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#78716C" style={styles.searchIcon} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by student name or email address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <LoadingSpinner message="Fetching registered students..." />
        ) : students.length > 0 ? (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>Email Address</th>
                    <th style={styles.th}>Enrollments</th>
                    <th style={styles.th}>Registration Date</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={styles.avatar}>
                            {student.name?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <strong>{student.name}</strong>
                        </div>
                      </td>
                      <td style={styles.td}>{student.email}</td>
                      <td style={styles.td}>
                        <span className="badge badge-primary">
                          {student.enrollmentCount || 0} Courses
                        </span>
                      </td>
                      <td style={styles.td}>
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleViewStudent(student)}
                        >
                          <Eye size={15} /> View Details
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
              No student records match your search query.
            </p>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Student Profile Details"
      >
        {selectedStudent && (
          <div>
            <div style={styles.modalHeaderBox}>
              <div style={styles.largeAvatar}>
                {selectedStudent.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>{selectedStudent.name}</h3>
                <span className="badge badge-primary">Student Role</span>
              </div>
            </div>

            <div style={styles.detailGrid}>
              <div style={styles.detailRow}>
                <Mail size={16} color="#78716C" />
                <span>
                  <strong>Email:</strong> {selectedStudent.email}
                </span>
              </div>

              <div style={styles.detailRow}>
                <Calendar size={16} color="#78716C" />
                <span>
                  <strong>Joined:</strong> {new Date(selectedStudent.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div style={styles.detailRow}>
                <BookOpen size={16} color="#78716C" />
                <span>
                  <strong>Total Enrolled Courses:</strong> {selectedStudent.enrollmentCount || 0}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E7E5E4' }}>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Enrolled Courses List</h4>
              {selectedStudent.enrolledCourses && selectedStudent.enrolledCourses.length > 0 ? (
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', color: '#57534E' }}>
                  {selectedStudent.enrolledCourses.map((title, idx) => (
                    <li key={idx} style={{ marginBottom: '0.35rem' }}>
                      {title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#78716C', fontSize: '0.9rem' }}>
                  This student is not enrolled in any courses yet.
                </p>
              )}
            </div>

            <div style={{ textAlign: 'right', marginTop: '2rem' }}>
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
    gap: '0.75rem'
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    fontSize: '0.92rem',
    color: '#334155'
  }
};

export default AdminStudents;
