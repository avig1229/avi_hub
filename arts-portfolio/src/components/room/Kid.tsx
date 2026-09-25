'use client';

import { useEffect, useState } from 'react';

// Third Eye as a chibi pixel sprite, drawn cell by cell: big round head, big
// white eyes like the mascot's, blush, gold third eye and hoop earrings, a stubby
// sashiko-stitched body. Frames: standing, mid-step, and a blink.

const PALETTE: Record<string, string> = {
    o: '#6B3A22', // outline
    s: '#F0AE7C', // skin
    d: '#D98E5F', // sashiko stitching on his head
    g: '#F2C14E', // gold: third eye, earrings
    K: '#1B1420', // third eye's pupil
    h: '#FFFFFF', // eyes
    r: '#F59A9A', // blush
    m: '#8A3B2A', // smile
    b: '#2B3A8C', // indigo shirt
    t: '#E6E1D6', // sashiko stitch
    B: '#1D275F', // shorts
    l: '#3A2F3A', // legs
    k: '#151015', // shoes
};

const HEAD = [
    '....oooooooo....',
    '..oodsdsdsdsoo..',
    '.osssssggssssso.',
    'osssssgKKgssssso',
    'ossssssggsssssso',
    'osssssssssssssso',
    'osshhsssssshhsso',
    'osshhsssssshhsso',
    'gsshhsssssshhssg',
    'gsrrssmssmssrrsg',
    '.osssssmmssssso.',
    '..oossssssssoo..',
    '....oooooooo....',
];
// Eyes shut: rows 6–8 of the head.
const BLINK = ['osssssssssssssso', 'ossoossssssoosso', 'gssssssssssssssg'];
const BODY = ['.....bbbbbb.....', '....sbtbbtbs....', '.....BBBBBB.....'];
const LEGS = [
    ['......l..l......', '.....kk..kk.....'],
    ['.....l....l.....', '....kk....kk....'],
];

export const KID_SIZE = { w: 16, h: HEAD.length + BODY.length + 2 };

export default function Kid({ step = 0, walking = false }: { step?: number; walking?: boolean }) {
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

    const head = blink ? [...HEAD.slice(0, 6), ...BLINK, ...HEAD.slice(9)] : HEAD;
    const rows = [...head, ...BODY, ...LEGS[walking ? step % 2 : 0]];
    return (
        <svg
            viewBox={`0 0 ${KID_SIZE.w} ${KID_SIZE.h}`}
            className={`w-full h-full overflow-visible ${walking ? '' : 'motion-safe:animate-[kid-bob_1.6s_steps(2)_infinite]'}`}
            shapeRendering="crispEdges"
            aria-hidden
        >
            {rows.flatMap((row, y) =>
                [...row].map((c, x) =>
                    PALETTE[c] ? <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={PALETTE[c]} /> : null,
                ),
            )}
        </svg>
    );
}
