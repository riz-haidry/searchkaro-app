import axios from "axios";

// --- CONFIGURATION ---
const BASE_URL = "https://searchkaro-app.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// --- HELPERS ---
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

// --- INTERCEPTORS ---
api.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    }
    return Promise.reject(error);
  }
);

// --- API EXPORTS ---

// 1. Auth Flow
export const signup = (payload) => api.post("/api/signup", payload);
export const login = (payload) => api.post("/api/login", payload);

// Forgot Password Flow
export const sendOtp = (email) => api.post("/api/auth/forgot-password", { email });
export const verifyOtp = (otp) => api.post("/api/auth/verify-otp", { otp });
export const resetPassword = (payload) => api.post("/api/auth/reset-password", payload);

// 2. Dashboard & Search 
export const getDashboardStats = () => api.get("/api/reports/summary"); 
export const searchAPI = (params) => api.get("/api/search", { params });

// 3. Categories CRUD
export const getCategories = () => api.get("/api/categories");
export const addCategory = (payload) => api.post("/api/categories", payload);
export const deleteCategory = (id) => api.delete(`/api/categories/${id}`);

// 4. Locations CRUD
export const getLocations = () => api.get("/api/locations");
export const addLocation = (payload) => api.post("/api/locations", payload);
export const deleteLocation = (id) => api.delete(`/api/locations/${id}`);

// 5. Ratings CRUD
export const getRatings = () => api.get("/api/ratings");
export const addRating = (payload) => api.post("/api/ratings", payload);
export const deleteRating = (id) => api.delete(`/api/ratings/${id}`);

// 6. Reports & Policies
export const getReports = () => api.get("/api/reports/summary");
export const getLegalPolicies = () => api.get("/api/legal-policies");

export default api;