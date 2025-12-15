import ProjectCard from './ProjectCard';
import { client } from '@/sanity/lib/client';
import { PROJECTS_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';

export default async function ProjectGrid() {
    const projects = await client.fetch(PROJECTS_QUERY);

    // Calculate total pieces (gallery items + main image + subsection items for each project)
    const totalPieces = projects.reduce((acc: number, project: any) => {
        const galleryCount = project.galleryCount || 0;
        const mainImageCount = project.mainImage ? 1 : 0;
        const linksCount = project.linksCount || 0;
        const subsectionCount = project.subsections?.reduce((subAcc: number, sub: any) => {
            return subAcc + (sub.gallery?.length || 0);
        }, 0) || 0;

        return acc + galleryCount + mainImageCount + subsectionCount + linksCount;
    }, 0);

    return (
        <section id="work" className="py-12">
            <div className="flex justify-between items-baseline mb-12 border-b border-black dark:border-white pb-4">
                <h2 className="text-4xl font-bold tracking-tighter uppercase">Selected Work</h2>
                <span className="font-mono text-sm uppercase tracking-widest text-gray-500">
                    {totalPieces} {totalPieces === 1 ? 'Piece' : 'Pieces'} in Total
                </span>
            </div>
            {/* 
        Using CSS columns for a masonry-like effect. 
        'columns-1 md:columns-2 lg:columns-3' creates the layout.
        'gap-8' sets space between columns.
      */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {projects.length > 0 ? (
                    projects.map((project: any, index: number) => {
                        const block = project.content?.find((b: any) => b._type === 'block' && b.children);
                        const summary = block ? block.children.map((c: any) => c.text).join('') : '';

                        return (
                            <ProjectCard
                                key={project._id}
                                index={index}
                                title={project.title}
                                category={project.category}
                                slug={project.slug}
                                image={project.mainImage ? urlFor(project.mainImage).width(800).url() : undefined}
                                summary={summary}
                            />
                        );
                    })
                ) : (
                    <div className="p-12 text-center border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 font-mono">
                        No projects found. Add them in the Sanity Studio.
                    </div>
                )}
            </div>
        </section>
    );
}
