// Floor plan for the landing-page room, in room pixels (the SVG's units).
// RoomArt draws to this grid; swap these numbers (and the art) when the real
// floor plan arrives.

export const ROOM = { w: 240, h: 180 };

export type Rect = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };
export type SpotId = 'closet' | 'arcade' | 'records';

export type Spot = {
    id: SpotId;
    label: string;
    hint: string;
    // Clickable area.
    box: Rect;
    // Where Third Eye stands (his feet) when he walks over.
    stand: Point;
};

export const SPOTS: Spot[] = [
    { id: 'closet', label: 'Closet', hint: 'Coming soon', box: { x: 10, y: 5, w: 62, h: 50 }, stand: { x: 40, y: 68 } },
    { id: 'arcade', label: 'Arcade', hint: 'Selected work', box: { x: 178, y: 1, w: 38, h: 64 }, stand: { x: 197, y: 80 } },
    { id: 'records', label: 'Records', hint: 'Browse the crate', box: { x: 8, y: 128, w: 60, h: 42 }, stand: { x: 80, y: 152 } },
];

// Where he can walk.
export const FLOOR: Rect = { x: 16, y: 56, w: 208, h: 114 };
export const KID_START: Point = { x: 124, y: 118 };

// The turntable's record: the scroll zoom starts on it, carrying on from the hero's record.
export const RECORD: Point & { r: number } = { x: 26, y: 142.5, r: 7.5 };

// The arcade cabinet's screen (the dive zooms into it) and marquee.
export const ARCADE_SCREEN: Rect = { x: 184, y: 13, w: 26, h: 18 };
export const MARQUEE: Rect = { x: 184, y: 4, w: 26, h: 7 };

export const pctX = (x: number) => `${(x / ROOM.w) * 100}%`;
export const pctY = (y: number) => `${(y / ROOM.h) * 100}%`;
