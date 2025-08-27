import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import MovieList from "../pages/MovieList";
import MovieDetail from "../pages/MovieDetail";
import MovieCreate from "../pages/MovieCreate";
import MovieEdit from "../pages/MovieEdit";
import Favorites from "../pages/Favorites"; // opcional; lo podés quitar si ya no lo usás
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/auth/Login";
import Profiles from "../pages/Profiles";
import RequireProfile from "../components/RequireProfile";
import Watchlist from "../pages/Watchlist";

export default function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/auth/login" element={<Login />} />

      {/* Protegidas por auth */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/profiles" replace />} />
        <Route path="/profiles" element={<Profiles />} />

        {/* Requieren perfil seleccionado */}
        <Route element={<RequireProfile />}>
          <Route path="/movies" element={<MovieList />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/movies/create" element={<MovieCreate />} />
          <Route path="/movies/:id/edit" element={<MovieEdit />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}