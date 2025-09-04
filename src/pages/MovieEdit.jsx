import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { api } from "../lib/api";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  title: yup
  .string()
  .required("Título requerido")
  .min(3,"El título debe tener al menos 3 caracteres"),
  year: yup
    .number()
    .typeError("Año debe ser numérico")
    .min(1878, "Año inválido")
    .nullable()
    .transform((v, o) => (o === "" ? null : v)),
  genres: yup
    .string()
    .nullable()
    .transform((v, o) => (o === "" ? null : v)),
  ageRating: yup
    .string()
    .nullable()
    .transform((v, o) => (o === "" ? null : v)),
  overview: yup
    .string()
    .nullable()
    .transform((v, o) => (o === "" ? null : v)),
  poster: yup
    .string()
    .url("URL inválida")
    .nullable()
    .transform((v, o) => (o === "" ? null : v)),
});

export default function MovieEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
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
    shouldFocusError: true,
  });

  // Cargar datos y setear defaults
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get(`/movies/${id}`);
        if (!mounted) return;

        reset({
          title: data.title || "",
          year: data.year ?? "",
          // en el form de edición mostramos géneros como string separado por coma
          genres: Array.isArray(data.genres) ? data.genres.join(", ") : "",
          ageRating: data.ageRating ?? "",
          overview: data.overview || "",
          poster: data.poster || "",
        });
      } catch (e) {
        // si usás el interceptor sin toast para 4xx, podés mostrar inline:
        setError("title", {
          type: "server",
          message: "No se pudo cargar la película",
        });
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, reset, setError]);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      year: values.year ? Number(values.year) : undefined,
      genres: values.genres
        ? values.genres
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };
    if (!payload.ageRating) delete payload.ageRating;

    try {
      await api.put(`/movies/${id}`, payload);
      navigate(`/movies/${id}`, { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data || {};
      const msg = data.error || "No se pudo actualizar";

      // 1) Errores por campo del backend
      if (data.errors && typeof data.errors === "object") {
        Object.entries(data.errors).forEach(([field, message]) => {
          setError(field, { type: "server", message: String(message) });
        });
        return;
      }

      // 2) Permisos / auth
      if (status === 401 || status === 403) {
        setError("title", {
          type: "server",
          message: msg || "Permisos insuficientes",
        });
        return;
      }

      // 3) Genérico visible
      setError("title", { type: "server", message: msg });
    }
  };

  return (
    <section className="max-w-3xl mx-auto">
      <div className="card mb-6">
        <div className="card-body">
          <h1 className="card-title">Editar película</h1>
          <p className="card-subtle">
            Modificá los datos y guardá los cambios.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card">
        <div className="card-body space-y-4">
          <div>
            <label className="label">Título</label>
            <input
              className="input"
              placeholder="Blade Runner"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">Año</label>
            <input className="input" placeholder="1982" {...register("year")} />
            {errors.year && (
              <p className="text-sm text-red-600 mt-1">{errors.year.message}</p>
            )}
          </div>

          <div>
            <label className="label">Géneros (separados por coma)</label>
            <input
              className="input"
              placeholder="Ciencia ficción, Neo-noir"
              {...register("genres")}
            />
            {errors.genres && (
              <p className="text-sm text-red-600 mt-1">
                {errors.genres.message}
              </p>
            )}
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
            {errors.ageRating && (
              <p className="text-sm text-red-600 mt-1">
                {errors.ageRating.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">URL del poster</label>
            <input
              className="input"
              placeholder="https://…/poster.jpg"
              {...register("poster")}
            />
            {errors.poster && (
              <p className="text-sm text-red-600 mt-1">
                {errors.poster.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">Descripción</label>
            <textarea
              className="input"
              rows={4}
              placeholder="Breve sinopsis…"
              {...register("overview")}
            />
            {errors.overview && (
              <p className="text-sm text-red-600 mt-1">
                {errors.overview.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando…" : "Guardar"}
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
