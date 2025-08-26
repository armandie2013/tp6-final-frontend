import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeButton from "./ThemeButton";

export default function Navbar() {
  const { isAuth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  const linkCls = ({ isActive }) =>
    `px-3 py-1 rounded ${isActive ? "bg-slate-200 dark:bg-slate-700" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`;

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
            </>
          )}
          <ThemeButton />
          {!isAuth ? (
            <NavLink to="/auth/login" className={linkCls}>Ingresar</NavLink>
          ) : (
            <button onClick={handleLogout} className="px-3 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              Salir
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
