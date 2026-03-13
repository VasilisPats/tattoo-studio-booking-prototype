import { useRef, ElementType } from "react";
import { motion, useInView } from "framer-motion";

interface TextRevealProps {
    text: string;
    className?: string;
    as?: ElementType;
    delay?: number;
    stagger?: number;
}

/**
 * Splits text into words. Each word slides up from behind an invisible mask
 * when the element enters the viewport (fires once).
 *
 * Technique: each word is wrapped in `overflow-hidden` (the "mask"),
 * and its inner span animates from y=105% to y=0 — so the text
 * emerges cleanly upward, revealing itself like a theatre curtain.
 */
const TextReveal = ({
    text,
    className = "",
    as: Tag = "h2",
    delay = 0,
    stagger = 0.09,
}: TextRevealProps) => {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref as React.RefObject<Element>, {
        once: true,
        margin: "-10% 0px",
    });

    const words = text.split(" ");

    return (
        <Tag
            ref={ref}
            className={`overflow-hidden ${className}`}
            aria-label={text}
        >
            {words.map((word, i) => (
                // Outer span: the invisible mask (overflow-hidden clips what's below)
                <span key={i} className="inline-block overflow-hidden align-bottom">
                    <motion.span
                        className="inline-block"
                        initial={{ y: "110%" }}
                        animate={isInView ? { y: "0%" } : { y: "110%" }}
                        transition={{
                            duration: 0.75,
                            ease: [0.16, 1, 0.3, 1], // expo-out: snappy start, silky finish
                            delay: delay + i * stagger,
                        }}
                    >
                        {word}
                    </motion.span>
                    {/* Space between words (not inside the animated span to avoid clipping) */}
                    {i < words.length - 1 && "\u00A0"}
                </span>
            ))}
        </Tag>
    );
};

export default TextReveal;
