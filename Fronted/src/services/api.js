import axios from "axios";

const api = axios.create({
  // In production VITE_API_URL is set to the backend URL (e.g. https://moodify-api.onrender.com)
  // In local dev it falls back to localhost:3000
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true, // send cookies (JWT) with every request
});

export default api;