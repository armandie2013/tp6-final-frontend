import AppRouter from "./router/AppRouter";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ⬇️ importar estilos y contenedor de Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <AppRouter />
      </main>
      <Footer />

      {/* ⬇️ MUY IMPORTANTE */}
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}