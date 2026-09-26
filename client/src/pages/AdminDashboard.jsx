import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, attendanceService } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
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
  Award,
  Search,
  Filter,
  Eye,
  Edit2,
  UserCheck,
  UserX,
  Mail,
  Building,
  CheckCircle,
  XCircle,
  Save
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // User Management State
  const [usersList, setUsersList] = useState([]);
  const [userStats, setUserStats] = useState({ totalUsers: 0, activeUsers: 0, inactiveUsers: 0, studentsCount: 0, facultyCount: 0 });
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', department: '', status: 'Active', bio: '', phone: '' });
  const [savingUser, setSavingUser] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

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

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await adminService.getAllUsers(params);
      if (res.success) {
        setUsersList(res.users || []);
        if (res.stats) setUserStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, roleFilter, statusFilter]);

  const handleOpenView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || '',
      department: user.department || '',
      status: user.status || 'Active',
      bio: user.bio || '',
      phone: user.phone || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSavingUser(true);
    try {
      const res = await adminService.updateUser(selectedUser._id, editFormData);
      if (res.success) {
        setIsEditModalOpen(false);
        setActionSuccess(`User ${editFormData.name} updated successfully.`);
        setTimeout(() => setActionSuccess(''), 4000);
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user profile');
    } finally {
      setSavingUser(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    const confirmMsg = `Are you sure you want to ${newStatus === 'Active' ? 'activate' : 'deactivate'} ${user.name}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await adminService.toggleUserStatus(user._id, newStatus);
      if (res.success) {
        setActionSuccess(`User account ${user.name} is now ${newStatus}.`);
        setTimeout(() => setActionSuccess(''), 4000);
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

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
    <div style={{ padding: '3rem 0 5rem 0' }} className="digital-library-bg">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-warning">
                <Shield size={12} style={{ marginRight: 4 }} /> Admin Control Center
              </span>
            </div>
            <h1 className="section-title">Administrator Dashboard</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Live platform metrics, faculty workloads, student progress, and centralized user management.
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

        {actionSuccess && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} color="#15803D" />
            <span>{actionSuccess}</span>
          </div>
        )}

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

        {/* ================= FEATURE 5: USER MANAGEMENT SECTION ================= */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#3D291F', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={22} color="#B87333" /> User Management
                </h2>
                <p style={{ color: '#78716C', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                  Search, view, update profiles, and manage active status for all students and faculty members.
                </p>
              </div>

              {/* User stats summary */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">
                  {userStats.studentsCount || 0} Students
                </span>
                <span className="badge badge-info" style={{ backgroundColor: '#FBF4ED', color: '#B87333', border: '1px solid #E7E5E4' }}>
                  {userStats.facultyCount || 0} Faculty
                </span>
                <span className="badge badge-success">
                  {userStats.activeUsers || 0} Active
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={18} color="#78716C" style={styles.searchIcon} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search users by name or email... 🔍"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              {/* Role Filter */}
              <div>
                <select
                  className="form-input"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">All Roles ▼</option>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  className="form-input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status ▼</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            {usersLoading ? (
              <LoadingSpinner message="Filtering users list..." />
            ) : usersList.length > 0 ? (
              <div style={{ overflowX: 'auto', border: '1px solid #E7E5E4', borderRadius: '10px' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Department</th>
                      <th style={styles.th}>Status</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((usr) => (
                      <tr key={usr._id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              ...styles.avatar,
                              backgroundColor: usr.role === 'faculty' ? '#7C2D12' : '#3D291F'
                            }}>
                              {usr.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <strong style={{ fontSize: '0.95rem', color: '#1C1917', display: 'block' }}>{usr.name}</strong>
                              <span style={{ fontSize: '0.8rem', color: '#78716C' }}>{usr.email}</span>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span className={`badge ${usr.role === 'faculty' ? 'badge-info' : 'badge-primary'}`}
                            style={usr.role === 'faculty' ? { backgroundColor: '#FBF4ED', color: '#B87333', border: '1px solid #E7E5E4' } : {}}
                          >
                            {usr.role?.charAt(0).toUpperCase() + usr.role?.slice(1)}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={{ fontSize: '0.9rem', color: '#44403C' }}>
                            {usr.department || usr.designation || 'CSE'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span className={`badge ${usr.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                            {usr.status || 'Active'}
                          </span>
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenView(usr)}
                              title="View user details"
                              style={{ padding: '0.35rem 0.65rem' }}
                            >
                              <Eye size={14} /> View
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEdit(usr)}
                              title="Edit user profile"
                              style={{ padding: '0.35rem 0.65rem' }}
                            >
                              <Edit2 size={14} /> Edit
                            </button>
                            <button
                              className={`btn btn-sm ${usr.status === 'Active' ? 'btn-secondary' : 'btn-primary'}`}
                              onClick={() => handleToggleStatus(usr)}
                              title={usr.status === 'Active' ? 'Deactivate account' : 'Activate account'}
                              style={{
                                padding: '0.35rem 0.65rem',
                                color: usr.status === 'Active' ? '#DC2626' : '#FFFFFF',
                                borderColor: usr.status === 'Active' ? '#FECACA' : '#15803D',
                                backgroundColor: usr.status === 'Active' ? '#FEF2F2' : '#15803D'
                              }}
                            >
                              {usr.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
                              <span>{usr.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#FAF8F5', borderRadius: '8px' }}>
                <Users size={36} color="#A8A29E" style={{ marginBottom: '0.5rem' }} />
                <h4>No users found</h4>
                <p style={{ color: '#78716C', fontSize: '0.88rem', margin: 0 }}>
                  Try changing your search query or filter options.
                </p>
              </div>
            )}
          </div>
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

      {/* ================= VIEW USER DETAILS MODAL ================= */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Profile Details"
      >
        {selectedUser && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid #E7E5E4', marginBottom: '1.25rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: selectedUser.role === 'faculty' ? '#7C2D12' : '#3D291F',
                color: '#FFF',
                fontWeight: '800',
                fontSize: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedUser.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: '0 0 4px 0' }}>{selectedUser.name}</h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className={`badge ${selectedUser.role === 'faculty' ? 'badge-info' : 'badge-primary'}`}>
                    {selectedUser.role?.toUpperCase()}
                  </span>
                  <span className={`badge ${selectedUser.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                    {selectedUser.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#78716C" />
                <span><strong>Email:</strong> {selectedUser.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={16} color="#78716C" />
                <span><strong>Department:</strong> {selectedUser.department || selectedUser.designation || 'CSE'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#78716C" />
                <span><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</span>
              </div>
              {selectedUser.bio && (
                <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#FAF8F5', borderRadius: '8px' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#78716C' }}>Bio:</strong>
                  <p style={{ margin: '4px 0 0 0', color: '#334155' }}>{selectedUser.bio}</p>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right', marginTop: '2rem' }}>
              <button className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ================= EDIT USER PROFILE MODAL ================= */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User Profile"
      >
        {selectedUser && (
          <form onSubmit={handleSaveEdit}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Email Address (Read Only)</label>
              <input
                type="email"
                className="form-input"
                value={selectedUser.email}
                disabled
                style={{ backgroundColor: '#F3EFEA', cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Department / Designation</label>
              <input
                type="text"
                className="form-input"
                value={editFormData.department}
                onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                placeholder="e.g. Computer Science & Engineering"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Account Status</label>
              <select
                className="form-input"
                value={editFormData.status}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              >
                <option value="Active">Active (Allowed to log in)</option>
                <option value="Inactive">Inactive (Blocked from logging in)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Bio / Notes</label>
              <textarea
                className="form-input"
                rows={3}
                value={editFormData.bio}
                onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                placeholder="Profile notes or bio..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={savingUser}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Save size={16} /> {savingUser ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
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
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    color: '#FFFFFF',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    flexShrink: 0
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
    padding: '0.85rem 1.15rem',
    backgroundColor: '#FAF8F5',
    borderBottom: '2px solid #E7E5E4',
    color: '#78716C',
    fontWeight: '700',
    fontSize: '0.8rem',
    textTransform: 'uppercase'
  },
  td: {
    padding: '0.85rem 1.15rem',
    borderBottom: '1px solid #E7E5E4'
  },
  tr: {
    transition: 'background-color 0.15s'
  }
};

export default AdminDashboard;
