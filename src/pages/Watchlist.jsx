import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { toast } from "react-toastify";

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

  useEffect(() => { load(); }, []);

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
    return <div className="p-6 text-slate-500">Elegí un perfil primero.</div>;
  }

  return (
    <section className="p-4 md:p-6">
      <h1 className="text-xl font-semibold mb-4">Mi Watchlist</h1>
      {loading && <div className="py-8 text-center text-slate-500">Cargando…</div>}
      {!loading && items.length === 0 && <div className="text-slate-500">No hay películas en tu watchlist.</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((w) => (
          <div key={w._id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <div className="font-medium">{w.movieId?.title}</div>
              <div className="text-sm text-slate-500">
                {w.movieId?.year} · {w.movieId?.ageRating}
              </div>
            </div>
            <button
              onClick={() => remove(w._id)}
              className="text-sm bg-red-600 text-white px-3 py-1 rounded"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}