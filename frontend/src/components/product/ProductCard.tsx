import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const primaryImage =
    product.images?.find((i) => i.is_primary) ?? product.images?.[0];

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;
      const enter = () =>
        gsap.to(card, { scale: 1.02, y: -4, duration: 0.2, ease: "power2.out" });
      const leave = () =>
        gsap.to(card, { scale: 1, y: 0, duration: 0.2, ease: "power2.out" });
      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
      return () => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mouseleave", leave);
      };
    },
    { scope: cardRef }
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      product_id: product.id,
      quantity: 1,
      product,
    });
  };

  const isOutOfStock = product.status === "out_of_stock";

  return (
    <div
      ref={cardRef}
      className="neumorphic-raised bg-background rounded-3xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 cursor-pointer group"
    >
      <Link to={`/products/${product.slug}`} className="contents">
        <div className="relative w-full aspect-square neumorphic-inset bg-white rounded-2xl overflow-hidden p-3 sm:p-4 flex items-center justify-center">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt_text ?? product.name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center rounded-2xl">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
          {product.status === "upcoming" && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          )}
          {product.discount_price && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive" className="text-xs">
                {Math.round(
                  (1 - product.discount_price / product.price) * 100
                )}
                % OFF
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 px-1">
          <span className="text-[11px] sm:text-xs font-medium text-primary">
            {product.brand}
          </span>
          <h4 className="text-sm font-semibold text-foreground line-clamp-2">
            {product.name}
          </h4>
          <div className="flex items-end justify-between gap-2 mt-1.5">
            <div className="min-w-0">
              {product.discount_price ? (
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-base sm:text-lg font-bold text-foreground">
                    {formatPrice(product.discount_price)}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-base sm:text-lg font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label="Add to cart"
              className="neumorphic-raised bg-background p-2 rounded-xl text-primary hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-transform"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
