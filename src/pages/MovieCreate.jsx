import { useForm } from "react-hook-form";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../context/AuthContext";

// Mantengo tu schema: géneros como string (se parte en submit), ageRating opcional
const schema = yup.object({
  title: yup.string().required("Título requerido"),
  year: yup
    .number()
    .typeError("Año debe ser numérico")
    .min(1878, "Año inválido"),
  genres: yup.string().nullable(), // lo transformamos a array antes de enviar
  ageRating: yup.string().nullable(),
  overview: yup.string().nullable(),
  poster: yup.string().url("URL inválida").nullable(),
});

export default function MovieCreate() {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      year: "",
      genres: "",
      ageRating: "",
      overview: "",
      poster: "",
    },
  });

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      year: values.year ? Number(values.year) : undefined,
      // géneros: "accion, drama" -> ["accion", "drama"]
      genres: values.genres
        ? values.genres.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    try {
      await api.post("", payload);
      toast.success("Película creada");
      reset();
      navigate("/movies");
    } catch (err) {
      // los errores ya los toastea el interceptor de api
    }
  };

  return (
    <section className="max-w-3xl mx-auto">
      <div className="card mb-6">
        <div className="card-body">
          <h1 className="card-title">Nueva película</h1>
          <p className="card-subtle">Completá los datos y guardá.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="label">Título</label>
            <input className="input" placeholder="Blade Runner" {...register("title")} />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label">Año</label>
            <input className="input" placeholder="1982" {...register("year")} />
            {errors.year && <p className="text-sm text-red-600 mt-1">{errors.year.message}</p>}
          </div>

          <div>
            <label className="label">Géneros (separados por coma)</label>
            <input className="input" placeholder="Ciencia ficción, Neo-noir" {...register("genres")} />
            {errors.genres && <p className="text-sm text-red-600 mt-1">{errors.genres.message}</p>}
          </div>

          <div>
            <label className="label">Clasificación por edad</label>
            <input className="input" placeholder="+13 / ATP / PG-13" {...register("ageRating")} />
            {errors.ageRating && <p className="text-sm text-red-600 mt-1">{errors.ageRating.message}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">URL del poster</label>
            <input className="input" placeholder="https://…/poster.jpg" {...register("poster")} />
            {errors.poster && <p className="text-sm text-red-600 mt-1">{errors.poster.message}</p>}
          </div>

          <div>
            <label className="label">Descripción</label>
            <textarea rows={5} className="input" placeholder="Breve sinopsis…" {...register("overview")} />
            {errors.overview && <p className="text-sm text-red-600 mt-1">{errors.overview.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando…" : "Crear"}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Limpiar
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}