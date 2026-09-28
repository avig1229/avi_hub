'use client';

import { createElement, useEffect, useState } from 'react';

// A spinnable 3D piece (a .glb from Sanity), via Google's <model-viewer>:
// drag to turn, pinch to zoom, and "view in your space" AR on phones. The
// library only loads on pages that actually show a model.
export default function Model3D({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        let alive = true;
        import('@google/model-viewer').then(() => alive && setReady(true));
        return () => {
            alive = false;
        };
    }, []);

    if (!ready) return <div className={`animate-pulse bg-black/10 ${className}`} aria-label={`Loading ${alt}`} />;
    return createElement('model-viewer', {
        src,
        alt,
        class: className,
        'camera-controls': true,
        'auto-rotate': true,
        'auto-rotate-delay': 800,
        'interaction-prompt': 'auto',
        'shadow-intensity': '1',
        exposure: '1.05',
        ar: true,
        'ar-modes': 'webxr scene-viewer quick-look',
        style: { width: '100%', height: '100%', background: 'transparent' },
    });
}
