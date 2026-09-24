import { client } from '@/sanity/lib/client';
import { MUSIC_REC_QUERY } from '@/sanity/lib/queries';
import type { MusicRecData } from './MusicRec';

// Used until a Weekly music rec is published in the Studio.
const FALLBACK_URL = 'https://www.youtube.com/watch?v=06UY21yZyQY';

export function youtubeId(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null;
        if (u.pathname.startsWith('/shorts/') || u.pathname.startsWith('/embed/')) return u.pathname.split('/')[2] || null;
        return u.searchParams.get('v');
    } catch {
        return null;
    }
}

// "Soft Lipa - 日本房間 Official Music Video" -> artist "Soft Lipa", song "日本房間"
function splitTitle(title: string, channel?: string) {
    const clean = title.replace(/[([]?\s*official\s+(music\s+)?(video|audio|mv)\s*[)\]]?/gi, '').replace(/\s+/g, ' ').trim();
    const [artist, ...rest] = clean.split(/\s[-–—]\s/);
    return rest.length ? { artist: artist.trim(), song: rest.join(' - ').trim() } : { artist: channel ?? '', song: clean };
}

export async function getMusicRec(): Promise<MusicRecData | null> {
    const doc: { youtubeUrl?: string; note?: string; weekOf?: string } | null = await client
        .fetch(MUSIC_REC_QUERY, {}, { next: { revalidate: 60 } })
        .catch(() => null);

    const videoId = youtubeId(doc?.youtubeUrl || FALLBACK_URL) ?? youtubeId(FALLBACK_URL)!;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    // Public oEmbed info: title and channel, no API key needed.
    const meta: { title?: string; author_name?: string; author_url?: string } | null = await fetch(
        `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
        { next: { revalidate: 86400 } },
    )
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

    const { artist, song } = splitTitle(meta?.title ?? 'This week’s song', meta?.author_name);
    return {
        videoId,
        url,
        song,
        artist,
        channel: meta?.author_name,
        channelUrl: meta?.author_url,
        note: doc?.note?.trim() || undefined,
        weekOf: doc?.weekOf,
    };
}
