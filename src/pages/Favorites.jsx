import { useFavoritos } from "../context/FavoritesContext";
import { safeImage } from "../utils/images";

export default function Favorites() {
  const { favoritos, eliminarFavorito, eliminarTodos } = useFavoritos();

  if (favoritos.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-10">
        <p className="text-center text-sm text-slate-500 dark:text-slate-300">
          Sin películas favoritas por ahora.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 mt-10">
      <h2 className="text-xl font-bold mb-4">Favoritos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
        {favoritos.map((peli) => (
          <div
            key={peli.id}
            className="h-full p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col items-center text-center dark:bg-slate-800 dark:border-slate-700"
          >
            {/* Imagen con proxy y placeholder */}
            {peli.imagen && (
              <div className="w-full h-44 flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden mb-3 dark:bg-slate-700">
                <img
                  src={safeImage(peli.imagen)}
                  alt={peli.titulo}
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

            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {peli.titulo}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">{peli.genero}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {peli.year ?? peli.año}
            </p>

            <button
              onClick={() => eliminarFavorito(peli.id)}
              className="mt-auto px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 shadow-sm"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={eliminarTodos}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm shadow-sm"
        >
          Eliminar todos
        </button>
      </div>
    </div>
  );
}