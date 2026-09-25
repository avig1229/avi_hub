import { ARCADE_SCREEN, RECORD, ROOM } from './layout';

// The room, drawn top-down in the 3/4 view of 16-bit RPGs: the back wall shows
// its face, furniture shows its top and front. One unit = one room pixel.
// Everything sits on the 240×180 floor plan; on screens wider than 4:3 the
// floor and back wall simply carry on past it (x0/width), so the room fills
// the screen with no frame.

const C = {
    // A modern interior: warm plaster walls, light oak floor, walnut and matte black.
    wall: '#E8E2D8',
    wallShade: '#DDD5C8',
    wallTrim: '#F7F4EE', // baseboard
    wallTrimShadow: '#CFC6B8',
    floor: '#C9A27B',
    floorLine: '#B38B63',
    floorLight: '#CFAA84',
    rug: '#2B3A8C',
    rugEdge: '#1D275F',
    stitch: '#D9D2C3',
    wood: '#7B5238', // walnut
    woodDark: '#5E3D2A',
    woodDeep: '#3E281C',
    metal: '#9AA0A8',
    steel: '#2B2B30', // matte black: window frame, rail, poster frame
    cream: '#E6E1D6',
    ink: '#121212',
    cabinet: '#1B1826',
    cabinetSide: '#110F18',
    chrome: '#C3C8D0',
    panel: '#8C8F99',
    panelEdge: '#5C5F68',
    red: '#E23B3B',
    blue: '#3B6BFF',
    magenta: '#C2307A',
    purple: '#6B2A8C',
    gold: '#F2C14E',
    leaf: '#4E9A5A',
    leafDark: '#2F6E3E',
    pot: '#EDEAE4',
    potShade: '#D6D2CA',
};

type R = { x: number; y: number; w: number; h: number; c: string };
const px = (x: number, y: number, w: number, h: number, c: string): R => ({ x, y, w, h, c });

function Rects({ rects }: { rects: R[] }) {
    return (
        <>
            {rects.map((r, i) => (
                <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
            ))}
        </>
    );
}

// Garments on the closet rail: [x, width, length, colour, detail colour].
const GARMENTS: [number, number, number, string, string][] = [
    [15, 8, 26, '#E8B64A', '#C9962F'], // the yee-haw hoodie
    [24, 7, 22, '#C9D3E0', '#2B3A8C'], // 'THE' jersey
    [32, 7, 28, '#2B3A8C', '#D9D2C3'], // sashiko jacket
    [40, 6, 20, '#C8453B', '#9E3029'],
    [47, 7, 25, '#1B1B22', '#3A3A44'],
    [55, 6, 23, '#4A6FA5', '#35557F'],
    [62, 6, 19, '#D9C7A8', '#B8A382'],
];

export default function RoomArt({
    playing,
    x0 = 0,
    width = ROOM.w,
    poster,
}: {
    playing: boolean;
    x0?: number;
    width?: number;
    // The art piece on the wall (a small render, shown pixelated).
    poster?: string;
}) {
    const s = ARCADE_SCREEN;
    return (
        <svg
            viewBox={`${x0} 0 ${width} ${ROOM.h}`}
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            shapeRendering="crispEdges"
            aria-hidden
        >
            <defs>
                {/* Long light-oak boards */}
                <pattern id="room-planks" width="64" height="8" patternUnits="userSpaceOnUse">
                    <rect width="64" height="8" fill={C.floor} />
                    <rect y="3" width="64" height="1" fill={C.floorLine} />
                    <rect y="7" width="64" height="1" fill={C.floorLine} />
                    <rect x="22" width="1" height="3" fill={C.floorLine} />
                    <rect x="52" y="4" width="1" height="3" fill={C.floorLine} />
                    <rect x="4" y="1" width="12" height="1" fill={C.floorLight} />
                    <rect x="30" y="5" width="14" height="1" fill={C.floorLight} />
                </pattern>
                {/* Smooth plaster, a faint fleck here and there */}
                <pattern id="room-wallpaper" width="14" height="10" patternUnits="userSpaceOnUse">
                    <rect width="14" height="10" fill={C.wall} />
                    <rect x="3" y="2" width="1" height="1" fill={C.wallShade} />
                    <rect x="10" y="7" width="1" height="1" fill={C.wallShade} />
                </pattern>
                {/* Sashiko running stitch, like the record label's indigo. */}
                <pattern id="room-sashiko" width="6" height="6" patternUnits="userSpaceOnUse">
                    <rect width="6" height="6" fill={C.rug} />
                    <rect x="1" y="1" width="2" height="1" fill={C.stitch} opacity="0.75" />
                    <rect x="4" y="3" width="1" height="2" fill={C.stitch} opacity="0.75" />
                </pattern>
                <pattern id="room-marquee" width="6" height="6" patternUnits="userSpaceOnUse">
                    <rect width="6" height="6" fill={C.magenta} />
                    <rect x="0" y="0" width="2" height="2" fill={C.purple} />
                    <rect x="3" y="3" width="2" height="2" fill={C.purple} />
                </pattern>
            </defs>

            {/* Floor and walls */}
            <rect x={x0} width={width} height={ROOM.h} fill="url(#room-planks)" />
            <rect x={x0} width={width} height="44" fill="url(#room-wallpaper)" />
            <Rects rects={[px(x0, 40, width, 4, C.wallTrim), px(x0, 40, width, 1, C.wallTrimShadow), px(x0, 44, width, 1, C.floorLine)]} />

            {/* Window: black steel frame, night outside */}
            <Rects
                rects={[
                    px(102, 7, 36, 26, C.steel),
                    px(103, 8, 34, 24, '#16213F'),
                    px(119, 8, 1, 24, C.steel),
                    px(103, 19, 34, 1, C.steel),
                    px(110, 11, 3, 3, C.cream),
                    px(111, 11, 2, 1, '#16213F'),
                    px(125, 13, 1, 1, C.cream),
                    px(131, 11, 1, 1, C.cream),
                    px(107, 25, 1, 1, C.cream),
                    px(128, 24, 1, 1, C.cream),
                    px(100, 33, 40, 2, C.wallTrim),
                    px(100, 35, 40, 1, C.wallTrimShadow),
                ]}
            />

            {/* Framed art piece: thin black frame, white mat, the piece rendered small and pixelated */}
            <Rects rects={[px(75, 7, 22, 28, C.steel), px(76, 8, 20, 26, '#FAF8F4'), px(75, 35, 22, 1, C.wallShade)]} />
            {poster ? (
                <image
                    href={poster}
                    x="78"
                    y="10"
                    width="16"
                    height="22"
                    preserveAspectRatio="xMidYMid slice"
                    style={{ imageRendering: 'pixelated' }}
                />
            ) : (
                <image href="/logo.svg" x="78" y="18" width="16" height="6" preserveAspectRatio="xMidYMid meet" />
            )}

            {/* Rug */}
            <rect x="84" y="86" width="80" height="52" fill={C.rugEdge} />
            <rect x="86" y="88" width="76" height="48" fill="url(#room-sashiko)" />

            {/* ── Closet corner: a rail of pieces, shoes underneath ── */}
            <Rects
                rects={[
                    px(12, 8, 2, 6, C.steel),
                    px(68, 8, 2, 6, C.steel),
                    px(12, 10, 58, 1, C.steel),
                ]}
            />
            {GARMENTS.map(([x, w, len, c, d], i) => (
                <g key={i}>
                    <rect x={x + Math.floor(w / 2)} y={11} width="1" height="2" fill={C.steel} />
                    <rect x={x + 1} y={13} width={w - 2} height="2" fill={c} />
                    <rect x={x} y={15} width={w} height={len} fill={c} />
                    <rect x={x + w - 1} y={15} width="1" height={len} fill={d} />
                    {i === 1 && <rect x={x} y={20} width={w} height="1" fill={d} />}
                    {i === 2 && <rect x={x + 2} y={20} width="2" height="1" fill={d} />}
                </g>
            ))}
            <Rects
                rects={[
                    px(12, 44, 58, 3, 'rgba(0,0,0,0.18)'),
                    // loafers
                    px(18, 48, 4, 6, '#7A2E2A'),
                    px(23, 48, 4, 6, '#7A2E2A'),
                    px(19, 49, 2, 1, C.gold),
                    px(24, 49, 2, 1, C.gold),
                    // sneakers
                    px(34, 48, 4, 6, C.cream),
                    px(39, 48, 4, 6, C.cream),
                    px(34, 53, 4, 1, '#B8B1A3'),
                    px(39, 53, 4, 1, '#B8B1A3'),
                    // boots
                    px(50, 47, 4, 7, '#3A2A20'),
                    px(55, 47, 4, 7, '#3A2A20'),
                ]}
            />

            {/* ── Vinyl corner: credenza, turntable, crate ── */}
            <Rects
                rects={[
                    px(10, 132, 58, 22, C.wood),
                    px(10, 132, 58, 1, '#946447'),
                    px(10, 154, 58, 14, C.woodDark),
                    px(38, 155, 1, 12, C.woodDeep),
                    px(22, 160, 3, 1, C.gold),
                    px(52, 160, 3, 1, C.gold),
                    px(11, 168, 3, 2, C.woodDeep),
                    px(64, 168, 3, 2, C.woodDeep),
                    // turntable plinth
                    px(14, 134, 28, 18, '#D8D2C4'),
                    px(14, 151, 28, 1, '#B8B1A3'),
                    px(38, 147, 2, 2, C.red),
                    // crate of records
                    px(45, 135, 19, 16, C.woodDeep),
                    px(46, 136, 17, 14, '#2A1E16'),
                    px(47, 137, 2, 12, '#E8B64A'),
                    px(50, 137, 2, 12, C.rug),
                    px(53, 137, 2, 12, '#C8453B'),
                    px(56, 137, 2, 12, C.cream),
                    px(59, 137, 2, 12, '#3F8F4E'),
                ]}
            />
            {/* The record: spins, faster while the music plays */}
            <g
                className={`motion-reduce:animate-none ${playing ? 'animate-[spin_1.8s_linear_infinite]' : 'animate-[spin_7s_linear_infinite]'}`}
                style={{ transformBox: 'view-box', transformOrigin: `${RECORD.x}px ${RECORD.y}px` }}
            >
                <circle cx={RECORD.x} cy={RECORD.y} r={RECORD.r} fill={C.ink} shapeRendering="geometricPrecision" />
                <circle cx={RECORD.x} cy={RECORD.y} r={RECORD.r - 1.5} fill="none" stroke="#2A2A2A" strokeWidth="0.5" shapeRendering="geometricPrecision" />
                <circle cx={RECORD.x} cy={RECORD.y} r={RECORD.r - 3} fill="none" stroke="#2A2A2A" strokeWidth="0.5" shapeRendering="geometricPrecision" />
                <circle cx={RECORD.x} cy={RECORD.y} r="2.6" fill={C.rug} shapeRendering="geometricPrecision" />
                <rect x={RECORD.x - 0.5} y={RECORD.y - 2} width="1" height="1" fill={C.gold} />
                <rect x={RECORD.x - 1} y={RECORD.y + 0.5} width="2" height="0.6" fill={C.stitch} />
            </g>
            {/* Tonearm: swings onto the record while it plays */}
            <g
                style={{
                    transformBox: 'view-box',
                    transformOrigin: '38px 137px',
                    transform: `rotate(${playing ? 28 : 0}deg)`,
                    transition: 'transform 0.6s ease-out',
                }}
            >
                <rect x="37" y="136" width="2" height="2" fill={C.metal} />
                <rect x="37.5" y="138" width="1" height="7" fill={C.metal} />
                <rect x="36.5" y="145" width="2" height="1.5" fill="#6E737B" />
            </g>

            {/* ── Arcade cabinet ── */}
            <Rects
                rects={[
                    px(178, 62, 38, 3, 'rgba(0,0,0,0.3)'),
                    px(180, 2, 34, 61, C.cabinetSide),
                    px(180, 2, 1, 61, C.chrome),
                    px(213, 2, 1, 61, C.chrome),
                ]}
            />
            <rect x="182" y="3" width="30" height="9" fill="url(#room-marquee)" />
            <Rects
                rects={[
                    px(182, 12, 30, 21, '#0B0A10'),
                    // screen glow on the bezel
                    px(s.x - 1, s.y - 1, s.w + 2, s.h + 2, '#1A2A6C'),
                    // control panel
                    px(181, 33, 32, 6, C.panel),
                    px(181, 39, 32, 2, C.panelEdge),
                    // P1 stick + buttons
                    px(186, 34, 1, 3, '#333'),
                    px(185, 33, 3, 2, C.red),
                    px(190, 34, 2, 1, C.blue),
                    px(193, 34, 2, 1, C.blue),
                    px(196, 34, 2, 1, C.blue),
                    px(190, 36, 2, 1, C.blue),
                    px(193, 36, 2, 1, C.blue),
                    px(196, 36, 2, 1, C.blue),
                    // P2
                    px(201, 34, 1, 3, '#333'),
                    px(200, 33, 3, 2, C.red),
                    px(205, 34, 2, 1, C.blue),
                    px(208, 34, 2, 1, C.blue),
                    px(211, 34, 1, 1, C.blue),
                    px(205, 36, 2, 1, C.blue),
                    px(208, 36, 2, 1, C.blue),
                    // lower body, coin door
                    px(183, 41, 28, 21, C.cabinet),
                    px(193, 46, 8, 9, '#2E2A38'),
                    px(195, 49, 1, 2, C.red),
                    px(198, 49, 1, 2, C.red),
                    px(183, 60, 28, 2, '#0B0A10'),
                ]}
            />

            {/* Plant */}
            <Rects
                rects={[
                    px(214, 158, 12, 10, C.pot),
                    px(223, 158, 3, 10, C.potShade),
                    px(214, 158, 12, 1, C.potShade),
                    px(213, 146, 6, 8, C.leaf),
                    px(219, 142, 6, 10, C.leafDark),
                    px(222, 148, 5, 8, C.leaf),
                    px(216, 152, 8, 6, C.leafDark),
                    px(211, 150, 4, 5, C.leafDark),
                ]}
            />
        </svg>
    );
}
