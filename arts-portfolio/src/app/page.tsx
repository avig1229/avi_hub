import Hero from "@/components/Hero";
import Room from "@/components/room/Room";
import { MusicRecProvider } from "@/components/music/MusicRec";
import { getMusicRec } from "@/components/music/getMusicRec";

// Re-fetch Sanity content (the music rec) at most once a minute.
export const revalidate = 60;

export default async function Home() {
  const rec = await getMusicRec();

  const page = (
    <div className="min-h-screen">
      <Hero />
      <Room />
    </div>
  );
  return rec ? <MusicRecProvider rec={rec}>{page}</MusicRecProvider> : page;
}
