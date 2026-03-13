import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

interface CounterProps {
    end: number;
    suffix?: string;
    decimals?: number;
    duration?: number;
    delay?: number;
    started: boolean;
}

const Counter = ({ end, suffix = "", decimals = 0, duration = 2000, delay = 0, started }: CounterProps) => {
    const [value, setValue] = useState(0);
    const [showSuffix, setShowSuffix] = useState(false);

    useEffect(() => {
        if (!started) return;

        const timer = setTimeout(() => {
            const startTime = performance.now();

            const animate = (now: number) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // easeOut curve
                const eased = 1 - Math.pow(1 - progress, 3);
                setValue(eased * end);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setValue(end);
                    setShowSuffix(true);
                }
            };

            requestAnimationFrame(animate);
        }, delay);

        return () => clearTimeout(timer);
    }, [started, end, duration, delay]);

    return (
        <span>
            {decimals > 0 ? value.toFixed(decimals) : Math.floor(value)}
            <span
                className={`inline-block transition-all duration-500 ${showSuffix ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                    }`}
            >
                {suffix}
            </span>
        </span>
    );
};

const StatsBar = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [hasTriggered, setHasTriggered] = useState(false);
    const { t } = useLanguage();

    const stats = [
        { value: 500, suffix: "+", label: t.stats.completedTattoos, decimals: 0 },
        { value: 5.0, suffix: "★", label: t.stats.googleRating, decimals: 1 },
        { value: 8, suffix: "+", label: t.stats.yearsExperience, decimals: 0 },
        { value: 5, suffix: "", label: t.stats.artists, decimals: 0 },
    ];

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasTriggered) {
                    setHasTriggered(true);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={ref}
            className={`py-16 px-6 bg-secondary transition-opacity duration-700 ${hasTriggered ? "opacity-100" : "opacity-0"
                }`}
        >
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className={`text-center ${i < stats.length - 1 ? "md:border-r md:border-border" : ""
                                }`}
                        >
                            <p className="font-serif text-5xl md:text-6xl font-light text-foreground mb-2 tabular-nums">
                                <Counter
                                    end={stat.value}
                                    suffix={stat.suffix}
                                    decimals={stat.decimals}
                                    delay={i * 150}
                                    started={hasTriggered}
                                />
                            </p>
                            <p className="text-muted-foreground text-xs tracking-[0.2em]">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsBar;
