import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeButton from "./ThemeButton";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const linkCls = ({ isActive }) =>
  `block px-3 py-2 rounded-xl transition ${
    isActive
      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
      : "hover:bg-slate-100 dark:hover:bg-slate-800"
  }`;

export default function Navbar() {
  const { isAuth, logout, role } = useAuth();
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setProfileName(localStorage.getItem("profileName"));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <nav className="glass px-4 py-3 flex items-center justify-between gap-2">
          {/* Brand */}
          <Link to="/" className="font-semibold tracking-tight text-lg">
            Pelis<span className="text-blue-600">Data</span>
          </Link>

          {/* Desktop links */}
          {isAuth && (
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/movies" className={linkCls}>
                Películas
              </NavLink>
              <NavLink to="/watchlist" className={linkCls}>
                Watchlist
              </NavLink>
              {role === "owner" && (
                <NavLink to="/movies/create" className={linkCls}>
                  Crear
                </NavLink>
              )}
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeButton />

            {/* Desktop profile & logout */}
            {isAuth && (
              <>
                {profileName && (
                  <span className="hidden sm:inline-flex items-center rounded-xl border border-slate-300 dark:border-slate-700 px-2 py-1 text-xs text-slate-600 dark:text-slate-300">
                    Perfil: <b className="ml-1">{profileName}</b>
                  </span>
                )}
                <button onClick={handleLogout} className="btn-primary hidden md:inline-flex">
                  Salir
                </button>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {open ? (
                <XMarkIcon className="h-6 w-6 text-slate-700 dark:text-slate-200" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-slate-700 dark:text-slate-200" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden mt-2 glass p-4 rounded-xl space-y-2">
            {isAuth ? (
              <>
                {profileName && (
                  <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    Perfil: <b>{profileName}</b>
                  </div>
                )}
                <NavLink to="/movies" className={linkCls} onClick={() => setOpen(false)}>
                  Películas
                </NavLink>
                <NavLink to="/watchlist" className={linkCls} onClick={() => setOpen(false)}>
                  Watchlist
                </NavLink>
                {role === "owner" && (
                  <NavLink to="/movies/create" className={linkCls} onClick={() => setOpen(false)}>
                    Crear
                  </NavLink>
                )}
                <button onClick={handleLogout} className="btn-primary w-full">
                  Salir
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
}