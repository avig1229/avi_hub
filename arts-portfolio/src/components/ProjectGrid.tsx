import WorkSelect, { type WorkItem } from './WorkSelect';
import { client } from '@/sanity/lib/client';
import { PROJECTS_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';

export default async function ProjectGrid() {
    const projects = await client.fetch(PROJECTS_QUERY);

    const items: WorkItem[] = projects.map((project: any) => {
        const block = project.content?.find((b: any) => b._type === 'block' && b.children);
        return {
            slug: project.slug,
            title: project.title,
            category: project.category,
            date: project.date,
            summary: block ? block.children.map((c: any) => c.text).join('') : undefined,
            screen: project.mainImage ? urlFor(project.mainImage).width(1400).auto('format').quality(80).url() : undefined,
            thumb: project.mainImage ? urlFor(project.mainImage).width(320).height(320).auto('format').url() : undefined,
        };
    });

    return <WorkSelect items={items} />;
}
