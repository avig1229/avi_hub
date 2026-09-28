// shRma: the brand intro and the seasons along the road. The page reads the
// shRma project in Sanity; anything not filled in there falls back to what's
// built in here (and to the project's older sections: the logo story, the
// jersey, loafers, bandana and jewellery).

export type Level = 'low' | 'mid' | 'high';
export const LEVELS: Level[] = ['low', 'mid', 'high'];
export const levelRank = (l: Level) => LEVELS.indexOf(l);
// Does a visitor at `visitor` see content tagged `from`?
export const sees = (visitor: Level, from: Level) => levelRank(visitor) >= levelRank(from);

export type Img = { src: string; caption?: string; w?: number; h?: number };
export type Detail = { title?: string; level: Level; body?: string; images: Img[]; video?: string };
export type Piece = { name: string; key?: boolean; images: Img[]; model?: string; notes?: string; specs?: string };
export type Palette = { bg: string; ink: string; accent: string };
export type Season = {
    id: string;
    name: string;
    // Optional Chinese title, set vertically on the chapter opener.
    hanzi?: string;
    label?: string;
    date?: string;
    era: 'meraki' | 'shrma';
    status: 'released' | 'concept';
    oneLiner?: string;
    palette: Palette;
    keyVisuals: Img[];
    pieces: Piece[];
    photos: Img[];
    details: Detail[];
};
export type Intro = { headline: string; text: string[]; logo?: Img; details: Detail[] };

export const ERAS = {
    meraki: { chapter: 'Chapter I', name: 'Meraki', hanzi: '美拉奇', blurb: 'Three released seasons, co-founded as Meraki.' },
    shrma: { chapter: 'Chapter II', name: 'shRma', hanzi: '', blurb: 'The restart under my middle name. Concepts first; the road keeps going.' },
} as const;

// The built-in road. `from` names the project's older section whose images
// and text fill a season in (matched by title).
export type SeasonDefault = Omit<Season, 'pieces' | 'details'> & {
    pieces: (Omit<Piece, 'images'> & { images?: Img[]; fromCaptions?: string[] })[];
    details: (Omit<Detail, 'images'> & { images?: Img[]; fromCaptions?: string[]; bodyFrom?: string })[];
};

export const DEFAULT_SEASONS: SeasonDefault[] = [
    {
        id: 'meraki-essentials',
        name: 'Meraki Essentials',
        label: "Summer '24 · SS24",
        date: 'Summer 2024',
        era: 'meraki',
        status: 'released',
        oneLiner: 'Localization: the everyday essentials that started it all.',
        palette: { bg: '#0B3A30', ink: '#EAD3A4', accent: '#EAD3A4' },
        keyVisuals: [],
        pieces: [{ name: 'Meraki Essentials Tee', key: true }],
        photos: [],
        details: [],
    },
    {
        id: 'formosa-cowboy',
        name: 'Formosa Cowboy',
        hanzi: '寶島牛仔',
        label: 'FW 24/25 · ACT I',
        date: '10.10.2024',
        era: 'meraki',
        status: 'released',
        oneLiner: 'See you on the road. Taiwanese temple craft meets the open desert highway.',
        palette: { bg: '#3B1A12', ink: '#F6E3C8', accent: '#F28C28' },
        keyVisuals: [],
        pieces: [
            {
                name: 'Not My First Yee-haw Hoodie',
                key: true,
                fromCaptions: ['OG Hoodie Back', 'OG Hoodie Front'],
                notes: 'The first hoodie I sold out, and still the one people ask for.',
            },
            {
                name: 'You Know How We Ride Zip-up',
                fromCaptions: ['You Know How We Ride Zip-up Front', 'You Know How We Ride Zip-up Back'],
                notes: 'The 1-year anniversary, re-imagined.',
            },
        ],
        photos: [],
        details: [
            { title: 'The hoodie story', level: 'mid', bodyFrom: 'Hoodie Vision Board' },
            { title: 'The back design', level: 'mid', fromCaptions: ['OG Hoodie Back Design'] },
            {
                title: 'NanoBanana promo shoots',
                level: 'high',
                body: 'Prototyped and shot with NanoBanana: the first demo, the revision, then the V2 campaign.',
                fromCaptions: [
                    'First NanoBanana Demo Shoot',
                    'Revised NanoBanana Promo',
                    'V2. Race Track Promo (1)',
                    'V2. Race Track Promo (2) - Close Up',
                    'V2. Street Style Promo',
                    'V2. Fashion Week Promo (1)',
                    'V2. Fashion Week Promo (2)',
                ],
            },
        ],
    },
    {
        id: 'mrk-road-trippin',
        name: "MRK Road Trippin'",
        hanzi: '美拉奇路旅',
        label: "Spring '25",
        date: '03.08.25 · Seattle',
        era: 'meraki',
        status: 'released',
        oneLiner: 'Taiwanese culture, shared globally through street aesthetics. Pop-up at Gaga Tea, Chinatown.',
        palette: { bg: '#8E1116', ink: '#F3E9D6', accent: '#F2C14E' },
        keyVisuals: [],
        pieces: [
            {
                name: 'What the Fudge Tee',
                key: true,
                notes: 'The taste of home, the taste of sweet victories.',
            },
            { name: 'Puff Puff Past Tee' },
        ],
        photos: [],
        details: [],
    },
    {
        id: 'the-merakive',
        name: 'The MeraKive',
        era: 'shrma',
        status: 'concept',
        oneLiner: 'Pieces from the archive of ideas: the jersey, the temple loafers, the bandana.',
        palette: { bg: '#EDE6D6', ink: '#23211E', accent: '#4E9A5A' },
        keyVisuals: [],
        pieces: [
            { name: "'THE' Baseball Jersey", key: true, fromCaptions: ['Jersey Front', 'Jersey Back'] },
            { name: "'Take me to Temple' Loafers", fromCaptions: ['Loafers, Side', 'Loafers, Top', 'Loafers, Back'] },
            { name: 'Silk Bandana 001', fromCaptions: ['Silk Bandana 001'] },
        ],
        photos: [],
        details: [
            { title: 'The jersey', level: 'mid', bodyFrom: "'THE' Baseball Jersey Shirt" },
            { title: 'Jersey moodboards', level: 'mid', fromCaptions: ['Mood 1', 'Mood 2', 'Mood 3'] },
            { title: 'From sketch to jersey', level: 'mid', fromCaptions: ['Jersey Ideation Sketches'] },
            { title: 'Gemini shoots', level: 'high', fromCaptions: ['Gemini Product Shoot', 'Y2K Photoshoot', 'Y2K Fish Eye '] },
            { title: 'The temple loafers', level: 'mid', bodyFrom: "'Take me to Temple' Loafer designs" },
        ],
    },
    {
        id: 'shrma-accessories',
        name: 'shRma Accessory Line',
        era: 'shrma',
        status: 'concept',
        oneLiner: 'Small blings, here and there. Early contours of the jewellery line.',
        palette: { bg: '#141414', ink: '#EDEDED', accent: '#D7263D' },
        keyVisuals: [],
        pieces: [
            { name: 'The Prototype 000', key: true, fromCaptions: ['The Prototype 000 '] },
            { name: 'Spine Chain 001', fromCaptions: ['Spine Chain 001'] },
            { name: 'Eye Dangly Earrings 001', fromCaptions: ['Eye Dangly Earrings 001'] },
            { name: 'Emo Ring 001', fromCaptions: ['Emo Ring 001'] },
        ],
        photos: [],
        details: [
            { title: 'Why jewellery', level: 'mid', bodyFrom: 'shRma Jewelry Line' },
            { title: 'The vision before starting', level: 'high', fromCaptions: ['The Vision I had in mind before strarting'] },
        ],
    },
];

// The built-in brand intro. The logo story comes from the project's
// "Logo Design" section.
export const DEFAULT_INTRO = {
    headline: 'shRma',
    details: [
        { title: 'The logo', level: 'mid' as Level, bodyFrom: 'Logo Design', fromCaptions: ['Finalized Logo and First BG Design'] },
        { title: 'Logo process & variation lab', level: 'high' as Level, fromCaptions: ['Variation Lab'], videoFrom: 'Logo Creating process' },
    ],
};
