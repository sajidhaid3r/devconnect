import axios from "axios";

// Axios instance -> React Query handles server-state caching (per PDF Data Flow)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Let calling code decide how to react (e.g. redirect to /login)
    }
    return Promise.reject(error.response?.data || error);
  }
);
