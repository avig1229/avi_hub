import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { DEFAULT_SERIES, SERIES, type SeriesId } from './content';
import CoreExperience, { type Piece, type SeriesData } from './CoreExperience';

const CORE_QUERY = groq`*[_type == "project" && slug.current == "core-collection"][0] {
  title,
  date,
  content,
  "pieces": gallery[_type == "image" && defined(asset)]{
    "url": asset->url,
    "file": asset->originalFilename,
    caption,
    story,
    series,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }
}`;

type Block = { _type: string; children?: { text?: string }[] };

type CorePiece = Piece & { file?: string; series?: string };

type CoreData = {
    title: string;
    date?: string;
    content?: Block[];
    pieces?: CorePiece[];
};

const isSeries = (v: unknown): v is SeriesId => SERIES.some((s) => s.id === v);

function seriesOf(piece: CorePiece): SeriesId {
    if (isSeries(piece.series)) return piece.series;
    const legacy = SERIES.find((s) => (s.legacyFiles as readonly string[]).includes(piece.file ?? ''));
    return legacy?.id ?? DEFAULT_SERIES;
}

export default async function CorePage() {
    const data: CoreData | null = await client.fetch(CORE_QUERY);

    const story = (data?.content ?? [])
        .filter((b) => b._type === 'block')
        .map((b) => (b.children ?? []).map((c) => c.text ?? '').join('').trim())
        .filter(Boolean);

    // Group in gallery order, so reordering in Sanity reorders the page.
    const series: SeriesData[] = SERIES.map((s) => ({
        id: s.id,
        pieces: (data?.pieces ?? []).filter((p) => seriesOf(p) === s.id),
    }));

    return <CoreExperience year={data?.date} story={story} series={series} />;
}
