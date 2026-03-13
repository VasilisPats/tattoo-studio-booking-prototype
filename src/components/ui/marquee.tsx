import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
    /**
     * Optional CSS class name to apply custom styles.
     */
    className?: string;
    /**
     * Reverse the marquee direction.
     * @default false
     */
    reverse?: boolean;
    /**
     * Pause the marquee animation on hover.
     * @default false
     */
    pauseOnHover?: boolean;
    /**
     * Content to render inside the marquee.
     */
    children?: React.ReactNode;
    /**
     * Enable vertical scrolling instead of horizontal.
     * @default false
     */
    vertical?: boolean;
    /**
     * Number of times to repeat the children for seamless looping.
     * @default 4
     */
    repeat?: number;
}

export function Marquee({
    className,
    reverse = false,
    pauseOnHover = false,
    children,
    vertical = false,
    repeat = 4,
    ...props
}: MarqueeProps) {
    return (
        <div
            {...props}
            className={cn(
                "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
                vertical ? "flex-col" : "flex-row",
                className,
            )}
        >
            {Array(repeat)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex shrink-0 justify-around [gap:var(--gap)]",
                            vertical ? "flex-col" : "flex-row",
                            vertical
                                ? "animate-marquee-vertical"
                                : "animate-marquee",
                            pauseOnHover && "group-hover:[animation-play-state:paused]",
                            reverse && "[animation-direction:reverse]",
                        )}
                    >
                        {children}
                    </div>
                ))}
        </div>
    );
}
