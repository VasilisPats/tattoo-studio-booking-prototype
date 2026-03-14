import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useScrollAnimation } from "./useScrollAnimation";
import { useLanguage } from "@/i18n/LanguageContext";
import BookingForm from "./BookingForm";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const Hero = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 800], [0, -160]);
  const orbY = useTransform(scrollY, [0, 800], [0, -60]);
  const { t } = useLanguage();
  const formSectionRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section id="hero" className="min-h-screen relative flex items-center pt-20 overflow-hidden" ref={ref}>
      <motion.div
        style={{ y: orbY }}
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-3xl pointer-events-none"
      />
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <div className="space-y-4">
            <motion.p
              variants={itemVariants}
              className="text-primary text-sm tracking-[0.3em] uppercase font-medium"
            >
              {t.hero.tagline}
            </motion.p>
            <motion.h1
              variants={itemVariants}
              className="font-serif text-5xl md:text-7xl font-light leading-[1.1] text-foreground"
            >
              {t.hero.headline}
              <br />
              <span className="italic text-primary">{t.hero.headlineAccent}</span> {t.hero.headlineSuffix}
            </motion.h1>
          </div>
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground text-lg leading-relaxed max-w-lg"
          >
            {t.hero.description}
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={scrollToForm}
              className="inline-block text-center px-8 py-4 bg-primary text-primary-foreground text-sm tracking-[0.15em] uppercase font-medium hover:opacity-90 transition-opacity duration-300 pointer-events-auto"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {t.hero.cta}
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          ref={formSectionRef}
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
        >
          <motion.div
            style={{ y: imageY }}
            className="bg-background/20 backdrop-blur-xl border border-foreground/10 shadow-2xl p-6 md:p-10 will-change-transform relative"
          >
            <div className="absolute top-0 right-0 p-4">
              <div className="w-12 h-[1px] bg-primary/30" />
              <div className="h-12 w-[1px] bg-primary/30 ml-auto mt-[-1px]" />
            </div>
            
            <BookingForm variant="hero" />
          </motion.div>
          {/* Subtle Decorative Elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r border-b border-primary/20 -z-10" />
          <div className="absolute -top-6 -left-6 w-32 h-32 border-l border-t border-primary/20 -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
