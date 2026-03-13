import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Subtle ink-drop custom cursor for desktop only.
 * - Hides the native cursor via body style
 * - An organic teardrop blob follows the mouse with a spring lag
 * - Hidden on mobile (pointer: coarse) to avoid hiding the tap target
 */
const InkCursor = () => {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Spring lag gives the drop a sense of physical weight
    const x = useSpring(mouseX, { stiffness: 380, damping: 26 });
    const y = useSpring(mouseY, { stiffness: 380, damping: 26 });

    useEffect(() => {
        // Only activate on non-touch devices
        if (window.matchMedia("(pointer: coarse)").matches) return;

        document.body.style.cursor = "none";

        const move = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", move);
        return () => {
            document.body.style.cursor = "";
            window.removeEventListener("mousemove", move);
        };
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
            style={{
                x,
                y,
                // Centre the drop over the actual cursor hotspot
                translateX: "-50%",
                translateY: "-60%",
            }}
            aria-hidden="true"
        >
            <svg
                width="13"
                height="17"
                viewBox="0 0 13 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/*
          Organic ink drop — slightly asymmetric so it feels hand-drawn.
          Wide body, narrow neck at top, rounded bottom.
        */}
                <path
                    d="M6.5 0
             C6.5 0 1.2 5.8 0.4 9.5
             C-0.3 12.7 1.8 15.5 4.5 16.5
             C5.1 16.8 5.8 17 6.5 17
             C7.2 17 7.9 16.8 8.5 16.5
             C11.2 15.5 13.3 12.7 12.6 9.5
             C11.8 5.8 6.5 0 6.5 0Z"
                    fill="currentColor"
                    className="text-foreground"
                    opacity="0.55"
                />
            </svg>
        </motion.div>
    );
};

export default InkCursor;
