import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find(p => p.slug === params.slug);
  if (!project) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <img src={project.cover} alt={project.name} className="rounded-xl mb-8 w-full object-cover" />
      <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
      <p className="text-xl text-accent mb-6">{project.tagline}</p>
      <p className="mb-6">{project.description}</p>
      <ul className="mb-6 list-disc list-inside">
        {project.highlights.map((h, i) => <li key={i}>{h}</li>)}
      </ul>
      <div className="mb-6 flex flex-wrap gap-4">
        {project.tools.map(tool => (
          <span key={tool} className="bg-gray-100 px-3 py-1 rounded-full">{tool}</span>
        ))}
      </div>
      <div className="mb-6">
        <strong>Your Role:</strong> {project.role}
      </div>
      <div className="mb-6 flex gap-4">
        {project.links.website && <a href={project.links.website} className="text-blue-600" target="_blank">Website</a>}
        {project.links.instagram && <a href={project.links.instagram} className="text-blue-600" target="_blank">Instagram</a>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {project.gallery.map((img, i) => (
          <img key={i} src={img} alt={`${project.name} screenshot ${i+1}`} className="rounded-lg" />
        ))}
      </div>
    </div>
  );
} 