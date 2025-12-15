'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
    const { scrollY } = useScroll();
    const rotate = useTransform(scrollY, [0, 500], [0, 25]); // "Head tilt" effect
    const y = useTransform(scrollY, [0, 500], [0, 50]); // Slight parallax

    return (
        <section className="min-h-[85vh] flex items-center justify-between pb-12 mb-24 border-b border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">

                {/* Left Column: Title & Text */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                    <div className="overflow-hidden mb-8">
                        <h1 className="text-[15vw] lg:text-[10vw] leading-[0.85] font-black tracking-tighter">
                            <motion.span
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, ease: "circOut" }}
                                className="block"
                            >
                                shRma
                            </motion.span>
                        </h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-xl md:text-3xl max-w-2xl font-mono text-gray-600 dark:text-gray-400 leading-tight"
                    >
                        Passionate product designer bridging tech, design, and fashion to create intuitive digital experiences.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-sm font-mono uppercase tracking-widest text-gray-400 mt-12"
                    >
                        Scroll for work ↓
                    </motion.div>
                </div>

                <div className="lg:col-span-5 flex justify-center lg:justify-start lg:pl-12">
                    <motion.div
                        style={{ rotate, y }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                        className="relative w-full max-w-[650px] aspect-square"
                    >
                        <img
                            src="/shRma_Sashiko.png"
                            alt="shRma Sashiko Logo"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
