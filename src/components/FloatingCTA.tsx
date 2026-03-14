import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const FloatingCTA = () => {
    const [visible, setVisible] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            const heroEl = document.getElementById("hero");
            const heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : window.innerHeight;

            // Show when the hero section (which contains the form) is out of view
            setVisible(heroBottom < 100);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.a
                    href="#hero"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground text-sm tracking-[0.12em] uppercase font-medium shadow-lg shadow-primary/20"
                >
                    <span>{t.floatingCta}</span>
                    <ArrowUp size={14} className="animate-bounce" />

                    <span className="absolute inset-0 border border-primary/30 animate-ping opacity-20 pointer-events-none" />
                </motion.a>
            )}
        </AnimatePresence>
    );
};

export default FloatingCTA;
