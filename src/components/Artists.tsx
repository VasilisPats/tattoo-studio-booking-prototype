import { useRef, useState, useCallback } from "react";
import { useScrollAnimation } from "./useScrollAnimation";
import { GripHorizontal } from "lucide-react";
import TiltCard from "./TiltCard";
import TextReveal from "./TextReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const artistKeys = ["cap", "anne", "jax", "rox", "zen"] as const;

const artists = [
  { alias: "Cap", key: "cap" as const, image: "/images/artists/cap.webp" },
  { alias: "Anne", key: "anne" as const, image: "/images/artists/anne.webp" },
  { alias: "Jax", key: "jax" as const, image: "/images/artists/jax.webp" },
  { alias: "Rox", key: "rox" as const, image: "/images/artists/rox.webp" },
  { alias: "Zen", key: "zen" as const, image: "/images/artists/zen.webp" },
];

const Artists = () => {
  const { ref, isVisible } = useScrollAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { t } = useLanguage();

  const updateMousePos = useCallback((e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    const rect = carouselRef.current.getBoundingClientRect();
    const x = Math.max(40, Math.min(e.clientX - rect.left, rect.width - 40));
    const y = Math.max(40, Math.min(e.clientY - rect.top, rect.height - 40));
    setMousePos({ x, y });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovering(false);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovering(true);
    updateMousePos(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updateMousePos(e);

    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section id="artists" className="py-32 bg-card overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <p className="text-primary text-sm tracking-[0.3em] mb-4">{t.artists.subtitle}</p>
          <TextReveal text={t.artists.title} className="font-serif text-4xl md:text-5xl font-light text-foreground justify-center" />
        </div>
      </div>

      {/* Carousel container */}
      <div
        ref={carouselRef}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Dynamic DRAG indicator - follows mouse */}
        <div
          className={`absolute z-20 pointer-events-none transition-opacity duration-300 ${isHovering && isVisible ? "opacity-100" : "opacity-0"
            }`}
          style={{
            left: mousePos.x,
            top: mousePos.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className={`w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transition-transform duration-200 ${isDragging ? "scale-90" : "scale-100"
              }`}
          >
            <GripHorizontal size={16} strokeWidth={2} />
          </div>
        </div>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className={`flex gap-5 px-6 md:pl-12 md:pr-6 overflow-x-auto cursor-none active:cursor-none scrollbar-hide transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"
            }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {artists.map((artist) => (
            <TiltCard
              key={artist.alias}
              className="flex-shrink-0 w-[320px] md:w-[360px] select-none group"
              tiltDegree={8}
            >
              <div className="aspect-[3/4] relative overflow-hidden w-full">
                <img
                  src={artist.image}
                  alt={`${artist.alias} — Tattoo Artist`}
                  className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />

                {/* Glassmorphism container at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-xl bg-white/10 border-t border-white/20">
                  <div className="space-y-2">
                    <h3 className="text-white text-xl leading-tight">
                      <span className="font-bold tracking-wide">{artist.alias}</span>
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {t.artists.styles[artist.key]}
                    </p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
              </div>
            </TiltCard>
          ))}

          {/* Right spacer */}
          <div className="flex-shrink-0 w-6" />
        </div>
      </div>
    </section>
  );
};

export default Artists;
