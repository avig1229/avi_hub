'use client';

import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface GalleryItem {
    _type: 'image' | 'file';
    url?: string;
    caption?: string;
    [key: string]: any;
}

interface GalleryGridProps {
    items: GalleryItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-24">
            {items.map((image: GalleryItem, i: number) => {
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
                            <div className="text-center">
                                {/* Only try to render image if it has an asset or specific Sanity image structure that urlFor handles. 
                                    Assuming 'image' here is the full Sanity image object if it came from _type=='image' 
                                 */}
                                {image.url ? (
                                    /* If we have a direct URL (from query projection), use it. 
                                       Note: urlFor usually takes a source (image object). 
                                       The query returns "url": asset->url. 
                                       However, urlFor needs the sanity image object to do transformations like width(). 
                                       
                                       Wait, my previous query projection was:
                                       _type == "image" => { "url": asset->url, "caption": caption }
                                       
                                       But `urlFor(image)` in the original code expects a SanityImageSource. 
                                       If I only pass `{url: '...', caption: '...'}` to `urlFor`, it might fail if strictly typed or if urlFor expects _ref.
                                       
                                       Let's check `src/sanity/lib/image.ts` or similar? 
                                       
                                       In the original code: `src={urlFor(image).width(1200).url()}`
                                       The `image` object in the loop came from `gallery[]` in the query PROJECT_QUERY.
                                       
                                       Let's look at the query again.
                                       PROJECT_QUERY:
                                       gallery[]{
                                           ...,
                                           _type == "image" => { "url": asset->url, "caption": caption },
                                           ...
                                       }
                                       
                                       The `...` fetches all fields. So it includes `asset`, `hotspot`, etc.
                                       The projection adds `url` and `caption`.
                                       
                                       So `image` passed to `urlFor` IS the sanity image object + extra fields.
                                       
                                       HOWEVER, `urlFor` works on the source. 
                                       If I pass the whole object, it works.
                                       
                                       BUT, if I am using `urlFor(image).width(1200).url()`, I need to make sure `image` is valid source.
                                       
                                       In the extracted component, I should just pass the whole object.
                               */
                                    <Image
                                        src={urlFor(image).width(1200).url()}
                                        alt={image.caption || `Gallery image ${i + 1}`}
                                        width={1200}
                                        height={800}
                                        className="w-full h-auto rounded-sm shadow-sm"
                                    />
                                ) : (
                                    /* Fallback or if structure is different */
                                    <div className="bg-gray-200 h-64 flex items-center justify-center">No Image URL</div>
                                )}
                                {image.caption && (
                                    <p className="mt-3 text-sm font-mono text-gray-500 dark:text-gray-400">
                                        {image.caption}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
