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

export const SERIES = [
    {
        id: 'sashiko',
        title: 'Sashiko',
        kicker: 'Series 01',
        blurb: 'Stitched, patched, mended.',
        accent: '#6b7cff',
        // Fallback: 1-based Sanity gallery positions, used until the project
        // has a "Sashiko" subsection.
        fallback: [5, 6, 8],
    },
    {
        id: 'graffiti',
        title: 'Graffiti',
        kicker: 'Series 02',
        blurb: 'Loud strokes, one gesture each.',
        accent: '#ff2d3d',
        fallback: [3, 4, 7],
    },
    {
        id: 'experimentals',
        title: 'Experimentals',
        kicker: 'Series 03',
        blurb: 'Everything else the spine wanted to try.',
        accent: '#ff8ad8',
        fallback: [1, 2],
    },
] as const;

export type SeriesId = (typeof SERIES)[number]['id'];

export const pct = (p: Point) => ({
    left: `${(p.x / SPINE.width) * 100}%`,
    top: `${(p.y / SPINE.height) * 100}%`,
});

// Path under /public once a licensed track exists, e.g. '/work/core/soundtrack.mp3'.
export const SOUNDTRACK: string | null = null;
