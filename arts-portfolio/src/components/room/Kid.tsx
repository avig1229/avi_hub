// Third Eye as a pixel sprite, drawn cell by cell: bald head, gold third eye,
// hoop earrings, sashiko-stitched indigo shirt. Two frames: standing, and
// mid-step while he walks.

const PALETTE: Record<string, string> = {
    o: '#6B3A22', // outline
    s: '#E8A06C', // skin
    g: '#F2C14E', // gold: third eye, earrings
    w: '#F4EEE4', // eye white
    e: '#8C95A8', // eye
    p: '#F08F8F', // cheek
    b: '#2B3A8C', // indigo shirt
    t: '#E6E1D6', // sashiko stitch
    B: '#1D275F', // shorts
    l: '#3A2F3A', // legs
    k: '#151015', // shoes
};

const BODY = [
    '....ooooooo....',
    '..oosssssssoo..',
    '.osssssgssssso.',
    '.ossssgggsssso.',
    'ossssssgsssssso',
    'ossssssssssssso',
    'osswesssssewsso',
    'goswesssssewsog',
    'gspssssssssspsg',
    '.osssssossssso.',
    '..oosssssssoo..',
    '....ooooooo....',
    '....bbbbbbb....',
    '...bbtbbbtbb...',
    '..sbbtbtbtbbs..',
    '..sbbbbbbbbbs..',
    '....BBBBBBB....',
];
const LEGS = [
    ['.....ll.ll.....', '.....kk.kk.....'],
    ['....ll...ll....', '....kk...kk....'],
];

export const KID_SIZE = { w: 15, h: BODY.length + 2 };

export default function Kid({ step = 0 }: { step?: number }) {
    const rows = [...BODY, ...LEGS[step % 2]];
    return (
        <svg viewBox={`0 0 ${KID_SIZE.w} ${KID_SIZE.h}`} className="w-full h-full" shapeRendering="crispEdges" aria-hidden>
            {rows.flatMap((row, y) =>
                [...row].map((c, x) =>
                    PALETTE[c] ? <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={PALETTE[c]} /> : null,
                ),
            )}
        </svg>
    );
}
