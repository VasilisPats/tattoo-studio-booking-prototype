import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    tiltDegree?: number;
}

/**
 * Wraps children in a 3D tilt container that responds to mouse movement.
 * On hover, the card rotates toward the cursor (max `tiltDegree` degrees).
 * A subtle gloss follows the cursor to simulate light reflection.
 * Returns to flat on mouse leave via framer-motion springs.
 */
const TiltCard = ({ children, className = "", tiltDegree = 10 }: TiltCardProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [shine, setShine] = useState({ x: 50, y: 50 });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Springs make the movement feel elastic and physical
    const xSpring = useSpring(mouseX, { stiffness: 250, damping: 25 });
    const ySpring = useSpring(mouseY, { stiffness: 250, damping: 25 });

    // Map -0.5 → +0.5 mouse offset to tilt angles
    const rotateX = useTransform(ySpring, [-0.5, 0.5], [`${tiltDegree}deg`, `-${tiltDegree}deg`]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], [`-${tiltDegree}deg`, `${tiltDegree}deg`]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
        setShine({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        // Outer div provides the CSS perspective depth
        <div className={className} style={{ perspective: "1000px" }}>
            <motion.div
                ref={ref}
                className="w-full h-full"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
            >
                {children}

                {/* Gloss layer: light reflection that moves with the cursor */}
                <div
                    className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 rounded-[inherit]"
                    style={{
                        opacity: isHovered ? 1 : 0,
                        background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
                    }}
                />
            </motion.div>
        </div>
    );
};

export default TiltCard;
