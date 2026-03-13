import { motion } from "framer-motion";
import { Instagram, ArrowUp } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-logo text-2xl text-primary tracking-[0.15em]">THE LIVING CANVAS</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t.footer.description}
            </p>
            <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium">
              {t.footer.appointmentOnly}
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-foreground text-sm tracking-[0.2em] uppercase">{t.footer.contactTitle}</h4>
            <div className="space-y-2 text-muted-foreground text-sm">
              <p>{t.footer.address}</p>
              <p>+30 210 123 4567</p>
              <p>info@thelivingcanvas.gr</p>
            </div>
          </div>

          {/* Hours & Social */}
          <div className="space-y-4">
            <h4 className="text-foreground text-sm tracking-[0.2em] uppercase">{t.footer.hoursTitle}</h4>
            <div className="space-y-2 text-muted-foreground text-sm">
              <p>{t.footer.weekdays}</p>
              <p>{t.footer.saturday}</p>
              <p>{t.footer.sunday}</p>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.15, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Instagram size={20} strokeWidth={1.5} />
              </motion.a>
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                TikTok
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex items-center justify-between">
          <p className="text-muted-foreground/50 text-xs">
            {t.footer.copyright}
          </p>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
