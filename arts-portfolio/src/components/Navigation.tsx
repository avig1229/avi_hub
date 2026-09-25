'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { SoundToggle } from './audio/SoundToggle';
import { arcade } from './arcade';

const LINKS = [
    { href: '/work', label: 'Work' },
    { href: '/about', label: 'About' },
];

export default function Navigation() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close on navigation; `pathname` changing is the signal.
    const [lastPath, setLastPath] = useState(pathname);
    if (pathname !== lastPath) {
        setLastPath(pathname);
        setOpen(false);
    }

    // While the menu is open: Esc closes it and the page behind stays put.
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', onKey);
        const html = document.documentElement;
        const prev = html.style.overflow;
        html.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            html.style.overflow = prev;
        };
    }, [open]);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 mix-blend-difference text-gray-800 dark:text-white">
                {/* Phones: logo centred, menu button on the right. Wider: logo left, links right. */}
                <div className="grid grid-cols-[2.75rem_1fr_2.75rem] items-center md:flex md:justify-between md:items-start">
                    <span aria-hidden className="md:hidden" />
                    <Link
                        href="/"
                        aria-label="shRma, home"
                        className="justify-self-center hover:opacity-75 transition-opacity"
                    >
                        <Logo className="h-8 md:h-9" />
                    </Link>
                    <div className="hidden md:flex gap-6 text-sm font-medium items-center">
                        {LINKS.map((l) => (
                            <Link key={l.href} href={l.href} className="hover:underline underline-offset-4 decoration-1 uppercase">
                                {l.label}
                            </Link>
                        ))}
                        <SoundToggle />
                        <ThemeToggle />
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        aria-expanded={open}
                        aria-controls="site-menu"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        className="md:hidden justify-self-end w-11 h-11 flex flex-col items-center justify-center gap-[5px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-current rounded-full"
                    >
                        <span
                            className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
                        />
                        <span className={`block h-0.5 w-6 bg-current transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
                        <span
                            className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
                        />
                    </button>
                </div>
            </nav>

            {/* Phone menu: full screen, under the nav bar so the button stays on top. */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        id="site-menu"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Menu"
                        data-guide-hide="always"
                        className="md:hidden fixed inset-0 z-[48] bg-[#141312] text-[#E6E1D6] flex flex-col px-6 pt-28 pb-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <nav aria-label="Site" className="flex flex-col gap-2">
                            {LINKS.map((l, i) => (
                                <motion.div
                                    key={l.href}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 + i * 0.05 }}
                                >
                                    <Link
                                        href={l.href}
                                        onClick={() => setOpen(false)}
                                        aria-current={pathname === l.href ? 'page' : undefined}
                                        className="flex items-baseline justify-between border-b border-[#E6E1D6]/15 py-4 font-display text-5xl uppercase"
                                    >
                                        {l.label}
                                        <span aria-hidden className={`${arcade.className} text-[10px] text-[#F2C14E]`}>
                                            {pathname === l.href ? '● Here' : '▶'}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                        <div className="mt-auto flex items-center justify-between">
                            <span className={`${arcade.className} text-[9px] uppercase tracking-[0.2em] text-[#E6E1D6]/50`}>
                                Sound · Theme
                            </span>
                            <div className="flex items-center gap-4">
                                <SoundToggle />
                                <ThemeToggle />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
