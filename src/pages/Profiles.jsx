import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { toast } from "react-toastify";

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", type: "adult" });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", type: "adult" });

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
    localStorage.setItem("profileName", p.name);
    toast.success(`Perfil: ${p.name}`);
    window.location.href = "/movies";
  };

  const createProfile = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.warn("El nombre es requerido");
    try {
      const { data } = await api.post("/profiles", form);
      toast.success("Perfil creado");
      setForm({ name: "", type: "adult" });
      setProfiles((prev) => [...prev, data]);
    } catch (e) {
      toast.error(e?.response?.data?.error || "No se pudo crear");
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setEditForm({ name: p.name, type: p.type });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", type: "adult" });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return toast.warn("El nombre es requerido");
    try {
      const { data } = await api.put(`/profiles/${editingId}`, editForm);
      setProfiles((prev) => prev.map(p => p._id === editingId ? data : p));
      toast.success("Perfil actualizado");
      cancelEdit();
    } catch (e) {
      toast.error(e?.response?.data?.error || "No se pudo actualizar");
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar este perfil?")) return;
    try {
      await api.delete(`/profiles/${id}`);
      setProfiles((prev) => prev.filter((p) => p._id !== id));
      const active = localStorage.getItem("profileId");
      if (active === id) {
        localStorage.removeItem("profileId");
        localStorage.removeItem("profileName");
      }
      toast.info("Perfil eliminado");
    } catch (e) {
      toast.error(e?.response?.data?.error || "No se pudo eliminar");
    }
  };

  return (
    <section className="p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Perfiles</h1>
        <p className="text-sm text-slate-500">El catálogo se ajusta según el tipo (adult/kid).</p>
      </div>

      {loading && <div className="py-8 text-center text-slate-500">Cargando…</div>}
      {err && <div className="py-8 text-center text-red-600">{err}</div>}

      {!loading && !err && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {profiles.map((p) => (
              <div key={p._id} className="border rounded-xl p-4 flex items-center justify-between">
                {editingId === p._id ? (
                  <form onSubmit={saveEdit} className="flex-1 flex flex-wrap gap-2 items-center">
                    <input
                      className="border p-2 rounded w-44"
                      value={editForm.name}
                      onChange={(e) => setEditForm(s => ({ ...s, name: e.target.value }))}
                      placeholder="Nombre"
                    />
                    <select
                      className="border p-2 rounded w-36"
                      value={editForm.type}
                      onChange={(e) => setEditForm(s => ({ ...s, type: e.target.value }))}
                    >
                      <option value="adult">adult</option>
                      <option value="kid">kid</option>
                    </select>
                    <div className="ml-auto flex gap-2">
                      <button className="px-3 py-1 rounded bg-black text-white">Guardar</button>
                      <button type="button" onClick={cancelEdit} className="px-3 py-1 rounded border">Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <button
                      onClick={() => selectProfile(p)}
                      className="text-left"
                      title={`Tipo: ${p.type}`}
                    >
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.type}</div>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="px-3 py-1 text-sm rounded bg-amber-500 text-white hover:bg-amber-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => remove(p._id)}
                        className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="max-w-md">
            <h2 className="font-medium mb-2">Crear perfil</h2>
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
        </>
      )}
    </section>
  );
}