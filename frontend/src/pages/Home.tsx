import { HeroSection } from "@/components/home/HeroSection";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeatureHighlights />
      <CategoryGrid />
      <FeaturedProducts />
    </div>
  );
}
