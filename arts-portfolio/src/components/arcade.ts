import type { CSSProperties } from 'react';
import { Press_Start_2P } from 'next/font/google';

// Pixel face for everything arcade: the room's labels, the cabinet's screen and
// the Selected Work select screen.
export const arcade = Press_Start_2P({ weight: '400', subsets: ['latin'], display: 'swap' });

// Fighting-game title lettering: gold-to-red fill, dark outline, hard stepped shadow.
export const arcadeTitleStyle: CSSProperties = {
    backgroundImage: 'linear-gradient(180deg, #FFF3B0 0%, #FFD23F 38%, #FF8A1F 62%, #D7263D 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextStroke: '1px #5C1409',
    filter: 'drop-shadow(2px 2px 0 #5C1409) drop-shadow(2px 2px 0 #2B0A04)',
};
