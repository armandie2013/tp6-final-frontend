import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { toast } from "react-toastify";

export default function TmdbImportModal({
  open,
  onClose,
  onImported,
  initialQuery = "",
  autoSearch = false,
}) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [lastError, setLastError] = useState("");

  useEffect(() => {
    if (!open) {
      setQ("");
      setResults([]);
      setLoading(false);
      setLastError("");
    } else {
      if (initialQuery) {
        setQ(initialQuery);
        if (autoSearch) {
          setTimeout(() => search(), 0);
        }
      }
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const search = async (e) => {
    e?.preventDefault?.();
    const query = q.trim();
    if (!query) {
      toast.info("Escribí algo para buscar");
      return;
    }
    setLoading(true);
    setLastError("");
    try {
      const { data } = await api.get("/tmdb/search", { params: { query } });
      const list = Array.isArray(data) ? data : data?.results || [];
      setResults(list);
      if (list.length === 0) setLastError("Sin resultados para esa búsqueda");
    } catch (e) {
      const msg = e?.response?.data?.error || e.message || "Error buscando";
      setLastError(msg);
      toast.error(msg);
      console.error("[TMDB] search error =", e);
    } finally {
      setLoading(false);
    }
  };

  const importOne = async (r) => {
    const tmdbId = r.tmdbId || r.id;
    if (!tmdbId) return toast.error("No se encontró tmdbId");
    try {
      await api.post(`/tmdb/import/${tmdbId}`);
      toast.success(`Importada: ${r.title || r.name}`);
      onImported?.();
    } catch (e) {
      const msg = e?.response?.data?.error || e.message || "Error importando";
      toast.error(msg);
      console.error("[TMDB] import error =", e);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      {/* Contenedor del modal con nuestro estilo "glass" */}
      <div className="w-full max-w-3xl max-h-[85vh] card flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b dark:border-slate-700 flex items-center justify-between">
          <h2 className="card-title m-0">Importar desde The Movie Database</h2>
          <button onClick={onClose} className="btn-ghost text-sm px-3 py-1.5">
            Cerrar
          </button>
        </div>

        {/* Cuerpo scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Barra de búsqueda (sticky) */}
          <form
            onSubmit={search}
            className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b dark:border-slate-700"
          >
            <div className="p-4 flex gap-2">
              <input
                className="input flex-1"
                placeholder="Buscar película (ej: Matrix)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button className="btn-primary" disabled={loading}>
                {loading ? "Buscando…" : "Buscar"}
              </button>
            </div>
          </form>

          <div className="p-4">
            {loading && (
              <div className="card mb-4">
                <div className="card-body">
                  <p className="card-subtle text-center">Cargando resultados…</p>
                </div>
              </div>
            )}

            {!loading && lastError && (
              <div className="card mb-4">
                <div className="card-body">
                  <p className="text-center text-red-600">{lastError}</p>
                </div>
              </div>
            )}

            {!loading && !lastError && results.length === 0 && (
              <div className="card">
                <div className="card-body">
                  <p className="card-subtle text-center">
                    Ingresá un término y buscá
                  </p>
                </div>
              </div>
            )}

            {/* Resultados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((r) => {
                const title = r.title || r.name || "Sin título";
                const year =
                  r.year ||
                  r.release_year ||
                  (r.release_date?.slice(0, 4) || "");
                const poster = r.poster || r.poster_path || r.image || null;
                const rating = r.ageRating || r.certification || "";
                const isAdult = !!r.adult;

                return (
                  <div
                    key={(r.tmdbId || r.id || title) + year}
                    className="card"
                  >
                    <div className="card-body">
                      <div className="flex gap-4 items-start">
                        {/* Poster */}
                        <div className="w-16 h-24 rounded-xl overflow-hidden bg-slate-200/60 dark:bg-slate-800/60 flex-shrink-0">
                          {poster ? (
                            <img
                              src={
                                poster.startsWith?.("http")
                                  ? poster
                                  : `https://image.tmdb.org/t/p/w185${poster}`
                              }
                              alt={title}
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

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="card-title truncate">{title}</div>
                          <div className="card-subtle">{year}</div>

                          {/* Clasificación */}
                          {rating && (
                            <div className="mt-2 inline-flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs">
                                {rating}
                              </span>
                              <span className="text-xs card-subtle">
                                Clasificación
                              </span>
                            </div>
                          )}
                          {!rating && isAdult && (
                            <div className="mt-2 text-xs text-red-500">
                              Solo adultos
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => importOne(r)}
                          className="btn-primary text-sm"
                        >
                          Importar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-xs card-subtle">
              <p>Este producto utiliza la API de TMDB, pero no está avalado ni certificado por TMDB, para mas informaciión visite https://www.themoviedb.org </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}