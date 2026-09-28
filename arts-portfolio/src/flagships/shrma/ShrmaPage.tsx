import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import ShrmaExperience from './ShrmaExperience';
import {
    DEFAULT_INTRO,
    DEFAULT_SEASONS,
    type Detail,
    type Img,
    type Intro,
    type Level,
    type Piece,
    type Season,
} from './content';

// The shRma flagship page. Sanity's shRma fields win; anything empty falls
// back to the built-in seasons and intro in content.ts, filled in from the
// project's older sections by caption.

const IMG = `{ "src": asset->url, caption, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height }`;
const DETAIL = `{ title, level, body, "images": images[defined(asset)]${IMG}, "video": video.asset->url }`;

const SHRMA_QUERY = groq`*[_type == "project" && slug.current == "shrma"][0] {
  content,
  "logo": mainImage${IMG},
  subsections[]{
    title,
    "text": pt::text(description),
    "media": gallery[]{ _type, caption, "src": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height }
  },
  shrmaIntro { headline, text, "video": video.asset->url, videoStart, videoEndTrim, "details": details[]${DETAIL} },
  shrmaSeasons[] {
    name, hanzi, label, date, era, status, oneLiner, palette,
    "keyVisuals": keyVisuals[defined(asset)]${IMG},
    "pieces": pieces[] { name, key, notes, specs, "images": images[defined(asset)]${IMG}, "model": model.asset->url },
    "photos": photos[defined(asset)]${IMG},
    "details": details[]${DETAIL}
  }
}`;

type Media = { _type: string; caption?: string; src?: string; w?: number; h?: number };
type Section = { title?: string; text?: string; media?: Media[] };
type Block = { _type: string; children?: { text?: string }[] };
type SanityDetail = { title?: string; level?: string; body?: string; images?: Img[]; video?: string };
type SanitySeason = {
    name?: string;
    hanzi?: string;
    label?: string;
    date?: string;
    era?: string;
    status?: string;
    oneLiner?: string;
    palette?: { bg?: string; ink?: string; accent?: string };
    keyVisuals?: Img[];
    pieces?: { name?: string; key?: boolean; notes?: string; specs?: string; images?: Img[]; model?: string }[];
    photos?: Img[];
    details?: SanityDetail[];
};
type ShrmaData = {
    content?: Block[];
    logo?: Img;
    subsections?: Section[];
    shrmaIntro?: { headline?: string; text?: string; video?: string; videoStart?: number; videoEndTrim?: number; details?: SanityDetail[] };
    shrmaSeasons?: SanitySeason[];
} | null;

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const asLevel = (l?: string): Level => (l === 'low' || l === 'high' ? l : 'mid');
const paragraphs = (text?: string) =>
    (text ?? '')
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'season';
const cleanDetail = (d: SanityDetail): Detail => ({
    title: d.title?.trim() || undefined,
    level: asLevel(d.level),
    body: d.body?.trim() || undefined,
    images: (d.images ?? []).filter((i) => i.src),
    video: d.video || undefined,
});

export default async function ShrmaPage() {
    const data: ShrmaData = await client.fetch(SHRMA_QUERY, {}, { next: { revalidate: 60 } }).catch(() => null);
    const sections = data?.subsections ?? [];

    // The older sections' media, by caption, and their text, by title.
    const byCaption = new Map<string, Media>();
    for (const s of sections) for (const m of s.media ?? []) if (m.caption && m.src) byCaption.set(m.caption.trim(), m);
    const imagesFor = (captions?: string[]): Img[] =>
        (captions ?? [])
            .map((c) => byCaption.get(c.trim()))
            .filter((m): m is Media => !!m && m._type === 'image')
            .map((m) => ({ src: m.src!, caption: m.caption?.trim(), w: m.w, h: m.h }));
    const textFor = (title?: string) => sections.find((s) => s.title?.trim() === title?.trim())?.text?.trim();

    // ── Intro
    const introText = paragraphs(data?.shrmaIntro?.text).length
        ? paragraphs(data?.shrmaIntro?.text)
        : (data?.content ?? [])
              .filter((b) => b._type === 'block')
              .map((b) => (b.children ?? []).map((c) => c.text ?? '').join('').trim())
              .filter(Boolean);
    const intro: Intro = {
        headline: data?.shrmaIntro?.headline?.trim() || DEFAULT_INTRO.headline,
        text: introText,
        logo: data?.logo?.src ? data.logo : undefined,
        video: data?.shrmaIntro?.video || byCaption.get('Logo Creating process')?.src,
        videoStart: data?.shrmaIntro?.videoStart ?? 10,
        videoEndTrim: data?.shrmaIntro?.videoEndTrim ?? 2,
        details: data?.shrmaIntro?.details?.length
            ? data.shrmaIntro.details.map(cleanDetail)
            : DEFAULT_INTRO.details.map((d) => ({
                  title: d.title,
                  level: d.level,
                  body: 'bodyFrom' in d ? textFor(d.bodyFrom) : undefined,
                  images: imagesFor(d.fromCaptions),
                  video: 'videoFrom' in d ? byCaption.get(d.videoFrom!)?.src : undefined,
              })),
    };

    // ── Seasons
    const fromSanity = (data?.shrmaSeasons ?? []).filter((s) => s.name?.trim());
    const seasons: Season[] = fromSanity.length
        ? fromSanity.map((s, i) => {
              const fallback = DEFAULT_SEASONS[i]?.palette ?? DEFAULT_SEASONS[0].palette;
              const hex = (v: string | undefined, f: string) => (v && HEX.test(v.trim()) ? v.trim() : f);
              return {
                  id: slugify(s.name!),
                  name: s.name!.trim(),
                  hanzi: s.hanzi?.trim() || undefined,
                  label: s.label?.trim() || undefined,
                  date: s.date?.trim() || undefined,
                  era: s.era === 'meraki' ? 'meraki' : 'shrma',
                  status: s.status === 'concept' ? 'concept' : 'released',
                  oneLiner: s.oneLiner?.trim() || undefined,
                  palette: {
                      bg: hex(s.palette?.bg, fallback.bg),
                      ink: hex(s.palette?.ink, fallback.ink),
                      accent: hex(s.palette?.accent, fallback.accent),
                  },
                  keyVisuals: (s.keyVisuals ?? []).filter((i) => i.src),
                  pieces: (s.pieces ?? [])
                      .filter((p) => p.name?.trim())
                      .map(
                          (p): Piece => ({
                              name: p.name!.trim(),
                              key: !!p.key,
                              images: (p.images ?? []).filter((i) => i.src),
                              model: p.model || undefined,
                              notes: p.notes?.trim() || undefined,
                              specs: p.specs?.trim() || undefined,
                          }),
                      ),
                  photos: (s.photos ?? []).filter((i) => i.src),
                  details: (s.details ?? []).map(cleanDetail),
              };
          })
        : DEFAULT_SEASONS.map((s) => ({
              ...s,
              pieces: s.pieces
                  // Pieces stay listed without images: the page shows "photographs to come".
                  .map((p) => ({ ...p, images: [...(p.images ?? []), ...imagesFor(p.fromCaptions)] })),
              details: s.details
                  .map((d) => ({
                      title: d.title,
                      level: d.level,
                      body: d.body ?? textFor(d.bodyFrom),
                      images: [...(d.images ?? []), ...imagesFor(d.fromCaptions)],
                  }))
                  .filter((d) => d.body || d.images.length),
          }));

    return <ShrmaExperience intro={intro} seasons={seasons} />;
}
