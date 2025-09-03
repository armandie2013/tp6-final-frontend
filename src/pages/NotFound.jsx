import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="max-w-3xl mx-auto p-6">
      <div className="card">
        <div className="card-body text-center space-y-4">
          <h2 className="card-title text-2xl">Página no encontrada</h2>
          <p className="card-subtle">
            La ruta que intentaste abrir no existe.
          </p>
          <Link
            to="/"
            className="btn-primary inline-block"
          >
            Ir a inicio
          </Link>
        </div>
      </div>
    </section>
  );
}