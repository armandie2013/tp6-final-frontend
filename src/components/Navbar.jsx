import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeButton from "./ThemeButton";

const linkCls = ({ isActive }) =>
  `px-3 py-2 rounded-xl transition ${
    isActive
      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
      : "hover:bg-slate-100 dark:hover:bg-slate-800"
  }`;

export default function Navbar() {
  const { isAuth, logout, role } = useAuth();
  const navigate = useNavigate();
  const [profileId, setProfileId] = useState(null);
  const [profileName, setProfileName] = useState(null);

  useEffect(() => {
    setProfileId(localStorage.getItem("profileId"));
    setProfileName(localStorage.getItem("profileName"));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <nav className="glass px-4 py-3 flex items-center justify-between gap-2">
          {/* Brand */}
          <Link to="/" className="font-semibold tracking-tight text-lg">
            Nodo<span className="text-blue-600">Cine</span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={linkCls}>
              Inicio
            </NavLink>
            <NavLink to="/movies" className={linkCls}>
              Películas
            </NavLink>
            <NavLink to="/watchlist" className={linkCls}>
              Watchlist
            </NavLink>
            {role === "admin" && (
              <NavLink to="/movies/create" className={linkCls}>
                Crear
              </NavLink>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {profileName && (
              <span className="hidden sm:inline-flex items-center rounded-xl border border-slate-300 dark:border-slate-700 px-2 py-1 text-xs text-slate-600 dark:text-slate-300">
                Perfil: <b className="ml-1">{profileName}</b>
              </span>
            )}
            <ThemeButton />

            {!isAuth ? (
              <NavLink to="/auth/login" className="btn-outline">
                Ingresar
              </NavLink>
            ) : (
              <button onClick={handleLogout} className="btn-primary">
                Salir
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}