import { Link } from "react-router-dom";
import { safeImage } from "../utils/images";
import { Card, CardBody, CardTitle, CardSubtle } from "./ui/Card";

export default function MovieCard({ movie }) {
  const id = movie._id || movie.id;
  const title = movie.title || movie.titulo || "Sin título";
  const year = movie.year ?? movie.año ?? "";
  const poster = movie.poster || movie.imagen || "";
  const genres = Array.isArray(movie.genres)
    ? movie.genres.join(" / ")
    : movie.genero || "";
  const ageRating = movie.ageRating || "";

  return (
    <Card className="hover:shadow-2xl transition">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-t-2xl bg-slate-200/60 dark:bg-slate-800/60">
        <img
          src={safeImage(poster)}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/300x400?text=Sin+imagen";
            e.currentTarget.className =
              "h-full w-full object-contain opacity-70";
          }}
        />
      </div>

      <CardBody>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardSubtle>
          {year} {genres && `• ${genres}`} {ageRating && `• ${ageRating}`}
        </CardSubtle>

        <div className="mt-4 flex gap-2">
          <Link to={`/movies/${id}`} className="btn-outline">
            Ver
          </Link>
          <Link to={`/movies/${id}/edit`} className="btn-primary">
            Editar
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}