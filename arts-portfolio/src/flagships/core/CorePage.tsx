import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { BUILTIN_SERIES, DEFAULT_SERIES, FALLBACK_COLORS, shiftHue } from './content';
import CoreExperience from './CoreExperience';
import type { Piece, SeriesData } from './Collection';

const PIECE = `{
  "url": asset->url,
  "file": asset->originalFilename,
  caption,
  story,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const CORE_QUERY = groq`*[_type == "project" && slug.current == "core-collection"][0] {
  date,
  content,
  "pieces": gallery[_type == "image" && defined(asset)]${PIECE},
  subsections[]{
    title,
    description,
    accent,
    "pieces": gallery[_type == "image" && defined(asset)]${PIECE}
  }
}`;

type Block = { _type: string; children?: { text?: string }[] };

type CorePiece = Piece & { file?: string };

type CoreData = {
    date?: string;
    content?: Block[];
    pieces?: CorePiece[];
    subsections?: { title?: string; description?: Block[]; accent?: string; pieces?: CorePiece[] }[];
} | null;

const plainText = (blocks?: Block[]) =>
    (blocks ?? [])
        .filter((b) => b._type === 'block')
        .map((b) => (b.children ?? []).map((c) => c.text ?? '').join('').trim())
        .filter(Boolean);

const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'series';

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

// A colour set in the Studio wins; then the built-in pair; then a fallback.
function colorsFor(custom: string | undefined, builtin: { accent: string; glow: string } | undefined, i: number) {
    const c = custom?.trim();
    if (c && HEX.test(c)) return { accent: c, glow: shiftHue(c) };
    const { accent, glow } = builtin ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length];
    return { accent, glow };
}

export default async function CorePage() {
    const data: CoreData = await client.fetch(CORE_QUERY);

    // Each titled subsection is a series, in Studio order.
    const sections: SeriesData[] = (data?.subsections ?? [])
        .filter((s) => s.title?.trim())
        .map((s, i) => {
            const id = slugify(s.title!);
            const builtin = BUILTIN_SERIES.find((b) => b.id === id);
            return {
                id,
                title: s.title!.trim(),
                blurb: plainText(s.description).join(' ') || builtin?.blurb,
                ...colorsFor(s.accent, builtin, i),
                pieces: s.pieces ?? [],
            };
        });

    // Main-gallery pieces not yet moved into a subsection keep their old
    // placement. A piece in both shows once, in its subsection.
    const placed = new Set(sections.flatMap((s) => s.pieces.map((p) => p.url)));
    for (const piece of data?.pieces ?? []) {
        if (placed.has(piece.url)) continue;
        const target =
            BUILTIN_SERIES.find((b) => b.legacyFiles.includes(piece.file ?? ''))?.id ?? DEFAULT_SERIES;
        let section = sections.find((s) => s.id === target);
        if (!section) {
            const b = BUILTIN_SERIES.find((s) => s.id === target)!;
            section = { id: b.id, title: b.title, blurb: b.blurb, accent: b.accent, glow: b.glow, pieces: [] };
            sections.push(section);
        }
        section.pieces.push(piece);
    }

    // With no subsections yet, keep the built-in order.
    if (!data?.subsections?.length) {
        const rank = (id: string) => BUILTIN_SERIES.findIndex((b) => b.id === id);
        sections.sort((a, b) => rank(a.id) - rank(b.id));
    }

    return <CoreExperience year={data?.date} story={plainText(data?.content)} series={sections} />;
}
