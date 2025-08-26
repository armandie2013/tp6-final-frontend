import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { safeImage } from "../utils/images";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const profileId = localStorage.getItem("profileId");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await api.get(`/movies/${id}`);
      setMovie(data);
    } catch (e) {
      setErr(e?.response?.data?.error || "Error al cargar la película");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const addToWatchlist = async () => {
    if (!profileId) {
      toast.warn("Elegí un perfil primero");
      return;
    }
    try {
      await api.post("/watchlist", { profileId, movieId: movie._id });
      toast.success("Agregada a tu watchlist");
    } catch (e) {
      toast.error(e?.response?.data?.error || "Error al agregar a watchlist");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta película?")) return;
    try {
      await api.delete(`/movies/${movie._id}`);
      toast.success("Película eliminada");
      navigate("/movies", { replace: true });
    } catch (e) {
      const msg = e?.response?.data?.error || "No se pudo eliminar";
      // Si no sos owner/admin, el backend devuelve 403
      toast.error(msg);
    }
  };

  if (loading) return <div className="p-6 text-center text-slate-500">Cargando…</div>;
  if (err) return <div className="p-6 text-center text-red-600">{err}</div>;
  if (!movie) return null;

  const title = movie.title || movie.titulo || "Sin título";
  const year = movie.year ?? movie.año ?? "";
  const poster = movie.poster || movie.imagen || "";
  const genres = Array.isArray(movie.genres) ? movie.genres.join(" / ") : (movie.genero || "");
  const ageRating = movie.ageRating || "";

  return (
    <section className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[240px,1fr] gap-6">
        <div className="border rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
          {poster ? (
            <img
              src={safeImage(poster)}
              alt={title}
              className="w-full h-auto object-cover"
              onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x600?text=Sin+imagen")}
            />
          ) : (
            <div className="h-[360px] grid place-items-center text-slate-500">Sin imagen</div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold mb-1">{title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            {year ? `${year} · ` : ""}{genres} {ageRating ? `· ${ageRating}` : ""}
          </p>

          {movie.overview && (
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed mb-4">{movie.overview}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={addToWatchlist}
              className="px-3 py-1 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700"
              title={profileId ? "Agregar a tu watchlist" : "Elegí un perfil primero"}
            >
              + Watchlist
            </button>

            <Link
              to={`/movies/${movie._id}/edit`}
              className="px-3 py-1 text-sm rounded bg-amber-500 text-white hover:bg-amber-600"
            >
              Editar
            </Link>

            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              title="Solo owner/admin puede eliminar"
            >
              Eliminar
            </button>

            <Link
              to="/movies"
              className="px-3 py-1 text-sm rounded border"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}