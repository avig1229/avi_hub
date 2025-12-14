import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { PROJECT_QUERY } from '@/sanity/lib/queries';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await client.fetch(PROJECT_QUERY, { slug });

    const components = {
        types: {
            videoEmbed: ({ value }: any) => {
                if (!value.url) return null;
                // Simple YouTube/Vimeo ID extraction could go here, or just use a generic iframe if possible.
                // For simplicity/robustness without regex, we might just assume the user provides an embed link or we rely on a library.
                // Let's assume standard YouTube/Vimeo logic or just link for now if extraction is complex.
                // A better approach for "Copy Paste URL" without a library is a simple "Watch on specific platform" or a basic regex.
                // Let's use a basic iframe assuming the user knows to use embed URLs, OR use a helper. 
                // Actually, let's just make it a link "Watch Video" if complexity is high, boundaries are tight.
                // Better: Use a simple function to convert youtube.com/watch?v=ID to youtube.com/embed/ID

                const isYoutube = value.url.includes('youtube.com') || value.url.includes('youtu.be');
                let embedUrl = value.url;
                if (isYoutube) {
                    const videoId = value.url.split('v=')[1]?.split('&')[0] || value.url.split('/').pop();
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                }

                return (
                    <div className="my-8 aspect-video w-full">
                        <iframe
                            src={embedUrl}
                            className="w-full h-full rounded-sm"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                );
            }
        }
    }

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
                    <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
                        <PortableText value={project.content} components={components} />
                    </div>

                    {project.gallery && (
                        <div className="space-y-24">
                            {project.gallery.map((image: any, i: number) => {
                                // Dynamic Layout Logic
                                const isFull = i % 3 === 0;
                                const isRight = i % 3 === 1;
                                const isVideo = image._type === 'file';

                                let containerClass = "w-full";
                                if (!isVideo) {
                                    if (isRight) containerClass = "w-[85%] ml-auto";
                                    else if (!isFull) containerClass = "w-[85%] mr-auto";
                                } else {
                                    // Helper class to center content
                                    containerClass = "w-full flex flex-col items-center justify-center";
                                }

                                return (
                                    <div key={i} className={containerClass}>
                                        {isVideo ? (
                                            <div className="text-center max-w-full">
                                                <video
                                                    src={image.url}
                                                    controls
                                                    className="w-auto max-w-full max-h-[85vh] h-auto rounded-sm shadow-sm mx-auto"
                                                />
                                                {image.caption && (
                                                    <p className="mt-3 text-sm font-mono text-gray-500 dark:text-gray-400">
                                                        {image.caption}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <Image
                                                src={urlFor(image).width(1200).url()}
                                                alt={`Gallery image ${i + 1}`}
                                                width={1200}
                                                height={800}
                                                className="w-full h-auto rounded-sm shadow-sm"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
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
                </div>
            </div>
        </article>
    );
}
