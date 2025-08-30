import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../context/AuthContext";
import TmdbImportModal from "../components/TmdbImportModal";
import { useLocation, useNavigate } from "react-router-dom";

// Tamaño de página para el backend
const PER_PAGE = 12;

function useQueryState() {
  const loc = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(loc.search), [loc.search]);

  const get = (key, def = "") => params.get(key) ?? def;

  const setMany = (obj) => {
    const next = new URLSearchParams(params);
    Object.entries(obj).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") next.delete(k);
      else next.set(k, v);
    });
    navigate({ search: next.toString() }, { replace: false });
  };

  return { get, setMany };
}

export default function MovieList() {
  const { get, setMany } = useQueryState();
  const { role } = useAuth();

  const [movies, setMovies] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(get("search", ""));
  const [genre, setGenre] = useState(get("genre", ""));
  const [year, setYear] = useState(get("year", ""));
  const [showImport, setShowImport] = useState(false);
  const [tmdbInitialQuery, setTmdbInitialQuery] = useState("");
  const [tmdbAutoSearch, setTmdbAutoSearch] = useState(false);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: PER_PAGE, // 👈 importante para que el backend pagine
        ...(search ? { search } : {}),
        ...(genre ? { genre } : {}),
        ...(year ? { year } : {}),
      };
      const res = await api.get("/movies", { params });
      const data = res?.data || {};
      const docs = data.docs || [];
      setMovies(docs);
      setPageInfo({
        page: data.page || 1,
        totalPages: data.totalPages || 1,
        totalDocs: data.totalDocs,
        limit: data.limit,
      });

      // Abrir modal TMDb si hay término y la base no devuelve nada
      const hasSearch = (search || "").trim().length > 0;
      if (hasSearch && docs.length === 0) {
        setTmdbInitialQuery(search.trim());
        setTmdbAutoSearch(true);
        setShowImport(true);
      } else {
        setTmdbAutoSearch(false);
      }
    } catch {
      // interceptor muestra errores
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const p = Number(get("page", 1)) || 1;
    load(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [get("page"), get("search"), get("genre"), get("year")]);

  const applyFilters = (e) => {
    e.preventDefault();
    setMany({ search, genre, year, page: 1 });
  };

  const clearFilters = () => {
    setSearch("");
    setGenre("");
    setYear("");
    setMany({ search: "", genre: "", year: "", page: 1 });
  };

  const goPage = (p) => setMany({ page: p });

  return (
    <section className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Películas</h1>
          <p className="text-sm text-slate-500">
            Buscá y filtrá resultados. El backend pagina y filtra.
          </p>
        </div>

        {role === "owner" && (
          <button
            onClick={() => setShowImport(true)}
            className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
          >
            Importar TMDb
          </button>
        )}
      </div>

      {/* Filtros */}
      <form
        onSubmit={applyFilters}
        className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-2"
      >
        <input
          className="border p-2 rounded"
          placeholder="Buscar por título…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">Todos los géneros</option>
          <option value="Acción">Acción</option>
          <option value="Aventura">Aventura</option>
          <option value="Comedia">Comedia</option>
          <option value="Drama">Drama</option>
          <option value="Terror">Terror</option>
          {/* agrega los géneros que manejes */}
        </select>

        <input
          className="border p-2 rounded"
          placeholder="Año (ej: 1999)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        {/* Buscar en la base */}
        <button className="px-3 py-2 rounded bg-black text-white" title="Buscar en la base">
          Buscar
        </button>

        {/* Forzar búsqueda en TMDb */}
        <button
          type="button"
          className="px-3 py-2 rounded border"
          title="Buscar también en TMDb"
          onClick={() => {
            const q = (search || "").trim();
            setTmdbInitialQuery(q);
            setTmdbAutoSearch(!!q);
            setShowImport(true);
          }}
        >
          Buscar en TMDb
        </button>
      </form>

      {/* Resultados internos */}
      {loading && (
        <div className="py-6 text-center text-slate-500">Cargando…</div>
      )}
      {!loading && movies.length === 0 && search && showImport && (
        <div className="py-6 text-center text-slate-500">
          Sin resultados en la base. Buscando en TMDb…
        </div>
      )}
      {!loading && movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map((m) => (
            <MovieCard key={m._id} movie={m} />
          ))}
        </div>
      )}

      {/* Paginación (solo si hay más de una página) */}
      {pageInfo.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => goPage(Math.max(1, pageInfo.page - 1))}
            disabled={pageInfo.page <= 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm">
            Página {pageInfo.page} / {pageInfo.totalPages}
          </span>
          <button
            onClick={() =>
              goPage(Math.min(pageInfo.totalPages, pageInfo.page + 1))
            }
            disabled={pageInfo.page >= pageInfo.totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal TMDb */}
      <TmdbImportModal
        open={showImport}
        onClose={() => {
          setShowImport(false);
          setTmdbAutoSearch(false); // reseteo para próximas veces
        }}
        onImported={() => load(1)}
        initialQuery={tmdbInitialQuery}
        autoSearch={tmdbAutoSearch}
      />
    </section>
  );
}