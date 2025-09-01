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
        limit: PER_PAGE, // 
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
    <section className="max-w-6xl mx-auto">
      {/* Encabezado */}
      <div className="card mb-6">
        <div className="card-body flex items-center justify-between gap-2">
          <div>
            <h1 className="card-title">Películas</h1>
            <p className="card-subtle">
              Buscá y filtrá resultados.
            </p>
          </div>

          {role === "owner" && (
            <button
              onClick={() => setShowImport(true)}
              className="btn-primary"
              title="Importar desde TMDb"
            >
              Importar TMDB
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <form onSubmit={applyFilters} className="card mb-6">
        <div className="card-body grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            className="input"
            placeholder="Buscar por título…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="input"
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
            className="input"
            placeholder="Año (ej: 1999)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />

          {/* Buscar en la base */}
          <button className="btn-primary" title="Buscar en la base">
            Buscar
          </button>

          {/* Forzar búsqueda en TMDb */}
          <button
            type="button"
            className="btn-outline"
            title="Buscar también en TMDb"
            onClick={() => {
              const q = (search || "").trim();
              setTmdbInitialQuery(q);
              setTmdbAutoSearch(!!q);
              setShowImport(true);
            }}
          >
            Buscar en TMDB
          </button>

          {/* Acciones secundarias */}
          <div className="md:col-span-5 flex items-center gap-2">
            <button
              type="button"
              className="btn-ghost"
              onClick={clearFilters}
              title="Limpiar filtros"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </form>

      {/* Resultados internos */}
      {loading && (
        <div className="card mb-6">
          <div className="card-body">
            <p className="card-subtle text-center">Cargando…</p>
          </div>
        </div>
      )}

      {!loading && movies.length === 0 && search && showImport && (
        <div className="card mb-6">
          <div className="card-body">
            <p className="card-subtle text-center">
              Sin resultados en la base. Buscando en TMDB…
            </p>
          </div>
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
            className="btn-outline disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm card-subtle">
            Página {pageInfo.page} / {pageInfo.totalPages}
          </span>
          <button
            onClick={() =>
              goPage(Math.min(pageInfo.totalPages, pageInfo.page + 1))
            }
            disabled={pageInfo.page >= pageInfo.totalPages}
            className="btn-outline disabled:opacity-50"
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
          setTmdbAutoSearch(false); 
        }}
        onImported={() => load(1)}
        initialQuery={tmdbInitialQuery}
        autoSearch={tmdbAutoSearch}
      />
    </section>
  );
}