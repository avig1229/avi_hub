import Image from "next/image";
import TypeNotes from "@/components/TypeNotes";

export default function AboutPage() {
    return (
        <div className="min-h-screen py-12 md:py-24 max-w-[1400px] mx-auto">
            <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter mb-24 text-center md:text-left mix-blend-difference">
                ABOUT
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-start">

                {/* Profile Image - Wider Column */}
                <div className="md:col-span-5 relative aspect-[3/4] w-full bg-gray-100 dark:bg-gray-800 rounded-sm overflow-hidden">
                    <Image
                        src="/profile.jpg"
                        alt="Avi Profile"
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                        priority
                    />
                </div>

                {/* Bio Content - Wider Column and Styled Typography */}
                <div className="md:col-span-7 space-y-12">
                    <div className="text-2xl md:text-4xl font-light leading-tight">
                        <p className="mb-12">
                            <span className="font-mono text-sm tracking-widest text-gray-500 block mb-4 uppercase">Introduction</span>
                            Hi, this is <span className="font-serif italic font-bold">Avi</span>!
                            I'm a <span className="text-orange-600 dark:text-orange-400 font-medium">passionate product designer</span> with a keen eye for user-centered design and a drive for
                            <span className="font-serif italic"> innovation</span>,
                            <span className="font-serif italic"> creation</span>, and
                            <span className="font-serif italic"> curation</span>.
                        </p>

                        <p className="mb-12">
                            With experience spanning across
                            <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded mx-1 text-blue-800 dark:text-blue-300 text-3xl">tech</span>,
                            <span className="bg-pink-100 dark:bg-pink-900/30 px-2 py-0.5 rounded mx-1 text-pink-800 dark:text-pink-300 text-3xl">design</span>, and
                            <span className="bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded mx-1 text-purple-800 dark:text-purple-300 text-3xl">fashion</span>
                            industry, I specialize in creating intuitive and engaging digital experiences that solve real-world problems.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg md:text-xl font-mono text-gray-600 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-800">
                            <div>
                                <h3 className="uppercase text-xs tracking-widest text-black dark:text-white mb-4">Approach</h3>
                                <p>Combining thorough user research, creative problem-solving, and a deep understanding of UI/UX.</p>
                            </div>
                            <div>
                                <h3 className="uppercase text-xs tracking-widest text-black dark:text-white mb-4">Toolkit</h3>
                                <p>Figma, Framer, Adobe Suite, HTML/CSS, JS, Flutter.</p>
                            </div>
                        </div>

                        <p className="pt-12 text-xl md:text-2xl">
                            I'm always excited to take on new challenges and collaborate on projects that push the boundaries of design. <br />
                            <span className="font-serif italic text-3xl block mt-4 text-gray-400">Let's create something amazing together!</span>
                        </p>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-800 pt-12">
                        <h2 className="text-sm font-mono uppercase tracking-widest mb-8">Connect</h2>
                        <div className="flex flex-wrap gap-8 font-mono text-lg">
                            <a href="mailto:hello@example.com" className="hover:text-orange-500 transition-colors">avig1.22.9@gmail.com</a>
                            <a href="#" className="hover:text-blue-500 transition-colors">Instagram</a>
                            <a href="#" className="hover:text-pink-500 transition-colors">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </div>

            <TypeNotes />
        </div>
    );
}
