import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const SETTINGS_KEY = "careerPilotSettings";
const ThemeContext = createContext(null);

// Login / signup pages keep their own fixed design (no dark mode).
const LIGHT_ONLY_PATHS = ["/", "/signin"];

function readTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    return ["light", "dark", "system"].includes(saved.theme) ? saved.theme : "light";
  } catch {
    return "light";
  }
}

function saveTheme(theme) {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...saved, theme }));
  } catch {
    // storage unavailable - theme just won't persist
  }
}

export function ThemeProvider({ children }) {
  const { pathname } = useLocation();
  const [theme, setThemeState] = useState(readTheme);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );

  // Follow the operating system when theme === "system"
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;
    const onChange = (e) => setSystemDark(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const darkMode = theme === "dark" || (theme === "system" && systemDark);
  const applyDark = darkMode && !LIGHT_ONLY_PATHS.includes(pathname);

  // Put the "dark" class on <html> so every page can be styled
  useEffect(() => {
    document.documentElement.classList.toggle("dark", applyDark);
  }, [applyDark]);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    saveTheme(next);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setTheme(darkMode ? "light" : "dark");
  }, [darkMode, setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, darkMode, toggleDarkMode }),
    [theme, setTheme, darkMode, toggleDarkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
