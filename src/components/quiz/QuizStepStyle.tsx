import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface QuizStepStyleProps {
    selected: string;
    onSelect: (style: string) => void;
}

const styleIcons: Record<string, JSX.Element> = {
    "Fine Line": (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1">
            <line x1="6" y1="36" x2="42" y2="12" strokeLinecap="round" />
            <circle cx="12" cy="32" r="2" fill="currentColor" opacity="0.3" />
            <circle cx="36" cy="16" r="1.5" fill="currentColor" opacity="0.3" />
        </svg>
    ),
    "Realism": (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="24" cy="24" r="14" />
            <circle cx="24" cy="24" r="9" opacity="0.5" />
            <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.25" />
            <path d="M20 18 Q24 14 28 18" strokeLinecap="round" opacity="0.4" />
        </svg>
    ),
    "Blackwork": (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="currentColor">
            <rect x="12" y="12" width="24" height="24" rx="2" />
            <rect x="18" y="18" width="12" height="12" rx="1" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
        </svg>
    ),
    "Japanese": (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M8 32 Q14 24 20 28 Q26 32 32 24 Q38 16 42 20" strokeLinecap="round" />
            <path d="M10 36 Q16 28 22 32 Q28 36 34 28 Q40 20 44 24" strokeLinecap="round" opacity="0.4" />
            <circle cx="18" cy="18" r="5" opacity="0.5" />
            <circle cx="18" cy="18" r="2" fill="currentColor" opacity="0.2" />
        </svg>
    ),
    "Traditional": (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="24,6 29,18 42,20 32,30 35,42 24,36 13,42 16,30 6,20 19,18" />
            <polygon points="24,14 27,22 35,23 29,28 31,36 24,32 17,36 19,28 13,23 21,22" fill="currentColor" opacity="0.15" />
        </svg>
    ),
    "Geometric": (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1">
            <polygon points="24,8 40,36 8,36" />
            <polygon points="24,16 34,34 14,34" opacity="0.4" />
            <circle cx="24" cy="28" r="4" opacity="0.3" />
        </svg>
    ),
};

const styleNames = ["Fine Line", "Realism", "Blackwork", "Japanese", "Traditional", "Geometric"] as const;
const descriptorKeys = ["fineLine", "realism", "blackwork", "japanese", "traditional", "geometric"] as const;

const QuizStepStyle = ({ selected, onSelect }: QuizStepStyleProps) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h3 className="font-serif text-2xl md:text-3xl text-foreground">
                    {t.quiz.styleTitle}
                </h3>
                <p className="text-muted-foreground text-sm">
                    {t.quiz.styleSubtitle}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {styleNames.map((name, i) => {
                    const isSelected = selected === name;
                    const descriptorKey = descriptorKeys[i];
                    return (
                        <motion.button
                            key={name}
                            onClick={() => onSelect(name)}
                            className={`relative flex flex-col items-center gap-3 p-5 md:p-6 border text-center transition-all duration-300 ${isSelected
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/60"
                                }`}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                                >
                                    <Check className="w-3 h-3 text-primary-foreground" />
                                </motion.div>
                            )}

                            <div
                                className={`transition-colors duration-300 ${isSelected ? "text-foreground" : "text-muted-foreground"
                                    }`}
                            >
                                {styleIcons[name]}
                            </div>

                            <div className="space-y-1">
                                <p
                                    className={`font-serif text-base md:text-lg transition-colors duration-300 ${isSelected ? "text-foreground" : "text-foreground/80"
                                        }`}
                                >
                                    {name}
                                </p>
                                <p className="text-muted-foreground text-xs leading-tight">
                                    {t.quiz.descriptors[descriptorKey]}
                                </p>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizStepStyle;
