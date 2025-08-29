import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { toast } from "react-toastify";

export default function TmdbImportModal({ open, onClose, onImported }) {
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
    }
  }, [open]);

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
      // 👇 tu backend ahora acepta ?query=...
      const { data } = await api.get("/tmdb/search", { params: { query } });
      console.log("[TMDB] search data =", data);

      const list = Array.isArray(data) ? data : (data?.results || []);
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
    if (!tmdbId) {
      toast.error("No se encontró tmdbId");
      return;
    }
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
      <div className="w-full max-w-3xl rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-700">
          <h2 className="font-semibold">Importar desde TMDb</h2>
          <button onClick={onClose} className="text-sm px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
            Cerrar
          </button>
        </div>

        <form onSubmit={search} className="p-4 flex gap-2">
          <input
            className="border p-2 rounded w-full"
            placeholder="Buscar película (ej: Matrix)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="px-3 py-2 rounded bg-black text-white" disabled={loading}>
            {loading ? "Buscando…" : "Buscar"}
          </button>
        </form>

        <div className="px-4 pb-4">
          {loading && <div className="py-6 text-center text-slate-500">Cargando resultados…</div>}
          {!loading && lastError && <div className="py-4 text-center text-red-600">{lastError}</div>}
          {!loading && !lastError && results.length === 0 && (
            <div className="py-6 text-center text-slate-500">Ingresá un término y buscá</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((r) => {
              const title = r.title || r.name || "Sin título";
              const year = r.year || r.release_year || (r.release_date?.slice(0, 4) || "");
              const poster = r.poster || r.poster_path || r.image || null;

              return (
                <div key={(r.tmdbId || r.id || title) + year} className="border rounded-lg p-3 flex gap-3 items-center dark:border-slate-700">
                  {poster ? (
                    <img
                      src={poster.startsWith?.("http") ? poster : `https://image.tmdb.org/t/p/w185${poster}`}
                      alt={title}
                      className="w-16 h-24 object-cover rounded"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-24 bg-slate-200 rounded grid place-items-center text-xs text-slate-500">Sin img</div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{title}</div>
                    <div className="text-sm text-slate-500">{year}</div>
                  </div>
                  <button
                    onClick={() => importOne(r)}
                    className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
                  >
                    Importar
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-xs text-slate-500">
            * Recordá configurar <code>TMDB_ACCESS_TOKEN</code> en el backend.
          </div>
        </div>
      </div>
    </div>
  );
}