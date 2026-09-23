import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { PROJECT_QUERY } from '@/sanity/lib/queries';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import ProjectTabs from '@/components/ProjectTabs';
import GalleryGrid from '@/components/GalleryGrid';
import { flagships } from '@/flagships';

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const Flagship = flagships[slug];
    if (Flagship) return <Flagship />;

    const project = await client.fetch(PROJECT_QUERY, { slug });

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-12">
                <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                <Link href="/" className="text-gray-500 hover:text-black dark:hover:text-white">← Return Home</Link>
            </div>
        )
    }

    return (
        <article className="min-h-screen py-12 animate-in fade-in duration-500 max-w-[1080px] mx-auto px-4">
            <Link href="/" className="inline-block mb-12 text-sm font-mono text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                ← BACK TO INDEX
            </Link>

            <header className="mb-16">
                <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 mb-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">{project.title}</h1>
                    <span className="text-xl font-mono text-gray-500">{slug.replace('-', ' ')}</span>
                </div>

            </header>

            {project.mainImage && (
                <div className="mb-12 max-w-[90%] mx-auto">
                    <Image
                        src={urlFor(project.mainImage).width(1200).url()}
                        alt={project.title}
                        width={1200}
                        height={800}
                        className="w-full h-auto rounded-sm shadow-sm"
                        priority
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    <ProjectTabs
                        mainContent={project.content}
                        mainGallery={project.gallery}
                        subsections={project.subsections}
                    />
                </div>

                <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 h-fit">
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                        <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Category</span>
                        <span className="text-lg font-medium">{project.category}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                        <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Year</span>
                        <span className="text-lg font-medium">{project.date}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                        <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Items</span>
                        <span className="text-lg font-medium">
                            {
                                (project.gallery?.length || 0) +
                                (project.mainImage ? 1 : 0) +
                                (project.links?.length || 0) +
                                (project.subsections?.reduce((acc: number, sec: any) => acc + (sec.gallery?.length || 0), 0) || 0)
                            } Pieces
                        </span>
                    </div>

                    {project.links && project.links.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                            <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Links</span>
                            <div className="flex flex-col gap-2">
                                {project.links.map((link: any, i: number) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg font-medium hover:underline flex items-center gap-2"
                                    >
                                        {link.title} ↗
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
