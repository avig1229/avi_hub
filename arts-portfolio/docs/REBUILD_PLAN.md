# shRma Portfolio Rebuild — Plan

Living doc. Decisions are settled unless listed under **Open**.

## Goals
Turn the portfolio into a *brand experience*: more video, more storytelling, a
different layout per flagship project, interactive breakdowns of design details,
and optional music.

## Settled decisions

| Area | Decision |
|---|---|
| Audience | Mixed but design-savvy — experimental is fine, must stay legible |
| Brand | **shRma** is settled; build the system around it |
| Flagships | 2–3 bespoke pages. Order: **CORE Collection** → **shRma** |
| Other projects | Keep the current tabs + sticky sidebar template (`/work/[slug]`) |
| Content model | Hybrid: structure/animation hardcoded per flagship, content fed from Sanity |
| Video | YouTube/Vimeo embeds (click-to-load facade so pages stay fast) |
| Interactive breakdowns | Different mechanic per flagship |
| Audio | Muted by default, persistent toggle. Per-project vs site-wide: **open** |
| Approach | Incremental. First milestone = flagship layout system + CORE end-to-end |
| Motion stack | Stay on Framer Motion (`useScroll`, sticky pinning) — no GSAP unless a need appears |

## Architecture
- `/work/[slug]` checks a registry of bespoke layouts
  (`src/flagships/<slug>/`). If the slug is registered, render that page;
  otherwise fall back to the existing generic template.
- Flagship pages still fetch from Sanity (text, images, series) — only the
  choreography is code.
- `AudioProvider` in the root layout so a track can keep playing across
  navigation; toggle lives in `Navigation`.

## Flagship 1: CORE Collection

All pieces share one base drawing (spine, nails, eye, top mark) on a
1640×2360 canvas; only the ornament and iris change. The page is built around
that: **one spine, many personalities.**

The vertebrae are part of the art, **not** navigation.

### Sections
1. **Origin** (intro / back story)
   - Base spine draws itself in on black while the back story scrolls.
   - **Anatomy breakdown** (CORE's interactive mechanic): hotspots on the
     spine sections, the nails (the real nails in my spine), and the eye
     (Nepali religious meaning + eyes as a window into someone's soul).
     Tap/hover reveals each story.
2. **Sashiko**: pieces #5, #6, #8. Spine pinned; stitch ornaments sew in.
3. **Graffiti**: pieces #3, #4, #7. Spine pinned; brush strokes sweep in.
4. **Experimentals**: pieces #1 (floral), #2 (red / roses). Looser treatment.
   - Plus a new piece (not yet in Sanity): painterly, with a realistic textured
     iris, watercolor clouds, shaded grey vertebrae, and sashiko stitches mixed
     with florals. It pulls all three series together, so it closes the page:
     the only "real" eye, bringing back Origin's eye as a window into the soul.

Numbering refers to the Sanity gallery order (1 = first gallery image).

### Sanity mapping
- `content` → Origin back story (already there)
- Each gallery image has a **Series** dropdown (CORE only). Untagged pieces go to
  Experimentals; the original CORE001–008 uploads are matched by file name.
- Each gallery image has a **Story**, shown on hover/tap.
- Anatomy hotspot copy: new small field or hardcoded, whichever is less work
  (decide when building)

### Assets
- ✅ `public/work/core/spine-outline.webp`: bare spine as an **outline** drawing,
  1390×2000 transparent. Same aspect ratio as the pieces and it **lines up
  exactly** when scaled to 1640×2360, so pieces can stack on it directly.
  Origin idea: outline draws in → fills to the solid white base → collection.
- Piece #3 (red graffiti) breaks the template on purpose? 4th vertebra is
  drawn split in two. If intentional, call it out as a story beat.
- Still needed, on the 1640×2360 canvas, transparent PNG (SVG even better so
  stitches and strokes can draw themselves in):
  - the filled base (solid spine + eye, no iris)
  - per piece: `<series>-<n>-ornament.png` and `<series>-<n>-iris.png`
  - the new piece
- For a true line-by-line draw-in, the outline needs to be a vector (SVG): export
  from source, or auto-trace the PNG (potrace).

## Open
- Music: per-project soundtrack vs site-wide ambient, and the CORE track
  (need usage rights)
- Video/footage for CORE, if any
- Third flagship (after shRma)

## Milestones
1. ✅ Flagship layout registry + audio provider scaffold
2. ✅ CORE: Origin + anatomy breakdown (series sections are an interim grid)
3. CORE: three series sections with layered animation
4. shRma flagship
