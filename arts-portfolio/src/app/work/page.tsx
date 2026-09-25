import type { Metadata } from 'next';
import Link from 'next/link';
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
        <div className="min-h-screen">
            <Link
                href="/#room-view"
                className="inline-block mt-4 text-sm font-mono text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
                ← BACK TO THE ROOM
            </Link>
            <ProjectGrid />
        </div>
    );
}
