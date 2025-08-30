import { useForm } from "react-hook-form";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../context/AuthContext";

// ✅ schema: géneros como string (lo partimos en el submit), ageRating opcional
const schema = yup.object({
  title: yup.string().required("Título requerido"),
  year: yup
    .number()
    .typeError("Año debe ser numérico")
    .min(1878, "Año inválido"),
  genres: yup
    .string()
    .default("")
    // validación simple: no más de 8 géneros separados por coma
    .test("max-genres", "Demasiados géneros (máx. 8)", (v) => {
      const n = (v || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean).length;
      return n <= 8;
    }),
  overview: yup.string().max(500, "Máximo 500 caracteres"),
  poster: yup.string().url("URL de poster inválida").nullable().default(""),
  ageRating: yup
    .string()
    .oneOf(["", "G", "PG", "PG-13", "R", "NC-17"], "Clasificación inválida")
    .default(""),
});

export default function MovieCreate() {
  const { role } = useAuth();
  const navigate = useNavigate();

  if (role !== "owner") {
    return (
      <div className="p-6 text-red-600">
        No tenés permisos para crear películas.
      </div>
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // 👈 ahora sí
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      year: "",
      genres: "",      // 👈 string
      overview: "",
      poster: "",
      ageRating: "",   // 👈 vacío por defecto
    },
  });

  const onSubmit = async (v) => {
    const genresArr = (v.genres || "")
      .trim()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: v.title,
      year: v.year ? Number(v.year) : undefined,
      genres: genresArr.length ? genresArr : undefined,
      poster: v.poster?.trim() || undefined,
      overview: v.overview?.trim() || undefined,
      // si queda vacío, no lo mandamos
      ...(v.ageRating ? { ageRating: v.ageRating } : {}),
    };

    try {
      await api.post("/movies", payload);
      toast.success("Película creada");
      reset(); // opcional: limpiar form
      navigate("/movies");
    } catch (e) {
      toast.error(e?.response?.data?.error || "No se pudo crear");
    }
  };

  return (
    <section className="p-4 md:p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Nueva película</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="text-sm block mb-1">Título</label>
          <input
            className="border p-2 w-full rounded"
            placeholder="Ej: The Matrix"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm block mb-1">Año</label>
            <input
              className="border p-2 w-full rounded"
              placeholder="1999"
              {...register("year")}
            />
            {errors.year && (
              <p className="text-sm text-red-600">{errors.year.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm">Clasificación</label>
            <select className="border p-2 w-full rounded" {...register("ageRating")}>
              <option value="">(Sin clasificación)</option>
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
              <option value="NC-17">NC-17</option>
            </select>
            {errors.ageRating && (
              <p className="text-sm text-red-600">{errors.ageRating.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm block mb-1">Géneros</label>
          <input
            className="border p-2 w-full rounded"
            placeholder="Action, Sci-Fi"
            {...register("genres")}
          />
          {errors.genres && (
            <p className="text-sm text-red-600">{errors.genres.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm block mb-1">Poster (URL, opcional)</label>
          <input
            className="border p-2 w-full rounded"
            placeholder="https://..."
            {...register("poster")}
          />
          {errors.poster && (
            <p className="text-sm text-red-600">{errors.poster.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm block mb-1">Descripción (opcional)</label>
          <textarea
            className="border p-2 w-full rounded"
            rows={4}
            placeholder="Sinopsis..."
            {...register("overview")}
          />
          {errors.overview && (
            <p className="text-sm text-red-600">{errors.overview.message}</p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {isSubmitting ? "Guardando…" : "Crear"}
        </button>
      </form>
    </section>
  );
}