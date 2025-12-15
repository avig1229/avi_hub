import { groq } from 'next-sanity';

// Get all projects for the grid
export const PROJECTS_QUERY = groq`*[_type == "project"] | order(date desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  date,
  mainImage,
  content,
  "galleryCount": count(gallery),
}`;

// Get a single project by slug
export const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  category,
  date,
  mainImage,
  content,
  content,
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
