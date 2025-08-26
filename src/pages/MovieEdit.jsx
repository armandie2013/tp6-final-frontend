import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { toast } from "react-toastify";

export default function MovieEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", year: "", genres: [], ageRating: "PG-13", overview: "", poster: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/movies/${id}`).then(({ data }) => {
      setForm({
        title: data.title || "",
        year: data.year || "",
        genres: Array.isArray(data.genres) ? data.genres : [],
        ageRating: data.ageRating || "PG-13",
        overview: data.overview || "",
        poster: data.poster || ""
      });
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: name === "genres" ? value.split(",").map(v => v.trim()).filter(Boolean) : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/movies/${id}`, form);
      toast.success("Película actualizada");
      navigate(`/movies/${id}`, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.error || "No se pudo actualizar");
    }
  };

  if (loading) return <div className="p-6 text-center text-slate-500">Cargando…</div>;

  return (
    <section className="p-4 md:p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Editar película</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border p-2 w-full rounded" name="title" value={form.title} onChange={onChange} placeholder="Título" />
        <input className="border p-2 w-full rounded" name="year" value={form.year} onChange={onChange} placeholder="Año (1999)" />
        <input className="border p-2 w-full rounded" name="genres" value={form.genres.join(", ")} onChange={onChange} placeholder="Géneros (Action, Sci-Fi)" />
        <input className="border p-2 w-full rounded" name="ageRating" value={form.ageRating} onChange={onChange} placeholder="Clasificación (G, PG, PG-13, R, NC-17)" />
        <input className="border p-2 w-full rounded" name="poster" value={form.poster} onChange={onChange} placeholder="URL del poster" />
        <textarea className="border p-2 w-full rounded" name="overview" value={form.overview} onChange={onChange} placeholder="Descripción" rows={4} />
        <button className="px-3 py-2 rounded bg-black text-white">Guardar</button>
      </form>
    </section>
  );
}