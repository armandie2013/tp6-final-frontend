import { useForm } from "react-hook-form";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  title: yup.string().required("Título requerido"),
  year: yup
    .number()
    .typeError("Año debe ser numérico")
    .min(1878, "Año inválido"),
  genres: yup.string().nullable(),
  ageRating: yup.string().nullable(),
  overview: yup.string().nullable(),
  poster: yup.string().url("URL inválida").nullable(),
});

export default function MovieCreate() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
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
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      year: values.year ? Number(values.year) : undefined,
      genres: values.genres
        ? values.genres.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };
    if (!payload.ageRating) delete payload.ageRating;

    try {
      await api.post("/movies", payload);
      toast.success("Película creada");
      reset();
      navigate("/movies");
    } catch (err) {
      // el interceptor maneja el toast de error si corresponde
    }
  };

  return (
    <section className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="card mb-6">
        <div className="card-body">
          <h1 className="card-title">Nueva película</h1>
          <p className="card-subtle">Completá los datos y guardá.</p>
        </div>
      </div>

      {/* Form con el mismo layout que MovieEdit */}
      <form onSubmit={handleSubmit(onSubmit)} className="card">
        <div className="card-body space-y-4">
          <div>
            <label className="label">Título</label>
            <input
              className="input"
              placeholder="Blade Runner"
              {...register("title")}
            />
          </div>

          <div>
            <label className="label">Año</label>
            <input
              className="input"
              placeholder="1982"
              {...register("year")}
            />
          </div>

          <div>
            <label className="label">Géneros (separados por coma)</label>
            <input
              className="input"
              placeholder="Ciencia ficción, Neo-noir"
              {...register("genres")}
            />
          </div>

          <div>
            <label className="label">Clasificación por edad</label>
            <select className="input" {...register("ageRating")}>
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
              placeholder="https://…/poster.jpg"
              {...register("poster")}
            />
          </div>

          <div>
            <label className="label">Descripción</label>
            <textarea
              className="input"
              rows={4}
              placeholder="Breve sinopsis…"
              {...register("overview")}
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando…" : "Crear"}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}