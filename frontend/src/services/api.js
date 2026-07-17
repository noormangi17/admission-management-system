import axios from "axios";

const API = axios.create({
  baseURL:"http://localhost:5000/api",
  // baseURL: "https://admission-management-system-production-06f1.up.railway.app/api",
  baseURL:"https://admission-management-system-production-61f1.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
