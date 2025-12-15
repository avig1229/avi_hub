import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import SashikoLogo from "@/components/SashikoLogo";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <SashikoLogo />
      <ProjectGrid />
    </div>
  );
}
