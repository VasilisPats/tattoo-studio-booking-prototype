import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { el, type Translations } from "./el";
import { en } from "./en";

type Language = "el" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
    language: "el",
    setLanguage: () => { },
    t: el,
});

const translations: Record<Language, Translations> = { el, en };

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        try {
            const stored = localStorage.getItem("tlc-lang");
            if (stored === "en" || stored === "el") return stored;
        } catch { }
        return "el";
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        try {
            localStorage.setItem("tlc-lang", lang);
        } catch { }
    };

    // Update <html lang> when language changes
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

export type { Language };
