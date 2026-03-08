import axios from "axios";

const base =
  (process.env.REACT_APP_SERVER_URL || "http://localhost:5000").replace(/\/$/, "");

const axiosInstance = axios.create({
  baseURL: `${base}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;