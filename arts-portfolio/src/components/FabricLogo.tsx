'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Logo, { LOGO_MASK } from './Logo';

// Landing intro for the hero wordmark: the logo is cut from sashiko cloth
// that appears in place flapping in the wind, then settles, and the cloth
// fades into the normal logo colour.
//
// The flapping is an SVG turbulence + displacement filter on a wrapper, driven
// frame by frame; the cloth is a hitomezashi-stitch tile plus a moving sheen,
// both clipped by the logo mask. The filter is removed once it lands.

const FILTER_ID = 'shrma-fabric-wind';
const DURATION = 2600; // ms, appear to landed
const WIND_UNTIL = 900; // full wind until here, then it dies down
const CALM_AT = 2300;
const MAX_DISPLACE = 90;

// Indigo cloth with white cross stitches (hitomezashi-style sashiko).
const CLOTH = `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>` +
        `<rect width='28' height='28' fill='#24306f'/>` +
        `<path d='M0 .5H28M0 14.5H28M.5 0V28M14.5 0V28' stroke='#1b2559' stroke-width='1'/>` +
        `<path d='M3 7h8M17 21h8M21 3v8M7 17v8' stroke='#f3ecdc' stroke-width='2.2' stroke-linecap='round'/>` +
        `</svg>`,
)}")`;

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export default function FabricLogo({ className = '' }: { className?: string }) {
    const reduce = useReducedMotion();
    const turbulence = useRef<SVGFETurbulenceElement>(null);
    const displace = useRef<SVGFEDisplacementMapElement>(null);
    const cloth = useRef<HTMLSpanElement>(null);
    const sheen = useRef<HTMLSpanElement>(null);
    const [landed, setLanded] = useState(false);

    useEffect(() => {
        if (reduce) return;
        const start = performance.now();
        let raf = 0;
        const frame = (now: number) => {
            const t = now - start;
            const s = t / 1000;
            // Wind: full, then easing to calm.
            const wind = t < WIND_UNTIL ? 1 : 1 - easeOutCubic(clamp01((t - WIND_UNTIL) / (CALM_AT - WIND_UNTIL)));
            // Gusts ripple through by swaying the noise's frequency.
            const fx = 0.0045 + 0.0018 * Math.sin(s * 2.3);
            const fy = 0.014 + 0.007 * Math.sin(s * 3.1 + 1.2);
            turbulence.current?.setAttribute('baseFrequency', `${fx.toFixed(5)} ${fy.toFixed(5)}`);
            displace.current?.setAttribute('scale', (MAX_DISPLACE * wind * (0.85 + 0.15 * Math.sin(s * 9))).toFixed(2));
            // Light sliding across the folds.
            sheen.current?.style.setProperty('background-position', `${(s * 70) % 300}% 0`);
            // Cloth gives way to the logo colour as it settles.
            if (cloth.current) cloth.current.style.opacity = String(1 - clamp01((t - 1600) / 900));

            if (t < DURATION) raf = requestAnimationFrame(frame);
            else setLanded(true);
        };
        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, [reduce]);

    if (reduce || landed) return <Logo className={className} />;

    return (
        <>
            <svg aria-hidden width="0" height="0" className="absolute">
                <filter id={FILTER_ID} x="-25%" y="-60%" width="150%" height="220%">
                    <feTurbulence
                        ref={turbulence}
                        type="fractalNoise"
                        baseFrequency="0.0045 0.014"
                        numOctaves={2}
                        seed={7}
                        result="noise"
                    />
                    <feDisplacementMap
                        ref={displace}
                        in="SourceGraphic"
                        in2="noise"
                        scale={MAX_DISPLACE}
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>

            {/* Appears in place, flapping; a slight lean and swell relax as it lands. */}
            <motion.span
                role="img"
                aria-label="shRma"
                className={`relative block aspect-[1164/400] ${className}`}
                style={{ filter: `url(#${FILTER_ID})` }}
                initial={{ opacity: 0, scale: 1.06, skewX: 5 }}
                animate={{ opacity: 1, scale: 1, skewX: 0 }}
                transition={{ opacity: { duration: 0.5 }, default: { duration: 2, ease: [0.22, 1, 0.36, 1] } }}
            >
                {/* Final colour underneath; the cloth fades off it. */}
                <span className="absolute inset-0 bg-current" style={LOGO_MASK} />
                <span
                    ref={cloth}
                    className="absolute inset-0"
                    style={{ ...LOGO_MASK, backgroundImage: CLOTH, backgroundSize: '22px 22px' }}
                >
                    <span
                        ref={sheen}
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                'linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.28) 42%, transparent 52%, rgba(0,0,0,0.25) 64%, transparent 76%)',
                            backgroundSize: '300% 100%',
                        }}
                    />
                </span>
            </motion.span>
        </>
    );
}
