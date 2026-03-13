import { useScrollAnimation } from "./useScrollAnimation";
import { Star } from "lucide-react";
import TextReveal from "./TextReveal";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
);

const ReviewCard = ({ text, name }: { text: string; name: string }) => (
    <div className="flex-shrink-0 w-[320px] md:w-[360px] select-none mx-3">
        <div className="rounded-3xl backdrop-blur-xl bg-white/[0.07] border border-white/[0.12] p-8 h-full flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <GoogleIcon />
                <div className="flex gap-0.5">
                    {[...Array(5)].map((_, s) => (
                        <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                </div>
            </div>

            <p className="text-foreground font-medium text-sm leading-relaxed flex-1">
                «{text}»
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-foreground/80 text-sm">{name}</span>
                <span className="text-muted-foreground/40 text-xs tracking-[0.1em] uppercase">
                    Verified Review
                </span>
            </div>
        </div>
    </div>
);

const Reviews = () => {
    const { ref, isVisible } = useScrollAnimation();
    const { t } = useLanguage();

    return (
        <section id="reviews" className="py-32 overflow-hidden" ref={ref}>
            <div className="max-w-7xl mx-auto px-6">
                <div
                    className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    <TextReveal
                        text={t.reviews.title}
                        className="font-serif text-4xl md:text-5xl font-light text-foreground justify-center"
                    />
                </div>
            </div>

            <div
                className={cn(
                    "relative transition-all duration-700",
                    isVisible ? "opacity-100" : "opacity-0"
                )}
            >
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

                <Marquee
                    pauseOnHover
                    className="[--duration:35s] [--gap:0rem] py-4"
                    repeat={3}
                >
                    {t.reviews.items.map((review, i) => (
                        <ReviewCard key={i} {...review} />
                    ))}
                </Marquee>
            </div>
        </section>
    );
};

export default Reviews;
