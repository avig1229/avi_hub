import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { BUILTIN_SERIES, DEFAULT_SERIES, FALLBACK_ACCENTS, type SeriesMeta } from './content';
import CoreExperience, { type Piece, type SeriesData } from './CoreExperience';

const CORE_QUERY = groq`{
  "project": *[_type == "project" && slug.current == "core-collection"][0] {
    date,
    content,
    "pieces": gallery[_type == "image" && defined(asset)]{
      "url": asset->url,
      "file": asset->originalFilename,
      caption,
      story,
      "series": series->slug.current,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  },
  "series": *[_type == "coreSeries" && defined(slug.current)] | order(order asc, title asc) {
    "id": slug.current,
    title,
    blurb,
    accent,
    order
  }
}`;

type Block = { _type: string; children?: { text?: string }[] };

type CorePiece = Piece & { file?: string; series?: string };

type CoreData = {
    project: { date?: string; content?: Block[]; pieces?: CorePiece[] } | null;
    series: (Partial<SeriesMeta> & { id: string; title?: string })[];
};

// Sanity series override the built-ins field by field; new ones follow them.
function mergeSeries(fromSanity: CoreData['series']): SeriesMeta[] {
    const merged = new Map<string, SeriesMeta>(BUILTIN_SERIES.map((b) => [b.id, { ...b }]));
    fromSanity.forEach((s, i) => {
        const base = merged.get(s.id);
        merged.set(s.id, {
            id: s.id,
            title: s.title || base?.title || s.id,
            blurb: s.blurb ?? base?.blurb,
            accent: s.accent || base?.accent || FALLBACK_ACCENTS[i % FALLBACK_ACCENTS.length],
            order: s.order ?? base?.order ?? 100 + i,
        });
    });
    return [...merged.values()].sort((a, b) => a.order - b.order);
}

function seriesOf(piece: CorePiece, known: Set<string>): string {
    if (piece.series && known.has(piece.series)) return piece.series;
    const legacy = BUILTIN_SERIES.find((s) => s.legacyFiles.includes(piece.file ?? ''));
    return legacy?.id ?? DEFAULT_SERIES;
}

export default async function CorePage() {
    const data: CoreData = await client.fetch(CORE_QUERY);
    const project = data.project;

    const story = (project?.content ?? [])
        .filter((b) => b._type === 'block')
        .map((b) => (b.children ?? []).map((c) => c.text ?? '').join('').trim())
        .filter(Boolean);

    const metas = mergeSeries(data.series ?? []);
    const known = new Set(metas.map((m) => m.id));

    // Pieces keep their gallery order within each series.
    const series: SeriesData[] = metas.map((meta) => ({
        ...meta,
        pieces: (project?.pieces ?? []).filter((p) => seriesOf(p, known) === meta.id),
    }));

    return <CoreExperience year={project?.date} story={story} series={series} />;
}
