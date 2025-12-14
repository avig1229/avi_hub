import ProjectCard from './ProjectCard';
import { client } from '@/sanity/lib/client';
import { PROJECTS_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';

export default async function ProjectGrid() {
    const projects = await client.fetch(PROJECTS_QUERY);

    return (
        <section id="work" className="py-12">
            {/* 
        Using CSS columns for a masonry-like effect. 
        'columns-1 md:columns-2 lg:columns-3' creates the layout.
        'gap-8' sets space between columns.
      */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {projects.length > 0 ? (
                    projects.map((project: any, index: number) => (
                        <ProjectCard
                            key={project._id}
                            index={index}
                            title={project.title}
                            category={project.category}
                            slug={project.slug}
                            image={project.mainImage ? urlFor(project.mainImage).width(800).url() : undefined}
                        />
                    ))
                ) : (
                    <div className="p-12 text-center border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 font-mono">
                        No projects found. Add them in the Sanity Studio.
                    </div>
                )}
            </div>
        </section>
    );
}
