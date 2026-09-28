import type { ComponentType } from 'react';
import CorePage from './core/CorePage';
import ShrmaPage from './shrma/ShrmaPage';

// Flagship projects get a bespoke, hand-built page instead of the generic
// /work/[slug] template. Structure and motion live in code; content still
// comes from Sanity.
export const flagships: Record<string, ComponentType> = {
    'core-collection': CorePage,
    shrma: ShrmaPage,
};
