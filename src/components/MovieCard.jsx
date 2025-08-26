import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../lib/api";
import { safeImage } from "../utils/images";

export default function MovieCard({ movie }) {
  // Normalizamos campos para tolerar data vieja del TP anterior y la nueva del backend
  const id = movie._id || movie.id;
  const title = movie.title || movie.titulo || "Sin título";
  const year = movie.year ?? movie.año ?? "";
  const poster = movie.poster || movie.imagen || "";
  const genres = Array.isArray(movie.genres)
    ? movie.genres.join(" / ")
    : (movie.genero || "");
  const ageRating = movie.ageRating || "";

  const profileId = localStorage.getItem("profileId");

  const handleAddToWatchlist = async () => {
    if (!profileId) {
      toast.warn("Elegí un perfil primero");
      return;
    }
    try {
      await api.post("/watchlist", { profileId, movieId: id });
      toast.success("Agregada a tu watchlist");
    } catch (e) {
      const msg = e?.response?.data?.error || "Error al agregar a watchlist";
      toast.error(msg);
    }
  };

  return (
    <div className="h-full p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col dark:bg-slate-800 dark:border-slate-700">
      {(poster) && (
        <div className="w-full h-44 flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden mb-3 dark:bg-slate-700">
          <img
            src={safeImage(poster)}
            alt={title}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/300x200?text=Sin+imagen";
              e.currentTarget.className =
                "max-h-full max-w-full object-contain opacity-70";
            }}
          />
        </div>
      )}

      <h3 className="font-semibold text-slate-900 truncate dark:text-slate-100">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {genres} {year ? `• ${year}` : ""} {ageRating ? `• ${ageRating}` : ""}
      </p>

      <div className="mt-auto pt-3 flex gap-2 flex-wrap">
        {/* Rutas nuevas alineadas al backend */}
        <Link
          to={`/movies/${id}`}
          className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        >
          Ver
        </Link>
        <Link
          to={`/movies/${id}/edit`}
          className="px-3 py-1 text-sm rounded bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
        >
          Editar
        </Link>

        {/* Watchlist (reemplaza “Favoritos” local) */}
        <button
          onClick={handleAddToWatchlist}
          className="px-3 py-1 text-sm rounded shadow-sm transition bg-emerald-600 text-white hover:bg-emerald-700"
          title={profileId ? "Agregar a tu watchlist" : "Elegí un perfil primero"}
        >
          + Watchlist
        </button>
      </div>
    </div>
  );
}