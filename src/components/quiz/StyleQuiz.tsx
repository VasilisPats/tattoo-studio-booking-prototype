import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import QuizStepStyle from "./QuizStepStyle";
import QuizStepBody from "./QuizStepBody";
import QuizStepSize from "./QuizStepSize";
import { useLanguage } from "@/i18n/LanguageContext";

export interface QuizData {
    style: string;
    zones: string[];
    size: string;
}

interface StyleQuizProps {
    onComplete: (data: QuizData) => void;
    onStepChange?: (step: number) => void;
}

const TOTAL_STEPS = 3;

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 120 : -120,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -120 : 120,
        opacity: 0,
    }),
};

const StyleQuiz = ({ onComplete, onStepChange, initialStep = 0 }: StyleQuizProps & { initialStep?: number }) => {
    const [step, setStep] = useState(initialStep);
    const [direction, setDirection] = useState(1);
    const [quiz, setQuiz] = useState<QuizData>({
        style: "",
        zones: [],
        size: "",
    });
    const { t } = useLanguage();

    const canProceed = () => {
        if (step === 0) return quiz.style !== "";
        if (step === 1) return quiz.zones.length > 0;
        if (step === 2) return quiz.size !== "";
        return false;
    };

    const next = () => {
        if (!canProceed()) return;
        if (step === TOTAL_STEPS - 1) {
            onComplete(quiz);
            return;
        }
        setDirection(1);
        const nextStep = step + 1;
        setStep(nextStep);
        if (onStepChange) onStepChange(nextStep);
    };

    const prev = () => {
        if (step === 0) return;
        setDirection(-1);
        const nextStep = step - 1;
        setStep(nextStep);
        if (onStepChange) onStepChange(nextStep);
    };

    return (
        <div className="space-y-8">
            {/* Progress dots removed for unified tracking in parent */}

            {/* Step content with animation */}
            <div className="relative overflow-hidden min-h-[380px]">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={step}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {step === 0 && (
                            <QuizStepStyle
                                selected={quiz.style}
                                onSelect={(style) => setQuiz((q) => ({ ...q, style }))}
                            />
                        )}
                        {step === 1 && (
                            <QuizStepBody
                                selectedZones={quiz.zones}
                                onSelect={(zones) => setQuiz((q) => ({ ...q, zones }))}
                            />
                        )}
                        {step === 2 && (
                            <QuizStepSize
                                selected={quiz.size}
                                onSelect={(size) => setQuiz((q) => ({ ...q, size }))}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center">
                {step > 0 ? (
                    <motion.button
                        onClick={prev}
                        className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <ChevronLeft size={16} /> {t.quiz.back}
                    </motion.button>
                ) : (
                    <div />
                )}

                <motion.button
                    onClick={next}
                    disabled={!canProceed()}
                    className={`flex items-center gap-2 px-8 py-3 text-sm tracking-[0.1em] uppercase transition-all duration-300 ${canProceed()
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "bg-border text-muted-foreground cursor-not-allowed"
                        }`}
                    whileHover={canProceed() ? { scale: 1.04 } : {}}
                    whileTap={canProceed() ? { scale: 0.97 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    {t.quiz.next} <ChevronRight size={16} />
                </motion.button>
            </div>
        </div>
    );
};

export default StyleQuiz;
