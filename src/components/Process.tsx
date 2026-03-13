import { MessageSquare, PenTool, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "./useScrollAnimation";
import TextReveal from "./TextReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const icons = [MessageSquare, PenTool, Sparkles, Heart];

const Process = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useLanguage();

  return (
    <section id="process" className="py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <TextReveal text={t.process.title} className="font-serif text-4xl md:text-5xl font-light text-foreground justify-center" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-border" />

          {t.process.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                className={`text-center relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: `${i * 150}ms` }}
                whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(0,0,0,0.15)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-24 h-24 mx-auto mb-6 border border-border flex items-center justify-center bg-background relative z-10">
                  <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                </div>
                <p className="text-primary text-xs tracking-[0.2em] uppercase mb-2">0{i + 1}</p>
                <h3 className="font-serif text-xl text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-16 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <motion.a
            href="#booking"
            className="inline-block px-10 py-4 bg-primary text-primary-foreground text-sm tracking-[0.15em] uppercase font-medium hover:opacity-90 transition-opacity duration-300"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {t.process.cta}
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Process;
