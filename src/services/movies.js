// src/services/movies.js
import { api } from "./http";

const normalize = (obj) => {
  if (obj && obj.año != null && obj.year == null) {
    return { ...obj, year: obj.año };
  }
  return obj;
};

export const Movies = {
  list: async () => {
    try {
      const res = await api.get("");
      const data = Array.isArray(res.data) ? res.data.map(normalize) : [];
      return { ...res, data };
    } catch (err) {
      // Si algo raro pasa, devolvemos lista vacía
      return { data: [] };
    }
  },

  get: async (id) => {
    const res = await api.get(`/${id}`);
    return { ...res, data: normalize(res.data) };
  },

  // 🔎 Manejo de 404: lo convertimos en []
  search: async ({ field, value }) => {
    const params = field === "titulo" ? { search: value } : { [field]: value };
    try {
      const res = await api.get("", { params });
      const data = Array.isArray(res.data) ? res.data.map(normalize) : [];
      return { ...res, data };
    } catch (err) {
      if (err?.response?.status === 404) {
        return { data: [] }; // sin resultados, no es error
      }
      throw err; // otros errores sí deben propagarse
    }
  },

  create: (payload) => {
    const p = { ...payload };
    delete p.año;
    return api.post("", p);
  },

  update: (id, payload) => {
    const p = { ...payload };
    delete p.año;
    return api.put(`/${id}`, p);
  },

  remove: (id) => api.delete(`/${id}`),
};