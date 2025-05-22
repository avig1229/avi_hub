'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const projects = [
  {
    id: 1,
    title: 'Project One',
    description: 'A comprehensive redesign of a mobile application focusing on user experience and accessibility.',
    category: 'UI/UX Design',
    image: '/project1.jpg',
    tags: ['Mobile App', 'UX Research', 'Prototyping'],
  },
  {
    id: 2,
    title: 'Project Two',
    description: 'Brand identity and visual design system for a sustainable fashion startup.',
    category: 'Branding',
    image: '/project2.jpg',
    tags: ['Brand Identity', 'Visual Design', 'Design System'],
  },
  {
    id: 3,
    title: 'Project Three',
    description: 'Interactive web platform for creative professionals to showcase their portfolios.',
    category: 'Web Design',
    image: '/project3.jpg',
    tags: ['Web Design', 'Interaction Design', 'Frontend'],
  },
];

export default function Projects() {
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Projects</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl">
            A collection of my design work, showcasing my approach to solving
            complex problems through thoughtful design solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-video bg-gray-100"></div>
                <div className="p-8">
                  <div className="mb-4">
                    <span className="text-sm font-medium text-blue-600">
                      {project.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {project.title}
                  </h2>
                  <p className="text-gray-600 mb-6">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700"
                  >
                    View Case Study
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
} 