import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const sections = [
    { id: "hero", key: "home" as const },
    { id: "gallery", key: "portfolio" as const },
    { id: "artists", key: "team" as const },
    { id: "process", key: "process" as const },
    { id: "standards", key: "safety" as const },
    { id: "reviews", key: "reviews" as const },
    { id: "booking", key: "session" as const },
];

// Tattoo needle SVG — a fine needle pointing downward, niche-appropriate
const NeedleIcon = ({ active }: { active: boolean }) => (
    <svg
        width="10"
        height="28"
        viewBox="0 0 10 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-500"
    >
        <rect
            x="4"
            y="0"
            width="2"
            height="20"
            rx="1"
            fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.3)"}
            className="transition-colors duration-500"
        />
        <polygon
            points="5,28 3,20 7,20"
            fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.2)"}
            className="transition-colors duration-500"
        />
        <rect
            x="2"
            y="0"
            width="6"
            height="3"
            rx="1"
            fill={active ? "hsl(var(--primary) / 0.7)" : "hsl(var(--muted-foreground) / 0.2)"}
            className="transition-colors duration-500"
        />
    </svg>
);

const SectionIndicator = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        const sectionEls = sections
            .map((s) => document.getElementById(s.id))
            .filter(Boolean) as HTMLElement[];

        if (sectionEls.length === 0) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visible.length > 0) {
                    const id = visible[0].target.id;
                    const index = sections.findIndex((s) => s.id === id);
                    if (index !== -1) setActiveIndex(index);
                }
            },
            { threshold: 0.3 }
        );

        sectionEls.forEach((el) => observerRef.current?.observe(el));
        return () => observerRef.current?.disconnect();
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const needleTop = activeIndex * 32;

    return (
        <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-0">
            <div className="relative flex flex-col items-center">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border/40" />

                <div
                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1 transition-all duration-500 ease-in-out pointer-events-none z-10"
                    style={{ top: `${needleTop}px` }}
                >
                    <NeedleIcon active={true} />
                </div>

                {sections.map((section, i) => (
                    <button
                        key={section.id}
                        onClick={() => scrollTo(section.id)}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="relative flex items-center group w-6 h-8 justify-center"
                        aria-label={`Scroll to ${t.sections[section.key]}`}
                    >
                        <span
                            className={`block w-1.5 h-1.5 rounded-full transition-all duration-300 z-20 ${i === activeIndex
                                ? "bg-primary scale-125"
                                : "bg-muted-foreground/25 group-hover:bg-muted-foreground/60"
                                }`}
                        />

                        <span
                            className={`absolute left-8 text-[10px] tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-200 pointer-events-none ${hoveredIndex === i
                                ? "opacity-100 translate-x-0 text-primary"
                                : "opacity-0 -translate-x-1 text-muted-foreground"
                                }`}
                        >
                            {t.sections[section.key]}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SectionIndicator;
