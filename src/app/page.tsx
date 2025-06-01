'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { SiFigma, SiAdobe, SiPython, SiFlutter, SiVuedotjs, SiJavascript, SiNotion, SiMiro } from 'react-icons/si';
import { FaCuttlefish, FaPaintBrush, FaFilm, FaCode } from 'react-icons/fa';

export default function Home() {
  const technicalSkills = [
    { icon: SiFigma, name: 'Figma' },
    { icon: SiAdobe, name: 'Adobe Suite' },
    { icon: FaPaintBrush, name: 'Procreate' },
    { icon: FaFilm, name: 'Final Cut Pro' },
    { icon: FaCuttlefish, name: 'CLO 3D' },
    { icon: SiPython, name: 'Python' },
    { icon: FaCode, name: 'Fullstack Web Development' },
    { icon: SiFlutter, name: 'Flutter' },
    { icon: SiVuedotjs, name: 'Vue.js' },
    { icon: SiJavascript, name: 'JavaScript' },
    { icon: SiNotion, name: 'Notion' },
    { icon: SiMiro, name: 'Miro' }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Hi, I&apos;m <span className="text-blue-600">AVIGU</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            I am a clothing designer, graphic designer, and full-stack web developer. I am passionate about fashion and eagerly looking for opportunities to redefine the Taiwanese fashion scene. The following are the main projects I&apos;ve been working on!
          </p>
        </motion.div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img src={project.cover} alt={project.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <p className="text-gray-600 mb-4">{project.tagline}</p>
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-blue-600 hover:text-blue-700 inline-flex items-center"
                >
                  View Project
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Skills & Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              'Brand Management',
              'Marketing Strategizing',
              'Clothing Product Development',
              'Brand Data Analytics',
            ].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm flex items-center justify-center text-center"
              >
                <h3 className="font-semibold text-gray-900 text-lg">{category}</h3>
              </motion.div>
            ))}
          </div>

          {/* Technical Skills Grid */}
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Technical Skills</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {technicalSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col items-center bg-white rounded-xl p-6 shadow-sm"
              >
                <skill.icon className="text-4xl mb-3 text-gray-700" />
                <span className="font-medium text-gray-900">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Let&apos;s Work Together
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of your visions.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get in Touch
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
