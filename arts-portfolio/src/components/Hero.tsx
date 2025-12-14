'use client';

import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="min-h-[70vh] flex flex-col justify-end pb-12 mb-24 border-b border-gray-200 dark:border-gray-800">
            <div className="overflow-hidden">
                <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter mb-8">
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-xl md:text-2xl max-w-2xl font-mono text-gray-600 dark:text-gray-400"
                >
                    Passionate product designer bridging tech, design, and fashion to create intuitive digital experiences.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-sm font-mono uppercase tracking-widest text-gray-400"
                >
                    Scroll for work ↓
                </motion.div>
            </div>
        </section>
    );
}
