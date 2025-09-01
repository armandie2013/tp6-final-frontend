import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { toast } from "react-toastify";

export default function MovieEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    year: "",
    genres: [],
    ageRating: "",
    overview: "",
    poster: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/movies/${id}`)
      .then(({ data }) => {
        setForm({
          title: data.title || "",
          year: data.year ?? "",
          genres: Array.isArray(data.genres) ? data.genres : [],
          ageRating: data.ageRating ?? "",
          overview: data.overview || "",
          poster: data.poster || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("No se pudo cargar la película");
      });
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [name]:
        name === "genres"
          ? value.split(",").map((v) => v.trim()).filter(Boolean)
          : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.ageRating) delete payload.ageRating;

      await api.put(`/movies/${id}`, payload);
      toast.success("Película actualizada");
      navigate(`/movies/${id}`, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.error || "No se pudo actualizar");
    }
  };

  if (loading) {
    return (
      <section className="max-w-3xl mx-auto">
        <div className="card">
          <div className="card-body">
            <p className="card-subtle">Cargando…</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto">
      <div className="card mb-6">
        <div className="card-body">
          <h1 className="card-title">Editar película</h1>
          <p className="card-subtle">Modificá los datos y guardá los cambios.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card">
        <div className="card-body space-y-4">
          <div>
            <label className="label">Título</label>
            <input
              className="input"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Blade Runner"
            />
          </div>

          <div>
            <label className="label">Año</label>
            <input
              className="input"
              name="year"
              value={form.year}
              onChange={onChange}
              placeholder="1982"
            />
          </div>

          <div>
            <label className="label">Géneros (separados por coma)</label>
            <input
              className="input"
              name="genres"
              value={form.genres.join(", ")}
              onChange={onChange}
              placeholder="Ciencia ficción, Neo-noir"
            />
          </div>

          <div>
            <label className="label">Clasificación por edad</label>
            <select
              className="input"
              name="ageRating"
              value={form.ageRating}
              onChange={onChange}
            >
              <option value="">(Sin clasificación)</option>
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
              <option value="NC-17">NC-17</option>
            </select>
          </div>

          <div>
            <label className="label">URL del poster</label>
            <input
              className="input"
              name="poster"
              value={form.poster}
              onChange={onChange}
              placeholder="https://…/poster.jpg"
            />
          </div>

          <div>
            <label className="label">Descripción</label>
            <textarea
              className="input"
              name="overview"
              value={form.overview}
              onChange={onChange}
              placeholder="Breve sinopsis…"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-primary">Guardar</button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}