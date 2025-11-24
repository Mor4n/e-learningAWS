import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Courses API
export const coursesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/courses', { params });
    return response.data.courses || response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data.course || response.data;
  },

  getByCategory: async (category) => {
    const response = await api.get(`/courses/category/${category}`);
    return response.data.courses || response.data;
  },

  getCurriculum: async (id) => {
    const response = await api.get(`/courses/${id}/curriculum`);
    return response.data;
  },
};

// Enrollments API
export const enrollmentsAPI = {
  enroll: async (courseId) => {
    const response = await api.post('/enrollments', { courseId });
    return response.data;
  },

  getMyEnrollments: async () => {
    const response = await api.get('/enrollments');
    return response.data;
  },

  checkEnrollment: async (courseId) => {
    const response = await api.get(`/enrollments/${courseId}`);
    return response.data;
  },

  unenroll: async (courseId) => {
    const response = await api.delete(`/enrollments/${courseId}`);
    return response.data;
  },
};

// Progress API
export const progressAPI = {
  saveProgress: async (courseId, lessonId, completed = true) => {
    const response = await api.post('/progress', { courseId, lessonId, completed });
    return response.data;
  },

  getCourseProgress: async (courseId) => {
    const response = await api.get(`/progress/${courseId}`);
    return response.data;
  },

  getAllProgress: async () => {
    const response = await api.get('/progress');
    return response.data;
  },

  deleteProgress: async (courseId, lessonId) => {
    const response = await api.delete(`/progress/${courseId}/${lessonId}`);
    return response.data;
  },
};

export default api;
