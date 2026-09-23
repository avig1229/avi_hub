import { ReactNode } from 'react';
import clsx from 'clsx';

interface FullBleedProps {
    children: ReactNode;
    className?: string;
}

// Breaks a section out of the root layout's centered, padded <main> container
// (max-w-[1920px] mx-auto px-6 md:px-12) so it can span the full viewport width.
export default function FullBleed({ children, className }: FullBleedProps) {
    return (
        <div className={clsx('relative left-1/2 right-1/2 -mx-[50vw] w-screen', className)}>
            {children}
        </div>
    );
}
