import { motion } from "framer-motion";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onAnimationComplete={(definition: { opacity?: number }) => {
                if (definition.opacity === 0) onComplete();
            }}
        >
            <div className="flex flex-col items-center gap-8">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="text-center"
                >
                    <h1 className="font-logo text-3xl md:text-4xl font-semibold tracking-[0.25em] text-primary">
                        THE LIVING CANVAS
                    </h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                        className="text-muted-foreground text-xs tracking-[0.3em] uppercase mt-3"
                    >
                        Premium Tattoo Studio
                    </motion.p>
                </motion.div>

                {/* Loading dots */}
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-primary/60"
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
