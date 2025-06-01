'use client';

import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find(p => p.slug === params.slug);
  if (!project) return notFound();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="mb-16">
        <img src={project.cover} alt={project.name} className="rounded-xl mb-8 w-full object-cover aspect-video" />
        <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
        <p className="text-xl text-gray-600 mb-6">{project.tagline}</p>
        <p className="text-lg text-gray-700 mb-6">{project.description}</p>
      </div>

      {/* Seasons Section */}
      {project.seasons && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Seasons</h2>
          <div className="space-y-16">
            {project.seasons.map((season, index) => (
              <div
                key={season.name}
                className="bg-white rounded-xl p-8 shadow-sm fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-2xl font-bold mb-4">{season.name}</h3>
                <p className="text-gray-700 mb-6">{season.description}</p>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Highlights</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {season.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {season.gallery.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${season.name} image ${i + 1}`}
                      className="rounded-lg object-cover aspect-video"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Creative Archive Section */}
      {project.creativeArchive && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Creative Archive</h2>
          <div className="bg-white rounded-xl p-8 shadow-sm fade-in">
            <h3 className="text-2xl font-bold mb-4">{project.creativeArchive.name}</h3>
            <p className="text-gray-700 mb-6">{project.creativeArchive.description}</p>
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Highlights</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {project.creativeArchive.highlights.map((highlight, i) => (
                  <li key={i}>{highlight}</li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.creativeArchive.gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${project.creativeArchive.name} image ${i + 1}`}
                  className="rounded-lg object-cover aspect-video"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tools and Links */}
      <div className="bg-gray-50 rounded-xl p-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Tools Used</h3>
          <div className="flex flex-wrap gap-2">
            {project.tools.map(tool => (
              <span key={tool} className="bg-white px-3 py-1 rounded-full text-sm">
                {tool}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          {project.links.website && (
            <a
              href={project.links.website}
              className="text-blue-600 hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Website
            </a>
          )}
          {project.links.instagram && (
            <a
              href={project.links.instagram}
              className="text-blue-600 hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 