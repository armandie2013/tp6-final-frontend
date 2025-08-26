import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
  // tratamos 404 como respuesta valida (no error)
  validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
});

api.interceptors.response.use(
  (res) => {
    // Si la API devolvia 404, lo mapeamos a lista vacia
    if (res.status === 404) {
      return { ...res, data: [] };
    }
    return res;
  },
  (err) => {
    const message = err.response?.data?.message || err.message || "Error de red";
    return Promise.reject(new Error(message));
  }
);