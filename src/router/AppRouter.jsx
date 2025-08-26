import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import MovieList from "../pages/MovieList";
import MovieDetail from "../pages/MovieDetail";
import MovieCreate from "../pages/MovieCreate";
import MovieEdit from "../pages/MovieEdit";
import Favorites from "../pages/Favorites"; // luego lo reemplazamos
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/auth/Login";
import Profiles from "../pages/Profiles"; // la creamos en el paso 3
import Watchlist from "../pages/Watchlist"; // la creamos en el paso 5

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      {/* Puedes agregar /auth/register si querés */}

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/profiles" replace />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/movies/create" element={<MovieCreate />} />
        <Route path="/movies/:id/edit" element={<MovieEdit />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}