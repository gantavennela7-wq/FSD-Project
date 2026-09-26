import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  BookOpen,
  GraduationCap,
  Eye,
  Mail,
  Phone,
  Briefcase,
  Award,
  Calendar,
  Layers,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';

const DEPARTMENTS = [
  'All',
  'Computer Science',
  'Web & Software Engineering',
  'Information Technology',
  'Data Science & AI',
  'Electronics & Communication'
];

const AdminFaculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyDetailData, setFacultyDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    facultyId: '',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    qualification: '',
    specialization: '',
    experience: '',
    phone: '',
    bio: '',
    status: 'Active'
  });

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const data = await adminService.getFaculty({
        search,
        department: departmentFilter
      });
      setFacultyList(data);
    } catch (err) {
      console.error('Failed to load faculty list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFaculty();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, departmentFilter]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      facultyId: `FAC-${Date.now().toString().slice(-4)}`,
      department: 'Computer Science',
      designation: 'Assistant Professor',
      qualification: '',
      specialization: '',
      experience: '',
      phone: '',
      bio: '',
      status: 'Active'
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (fac) => {
    setSelectedFaculty(fac);
    setFormData({
      name: fac.name || '',
      email: fac.email || '',
      password: '',
      facultyId: fac.facultyId || '',
      department: fac.department || 'Computer Science',
      designation: fac.designation || 'Assistant Professor',
      qualification: fac.qualification || '',
      specialization: fac.specialization || '',
      experience: fac.experience || '',
      phone: fac.phone || '',
      bio: fac.bio || '',
      status: fac.status || 'Active'
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (fac) => {
    setSelectedFaculty(fac);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetails = async (fac) => {
    setSelectedFaculty(fac);
    setIsDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const data = await adminService.getFacultyById(fac._id);
      setFacultyDetailData(data);
    } catch (err) {
      console.error('Failed to load faculty details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.email || !formData.password) {
      setFormError('Please fill in Name, Email, and Password.');
      return;
    }

    setSubmitting(true);
    try {
      await adminService.createFaculty(formData);
      setIsAddModalOpen(false);
      setActionSuccess('Faculty member added successfully!');
      setTimeout(() => setActionSuccess(''), 3500);
      fetchFaculty();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create faculty member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateFaculty = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.email) {
      setFormError('Name and Email are required.');
      return;
    }

    setSubmitting(true);
    try {
      await adminService.updateFaculty(selectedFaculty._id, formData);
      setIsEditModalOpen(false);
      setActionSuccess('Faculty profile updated successfully!');
      setTimeout(() => setActionSuccess(''), 3500);
      fetchFaculty();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update faculty member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFaculty = async () => {
    if (!selectedFaculty) return;
    setSubmitting(true);
    try {
      await adminService.deleteFaculty(selectedFaculty._id);
      setIsDeleteModalOpen(false);
      setActionSuccess('Faculty member and courses removed successfully.');
      setTimeout(() => setActionSuccess(''), 3500);
      fetchFaculty();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete faculty member');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title">Faculty Management</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Manage instructors, review teaching workloads, departmental assignments, and student engagement metrics.
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} /> Add New Faculty
          </button>
        </div>

        {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}

        {/* Filter and Search Bar */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={18} color="#78716C" style={styles.searchIcon} />
              <input
                type="text"
                className="form-input"
                placeholder="Search by faculty name, email, department, or faculty ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div style={{ minWidth: '200px' }}>
              <select
                className="form-select"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    Department: {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Faculty Table / List */}
        {loading ? (
          <LoadingSpinner message="Fetching registered faculty members..." />
        ) : facultyList.length > 0 ? (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Faculty Name</th>
                    <th style={styles.th}>Faculty ID</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Designation</th>
                    <th style={styles.th}>Email Address</th>
                    <th style={styles.th}>Courses</th>
                    <th style={styles.th}>Students</th>
                    <th style={styles.th}>Status</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyList.map((fac) => (
                    <tr key={fac._id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={styles.avatar}>
                            {fac.name?.charAt(0).toUpperCase() || 'F'}
                          </div>
                          <div>
                            <strong style={{ fontSize: '0.95rem', display: 'block' }}>{fac.name}</strong>
                            {fac.qualification && (
                              <span style={{ fontSize: '0.75rem', color: '#78716C' }}>{fac.qualification}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span className="badge badge-primary">{fac.facultyId || 'N/A'}</span>
                      </td>
                      <td style={styles.td}>{fac.department || 'General'}</td>
                      <td style={styles.td}>
                        <strong style={{ color: '#1C1917', fontSize: '0.88rem' }}>{fac.designation || 'Instructor'}</strong>
                      </td>
                      <td style={styles.td}>{fac.email}</td>
                      <td style={styles.td}>
                        <strong>{fac.courseCount || 0}</strong> courses
                      </td>
                      <td style={styles.td}>
                        <strong>{fac.studentCount || 0}</strong> students
                      </td>
                      <td style={styles.td}>
                        <span
                          className={`badge ${
                            fac.status === 'Active' || !fac.status ? 'badge-success' : 'badge-warning'
                          }`}
                        >
                          {fac.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.45rem' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenDetails(fac)}
                            title="View Faculty Academic Details"
                          >
                            <Eye size={14} /> Details
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenEdit(fac)}
                            title="Edit Faculty Member"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleOpenDelete(fac)}
                            title="Delete Faculty Member"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <GraduationCap size={48} color="#A8A29E" style={{ marginBottom: '1rem' }} />
            <h3>No faculty members found</h3>
            <p style={{ color: '#78716C', margin: '0.5rem 0 1.5rem 0' }}>
              No faculty records match your search criteria.
            </p>
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={18} /> Add First Faculty Member
            </button>
          </div>
        )}
      </div>

      {/* Add Faculty Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Faculty Member">
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleCreateFaculty}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Dr. Alan Turing"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="faculty@lms.com"
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Faculty ID</label>
              <input
                type="text"
                name="facultyId"
                className="form-input"
                value={formData.facultyId}
                onChange={handleFormChange}
                placeholder="e.g. FAC-1001"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Department *</label>
              <input
                type="text"
                name="department"
                className="form-input"
                value={formData.department}
                onChange={handleFormChange}
                placeholder="e.g. Computer Science"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Designation *</label>
              <input
                type="text"
                name="designation"
                className="form-input"
                value={formData.designation}
                onChange={handleFormChange}
                placeholder="e.g. Professor & Chair"
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Qualification</label>
              <input
                type="text"
                name="qualification"
                className="form-input"
                value={formData.qualification}
                onChange={handleFormChange}
                placeholder="e.g. Ph.D. in Computer Science"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Experience</label>
              <input
                type="text"
                name="experience"
                className="form-input"
                value={formData.experience}
                onChange={handleFormChange}
                placeholder="e.g. 10 Years"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="e.g. +1 555-0199"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Status</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleFormChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Specialization / Domain</label>
            <input
              type="text"
              name="specialization"
              className="form-input"
              value={formData.specialization}
              onChange={handleFormChange}
              placeholder="e.g. Algorithms, Full-Stack Architecture"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Add Faculty Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Faculty Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Faculty Details">
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleUpdateFaculty}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">New Password (leave blank to keep current)</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Faculty ID</label>
              <input
                type="text"
                name="facultyId"
                className="form-input"
                value={formData.facultyId}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Department *</label>
              <input
                type="text"
                name="department"
                className="form-input"
                value={formData.department}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Designation *</label>
              <input
                type="text"
                name="designation"
                className="form-input"
                value={formData.designation}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Qualification</label>
              <input
                type="text"
                name="qualification"
                className="form-input"
                value={formData.qualification}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Experience</label>
              <input
                type="text"
                name="experience"
                className="form-input"
                value={formData.experience}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleFormChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Specialization</label>
            <input
              type="text"
              name="specialization"
              className="form-input"
              value={formData.specialization}
              onChange={handleFormChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Faculty Detailed Profile & Academic Overview Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Faculty Academic Profile"
      >
        {detailLoading ? (
          <LoadingSpinner message="Retrieving faculty curriculum and metrics..." />
        ) : facultyDetailData ? (
          <div>
            {/* Top Profile Card */}
            <div style={styles.modalHeaderBox}>
              <div style={styles.largeAvatar}>
                {facultyDetailData.faculty?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>
                  {facultyDetailData.faculty?.name}
                </h3>
                <span style={{ fontSize: '0.88rem', color: '#78716C' }}>
                  {facultyDetailData.faculty?.designation || 'Instructor'} • {facultyDetailData.faculty?.department}
                </span>
                <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-primary">ID: {facultyDetailData.faculty?.facultyId || 'N/A'}</span>
                  <span className="badge badge-success">{facultyDetailData.faculty?.status || 'Active'}</span>
                </div>
              </div>
            </div>

            {/* Academic Information Grid */}
            <div style={styles.detailGrid}>
              <div style={styles.detailRow}>
                <Mail size={16} color="#78716C" />
                <span>
                  <strong>Email:</strong> {facultyDetailData.faculty?.email}
                </span>
              </div>

              {facultyDetailData.faculty?.phone && (
                <div style={styles.detailRow}>
                  <Phone size={16} color="#78716C" />
                  <span>
                    <strong>Phone:</strong> {facultyDetailData.faculty?.phone}
                  </span>
                </div>
              )}

              {facultyDetailData.faculty?.qualification && (
                <div style={styles.detailRow}>
                  <GraduationCap size={16} color="#78716C" />
                  <span>
                    <strong>Qualification:</strong> {facultyDetailData.faculty?.qualification}
                  </span>
                </div>
              )}

              {facultyDetailData.faculty?.specialization && (
                <div style={styles.detailRow}>
                  <Award size={16} color="#78716C" />
                  <span>
                    <strong>Specialization:</strong> {facultyDetailData.faculty?.specialization}
                  </span>
                </div>
              )}

              {facultyDetailData.faculty?.experience && (
                <div style={styles.detailRow}>
                  <Calendar size={16} color="#78716C" />
                  <span>
                    <strong>Experience:</strong> {facultyDetailData.faculty?.experience}
                  </span>
                </div>
              )}
            </div>

            {/* Teaching Workload Metrics */}
            <div style={styles.workloadBox}>
              <div style={styles.workloadCell}>
                <span style={styles.workloadLabel}>Courses Taught</span>
                <strong style={styles.workloadValue}>{facultyDetailData.academic?.totalCourses || 0}</strong>
              </div>
              <div style={styles.workloadCell}>
                <span style={styles.workloadLabel}>Total Students</span>
                <strong style={styles.workloadValue}>{facultyDetailData.academic?.totalStudents || 0}</strong>
              </div>
              <div style={styles.workloadCell}>
                <span style={styles.workloadLabel}>Total Enrollments</span>
                <strong style={styles.workloadValue}>{facultyDetailData.academic?.totalEnrollments || 0}</strong>
              </div>
            </div>

            {/* Course-wise Breakdown */}
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>Courses Taught & Performance</h4>
              {facultyDetailData.academic?.courses && facultyDetailData.academic?.courses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
                  {facultyDetailData.academic.courses.map((c) => (
                    <div key={c._id} style={styles.courseBreakdownCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <strong style={{ fontSize: '0.95rem' }}>{c.title}</strong>
                        <span className="badge badge-primary">{c.category}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#78716C' }}>
                        <span>Enrolled: <strong>{c.enrollmentCount}</strong> students</span>
                        <span>Completed: <strong style={{ color: '#15803D' }}>{c.completedStudents}</strong></span>
                        <span>In Progress: <strong style={{ color: '#B45309' }}>{c.inProgressStudents}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#78716C', fontSize: '0.9rem' }}>No courses assigned to this faculty member yet.</p>
              )}
            </div>

            <div style={{ textAlign: 'right', marginTop: '2rem' }}>
              <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Faculty Deletion">
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <AlertTriangle size={48} color="#B91C1C" style={{ marginBottom: '1rem' }} />
          <h3>Delete Faculty Member?</h3>
          <p style={{ color: '#78716C', margin: '0.5rem 0 1.5rem 0' }}>
            Are you sure you want to remove <strong>"{selectedFaculty?.name}"</strong>? This will permanently delete this instructor account and all their assigned courses and associated enrollments.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDeleteFaculty} disabled={submitting}>
              {submitting ? 'Deleting...' : 'Yes, Delete Faculty'}
            </button>
          </div>
        </div>
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
    padding: '1rem 1.15rem',
    backgroundColor: '#FAF8F5',
    borderBottom: '2px solid #E7E5E4',
    color: '#78716C',
    fontWeight: '700',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    textAlign: 'left'
  },
  td: {
    padding: '1rem 1.15rem',
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
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#3D291F',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
    marginBottom: '1.5rem'
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    fontSize: '0.92rem',
    color: '#334155'
  },
  workloadBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    backgroundColor: '#FAF8F5',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #E7E5E4',
    textAlign: 'center'
  },
  workloadCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  workloadLabel: {
    fontSize: '0.78rem',
    color: '#78716C',
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  workloadValue: {
    fontSize: '1.35rem',
    color: '#3D291F',
    fontWeight: '800'
  },
  courseBreakdownCard: {
    backgroundColor: '#FAF8F5',
    padding: '0.85rem 1rem',
    borderRadius: '8px',
    border: '1px solid #E7E5E4'
  }
};

export default AdminFaculty;
