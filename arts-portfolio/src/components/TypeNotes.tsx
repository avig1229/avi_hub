'use client';

import { useState } from 'react';

// About page: why the site is set the way it is, with a live tester.
// DRAFT copy in Avi's voice; edit freely.

const FACES = [
    {
        name: 'Philosopher',
        role: 'Headings',
        cls: 'font-display',
        designer: 'Jovanny Lemonad',
        weights: '400, 700 + italics',
        sample: 'Made by hand, told in type.',
        why: 'A humanist serif with calligraphic, slightly flared strokes. It is softer and more editorial than a hard geometric sans, so titles feel written, not stamped.',
    },
    {
        name: 'Mulish',
        role: 'Body & interface',
        cls: 'font-sans',
        designer: 'Vernon Adams',
        weights: 'variable, 200–1000',
        sample: 'Open, even letterforms that stay easy to read, paragraph after paragraph.',
        why: 'A clean, low-contrast sans with open shapes. It stays quiet next to Philosopher and keeps longer stories easy to read, which the old all-monospace body text never did.',
    },
    {
        name: 'Roboto Mono',
        role: 'Labels',
        cls: 'font-mono',
        designer: 'Christian Robertson',
        weights: 'variable, 100–700',
        sample: 'SECTION 01 · INDEX',
        why: 'Kept from the previous version, now only for small uppercase labels: section tags, numbering, and other small metadata. A little technical texture, and a nod to the tech side of what I do.',
    },
];

const DEFAULT_TEXT = 'The quick brown fox jumps over the lazy dog.';

export default function TypeNotes() {
    const [text, setText] = useState(DEFAULT_TEXT);
    const shown = text.trim() ? text : DEFAULT_TEXT;

    return (
        <section className="mt-32 border-t border-gray-200 dark:border-gray-800 pt-16" aria-labelledby="type-notes">
            <span className="font-mono text-sm tracking-widest text-gray-500 block mb-4 uppercase">For the type nerds</span>
            <h2 id="type-notes" className="text-5xl md:text-7xl font-bold leading-none">
                Type notes
            </h2>
            <p className="mt-8 max-w-3xl text-xl md:text-2xl font-light leading-snug text-gray-600 dark:text-gray-400">
                This site is set in three typefaces, each with one job: a calligraphic serif for voice, a quiet sans
                for reading, and a mono for the system around them. The serif carries the emotion; the sans gets out
                of the way.
            </p>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                {FACES.map((f) => (
                    <article
                        key={f.name}
                        className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-800 p-6 md:p-8"
                    >
                        <div className="flex items-baseline justify-between gap-4">
                            <span className="font-mono text-xs tracking-widest uppercase text-gray-500">{f.role}</span>
                            <span className="font-mono text-xs text-gray-400">{f.weights}</span>
                        </div>
                        <div className={`${f.cls} mt-6 text-8xl leading-none`} aria-hidden>
                            Aa
                        </div>
                        {/* Span carries the face: the global h1–h6 rule would force Philosopher. */}
                        <h3 className="mt-6 text-3xl leading-tight">
                            <span className={f.cls}>{f.name}</span>
                        </h3>
                        <span className="mt-1 text-sm text-gray-500">{f.designer}</span>
                        <p className={`${f.cls} mt-6 text-lg leading-snug`}>{f.sample}</p>
                        <p className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                            {f.why}
                        </p>
                    </article>
                ))}
            </div>

            <div className="mt-16">
                <label htmlFor="type-tester" className="font-mono text-xs tracking-widest uppercase text-gray-500">
                    Try it · type anything
                </label>
                <input
                    id="type-tester"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={80}
                    spellCheck={false}
                    className="mt-3 w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-3 text-xl md:text-2xl outline-none focus:border-gray-900 dark:focus:border-gray-100 transition-colors"
                />
                <div className="mt-10 space-y-8">
                    {FACES.map((f) => (
                        <div key={f.name} className="grid md:grid-cols-[10rem_1fr] gap-2 md:gap-8 items-baseline">
                            <span className="font-mono text-xs tracking-widest uppercase text-gray-500">{f.name}</span>
                            <p
                                className={`${f.cls} text-3xl md:text-5xl leading-tight break-words ${
                                    f.cls === 'font-mono' ? 'uppercase' : ''
                                }`}
                            >
                                {shown}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
