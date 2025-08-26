import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { toast } from "react-toastify";

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", type: "adult" });

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await api.get("/profiles");
      setProfiles(data);
    } catch (e) {
      setErr(e?.response?.data?.error || "Error al cargar perfiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const selectProfile = (p) => {
    localStorage.setItem("profileId", p._id);
    toast.success(`Perfil: ${p.name}`);
    window.location.href = "/movies";
  };

  const createProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/profiles", form);
      toast.success("Perfil creado");
      setForm({ name: "", type: "adult" });
      setProfiles((prev) => [...prev, data]);
    } catch (e) {
      toast.error(e?.response?.data?.error || "No se pudo crear");
    }
  };

  return (
    <section className="p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Elegí un perfil</h1>
        <p className="text-sm text-slate-500">El catálogo se ajusta al tipo (adult/kid).</p>
      </div>

      {loading && <div className="py-8 text-center text-slate-500">Cargando…</div>}
      {err && <div className="py-8 text-center text-red-600">{err}</div>}

      {!loading && !err && profiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {profiles.map((p) => (
            <button
              key={p._id}
              onClick={() => selectProfile(p)}
              className="border rounded-xl p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
              title={`Tipo: ${p.type}`}
            >
              <div className="text-lg font-medium">{p.name}</div>
              <div className="text-xs text-slate-500">{p.type}</div>
            </button>
          ))}
        </div>
      )}

      {!loading && !err && profiles.length === 0 && (
        <div className="mt-6 max-w-md">
          <h2 className="font-medium mb-2">Crear primer perfil</h2>
          <form onSubmit={createProfile} className="space-y-2">
            <input
              className="border p-2 w-full rounded"
              placeholder="Nombre (ej: Diego / Peque)"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            />
            <select
              className="border p-2 w-full rounded"
              value={form.type}
              onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
            >
              <option value="adult">adult</option>
              <option value="kid">kid</option>
            </select>
            <button className="px-3 py-2 rounded bg-black text-white">Crear</button>
          </form>
        </div>
      )}
    </section>
  );
}