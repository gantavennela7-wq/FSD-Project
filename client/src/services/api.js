import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? '/api'
    : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Service
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Course Service (Public & Common)
export const courseService = {
  getAll: async (params = {}) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
  create: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },
  update: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  }
};

// Faculty Service (Dedicated Faculty APIs)
export const facultyService = {
  getProfile: async () => {
    const response = await api.get('/faculty/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/faculty/profile', data);
    return response.data;
  },
  getDashboard: async () => {
    const response = await api.get('/faculty/dashboard');
    return response.data;
  },
  getCourses: async () => {
    const response = await api.get('/faculty/courses');
    return response.data;
  },
  getCourseById: async (id) => {
    const response = await api.get(`/faculty/courses/${id}`);
    return response.data;
  },
  createCourse: async (courseData) => {
    const response = await api.post('/faculty/courses', courseData);
    return response.data;
  },
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/faculty/courses/${id}`, courseData);
    return response.data;
  },
  deleteCourse: async (id) => {
    const response = await api.delete(`/faculty/courses/${id}`);
    return response.data;
  },
  getStudents: async (params = {}) => {
    const response = await api.get('/faculty/students', { params });
    return response.data;
  },
  getCourseStudents: async (courseId) => {
    const response = await api.get(`/faculty/courses/${courseId}/students`);
    return response.data;
  },
  getCourseProgress: async (courseId) => {
    const response = await api.get(`/faculty/courses/${courseId}/progress`);
    return response.data;
  },
  addLesson: async (courseId, lessonData) => {
    const response = await api.post(`/faculty/courses/${courseId}/lessons`, lessonData);
    return response.data;
  },
  updateLesson: async (courseId, lessonId, lessonData) => {
    const response = await api.put(`/faculty/courses/${courseId}/lessons/${lessonId}`, lessonData);
    return response.data;
  },
  deleteLesson: async (courseId, lessonId) => {
    const response = await api.delete(`/faculty/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  }
};

// Enrollment Service (Student learning & tracking)
export const enrollmentService = {
  enroll: async (courseId) => {
    const response = await api.post('/enrollments', { courseId });
    return response.data;
  },
  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/enrollments/${id}`);
    return response.data;
  },
  updateProgress: async (id, progressData) => {
    const response = await api.put(`/enrollments/${id}/progress`, progressData);
    return response.data;
  }
};

// Admin Service
export const adminService = {
  getStudents: async (params = {}) => {
    const response = await api.get('/admin/students', { params });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getFaculty: async (params = {}) => {
    const response = await api.get('/admin/faculty', { params });
    return response.data;
  },
  getFacultyById: async (id) => {
    const response = await api.get(`/admin/faculty/${id}`);
    return response.data;
  },
  createFaculty: async (facultyData) => {
    const response = await api.post('/admin/faculty', facultyData);
    return response.data;
  },
  updateFaculty: async (id, facultyData) => {
    const response = await api.put(`/admin/faculty/${id}`, facultyData);
    return response.data;
  },
  deleteFaculty: async (id) => {
    const response = await api.delete(`/admin/faculty/${id}`);
    return response.data;
  }
};

// Profile Service (General User)
export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  }
};

// AI Learning Assistant Service
export const aiService = {
  chat: async ({ message, question, courseId, lessonId, conversation = [], history = [] }) => {
    const payload = {
      message: message || question,
      question: question || message,
      courseId,
      lessonId,
      conversation: conversation.length > 0 ? conversation : history,
      history: history.length > 0 ? history : conversation
    };
    const response = await api.post('/ai/chat', payload);
    return response.data;
  },
  ask: async ({ question, message, courseId, lessonId, history = [], conversation = [] }) => {
    const payload = {
      message: message || question,
      question: question || message,
      courseId,
      lessonId,
      conversation: conversation.length > 0 ? conversation : history,
      history: history.length > 0 ? history : conversation
    };
    const response = await api.post('/ai/chat', payload);
    return response.data;
  }
};

// Attendance & Streak Service
export const attendanceService = {
  recordActivity: async (activityData) => {
    const response = await api.post('/attendance/activity', activityData);
    return response.data;
  },
  getMyStats: async () => {
    const response = await api.get('/attendance/me');
    return response.data;
  },
  getStreak: async () => {
    const response = await api.get('/attendance/streak');
    return response.data;
  },
  getCalendar: async (params = {}) => {
    const response = await api.get('/attendance/calendar', { params });
    return response.data;
  },
  getFacultyCourseAttendance: async (courseId) => {
    const response = await api.get(`/faculty/courses/${courseId}/attendance`);
    return response.data;
  },
  getAdminStats: async () => {
    const response = await api.get('/admin/attendance/stats');
    return response.data;
  }
};

export default api;

