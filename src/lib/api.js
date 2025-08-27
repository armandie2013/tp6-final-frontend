import axios from "axios";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

// Auth header
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Errores → toast automáticos
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.error ||
      err?.message ||
      "Error de red";
    // Evita duplicar si ya mostrás manualmente en algunos lados
    toast.error(msg);
    return Promise.reject(err);
  }
);

console.log("API baseURL =", api.defaults.baseURL);