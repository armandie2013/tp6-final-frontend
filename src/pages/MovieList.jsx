import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../context/AuthContext";
import TmdbImportModal from "../components/TmdbImportModal";
import { useLocation, useNavigate } from "react-router-dom";

function useQueryState() {
  const loc = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(loc.search), [loc.search]);

  const get = (key, def = "") => params.get(key) ?? def;

  const setMany = (obj) => {
    const next = new URLSearchParams(loc.search);
    Object.entries(obj).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") next.delete(k);
      else next.set(k, String(v));
    });
    navigate({ search: next.toString() }, { replace: true });
  };

  return { get, setMany, params };
}

export default function MovieList() {
  const { role } = useAuth();
  const { get, setMany } = useQueryState();

  // estado desde la URL
  const [search, setSearch] = useState(get("search", ""));
  const [genre, setGenre] = useState(get("genre", ""));
  const [year, setYear] = useState(get("year", ""));
  const pageFromUrl = Number(get("page", "1")) || 1;

  const [movies, setMovies] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: pageFromUrl, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // lista de géneros simples (podés hacerla dinámica si querés)
  const GENRES = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Drama", "Fantasy", "Family", "Sci-Fi", "Thriller"];

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        ...(search ? { search } : {}),
        ...(genre ? { genre } : {}),
        ...(year ? { year } : {}),
      };
      const { data } = await api.get("/movies", { params });
      setMovies(data.docs || []);
      setPageInfo({ page: data.page || 1, totalPages: data.totalPages || 1 });
    } catch {
      // interceptor muestra errores
    } finally {
      setLoading(false);
    }
  };

  // cargar cuando cambia cualquier filtro o la página
  useEffect(() => {
    load(pageFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, genre, year, pageFromUrl]);

  // handlers
  const applyFilters = (e) => {
    e?.preventDefault?.();
    setMany({ search, genre, year, page: 1 }); // resetea a página 1
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
          <p className="text-sm text-slate-500">Buscá y filtrá resultados. El backend pagina y filtra.</p>
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
      <form onSubmit={applyFilters} className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Buscar título…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">Todos los géneros</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <input
          className="border p-2 rounded"
          placeholder="Año (1999)"
          value={year}
          onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
        />
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded bg-black text-white">Aplicar</button>
          <button type="button" onClick={clearFilters} className="px-3 py-2 rounded border">
            Limpiar
          </button>
        </div>
      </form>

      {loading && <div className="py-8 text-center text-slate-500">Cargando…</div>}

      {!loading && movies.length === 0 && (
        <div className="py-8 text-center text-slate-500">Sin resultados</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {movies.map((m) => <MovieCard key={m._id || m.id} movie={m} />)}
      </div>

      {/* Paginado */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          disabled={pageInfo.page <= 1}
          onClick={() => goPage(pageInfo.page - 1)}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-slate-600">
          Página {pageInfo.page} de {pageInfo.totalPages}
        </span>
        <button
          disabled={pageInfo.page >= pageInfo.totalPages}
          onClick={() => goPage(pageInfo.page + 1)}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* Modal TMDb */}
      <TmdbImportModal
        open={showImport}
        onClose={() => setShowImport(false)}
        onImported={() => load(1)}
      />
    </section>
  );
}