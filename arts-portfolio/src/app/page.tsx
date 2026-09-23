import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";

// Re-fetch projects from Sanity at most once a minute, so new uploads
// appear without a redeploy.
export const revalidate = 60;

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <HorizontalScrollSection />
      <ProjectGrid />
    </div>
  );
}
