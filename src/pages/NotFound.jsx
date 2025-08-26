import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="max-w-3xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">404 - Página no encontrada</h2>
      <p className="mb-4 text-slate-600 dark:text-slate-300">
        La ruta que intentaste abrir no existe.
      </p>
      <Link to="/" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
        Ir a inicio
      </Link>
    </section>
  );
}