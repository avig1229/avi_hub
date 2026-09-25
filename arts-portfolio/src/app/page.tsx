import Hero from "@/components/Hero";
import Room, { type RoomPoster } from "@/components/room/Room";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { ROOM_POSTER_QUERY } from "@/sanity/lib/queries";
import { MusicRecProvider } from "@/components/music/MusicRec";
import { getMusicRec, getRecordCrate } from "@/components/music/getMusicRec";

// Re-fetch Sanity content (the music rec, the room's art) at most once a minute.
export const revalidate = 60;

// The project whose piece hangs on the room's wall.
const ROOM_POSTER_SLUG = "hear-feel-create";

export default async function Home() {
  const [rec, crate, posterDoc] = await Promise.all([
    getMusicRec(),
    getRecordCrate(),
    client.fetch(ROOM_POSTER_QUERY, { slug: ROOM_POSTER_SLUG }).catch(() => null),
  ]);
  // The art piece on the room's wall, rendered tiny so it reads as pixel art.
  const poster: RoomPoster | null = posterDoc?.mainImage
    ? {
        title: posterDoc.title,
        slug: posterDoc.slug,
        src: urlFor(posterDoc.mainImage).width(48).height(66).fit("crop").auto("format").url(),
      }
    : null;

  const page = (
    <div className="min-h-screen">
      <Hero />
      <Room poster={poster} />
    </div>
  );
  return rec ? <MusicRecProvider rec={rec} crate={crate}>{page}</MusicRecProvider> : page;
}
