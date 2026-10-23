import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { client } from '@/sanity/lib/client';
import { PROJECT_QUERY } from '@/sanity/lib/queries';
import CoreOriginHotspots from '@/components/core/CoreOriginHotspots';
import CoreCollectionSection from '@/components/core/CoreCollectionSection';
import CorePageClient from './CorePageClient';

const COLLECTION_ORDER = ['sashiko', 'graffiti', 'experimental'];

// Matches subsections to the three known collections by title (case-insensitive).
// Falls back to document order if titles don't match yet, so the page still
// renders sensibly before the subsections are renamed/organized in Studio.
function orderCollections(subsections: any[] = []) {
    const matched = COLLECTION_ORDER.map((name) =>
        subsections.find((s) => s.title?.trim().toLowerCase() === name)
    );

    if (matched.every(Boolean)) return matched;

    return COLLECTION_ORDER.map((_, i) => subsections[i]).filter(Boolean);
}

export default async function CoreCollectionPage() {
    const project = await client.fetch(PROJECT_QUERY, { slug: 'core-collection' });

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-12">
                <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                <Link href="/" className="text-gray-500 hover:text-black dark:hover:text-white">← Return Home</Link>
            </div>
        );
    }

    const collections = orderCollections(project.subsections);

    return (
        <CorePageClient>
            <article className="min-h-screen py-12">
                <Link href="/" className="inline-block mb-16 text-sm font-mono text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                    ← BACK TO INDEX
                </Link>

                {/* Origin */}
                <section className="mb-32">
                    <span className="block text-sm font-mono text-gray-400 mb-2">01 — Origin</span>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-12">
                        CORE Collection
                    </h1>

                    {project.content && (
                        <div className="max-w-2xl mb-16 prose dark:prose-invert text-lg leading-relaxed">
                            <PortableText value={project.content} />
                        </div>
                    )}

                    <CoreOriginHotspots image={project.mainImage} />
                </section>

                {/* Collection */}
                <section>
                    <span className="block text-sm font-mono text-gray-400 mb-2 px-0">02 — Collection</span>
                    {collections.length > 0 ? (
                        collections.map((section: any, i: number) => (
                            <CoreCollectionSection
                                key={section.title ?? i}
                                index={i + 1}
                                title={section.title}
                                description={section.description}
                                gallery={section.gallery}
                            />
                        ))
                    ) : (
                        <div className="p-12 text-center border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 font-mono">
                            Add the Sashiko, Graffiti, and Experimental subsections in Sanity Studio.
                        </div>
                    )}
                </section>

                <Link href="/" className="inline-block mt-24 text-sm font-mono text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                    ← BACK TO INDEX
                </Link>
            </article>
        </CorePageClient>
    );
}
