// Hand-authored copy and geometry for the CORE flagship page.
// Coordinates are in the spine outline's own pixel space (1390×2000), so they
// stay aligned at any rendered size.

export const SPINE = {
    src: '/work/core/spine-outline.webp',
    width: 1390,
    height: 2000,
};

export type Point = { x: number; y: number };

export const VERTEBRAE: Point[] = [
    { x: 695, y: 150 },
    { x: 695, y: 690 },
    { x: 695, y: 965 },
    { x: 695, y: 1215 },
    { x: 695, y: 1490 },
    { x: 695, y: 1745 },
];

export const NAILS: Point[] = [
    { x: 755, y: 197 },
    { x: 815, y: 748 },
    { x: 806, y: 1040 },
    { x: 799, y: 1285 },
    { x: 775, y: 1560 },
    { x: 762, y: 1762 },
];

export const EYE: Point = { x: 695, y: 410 };

export type AnatomyPart = {
    id: 'sections' | 'nails' | 'eye';
    label: string;
    title: string;
    body: string;
    // Where the tap target sits on the spine.
    hotspot: Point;
};

// DRAFT copy, written from Avi's notes. Edit freely.
export const ANATOMY: AnatomyPart[] = [
    {
        id: 'sections',
        label: 'The sections',
        title: 'The frame',
        body: 'The spine is the command center and the frame of a person: their appearance and, more importantly, their liveliness. Every piece in CORE is built on this same frame. What changes is the personality wrapped around it.',
        hotspot: VERTEBRAE[2],
    },
    {
        id: 'nails',
        label: 'The nails',
        title: 'What holds me together',
        body: 'Each small ring is a nail, standing in for the nails in my own spine after surgery. They appear in every piece of the collection, quietly holding my characteristics together.',
        hotspot: NAILS[1],
    },
    {
        id: 'eye',
        label: 'The eye',
        title: 'A window in',
        body: 'The eye carries religious meaning from my Nepali side, along with my own obsession with eyes: a window I use to peek into a person’s soul. Its iris changes in every piece. It’s where each personality shows first.',
        hotspot: EYE,
    },
];

// Series come from the CORE project's Subsections in Sanity, in their order.
// These built-ins supply the accent (and a blurb when the subsection has no
// description) for subsections titled Sashiko / Graffiti / Experimentals.
// Pieces still in the main gallery are placed by legacyFiles, or land in
// Experimentals.
// accent: labels, card frame, story rule. glow: second colour in the section's
// background gradient.
export type SeriesMeta = { id: string; title: string; blurb?: string; accent: string; glow: string };

export const BUILTIN_SERIES: (SeriesMeta & { legacyFiles: string[] })[] = [
    {
        id: 'sashiko',
        title: 'Sashiko',
        blurb: 'Stitched, patched, mended.',
        accent: '#6b7cff',
        glow: '#2de0c8',
        legacyFiles: ['CORE005.png', 'CORE006.png', 'CORE008.png'],
    },
    {
        id: 'graffiti',
        title: 'Graffiti',
        blurb: 'Loud strokes, one gesture each.',
        accent: '#ff2d3d',
        glow: '#ff8a00',
        legacyFiles: ['CORE003.png', 'CORE004.png', 'CORE007.png'],
    },
    {
        id: 'experimentals',
        title: 'Experimentals',
        blurb: 'Everything else the spine wanted to try.',
        accent: '#ff8ad8',
        glow: '#8a5cff',
        legacyFiles: ['CORE001.png', 'CORE002.png'],
    },
];

export const DEFAULT_SERIES = 'experimentals';

// Accent/glow pairs for series that aren't built-ins and set no colour.
export const FALLBACK_COLORS = [
    { accent: '#f2c14e', glow: '#ff5a8a' },
    { accent: '#5fd3a8', glow: '#3a7bff' },
    { accent: '#9b8cff', glow: '#ff7ac6' },
    { accent: '#ff9f5a', glow: '#ffd23f' },
];

// Second gradient colour for a custom accent: the same colour, hue-shifted.
export function shiftHue(hex: string, degrees = 50): string {
    const n = hex.replace('#', '');
    const full = n.length === 3 ? n.split('').map((c) => c + c).join('') : n;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
    let h = 0;
    const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + degrees + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * sat, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
    const [r1, g1, b1] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return '#' + [r1, g1, b1].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
}

export const pct = (p: Point) => ({
    left: `${(p.x / SPINE.width) * 100}%`,
    top: `${(p.y / SPINE.height) * 100}%`,
});

// Path under /public once a licensed track exists, e.g. '/work/core/soundtrack.mp3'.
export const SOUNDTRACK: string | null = null;
