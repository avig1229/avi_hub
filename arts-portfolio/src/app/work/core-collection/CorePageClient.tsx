'use client';

import { useRef, ReactNode } from 'react';
import CoreSpineProgress from '@/components/core/CoreSpineProgress';

interface CorePageClientProps {
    children: ReactNode;
}

// Holds the scroll-tracking ref for CoreSpineProgress — needs a client
// boundary since the page itself is an async server component.
export default function CorePageClient({ children }: CorePageClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef}>
            <CoreSpineProgress targetRef={containerRef} />
            {children}
        </div>
    );
}
