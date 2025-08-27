import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeButton from "./ThemeButton";

export default function Navbar() {
  const { isAuth, logout, role } = useAuth();
  const navigate = useNavigate();

  const [profileId, setProfileId] = useState(null);
  const [profileName, setProfileName] = useState(null);

  // Cargar perfil activo desde localStorage
  useEffect(() => {
    setProfileId(localStorage.getItem("profileId"));
    setProfileName(localStorage.getItem("profileName")); // opcional, si lo guardás al seleccionar
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  const clearProfile = () => {
    localStorage.removeItem("profileId");
    localStorage.removeItem("profileName");
    setProfileId(null);
    setProfileName(null);
    navigate("/profiles");
  };

  const linkCls = ({ isActive }) =>
    `px-3 py-1 rounded ${
      isActive ? "bg-slate-200 dark:bg-slate-700" : "hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <header className="border-b bg-white/60 dark:bg-slate-900/60 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="font-semibold">NodoCine</Link>

        <nav className="flex items-center gap-2">
          {isAuth && (
            <>
              <NavLink to="/profiles" className={linkCls}>Perfiles</NavLink>
              <NavLink to="/movies" className={linkCls}>Películas</NavLink>
              <NavLink to="/watchlist" className={linkCls}>Watchlist</NavLink>

              {/* Solo owner: crear película */}
              {role === "owner" && (
                <NavLink to="/movies/create" className={linkCls}>Nueva película</NavLink>
              )}

              {/* Chip perfil activo */}
              {profileId && (
                <button
                  onClick={clearProfile}
                  title="Cambiar perfil"
                  className="ml-1 px-2 py-1 text-xs rounded-full bg-slate-200 dark:bg-slate-700 hover:opacity-90"
                >
                  Perfil • {profileName || profileId.slice(-6)}
                </button>
              )}
            </>
          )}

          <ThemeButton />

          {!isAuth ? (
            <NavLink to="/auth/login" className={linkCls}>Ingresar</NavLink>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Salir
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}