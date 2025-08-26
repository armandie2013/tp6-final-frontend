import MovieSearch from "../components/MovieSearch";

export default function Home() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Buscar películas</h1>
      <MovieSearch />
    </section>
  );
}