import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen py-12 max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-12">
                ABOUT
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="relative aspect-[3/4] bg-gray-200 dark:bg-gray-800">
                    {/* Placeholder for Profile Picture */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-mono">
                        PROFILE IMAGE
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="text-xl md:text-2xl font-medium leading-relaxed">
                        <p className="mb-6">
                            I am a digital artist and creative technologist based in [Location]. My work explores the boundaries between code, design, and human interaction.
                        </p>
                        <p className="text-gray-500">
                            Currently studying "Arts in Digital Realm".
                        </p>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                        <h2 className="text-sm font-mono uppercase tracking-widest mb-6">Experience & Exhibitions</h2>
                        <ul className="space-y-4 font-mono text-sm">
                            <li className="flex justify-between">
                                <span>Digital Art Showcase</span>
                                <span className="text-gray-500">2024</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Creative Coding Workshop</span>
                                <span className="text-gray-500">2023</span>
                            </li>
                        </ul>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                        <h2 className="text-sm font-mono uppercase tracking-widest mb-6">Contact</h2>
                        <div className="flex flex-col gap-2 font-mono text-sm">
                            <a href="mailto:hello@example.com" className="hover:underline">hello@example.com</a>
                            <a href="#" className="hover:underline">Instagram</a>
                            <a href="#" className="hover:underline">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
