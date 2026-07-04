import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useProducts } from "@/hooks/useProducts";

export function FeaturedProducts() {
  const { data, isLoading } = useProducts({ is_featured: true, page_size: 8 });
  const products = data?.items ?? [];

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <p className="label-overline mb-1">Editor's Pick</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              Trending Now
            </h2>
          </div>
          <Link
            to="/products?featured=true"
            className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline whitespace-nowrap"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </section>
  );
}
