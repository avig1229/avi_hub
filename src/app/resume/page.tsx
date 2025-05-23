'use client';

import { motion } from 'framer-motion';
import { 
  SiFigma, 
  SiAdobexd, 
  SiPython, 
  SiR, 
  SiHtml5, 
  SiCss3, 
  SiFlutter, 
  SiVuedotjs, 
  SiTailwindcss,
  SiJavascript,
  SiNotion,
  SiMiro
} from 'react-icons/si';
import { IconType } from 'react-icons';

const SkillIcon = ({ icon: Icon, name }: { icon: IconType; name: string }) => (
  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <Icon className="w-12 h-12 text-primary mb-2" />
    <span className="text-sm text-gray-600">{name}</span>
  </div>
);

export default function Resume() {
  const technicalSkills = [
    { icon: SiFigma, name: 'Figma' },
    { icon: SiAdobexd, name: 'Adobe XD' },
    { icon: SiPython, name: 'Python' },
    { icon: SiR, name: 'R' },
    { icon: SiHtml5, name: 'HTML5' },
    { icon: SiCss3, name: 'CSS3' },
    { icon: SiFlutter, name: 'Flutter' },
    { icon: SiVuedotjs, name: 'Vue.js' },
    { icon: SiTailwindcss, name: 'Tailwind' },
    { icon: SiJavascript, name: 'JavaScript' },
    { icon: SiNotion, name: 'Notion' },
    { icon: SiMiro, name: 'Miro' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-12 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl font-bold text-primary mb-2"
                >
                  Min-Kuan Gu
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-xl text-accent font-medium"
                >
                  Graphic/Product Designer & Software Engineer
                </motion.p>
              </div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-start md:items-end gap-2"
              >
                <p className="text-gray-600">San Francisco, CA</p>
                <a href="mailto:avi@merakicorp.co" className="text-primary hover:text-accent transition-colors">
                  avi@merakicorp.co
                </a>
                <a href="https://www.linkedin.com/in/avigu/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">
                  linkedin.com/in/avigu
                </a>
                <a href="https://www.instagram.com/aviggu/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">
                  instagram.com/aviggu
                </a>
                <a href="https://shrma.notion.site" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors">
                  shrma.notion.site
                </a>
              </motion.div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-12">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-12">
                {/* Education */}
                <section>
                  <h2 className="text-2xl font-bold text-primary mb-6">Education</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">Minerva University</h3>
                        <p className="text-gray-600">San Francisco, CA</p>
                      </div>
                      <span className="text-sm text-gray-500">May 2026</span>
                    </div>
                    <p className="text-gray-700 mb-2">
                      Bachelor of Science in Computational Sciences (Concentration: Artificial Intelligence)
                    </p>
                    <p className="text-gray-600 text-sm">
                      Acceptance rate under 1%; study and work across seven global cities in 4 years; ranked as #1 most innovative university in the world in 2022, 2023, and 2024 by WURI
                    </p>
                  </div>
                </section>

                {/* Work Experience */}
                <section>
                  <h2 className="text-2xl font-bold text-primary mb-6">Work Experience</h2>
                  <div className="space-y-8">
                    {/* Meraki Co */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Founder, Creative Director | Meraki Co.</h3>
                          <p className="text-gray-600">Taipei, Taiwan</p>
                        </div>
                        <span className="text-sm text-gray-500">Jun 2024 - Present</span>
                      </div>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Directed a team of five for two product drops (seasons) by developing brand design systems and R&D team workflow, casting and organizing product photoshoots, and establishing online fashion research lab, accumulating 500+ brand following and 200k total content views.</li>
                        <li>Curated 2 in-person pop-up campaigns emphasizing the Taiwanese-Americana brand experience, including live DJ sets, cocktail bar, and live performances from 20+ artists, attracting participation of 300+ customers.</li>
                        <li>Oversaw the end-to-end product lifecycle, from product conceptualization, clothing line production, inventory management, and marketing strategies, attracting 5500 USD sales in the brand&apos;s initial two drops.</li>
                      </ul>
                    </div>

                    {/* Viainno */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">UI/UX Researcher, Product Designer | Viainno Corporation</h3>
                          <p className="text-gray-600">Taipei, Taiwan</p>
                        </div>
                        <span className="text-sm text-gray-500">Jul 2023 - Present</span>
                      </div>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Led product design team in restructuring company website with special emphasis on internationalizing product functionality contents using Figma, HTML, CSS Tailwind, and Vue.JS framework.</li>
                        <li>Collaborated with front-end and back-end engineers in enhancing product Dashboard usability by conducting user journey analysis and designing new property waste management and financial analytic tools using Figma, Flutter, and Java Script.</li>
                        <li>Conducted smart building market research and foreign field testing to produce promotional content for company expansion strategies, leading to 20 new international clients, 200% user growth, in Singapore and Korea in Q2 of 2024.</li>
                      </ul>
                    </div>

                    {/* Gensler */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Database Product Designer | Gensler</h3>
                          <p className="text-gray-600">San Francisco, CA</p>
                        </div>
                        <span className="text-sm text-gray-500">Sep 2022 - Apr 2023</span>
                      </div>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Supervised a cross-disciplinary team of 6 to research and develop an open-source material database to improve the architects&apos; design workflow by 40%, using Figma, Miro, and Notion.</li>
                        <li>Proposed database prototype after year-long building material research, 30+ architect interviews, and user testing, receiving the best project pitch award.</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="space-y-12">
                {/* Certifications */}
                <section>
                  <h2 className="text-2xl font-bold text-primary mb-6">External Coursework and Certification</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full"></span>
                        <span className="text-gray-700">CS50 by Harvard University</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full"></span>
                        <span className="text-gray-700">Data Structures and Algorithms Specialization by UC San Diego</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full"></span>
                        <span className="text-gray-700">UX Design Professional Certificate by Google</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full"></span>
                        <span className="text-gray-700">INSIDE LVMH Certificate by LVMH</span>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Skills */}
                <section>
                  <h2 className="text-2xl font-bold text-primary mb-6">Skills</h2>
                  
                  {/* Technical Skills Grid */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Technical Skills</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {technicalSkills.map((skill, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <SkillIcon icon={skill.icon} name={skill.name} />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Languages</h3>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                        <span className="text-lg">🇺🇸</span>
                        <span className="text-gray-700">English</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                        <span className="text-lg">🇹🇼</span>
                        <span className="text-gray-700">Chinese</span>
                      </div>
                    </div>
                  </div>

                  {/* Leadership Experience */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Leadership Experience</h3>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Founder and one-year lead in Generation Z (student NPO)</li>
                        <li>President of Model United Nations</li>
                        <li>Chair of CK Graduation committee</li>
                        <li>Design lead of web development at Viainno Corporation</li>
                        <li>Community Event Lead at Minerva University</li>
                        <li>Creative director at Meraki.Co</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="p-8 text-center bg-gray-50 border-t border-gray-100">
            <a
              href="https://docs.google.com/document/d/18UywrGehqUzPftBzepQAAJYY11YhZ47rDganwxrXyO4/export?format=pdf"
              className="inline-block bg-accent text-white px-8 py-4 rounded-lg hover:bg-accent-dark transition-colors"
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