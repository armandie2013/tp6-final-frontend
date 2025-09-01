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

  useEffect(() => {
    load();
  }, []);

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
      setProfiles((prev) => prev.map((p) => (p._id === editingId ? data : p)));
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
    <section className="max-w-5xl mx-auto">
      <div className="card mb-6">
        <div className="card-body">
          <h1 className="card-title">Perfiles</h1>
          <p className="card-subtle">
            El catálogo se ajusta según el tipo seleccionado (<b>adult</b> / <b>kid</b>).
          </p>
        </div>
      </div>

      {loading && (
        <div className="card mb-6">
          <div className="card-body">
            <p className="card-subtle text-center">Cargando…</p>
          </div>
        </div>
      )}

      {err && (
        <div className="card mb-6">
          <div className="card-body">
            <p className="text-red-600 text-center">{err}</p>
          </div>
        </div>
      )}

      {!loading && !err && (
        <>
          {/* Lista de perfiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {profiles.map((p) => (
              <div key={p._id} className="card">
                <div className="card-body">
                  {editingId === p._id ? (
                    <form onSubmit={saveEdit} className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="label">Nombre</label>
                          <input
                            className="input"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm((s) => ({ ...s, name: e.target.value }))
                            }
                            placeholder="Nombre"
                          />
                        </div>
                        <div>
                          <label className="label">Tipo</label>
                          <select
                            className="input"
                            value={editForm.type}
                            onChange={(e) =>
                              setEditForm((s) => ({ ...s, type: e.target.value }))
                            }
                          >
                            <option value="adult">adult</option>
                            <option value="kid">kid</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        <button className="btn-primary text-sm px-3 py-2">
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="btn-ghost text-sm px-3 py-2"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => selectProfile(p)}
                        className="flex-1 text-left"
                        title={`Tipo: ${p.type}`}
                      >
                        <div className="text-base font-medium">{p.name}</div>
                        <div className="text-xs card-subtle -mt-0.5">{p.type}</div>
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="btn-outline text-sm px-3 py-2"
                          title="Editar"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => remove(p._id)}
                          className="btn-primary text-sm px-3 py-2 bg-red-600 hover:bg-red-700"
                          title="Eliminar"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Crear perfil */}
          <div className="card max-w-xl">
            <div className="card-body">
              <h2 className="card-title mb-2">Crear perfil</h2>
              <form onSubmit={createProfile} className="space-y-3">
                <div>
                  <label className="label">Nombre</label>
                  <input
                    className="input"
                    placeholder="Nombre (ej: Diego / Peque)"
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="label">Tipo</label>
                  <select
                    className="input"
                    value={form.type}
                    onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
                  >
                    <option value="adult">adult</option>
                    <option value="kid">kid</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button className="btn-primary">Crear</button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setForm({ name: "", type: "adult" })}
                  >
                    Limpiar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </section>
  );
}