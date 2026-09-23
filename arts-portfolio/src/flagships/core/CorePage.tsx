import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { SERIES } from './content';
import CoreExperience, { type Piece, type SeriesData } from './CoreExperience';

const CORE_QUERY = groq`*[_type == "project" && slug.current == "core-collection"][0] {
  title,
  date,
  content,
  "pieces": gallery[_type == "image"]{
    "url": asset->url,
    caption,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  subsections[]{
    title,
    "pieces": gallery[_type == "image"]{
      "url": asset->url,
      caption,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }
}`;

type Block = { _type: string; children?: { text?: string }[] };

type CoreData = {
    title: string;
    date?: string;
    content?: Block[];
    pieces?: Piece[];
    subsections?: { title?: string; pieces?: Piece[] }[];
};

export default async function CorePage() {
    const data: CoreData | null = await client.fetch(CORE_QUERY);

    const story = (data?.content ?? [])
        .filter((b) => b._type === 'block')
        .map((b) => (b.children ?? []).map((c) => c.text ?? '').join('').trim())
        .filter(Boolean);

    // Prefer Sanity subsections named after each series; fall back to fixed
    // gallery positions until those subsections exist.
    const series: SeriesData[] = SERIES.map((s) => {
        const sub = data?.subsections?.find(
            (x) => x.title?.trim().toLowerCase() === s.title.toLowerCase(),
        );
        const pieces = sub?.pieces?.length
            ? sub.pieces
            : s.fallback.map((n) => data?.pieces?.[n - 1]).filter((p): p is Piece => !!p);
        return { id: s.id, pieces };
    });

    return <CoreExperience year={data?.date} story={story} series={series} />;
}
