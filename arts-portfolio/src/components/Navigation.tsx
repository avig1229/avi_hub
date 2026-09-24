import Link from 'next/link';
import Logo from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { SoundToggle } from './audio/SoundToggle';

export default function Navigation() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-6 mix-blend-difference text-gray-800 dark:text-white">
            <div className="flex justify-between items-start">
                <Link href="/" aria-label="shRma, home" className="hover:opacity-75 transition-opacity">
                    <Logo className="h-8 md:h-9" />
                </Link>
                <div className="flex gap-6 text-sm font-medium items-center">
                    <Link href="/" className="hover:underline underline-offset-4 decoration-1">
                        WORK
                    </Link>
                    <Link href="/about" className="hover:underline underline-offset-4 decoration-1">
                        ABOUT
                    </Link>
                    <SoundToggle />
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
