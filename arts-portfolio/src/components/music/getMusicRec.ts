import { client } from '@/sanity/lib/client';
import { MUSIC_REC_QUERY, RECORD_CRATE_QUERY } from '@/sanity/lib/queries';
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

// Title and artist from YouTube's public oEmbed info (no API key needed).
async function toRecord(youtubeUrl: string, extra: Partial<MusicRecData> = {}): Promise<MusicRecData | null> {
    const videoId = youtubeId(youtubeUrl);
    if (!videoId) return null;
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const meta: { title?: string; author_name?: string; author_url?: string } | null = await fetch(
        `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
        { next: { revalidate: 86400 } },
    )
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

    const { artist, song } = splitTitle(meta?.title ?? 'Untitled', meta?.author_name);
    return {
        videoId,
        url,
        song,
        // YouTube's auto-generated "Artist - Topic" channels name the artist.
        artist: artist.replace(/\s+-\s+Topic$/, ''),
        channel: meta?.author_name,
        channelUrl: meta?.author_url,
        ...extra,
    };
}

export async function getMusicRec(): Promise<MusicRecData | null> {
    const doc: { youtubeUrl?: string; note?: string; weekOf?: string } | null = await client
        .fetch(MUSIC_REC_QUERY, {}, { next: { revalidate: 60 } })
        .catch(() => null);

    const rec = await toRecord(doc?.youtubeUrl || FALLBACK_URL, {
        weekly: true,
        note: doc?.note?.trim() || undefined,
        weekOf: doc?.weekOf,
    });
    return rec ?? toRecord(FALLBACK_URL, { weekly: true });
}

// Used until the Record crate is filled in the Studio: songs from Hear. Feel. Create.
const DEFAULT_CRATE: { youtubeUrl: string; note: string }[] = [
    { youtubeUrl: 'https://www.youtube.com/watch?v=FvOpPeKSf_4', note: 'One of the songs I drew to for Hear. Feel. Create.' },
    { youtubeUrl: 'https://www.youtube.com/watch?v=VzAjXdBJsEc', note: 'One of the songs I drew to for Hear. Feel. Create.' },
    { youtubeUrl: 'https://www.youtube.com/watch?v=K3Qzzggn--s', note: 'One of the songs I drew to for Hear. Feel. Create.' },
    { youtubeUrl: 'https://www.youtube.com/watch?v=EZE62LpaqHg', note: 'One of the songs I drew to for Hear. Feel. Create.' },
    { youtubeUrl: 'https://www.youtube.com/watch?v=p38xW-IjvOc', note: 'One of the songs I drew to for Hear. Feel. Create.' },
];

// The room's crate: records besides the weekly rec.
export async function getRecordCrate(): Promise<MusicRecData[]> {
    const docs: { youtubeUrl?: string; note?: string }[] | null = await client
        .fetch(RECORD_CRATE_QUERY, {}, { next: { revalidate: 60 } })
        .catch(() => null);
    const list = docs?.filter((d) => d.youtubeUrl).length ? docs : DEFAULT_CRATE;
    const records = await Promise.all(
        list.map((d) => toRecord(d.youtubeUrl!, { note: d.note?.trim() || undefined })),
    );
    return records.filter((r): r is MusicRecData => !!r);
}
