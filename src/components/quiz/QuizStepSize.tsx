import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface QuizStepSizeProps {
    selected: string;
    onSelect: (size: string) => void;
}

const sizeIcons = [
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="16" cy="16" r="4" /></svg>,
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="16" cy="16" r="8" /></svg>,
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="16" cy="16" r="12" /></svg>,
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1"><rect x="4" y="4" width="24" height="24" rx="2" /></svg>,
];

const QuizStepSize = ({ selected, onSelect }: QuizStepSizeProps) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h3 className="font-serif text-2xl md:text-3xl text-foreground">
                    {t.quiz.sizeTitle}
                </h3>
                <p className="text-muted-foreground text-sm">
                    {t.quiz.sizeSubtitle}
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {t.quiz.sizeOptions.map((opt, i) => {
                    const isSelected = selected === opt.value;
                    return (
                        <motion.button
                            key={opt.value}
                            onClick={() => onSelect(opt.value)}
                            className={`relative flex items-center gap-4 w-full px-5 py-4 md:px-6 md:py-5 border text-left transition-all duration-300 ${isSelected
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/60"
                                }`}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                            <div
                                className={`flex-shrink-0 transition-colors duration-300 ${isSelected ? "text-foreground" : "text-muted-foreground"
                                    }`}
                            >
                                {sizeIcons[i]}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p
                                    className={`font-serif text-lg md:text-xl transition-colors duration-300 ${isSelected ? "text-foreground" : "text-foreground/80"
                                        }`}
                                >
                                    {opt.label}
                                </p>
                                <p className="text-muted-foreground text-xs md:text-sm mt-0.5">
                                    {opt.reference}
                                </p>
                            </div>

                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                                >
                                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizStepSize;
