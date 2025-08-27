import { useForm } from "react-hook-form";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../context/AuthContext";

const schema = yup.object({
  title: yup.string().required("Título requerido"),
  year: yup
    .number()
    .typeError("Año debe ser numérico")
    .min(1878, "Año inválido")
    .max(new Date().getFullYear() + 1, "Año inválido"),
  genres: yup.string().required("Géneros requeridos"),
  ageRating: yup
    .string()
    .oneOf(["G","PG","PG-13","R","NC-17"], "Clasificación inválida")
    .required("Clasificación requerida"),
  poster: yup.string().url("URL inválida").nullable().transform(v => (v === "" ? null : v)),
  overview: yup.string().nullable().transform(v => (v === "" ? null : v)),
});

export default function MovieCreate() {
  const { role } = useAuth();
  const navigate = useNavigate();

  if (role !== "owner") {
    return <div className="p-6 text-red-600">No tenés permisos para crear películas.</div>;
  }

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      year: "",
      genres: "",
      ageRating: "PG-13",
      poster: "",
      overview: "",
    }
  });

  const onSubmit = async (v) => {
    const payload = {
      title: v.title,
      year: v.year ? Number(v.year) : undefined,
      genres: v.genres.split(",").map(s => s.trim()).filter(Boolean),
      ageRating: v.ageRating,
      poster: v.poster || undefined,
      overview: v.overview || undefined,
    };

    try {
      await api.post("/movies", payload);
      toast.success("Película creada");
      navigate("/movies");
    } catch (e) {
      // El interceptor ya muestra el error, este es por si se desactiva
      toast.error(e?.response?.data?.error || "No se pudo crear");
    }
  };

  return (
    <section className="p-4 md:p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Nueva película</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="text-sm block mb-1">Título</label>
          <input className="border p-2 w-full rounded" placeholder="Ej: The Matrix" {...register("title")} />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm block mb-1">Año</label>
            <input className="border p-2 w-full rounded" placeholder="1999" {...register("year")} />
            {errors.year && <p className="text-sm text-red-600">{errors.year.message}</p>}
          </div>
          <div>
            <label className="text-sm block mb-1">Clasificación</label>
            <select className="border p-2 w-full rounded" {...register("ageRating")}>
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
              <option value="NC-17">NC-17</option>
            </select>
            {errors.ageRating && <p className="text-sm text-red-600">{errors.ageRating.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-sm block mb-1">Géneros</label>
          <input className="border p-2 w-full rounded" placeholder="Action, Sci-Fi" {...register("genres")} />
          {errors.genres && <p className="text-sm text-red-600">{errors.genres.message}</p>}
        </div>

        <div>
          <label className="text-sm block mb-1">Poster (URL, opcional)</label>
          <input className="border p-2 w-full rounded" placeholder="https://..." {...register("poster")} />
          {errors.poster && <p className="text-sm text-red-600">{errors.poster.message}</p>}
        </div>

        <div>
          <label className="text-sm block mb-1">Descripción (opcional)</label>
          <textarea className="border p-2 w-full rounded" rows={4} placeholder="Sinopsis..." {...register("overview")} />
          {errors.overview && <p className="text-sm text-red-600">{errors.overview.message}</p>}
        </div>

        <button disabled={isSubmitting} className="px-3 py-2 rounded bg-black text-white disabled:opacity-50">
          {isSubmitting ? "Guardando…" : "Crear"}
        </button>
      </form>
    </section>
  );
}