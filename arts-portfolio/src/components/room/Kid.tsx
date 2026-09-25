'use client';

import { useEffect, useState } from 'react';

// Third Eye as an 8-direction pixel sprite (public/room/kid/*.png, one pose
// per direction; the left-facing ones are mirrors of the right). Every image
// is loaded up front so turning never flickers. Facing you, he blinks; while
// walking he hops and waddles.

export type Dir = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
const DIRS: Dir[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

// Sprites are 18×33 pixels; in the room one sprite pixel is 0.85 room pixels.
export const KID_SIZE = { w: 18 * 0.85, h: 33 * 0.85 };

// Which way he faces when moving by (dx, dy), screen axes (y down).
export function dirFor(dx: number, dy: number): Dir {
    const a = (Math.atan2(dy, dx) * 180) / Math.PI; // 0 = east, 90 = south
    const i = Math.round(a / 45);
    return (['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'] as const)[((i % 8) + 8) % 8];
}

export default function Kid({ dir = 'S', walking = false, step = 0 }: { dir?: Dir; walking?: boolean; step?: number }) {
    // Blink every few seconds.
    const [blink, setBlink] = useState(false);
    useEffect(() => {
        let t: number;
        const loop = () => {
            t = window.setTimeout(() => {
                setBlink(true);
                t = window.setTimeout(() => {
                    setBlink(false);
                    loop();
                }, 140);
            }, 2600 + Math.random() * 2400);
        };
        loop();
        return () => window.clearTimeout(t);
    }, []);

    const shown = dir === 'S' && blink && !walking ? 'S-blink' : dir;
    const odd = step % 2 === 1;
    return (
        <div
            aria-hidden
            className={`relative w-full h-full ${walking ? '' : 'motion-safe:animate-[kid-bob_1.6s_steps(2)_infinite]'}`}
            style={walking ? { transform: `translateY(${odd ? '-5%' : '0'}) rotate(${odd ? -4 : 4}deg)`, transformOrigin: '50% 100%' } : undefined}
        >
            {[...DIRS, 'S-blink'].map((d) => (
                <img
                    key={d}
                    src={`/room/kid/${d}.png`}
                    alt=""
                    draggable={false}
                    className={`absolute inset-0 w-full h-full [image-rendering:pixelated] ${d === shown ? '' : 'invisible'}`}
                />
            ))}
        </div>
    );
}
