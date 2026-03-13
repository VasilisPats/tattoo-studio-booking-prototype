import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface QuizStepBodyProps {
    selectedZones: string[];
    onSelect: (zones: string[]) => void;
}

const QuizStepBody = ({ selectedZones, onSelect }: QuizStepBodyProps) => {
    const { t } = useLanguage();

    const toggleZone = (zoneName: string) => {
        const updated = selectedZones.includes(zoneName)
            ? selectedZones.filter((z) => z !== zoneName)
            : [...selectedZones, zoneName];
        onSelect(updated);
    };

    const renderChip = (zone: string) => {
        const isSelected = selectedZones.includes(zone);
        return (
            <motion.button
                key={zone}
                onClick={() => toggleZone(zone)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs md:text-sm border transition-all duration-200 whitespace-nowrap ${isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary/30 text-foreground/80 hover:border-primary/40 hover:bg-secondary/60"
                    }`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
                {isSelected && (
                    <motion.span
                        initial={{ scale: 0, width: 0 }}
                        animate={{ scale: 1, width: "auto" }}
                        className="inline-flex"
                    >
                        <Check className="w-3 h-3" />
                    </motion.span>
                )}
                {zone}
            </motion.button>
        );
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h3 className="font-serif text-2xl md:text-3xl text-foreground">
                    {t.quiz.bodyTitle}
                </h3>
                <p className="text-muted-foreground text-sm">
                    {t.quiz.bodySubtitle}
                </p>
            </div>

            {/* Upper Body */}
            <div className="space-y-2.5">
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    {t.quiz.upperBody}
                </p>
                <div className="flex flex-wrap gap-2">
                    {t.quiz.upperBodyZones.map(renderChip)}
                </div>
            </div>

            {/* Lower Body */}
            <div className="space-y-2.5">
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    {t.quiz.lowerBody}
                </p>
                <div className="flex flex-wrap gap-2">
                    {t.quiz.lowerBodyZones.map(renderChip)}
                </div>
            </div>
        </div>
    );
};

export default QuizStepBody;
