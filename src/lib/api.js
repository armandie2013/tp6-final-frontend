// import axios from "axios";
// import { toast } from "react-toastify";

// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
// });

// // Auth header
// api.interceptors.request.use(cfg => {
//   const token = localStorage.getItem("token");
//   if (token) cfg.headers.Authorization = `Bearer ${token}`;
//   return cfg;
// });

// // Errores → toast automáticos
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const msg =
//       err?.response?.data?.error ||
//       err?.message ||
//       "Error de red";
//     // Evita duplicar si ya mostrás manualmente en algunos lados
//     toast.error(msg);
//     return Promise.reject(err);
//   }
// );

// console.log("API baseURL =", api.defaults.baseURL);

// src/lib/api.js
import axios from "axios";
import { toast } from "react-toastify";

const isDev = import.meta.env.DEV === true;
const fromEnv = import.meta.env.VITE_API_URL;

// En dev permitimos localhost; en prod exigimos env
const baseURL = fromEnv || (isDev ? "http://localhost:4000" : null);

if (!baseURL) {
  // Evita builds de prod que queden apuntando a localhost
  const msg = "VITE_API_URL no está seteada en producción";
  // Podés forzar fallo de build:
  // throw new Error(msg);
  console.error("❌", msg);
}

export const api = axios.create({
  baseURL,
  withCredentials: false, // usamos Authorization: Bearer, no cookies
});

// Auth header
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Errores → toast automáticos (silenciá algunos si querés)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.error ||
      err?.message ||
      "Error de red";
    // Evitar duplicados: podés condicionar por ruta/código si hace falta
    toast.error(msg);
    return Promise.reject(err);
  }
);

// Log para verificar en Netlify
console.log("🔧 API baseURL =", baseURL);