import AppRouter from "./router/AppRouter";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <div className="min-h-screen app-bg bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-12">
        <AppRouter />
      </main>
      <Footer />

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}