import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import MovieCard from "../components/MovieCard";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const profileId = localStorage.getItem("profileId");

  const params = useMemo(() => {
    const p = { page, limit: 12 };
    if (profileId) p.profileId = profileId;    // gate niño en backend
    if (search) p.search = search;
    if (genre) p.genre = genre;
    if (year) p.year = year;
    return p;
  }, [page, profileId, search, genre, year]);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await api.get("/movies", { params });
      // El backend devuelve { docs, page, totalDocs, totalPages }
      setMovies(Array.isArray(data.docs) ? data.docs : []);
      setPage(data.page ?? 1);
      setTotalDocs(data.totalDocs ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (e) {
      setErr(e?.response?.data?.error || "Error al cargar películas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [params]);

  const next = () => page < totalPages && setPage(page + 1);
  const prev = () => page > 1 && setPage(page - 1);
  const clearFilters = () => {
    setSearch("");
    setGenre("");
    setYear("");
    setPage(1);
  };

  return (
    <section className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-semibold">Catálogo</h1>
          <p className="text-sm text-slate-500">
            {profileId ? "Filtrado por perfil seleccionado" : "Mostrando todo"}
          </p>
        </div>

        {/* Filtros */}
        <form
          onSubmit={(e) => { e.preventDefault(); setPage(1); load(); }}
          className="flex flex-wrap gap-2"
        >
          <input
            className="border p-2 rounded w-44"
            placeholder="Buscar título"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            className="border p-2 rounded w-36"
            placeholder="Género (Action)"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
          <input
            className="border p-2 rounded w-28"
            placeholder="Año (1999)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <button className="px-3 py-2 rounded bg-black text-white">Aplicar</button>
          <button
            type="button"
            className="px-3 py-2 rounded bg-slate-200 text-slate-800"
            onClick={clearFilters}
          >
            Limpiar
          </button>
        </form>
      </div>

      {/* Estado */}
      {loading && <div className="py-8 text-center text-slate-500">Cargando…</div>}
      {err && <div className="py-8 text-center text-red-600">{err}</div>}

      {/* Grid */}
      {!loading && !err && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {movies.map((m) => <MovieCard key={m._id || m.id} movie={m} />)}
          </div>

          {/* Paginado */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={prev}
              disabled={page <= 1}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              ← Anterior
            </button>
            <span className="text-sm text-slate-600">
              Página {page} de {totalPages} · {totalDocs} resultados
            </span>
            <button
              onClick={next}
              disabled={page >= totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </section>
  );
}