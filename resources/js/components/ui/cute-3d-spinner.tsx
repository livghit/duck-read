import { motion } from 'framer-motion';

export function Cute3dSpinner({
    className,
    size = 'md',
    color = 'primary',
}: {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    color?: string;
}) {
    // Map sizes to pixel values for SVG
    const sizeMap = {
        sm: 32,
        md: 48,
        lg: 64,
    };

    const pixelSize = sizeMap[size];
    const strokeWidth = pixelSize / 8; // Proportional stroke
    const radius = (pixelSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            style={{ perspective: '200px' }}
        >
            {/* Shadow Reflection */}
            <motion.div
                className="absolute -bottom-2 h-2 w-3/4 rounded-[100%] bg-black/20 blur-sm dark:bg-black/40"
                initial={{ opacity: 0.5, scale: 0.8 }}
                animate={{
                    opacity: [0.4, 0.6, 0.4],
                    scale: [0.8, 1, 0.8],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{
                    rotateX: 70,
                }}
            />

            {/* 3D Tilted Ring Container */}
            <motion.div
                className="relative flex items-center justify-center"
                style={{
                    width: pixelSize,
                    height: pixelSize,
                    rotateX: 55, // The 3D Tilt
                    transformStyle: 'preserve-3d',
                }}
                animate={{
                    z: [0, -5, 0], // Subtle floating bob
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                {/* Rotating SVG */}
                <motion.svg
                    width={pixelSize}
                    height={pixelSize}
                    viewBox={`0 0 ${pixelSize} ${pixelSize}`}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="overflow-visible"
                >
                    <defs>
                        <linearGradient
                            id="spinner-gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop
                                offset="0%"
                                className="text-primary"
                                stopColor="currentColor"
                                stopOpacity="0"
                            />
                            <stop
                                offset="50%"
                                className="text-primary"
                                stopColor="currentColor"
                                stopOpacity="0.5"
                            />
                            <stop
                                offset="100%"
                                className="text-primary"
                                stopColor="currentColor"
                                stopOpacity="1"
                            />
                        </linearGradient>
                    </defs>

                    {/* Background Track */}
                    <circle
                        cx={pixelSize / 2}
                        cy={pixelSize / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-muted/30"
                    />

                    {/* Active Progress Segment */}
                    <motion.circle
                        cx={pixelSize / 2}
                        cy={pixelSize / 2}
                        r={radius}
                        fill="none"
                        stroke="url(#spinner-gradient)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{
                            strokeDashoffset: [
                                circumference * 0.9, // Start small
                                circumference * 0.2, // Grow large
                                circumference * 0.9, // Shrink
                            ],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </motion.svg>

                {/* Optional: Inner Pulse for extra detail */}
                <motion.div
                    className="absolute rounded-full bg-primary/20"
                    style={{
                        width: pixelSize * 0.4,
                        height: pixelSize * 0.4,
                    }}
                    animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </motion.div>
        </div>
    );
}
