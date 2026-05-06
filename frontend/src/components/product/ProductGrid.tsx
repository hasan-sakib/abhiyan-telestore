import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "@/components/shared/LoadingSkeleton";
import type { Product } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!gridRef.current || isLoading) return;
    const cards = gridRef.current.querySelectorAll(".product-card-item");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          once: true,
        },
      }
    );
  }, { scope: gridRef, dependencies: [products, isLoading] });

  if (isLoading) return <ProductGridSkeleton />;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground text-lg">No products found.</p>
        <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {products.map((product) => (
        <div key={product.id} className="product-card-item">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
