'use client';

import { motion } from 'framer-motion';

const experiences = [
  {
    title: 'Design Intern',
    company: 'Creative Studio',
    period: 'Summer 2023',
    description: [
      'Assisted in the design and development of user interfaces for web applications',
      'Collaborated with senior designers on branding projects',
      'Conducted user research and created wireframes',
    ],
  },
  {
    title: 'Freelance Designer',
    company: 'Self-employed',
    period: '2022 - Present',
    description: [
      'Designed and developed websites for small businesses',
      'Created brand identities and marketing materials',
      'Managed client relationships and project timelines',
    ],
  },
];

const education = [
  {
    degree: 'Bachelor of Fine Arts in Design',
    school: 'University of Design',
    period: '2019 - 2023',
    description: [
      'Major in Graphic Design',
      'Minor in User Experience Design',
      'Dean\'s List, 3.8 GPA',
    ],
  },
];

const skills = [
  {
    category: 'Design',
    items: ['UI/UX Design', 'Visual Design', 'Branding', 'Typography'],
  },
  {
    category: 'Tools',
    items: ['Figma', 'Adobe Creative Suite', 'Sketch', 'InVision'],
  },
  {
    category: 'Development',
    items: ['HTML/CSS', 'JavaScript', 'React', 'Next.js'],
  },
];

export default function Resume() {
  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Name</h1>
            <p className="text-xl text-gray-600">Design Studio Intern</p>
          </div>

          {/* Experience */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Experience</h2>
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {exp.title}
                      </h3>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500">{exp.period}</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Education</h2>
            <div className="space-y-12">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {edu.degree}
                      </h3>
                      <p className="text-gray-600">{edu.school}</p>
                    </div>
                    <span className="text-sm text-gray-500">{edu.period}</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {edu.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Skills</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {skills.map((skillGroup, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {skillGroup.category}
                  </h3>
                  <ul className="space-y-2">
                    {skillGroup.items.map((skill, i) => (
                      <li key={i} className="text-gray-600">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Download Button */}
          <div className="mt-16 text-center">
            <a
              href="/resume.pdf"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Resume
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 