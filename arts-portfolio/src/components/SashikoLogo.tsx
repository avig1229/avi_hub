'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function SashikoLogo() {
    const { scrollY } = useScroll();

    // Scroll Ranges
    // 0 -> 400px: Logo is fading in and settling into position

    // Opacity: Hidden at top (0), visible as you scroll down (1)
    const opacity = useTransform(scrollY, [100, 400], [0, 1]);

    // Scale: Start slightly larger and settle to icon size
    const scale = useTransform(scrollY, [100, 400], [1.5, 1]);

    // Rotation: gentle spin entrance
    const rotate = useTransform(scrollY, [100, 400], [-45, 0]);

    // Fixed width/position constants (no longer moving across screen)
    const width = '80px';
    const top = '85vh';
    const right = '2rem';

    return (
        <motion.div
            style={{
                width,
                top,
                right,
                rotate,
                scale,
                opacity,
                position: 'fixed',
                zIndex: 50,
            }}
            className="hidden lg:block pointer-events-none mix-blend-difference md:mix-blend-normal"
        >
            <img
                src="/shRma_Sashiko.png"
                alt="shRma Sashiko Logo"
                className="w-full h-full object-contain drop-shadow-2xl"
            />
        </motion.div>
    );
}
