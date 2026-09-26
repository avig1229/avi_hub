'use client';

import { useEffect, useState } from 'react';

// Third Eye as an 8-direction pixel sprite with a 4-frame walk cycle
// (public/room/kid/{dir}-{frame}.png; the left-facing ones are mirrors of the
// right). Frame 0 is his standing pose; frames 1 and 3 lift a foot. Every
// image is loaded up front so turning never flickers. Facing you, he blinks.

export type Dir = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
const DIRS: Dir[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const ALL = [...DIRS.flatMap((d) => [0, 1, 2, 3].map((i) => `${d}-${i}`)), 'S-blink'];

// Sprites are 21×34 pixels; in the room one sprite pixel is 0.85 room pixels.
export const KID_SIZE = { w: 21 * 0.85, h: 34 * 0.85 };
const FRAMES = 4;

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

    const shown = !walking && dir === 'S' && blink ? 'S-blink' : `${dir}-${walking ? step % FRAMES : 0}`;
    return (
        <div aria-hidden className={`relative w-full h-full ${walking ? '' : 'motion-safe:animate-[kid-bob_1.6s_steps(2)_infinite]'}`}>
            {ALL.map((d) => (
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
