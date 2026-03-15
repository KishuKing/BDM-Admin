import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to inject token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginAdmin = async (email, password) => {
  const { data } = await api.post('/admin-login', { email, password });
  return data;
};

export const getPendingDoctors = async () => {
  const { data } = await api.get('/doctor/pending');
  return data;
};

export const getPendingVendors = async () => {
  const { data } = await api.get('/vendor/pending');
  return data;
};

export const getApprovedUsers = async () => {
  const { data } = await api.get('/users/approved');
  return data;
};

export const getUserDetails = async (id) => {
  console.log(id);
  const { data } = await api.get(`/doctor/${id}`);
  return data;
};

export const approveUser = async (id) => {
  // Ensure the path includes '/doctor' if that's where your routes are mounted
  const { data } = await api.post(`/doctor/approve/${id}`); 
  return data;
};

export const rejectUser = async (id) => {
  const { data } = await api.post(`/reject/${id}`);
  return data;
};

export const getDashboardStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data;
};

export const getVendorDetails = async (id) => {
  console.log(id)
  const { data } = await api.get(`/vendor/${id}`);
  return data;
};

export const approveVendor = async (id) => {
  const { data } = await api.post(`/vendor/approve/${id}`);
  return data;
};

export default api;
