import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { safeImage } from "../utils/images"; // opcional para sanear poster

export default function Watchlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const profileId = localStorage.getItem("profileId");

  const load = async () => {
    if (!profileId) return;
    setLoading(true);
    try {
      const { data } = await api.get("/watchlist", { params: { profileId } });
      setItems(data.docs ?? []);
    } catch (e) {
      toast.error(e?.response?.data?.error || "Error al cargar watchlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/watchlist/${id}`);
      setItems((prev) => prev.filter((x) => x._id !== id));
      toast.info("Quitada de tu watchlist");
    } catch (e) {
      toast.error(e?.response?.data?.error || "No se pudo quitar");
    }
  };

  if (!profileId) {
    return (
      <section className="max-w-4xl mx-auto">
        <div className="card">
          <div className="card-body">
            <p className="card-subtle">Elegí un perfil primero.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="card mb-6">
        <div className="card-body">
          <h1 className="card-title">Mi Watchlist</h1>
          <p className="card-subtle">Películas guardadas para ver más tarde.</p>
        </div>
      </div>

      {/* Loading / Empty */}
      {loading && (
        <div className="card mb-6">
          <div className="card-body">
            <p className="card-subtle text-center">Cargando…</p>
          </div>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="card">
          <div className="card-body">
            <p className="card-subtle">No hay películas en tu watchlist.</p>
          </div>
        </div>
      )}

      {/* Listado */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((w) => {
            const m = w.movieId || {};
            const poster = m.poster ? safeImage(m.poster) : "";
            return (
              <div key={w._id} className="card">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    {/* Poster mini (opcional) */}
                    <div className="w-16 h-24 rounded-xl overflow-hidden bg-slate-200/60 dark:bg-slate-800/60 flex-shrink-0">
                      {poster ? (
                        <img
                          src={poster}
                          alt={m.title || "Poster"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/64x96?text=No+img";
                            e.currentTarget.className =
                              "w-full h-full object-contain opacity-70";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-xs card-subtle">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="card-title truncate">{m.title}</div>
                      <div className="card-subtle">
                        {m.year} {m.ageRating ? `• ${m.ageRating}` : ""}
                      </div>
                    </div>

                    <button
                      onClick={() => remove(w._id)}
                      className="btn-primary bg-red-600 hover:bg-red-700"
                      title="Quitar de la watchlist"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}