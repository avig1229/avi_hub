import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import { GuideSpot } from "@/components/guide/Guide";
import { MusicRecProvider } from "@/components/music/MusicRec";
import { getMusicRec } from "@/components/music/getMusicRec";

// Re-fetch projects from Sanity at most once a minute, so new uploads
// appear without a redeploy.
export const revalidate = 60;

export default async function Home() {
  const rec = await getMusicRec();

  const page = (
    <div className="min-h-screen">
      <Hero />
      <GuideSpot id="home" siteKey="home" revealsGuide />
      <ProjectGrid />
    </div>
  );
  return rec ? <MusicRecProvider rec={rec}>{page}</MusicRecProvider> : page;
}
