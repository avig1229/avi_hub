import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import { GuideSpot } from "@/components/guide/Guide";

// Re-fetch projects from Sanity at most once a minute, so new uploads
// appear without a redeploy.
export const revalidate = 60;

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <GuideSpot id="home" siteKey="home" />
      <ProjectGrid />
    </div>
  );
}
