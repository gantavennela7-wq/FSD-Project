import React, { useState, useEffect } from 'react';
import { courseService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { Plus, Edit, Trash2, Search, BookOpen, Clock, User, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['Web Development', 'Programming', 'Computer Science', 'Data Science', 'Design'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    category: 'Web Development',
    level: 'Beginner',
    duration: '',
    thumbnail: ''
  });

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getAll({
        search,
        category: categoryFilter
      });
      setCourses(data);
    } catch (err) {
      console.error('Failed to load admin courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, categoryFilter]);

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      category: 'Web Development',
      level: 'Beginner',
      duration: '',
      thumbnail: ''
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      instructor: course.instructor || '',
      category: course.category || 'Web Development',
      level: course.level || 'Beginner',
      duration: course.duration || '',
      thumbnail: course.thumbnail || ''
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.description || !formData.instructor || !formData.duration) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await courseService.create(formData);
      setIsAddModalOpen(false);
      setActionSuccess('Course created successfully!');
      setTimeout(() => setActionSuccess(''), 3000);
      fetchCourses();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create course.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.description || !formData.instructor || !formData.duration) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await courseService.update(selectedCourse._id, formData);
      setIsEditModalOpen(false);
      setActionSuccess('Course updated successfully!');
      setTimeout(() => setActionSuccess(''), 3000);
      fetchCourses();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update course.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    setSubmitting(true);
    try {
      await courseService.delete(selectedCourse._id);
      setIsDeleteModalOpen(false);
      setActionSuccess('Course deleted successfully!');
      setTimeout(() => setActionSuccess(''), 3000);
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title">Course Management</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Create, edit, search, and delete platform training courses.
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} /> Add New Course
          </button>
        </div>

        {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}

        {/* Filter and Search Bar */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} color="#78716C" style={styles.searchIcon} />
              <input
                type="text"
                className="form-input"
                placeholder="Search course title, description, or instructor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div style={{ minWidth: '180px' }}>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Table / List */}
        {loading ? (
          <LoadingSpinner message="Fetching courses inventory..." />
        ) : courses.length > 0 ? (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Course Details</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Level</th>
                    <th style={styles.th}>Duration</th>
                    <th style={styles.th}>Enrolled</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img
                            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                            alt={course.title}
                            style={styles.tableThumbnail}
                          />
                          <div>
                            <strong style={{ fontSize: '1rem', display: 'block' }}>{course.title}</strong>
                            <span style={{ fontSize: '0.82rem', color: '#78716C' }}>Instructor: {course.instructor}</span>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span className="badge badge-primary">{course.category}</span>
                      </td>
                      <td style={styles.td}>
                        <span
                          className={`badge ${
                            course.level === 'Beginner' ? 'badge-success' : course.level === 'Intermediate' ? 'badge-warning' : 'badge-info'
                          }`}
                        >
                          {course.level}
                        </span>
                      </td>
                      <td style={styles.td}>{course.duration}</td>
                      <td style={styles.td}>{course.enrolledCount || 0} students</td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenEdit(course)}
                            title="Edit Course"
                          >
                            <Edit size={15} /> Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleOpenDelete(course)}
                            title="Delete Course"
                          >
                            <Trash2 size={15} /> Delete
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
            <BookOpen size={48} color="#A8A29E" style={{ marginBottom: '1rem' }} />
            <h3>No courses found</h3>
            <p style={{ color: '#78716C', marginTop: '0.5rem' }}>No courses match your current search criteria.</p>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Course">
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleCreateCourse}>
          <div className="form-group">
            <label className="form-label">Course Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="e.g. Master Web Architecture"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select name="category" className="form-select" value={formData.category} onChange={handleFormChange}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Level *</label>
              <select name="level" className="form-select" value={formData.level} onChange={handleFormChange}>
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Duration *</label>
              <input
                type="text"
                name="duration"
                className="form-input"
                value={formData.duration}
                onChange={handleFormChange}
                placeholder="e.g. 10 Weeks"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Instructor Name *</label>
            <input
              type="text"
              name="instructor"
              className="form-input"
              value={formData.instructor}
              onChange={handleFormChange}
              placeholder="e.g. Dr. Sarah Jenkins"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Thumbnail URL</label>
            <input
              type="url"
              name="thumbnail"
              className="form-input"
              value={formData.thumbnail}
              onChange={handleFormChange}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Course Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Detailed course objectives and outline..."
              rows={4}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Course Details">
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleUpdateCourse}>
          <div className="form-group">
            <label className="form-label">Course Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select name="category" className="form-select" value={formData.category} onChange={handleFormChange}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Level *</label>
              <select name="level" className="form-select" value={formData.level} onChange={handleFormChange}>
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Duration *</label>
              <input
                type="text"
                name="duration"
                className="form-input"
                value={formData.duration}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Instructor Name *</label>
            <input
              type="text"
              name="instructor"
              className="form-input"
              value={formData.instructor}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Thumbnail URL</label>
            <input
              type="url"
              name="thumbnail"
              className="form-input"
              value={formData.thumbnail}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Course Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleFormChange}
              rows={4}
              required
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Course Deletion">
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <AlertTriangle size={48} color="#B91C1C" style={{ marginBottom: '1rem' }} />
          <h3>Are you sure you want to delete this course?</h3>
          <p style={{ color: '#78716C', margin: '0.5rem 0 1.5rem 0' }}>
            Deleting <strong>"{selectedCourse?.title}"</strong> will permanently remove it from the platform along with all associated student enrollments. This action cannot be undone.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDeleteCourse} disabled={submitting}>
              {submitting ? 'Deleting...' : 'Yes, Delete Course'}
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
  tableThumbnail: {
    width: '56px',
    height: '56px',
    borderRadius: '8px',
    objectFit: 'cover'
  }
};

export default AdminCourses;
