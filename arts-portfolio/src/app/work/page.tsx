import type { Metadata } from 'next';
import ProjectGrid from '@/components/ProjectGrid';

// Re-fetch projects from Sanity at most once a minute, so new uploads
// appear without a redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
    title: 'Selected Work | shRma',
};

// The arcade's select screen: where the room's arcade cabinet leads.
export default function WorkPage() {
    return (
        <ProjectGrid />
    );
}
