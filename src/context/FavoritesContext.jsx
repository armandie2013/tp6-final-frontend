import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favoritos, setFavoritos] = useState(() => {
    const raw = localStorage.getItem("favoritosPeliculas");
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem("favoritosPeliculas", JSON.stringify(favoritos));
  }, [favoritos]);

  const agregarFavorito = (movie) => {
    if (!favoritos.find((m) => m.id === movie.id)) {
      setFavoritos((prev) => [...prev, movie]);
      toast.success("Agregada a favoritos");
    } else {
      toast.info("Ya está en favoritos", { toastId: `fav-${movie.id}` });
    }
  };

  const eliminarFavorito = (id) =>
    setFavoritos((prev) => prev.filter((m) => m.id !== id));

  const eliminarTodos = () => setFavoritos([]);

  const isFavorito = (id) => favoritos.some((m) => m.id === id); //

  return (
    <FavoritesContext.Provider
      value={{ favoritos, agregarFavorito, eliminarFavorito, eliminarTodos, isFavorito }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavoritos = () => useContext(FavoritesContext);