import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <HorizontalScrollSection />
      <ProjectGrid />
    </div>
  );
}
