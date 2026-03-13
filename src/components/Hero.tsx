import { motion, useScroll, useTransform } from "framer-motion";
import { useScrollAnimation } from "./useScrollAnimation";
import { useLanguage } from "@/i18n/LanguageContext";

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
            <motion.a
              href="#booking"
              className="inline-block text-center px-8 py-4 bg-primary text-primary-foreground text-sm tracking-[0.15em] uppercase font-medium hover:opacity-90 transition-opacity duration-300"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {t.hero.cta}
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
        >
          <motion.div
            style={{ y: imageY }}
            className="aspect-[3/4] bg-secondary relative overflow-hidden will-change-transform"
          >
            <img
              src="/hero-canvas.png"
              alt="The Living Canvas — a seamless fusion of all tattoo styles on a single living canvas"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </motion.div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 border-l-2 border-b-2 border-primary/30" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
