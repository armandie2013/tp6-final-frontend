import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-black dark:text-white rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300"
    >
      {theme === "light" ? (
        <>
          <Moon size={18} />
        </>
      ) : (
        <>
          <Sun size={18} />
        </>
      )}
    </button>
  );
};

export default ThemeButton;
