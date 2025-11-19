// simple axios instance
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const API = axios.create({ baseURL: API_BASE });

// attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
