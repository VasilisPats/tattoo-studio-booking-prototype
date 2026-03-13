import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type InkVariant = 1 | 2 | 3 | 4;

interface InkSplashProps {
    variant?: InkVariant;
    className?: string;
    speed?: number; // 0.1 (slow) to 1 (same as scroll)
    opacity?: number;
    scale?: number;
    flip?: boolean;
}

// Four unique organic ink-blob SVG paths
const paths: Record<InkVariant, string> = {
    1: "M60.5,-78.6C76.7,-67.8,87.2,-49.4,91.1,-29.7C95,-9.9,92.3,11.2,84.2,29.6C76.1,48.1,62.5,63.9,45.6,74.6C28.7,85.3,8.3,90.8,-12.1,89.2C-32.5,87.5,-52.9,78.7,-67.9,64.2C-82.9,49.7,-92.5,29.5,-93.1,8.8C-93.7,-11.9,-85.4,-33.1,-72.1,-49.1C-58.8,-65.1,-40.6,-75.8,-21.7,-80.3C-2.9,-84.8,16.6,-83.1,34.3,-77.3C52,-71.5,68,-89.4,60.5,-78.6Z",
    2: "M54.2,-72.1C67.3,-59.5,72.2,-40.2,75.8,-20.9C79.4,-1.6,81.7,17.7,76.1,34.5C70.5,51.4,57,65.9,40.9,74.9C24.9,84,6.4,87.6,-12.8,85.5C-32.1,83.4,-52.1,75.7,-65.3,62C-78.5,48.3,-84.9,28.7,-84.4,9.3C-83.9,-10.1,-76.4,-29.3,-64.2,-43.7C-51.9,-58.1,-34.9,-67.7,-17,-72.6C0.9,-77.4,18.8,-77.4,34.2,-73C49.7,-68.5,63.7,-59.6,54.2,-72.1Z",
    3: "M47.5,-63.2C60.8,-52.1,70.3,-37.3,75.6,-20.5C80.9,-3.8,81.9,14.9,75.8,30.5C69.7,46.1,56.4,58.6,41.1,67.8C25.8,77,8.5,82.9,-9.6,83.3C-27.7,83.7,-46.6,78.5,-59.2,67.3C-71.8,56,-78.1,38.6,-80.5,20.4C-82.8,2.2,-81.1,-16.8,-73.4,-31.9C-65.6,-47,-51.8,-58.2,-37,-66.3C-22.1,-74.4,-6.4,-79.4,9.4,-78.5C25.2,-77.6,41.2,-70.8,47.5,-63.2Z",
    4: "M52.3,-68.1C65.9,-58.3,74.4,-42.1,78.6,-24.7C82.8,-7.4,82.7,11.2,76.4,26.9C70.1,42.5,57.5,55.2,42.9,64.8C28.3,74.4,11.6,80.9,-5.8,81.1C-23.2,81.4,-41.3,75.4,-55.6,64.3C-70,53.2,-80.6,37.1,-83.5,19.7C-86.4,2.3,-81.7,-16.4,-72.1,-31.2C-62.6,-46,-48.4,-56.9,-33.7,-66.3C-19,-75.7,-3.8,-83.6,12.4,-84.5C28.7,-85.4,45.8,-79.3,52.3,-68.1Z",
};

const InkSplash = ({
    variant = 1,
    className = "",
    speed = 0.3,
    opacity = 0.05,
    scale = 1,
    flip = false,
}: InkSplashProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", `${-speed * 100}%`]);

    return (
        <div ref={ref} className={`absolute pointer-events-none select-none ${className}`}>
            <motion.div style={{ y }}>
                <svg
                    viewBox="-100 -100 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        opacity,
                        transform: `scale(${scale}) ${flip ? "scaleX(-1)" : ""}`,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <path d={paths[variant]} fill="currentColor" className="text-foreground" />
                </svg>
            </motion.div>
        </div>
    );
};

export default InkSplash;
