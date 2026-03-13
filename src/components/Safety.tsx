import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useScrollAnimation } from "./useScrollAnimation";
import InkSplash from "./InkSplash";
import TextReveal from "./TextReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const Safety = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const handleEnter = (i: number) => setOpenIndex(i);
  const handleLeave = () => setOpenIndex(null);

  return (
    <section id="standards" className="py-32 px-6 bg-card relative overflow-hidden" ref={ref}>
      <InkSplash variant={2} className="w-[500px] h-[500px] -bottom-24 -left-32" speed={0.35} opacity={0.03} />
      <InkSplash variant={4} className="w-[350px] h-[350px] top-8 -right-20" speed={0.2} opacity={0.04} flip />
      <div className="max-w-3xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <TextReveal text={t.safety.title} className="font-serif text-4xl md:text-5xl font-light text-foreground justify-center" />
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
            {t.safety.description}
          </p>
        </div>

        <div className="space-y-0">
          {t.safety.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`border-b border-border transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                style={{ transitionDelay: `${i * 80}ms` }}
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={handleLeave}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div
                  className="w-full flex items-center gap-4 py-5 text-left group cursor-default"
                >
                  <div className="w-7 h-7 rounded-full border border-primary/40 flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors duration-300">
                    <Check className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      <span className="text-muted-foreground/50 text-xs tracking-[0.15em] uppercase hidden sm:inline">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground/40 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                      }`}
                    strokeWidth={1.5}
                  />
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-32 opacity-100 pb-5" : "max-h-0 opacity-0"
                    }`}
                >
                  <p className="text-muted-foreground text-sm leading-relaxed pl-11">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Safety;
