import { useTheme } from "@/contexts/ThemeContext";

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
            <span className="bg-background text-foreground px-3 py-1.5 text-xs uppercase tracking-widest font-bold shadow-md border-2 border-primary rounded-sm animate-pulse">
                Switch style here! 👇
            </span>
            <div className="flex bg-background border-2 border-border p-1 shadow-lg 
            rounded-none overflow-hidden theme-transition-group">
                <button
                    onClick={() => setTheme("modern")}
                    className={`px-5 py-2.5 text-sm font-semibold transition-colors uppercase ${
                        theme === "modern" ? "bg-primary text-primary-foreground border-2 border-primary" : "hover:bg-muted border-2 border-transparent"
                    }`}
                >
                    Base
                </button>
                <button
                    onClick={() => setTheme("minimalist")}
                    className={`px-5 py-2.5 text-sm font-semibold transition-colors uppercase tracking-[0.1em] font-serif ${
                        theme === "minimalist" ? "bg-[#C4A484] text-[#2C2A29] border-2 border-[#C4A484]" : "hover:bg-muted border-2 border-transparent"
                    }`}
                >
                    Minimalist
                </button>
                <button
                    onClick={() => setTheme("punk")}
                    className={`px-5 py-2.5 text-lg font-semibold transition-colors font-['Permanent_Marker'] tracking-wide ${
                        theme === "punk" ? "bg-[#e60000] text-white border-2 border-white" : "hover:bg-muted border-2 border-transparent"
                    }`}
                >
                    PUNK!
                </button>
                <button
                    onClick={() => setTheme("occult")}
                    className={`px-5 py-2.5 text-lg font-semibold transition-colors uppercase font-['UnifrakturMaguntia'] tracking-widest ${
                        theme === "occult" ? "bg-black text-white border-2 border-white" : "hover:bg-muted border-2 border-transparent"
                    }`}
                >
                    Occult
                </button>
            </div>
        </div>
    );
};
