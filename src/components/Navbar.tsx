import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { label: t.nav.portfolio, href: "#gallery" },
    { label: t.nav.team, href: "#artists" },
    { label: t.nav.process, href: "#process" },
    { label: t.nav.safety, href: "#standards" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        <a href="#" className="font-logo text-2xl font-semibold tracking-[0.2em] text-primary">
          THE LIVING CANVAS
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300 group"
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 h-px w-full bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          ))}

          {/* Language toggle */}
          <div className="flex items-center gap-1 ml-2 border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => setLanguage("el")}
              className={`px-2 py-1 text-xs tracking-wider font-medium transition-all duration-300 ${language === "el"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              GR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 text-xs tracking-wider font-medium transition-all duration-300 ${language === "en"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border px-6 pb-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          {/* Mobile language toggle */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <button
              onClick={() => setLanguage("el")}
              className={`px-3 py-1.5 text-xs tracking-wider font-medium transition-all duration-300 ${language === "el"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground border border-border"
                }`}
            >
              GR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 text-xs tracking-wider font-medium transition-all duration-300 ${language === "en"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground border border-border"
                }`}
            >
              EN
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
