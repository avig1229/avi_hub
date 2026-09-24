import { groq } from 'next-sanity';

// Get all projects for the grid
export const PROJECTS_QUERY = groq`*[_type == "project"] | order(title != "shRma", title == "Archive", date desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  date,
  mainImage,
  content
}`;

// Get a single project by slug
export const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  category,
  date,
  mainImage,
  content,
  guide,
  links,
  gallery[]{
    ...,
    _type == "image" => {
      "url": asset->url,
      "caption": caption
    },
    _type == "file" => {
      "url": asset->url,
      "mimeType": asset->mimeType,
      "caption": caption
    }
  },
  subsections[]{
    title,
    description,
    guide,
    gallery[]{
      ...,
      _type == "image" => {
        "url": asset->url,
        "caption": caption
      },
      _type == "file" => {
        "url": asset->url,
        "mimeType": asset->mimeType,
        "caption": caption
      }
    }
  }
}`;

// The site guide's name and site-wide lines (singleton).
export const SITE_GUIDE_QUERY = groq`*[_id == "siteGuide"][0] {
  name,
  home,
  about,
  typeNotes,
  idle
}`;

// The home page's weekly music rec (singleton).
export const MUSIC_REC_QUERY = groq`*[_id == "musicRec"][0] {
  youtubeUrl,
  note,
  weekOf
}`;
