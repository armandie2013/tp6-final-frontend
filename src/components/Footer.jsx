export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 dark:border-slate-700 py-6 text-center text-sm text-slate-600 dark:text-slate-300">
      <p>
        Hecho por Diego • {new Date().getFullYear()} • React + Vite + Tailwind CSS
      </p>
    </footer>
  );
}