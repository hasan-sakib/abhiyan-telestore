import { HeroSection } from "@/components/home/HeroSection";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { BrandShowcase } from "@/components/home/BrandShowcase";
import { UpcomingProducts } from "@/components/home/UpcomingProducts";
import { CustomerTrust } from "@/components/home/CustomerTrust";

export default function Home() {
  return (
    <div className="mobile-nav-spacer">
      <HeroSection />
      <FeatureHighlights />
      <CategoryGrid />
      <FlashSaleSection />
      <FeaturedProducts />
      <BrandShowcase />
      <UpcomingProducts />
      <CustomerTrust />
    </div>
  );
}
