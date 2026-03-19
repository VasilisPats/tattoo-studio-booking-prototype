import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeType = "modern" | "punk" | "minimalist" | "occult";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "modern",
  setTheme: () => null,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    // 1. Check URL parameters
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get("theme") as ThemeType | null;
      if (urlTheme === "punk" || urlTheme === "modern" || urlTheme === "minimalist" || urlTheme === "occult") {
        return urlTheme;
      }
    } catch {}

    // 2. Check local storage
    try {
      const stored = localStorage.getItem("app-theme") as ThemeType | null;
      if (stored === "punk" || stored === "modern" || stored === "minimalist" || stored === "occult") {
        return stored;
      }
    } catch {}

    return "modern";
  });

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("app-theme", newTheme);
    } catch {}
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-modern", "theme-punk", "theme-minimalist", "theme-occult");
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
