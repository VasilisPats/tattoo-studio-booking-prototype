import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "./useScrollAnimation";
import InkSplash from "./InkSplash";
import TextReveal from "./TextReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const styleKeys = [
  "realism", "fineLine", "traditional", "japanese", "blackwork",
  "neoTraditional", "geometric", "sketch", "minimalist", "piercings",
] as const;

type StyleKey = typeof styleKeys[number];

const works: { id: number; styleKey: StyleKey; artist: string; placementKey: string; image: string }[] = [
  { id: 1, styleKey: "realism", artist: "Cap", placementKey: "arm", image: "/images/gallery/realism-1.webp" },
  { id: 2, styleKey: "fineLine", artist: "Anne", placementKey: "wrist", image: "/images/gallery/fineline-1.webp" },
  { id: 3, styleKey: "japanese", artist: "Zen", placementKey: "back", image: "/images/gallery/japanese-1.webp" },
  { id: 4, styleKey: "blackwork", artist: "Jax", placementKey: "chest", image: "/images/gallery/blackwork-1.webp" },
  { id: 5, styleKey: "traditional", artist: "Rox", placementKey: "leg", image: "/images/gallery/traditional-1.webp" },
  { id: 6, styleKey: "realism", artist: "Cap", placementKey: "shoulder", image: "/images/gallery/realism-1.webp" },
  { id: 7, styleKey: "fineLine", artist: "Anne", placementKey: "ankle", image: "/images/gallery/fineline-1.webp" },
  { id: 8, styleKey: "japanese", artist: "Zen", placementKey: "arm", image: "/images/gallery/japanese-1.webp" },
  { id: 9, styleKey: "blackwork", artist: "Jax", placementKey: "forearm", image: "/images/gallery/blackwork-1.webp" },
  { id: 10, styleKey: "neoTraditional", artist: "Rox", placementKey: "arm", image: "/images/gallery/neotrad-1.webp" },
  { id: 11, styleKey: "geometric", artist: "Jax", placementKey: "forearm", image: "/images/gallery/geometric-1.webp" },
  { id: 12, styleKey: "sketch", artist: "Cap", placementKey: "shoulder", image: "/images/gallery/sketch-1.webp" },
  { id: 13, styleKey: "minimalist", artist: "Anne", placementKey: "wrist", image: "/images/gallery/minimalist-1.webp" },
  { id: 14, styleKey: "piercings", artist: "Rox", placementKey: "ear", image: "/images/gallery/piercings-1.webp" },
  { id: 15, styleKey: "neoTraditional", artist: "Rox", placementKey: "leg", image: "/images/gallery/neotrad-1.webp" },
  { id: 16, styleKey: "geometric", artist: "Jax", placementKey: "chest", image: "/images/gallery/geometric-1.webp" },
  { id: 17, styleKey: "sketch", artist: "Cap", placementKey: "back", image: "/images/gallery/sketch-1.webp" },
  { id: 18, styleKey: "minimalist", artist: "Anne", placementKey: "ankle", image: "/images/gallery/minimalist-1.webp" },
];

const Gallery = () => {
  const [active, setActive] = useState<StyleKey>(styleKeys[0]);
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useLanguage();

  const filtered = works.filter((w) => w.styleKey === active);

  return (
    <section id="gallery" className="py-32 px-6 relative overflow-hidden" ref={ref}>
      <InkSplash variant={1} className="w-[400px] h-[400px] -top-16 -left-20" speed={0.25} opacity={0.04} />
      <InkSplash variant={3} className="w-[300px] h-[300px] -top-8 -right-16" speed={0.4} opacity={0.03} flip />
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">{t.gallery.subtitle}</p>
          <TextReveal text={t.gallery.title} className="font-serif text-4xl md:text-5xl font-light text-foreground justify-center" />
        </div>

        {/* Filter tabs */}
        <div
          className={`flex flex-wrap justify-center gap-2 mb-12 transition-all duration-700 delay-200 ${isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          {styleKeys.map((key) => {
            const label = t.gallery.styles[key];
            const subtitle = t.gallery.styleSubtitles[key];
            return (
              <motion.button
                key={key}
                onClick={() => setActive(key)}
                className={`px-5 py-3 text-center transition-all duration-300 ${active === key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="block text-sm tracking-[0.1em] uppercase font-medium">
                  {label}
                </span>
                {subtitle && (
                  <span
                    className={`block text-xs mt-0.5 ${active === key
                      ? "text-primary-foreground/60"
                      : "text-muted-foreground/50"
                      }`}
                  >
                    {subtitle}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((work) => {
            const styleName = t.gallery.styles[work.styleKey];
            const placementName = t.gallery.placements[work.placementKey] || work.placementKey;
            return (
              <motion.div
                key={work.id}
                className="group relative aspect-square bg-secondary overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {work.image ? (
                  <img
                    src={work.image}
                    alt={`${styleName} tattoo — ${placementName}`}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground/30 font-serif text-lg">{styleName}</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div className="space-y-1">
                    <p className="text-primary text-xs tracking-[0.2em] uppercase">{styleName}</p>
                    <p className="text-foreground text-sm font-medium">{work.artist}</p>
                    <p className="text-muted-foreground text-xs">{placementName}</p>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/0 group-hover:border-primary/50 transition-all duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
