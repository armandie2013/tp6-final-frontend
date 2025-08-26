import { useState, useMemo } from "react";
import { Movies } from "../services/movies";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { safeImage } from "../utils/images";
import { validateMovie, fe } from "../utils/validation";

export default function MovieCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: "",
    director: "",
    year: "",
    genero: "",
    descripcion: "",
    imagen: "",
    rating: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const previewSrc = useMemo(() => {
    if (!form.imagen?.trim()) return "";
    return safeImage(form.imagen);
  }, [form.imagen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: errs, data } = validateMovie(form);
    setErrors(errs);

    if (!isValid) {
      const first = Object.values(errs)[0];
      toast.warn(first || "Revisá los campos");
      return;
    }

    try {
      setSubmitting(true);
      await Movies.create({ ...data, year: data.year || "" });
      toast.success("Película creada");
      navigate("/items");
    } catch {
      toast.error("No se pudo crear");
    } finally {
      setSubmitting(false);
    }
  };

  const base =
    "w-full px-3 py-2 rounded bg-white text-slate-800 border focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white";
  const ok = "border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-600";
  const bad = "border-red-500 focus:ring-red-500 focus:border-red-500";

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      {/* Vista previa */}
      {previewSrc && (
        <div className="w-full bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-center dark:bg-slate-800 dark:border-slate-700">
          <img
            src={previewSrc}
            alt="Vista previa"
            className="w-full h-auto max-h-[40vh] object-contain rounded"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/800x450?text=Sin+imagen";
              e.currentTarget.className =
                "w-full h-auto max-h-[40vh] object-contain rounded opacity-70";
            }}
          />
        </div>
      )}

      {/* Titulo */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Título <span className="text-red-600">*</span>
        </label>
        <input
          name="titulo"
          placeholder="Ej: Interstellar"
          value={form.titulo}
          onChange={handleChange}
          className={`${base} ${fe(errors, "titulo") ? bad : ok}`}
          required
        />
        {fe(errors, "titulo") && (
          <p className="mt-1 text-xs text-red-600">{fe(errors, "titulo")}</p>
        )}
      </div>

      {/* Director */}
      <div>
        <label className="block text-sm font-medium mb-1">Director</label>
        <input
          name="director"
          placeholder="Ej: Christopher Nolan"
          value={form.director}
          onChange={handleChange}
          className={`${base} ${fe(errors, "director") ? bad : ok}`}
        />
        {fe(errors, "director") && (
          <p className="mt-1 text-xs text-red-600">{fe(errors, "director")}</p>
        )}
      </div>

      {/* Año y Genero */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Año</label>
          <input
            name="year"
            type="number"
            placeholder="Ej: 2023"
            value={form.year}
            onChange={handleChange}
            className={`${base} ${fe(errors, "year") ? bad : ok}`}
            inputMode="numeric"
            pattern="\d{4}"
            title="Cuatro dígitos, ej: 2023"
          />
          {fe(errors, "year") && (
            <p className="mt-1 text-xs text-red-600">{fe(errors, "year")}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Género</label>
          <input
            name="genero"
            placeholder="Ej: Ciencia ficción"
            value={form.genero}
            onChange={handleChange}
            className={`${base} ${fe(errors, "genero") ? bad : ok}`}
          />
          {fe(errors, "genero") && (
            <p className="mt-1 text-xs text-red-600">{fe(errors, "genero")}</p>
          )}
        </div>
      </div>

      {/* Imagen */}
      <div>
        <label className="block text-sm font-medium mb-1">URL de la imagen</label>
        <input
          name="imagen"
          placeholder="URL https (.jpg, .jpeg, .png, .webp)"
          value={form.imagen}
          onChange={handleChange}
          className={`${base} ${fe(errors, "imagen") ? bad : ok}`}
        />
        {fe(errors, "imagen") && (
          <p className="mt-1 text-xs text-red-600">{fe(errors, "imagen")}</p>
        )}
      </div>

      {/* Descripcion */}
      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          name="descripcion"
          placeholder="Breve sinopsis"
          value={form.descripcion}
          onChange={handleChange}
          rows={4}
          className={`${base} ${fe(errors, "descripcion") ? bad : ok}`}
        />
        {fe(errors, "descripcion") && (
          <p className="mt-1 text-xs text-red-600">{fe(errors, "descripcion")}</p>
        )}
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-1">Rating (0–10)</label>
        <input
          name="rating"
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="Ej: 8.5"
          value={form.rating}
          onChange={handleChange}
          className={`${base} ${fe(errors, "rating") ? bad : ok}`}
        />
        {fe(errors, "rating") && (
          <p className="mt-1 text-xs text-red-600">{fe(errors, "rating")}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          disabled={submitting}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}