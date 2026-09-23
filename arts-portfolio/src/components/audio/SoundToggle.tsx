'use client';

import { useAudio } from './AudioProvider';

// Only rendered on pages that register a soundtrack.
export function SoundToggle() {
    const { track, enabled, toggle } = useAudio();
    if (!track) return null;

    return (
        <button
            onClick={toggle}
            aria-pressed={enabled}
            aria-label={enabled ? 'Mute soundtrack' : 'Play soundtrack'}
            className="h-10 px-3 rounded-full flex items-center gap-2 border border-gray-300 dark:border-gray-700 text-xs font-mono tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
            <span className="flex items-end gap-[2px] h-3" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                    <span
                        key={i}
                        className={`w-[2px] bg-current origin-bottom ${enabled ? 'animate-sound-bar' : 'h-[3px]'}`}
                        style={enabled ? { animationDelay: `${i * 0.15}s`, height: '100%' } : undefined}
                    />
                ))}
            </span>
            {enabled ? 'SOUND ON' : 'SOUND OFF'}
        </button>
    );
}
