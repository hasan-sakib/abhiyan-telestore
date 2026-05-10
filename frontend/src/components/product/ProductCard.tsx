import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

function StatusBadge({ status, discount_price, price }: { status: Product["status"]; discount_price?: number; price: number }) {
  if (status === "out_of_stock") {
    return (
      <div className="absolute inset-0 bg-background/70 flex items-center justify-center rounded-2xl backdrop-blur-sm">
        <Badge variant="destructive" className="text-xs font-bold px-3 py-1">Out of Stock</Badge>
      </div>
    );
  }
  if (status === "upcoming") {
    return (
      <div className="absolute top-2 left-2">
        <Badge variant="secondary" className="text-xs font-bold bg-gradient-cool text-white border-0">Coming Soon</Badge>
      </div>
    );
  }
  if (discount_price) {
    const pct = Math.round((1 - discount_price / price) * 100);
    return (
      <div className="absolute top-2 left-2">
        <span className="badge-sale inline-block bg-gradient-warm text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-md">
          -{pct}%
        </span>
      </div>
    );
  }
  return null;
}

export function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const [wishlisted, setWishlisted] = useState(false);
  const primaryImage = product.images?.find((i) => i.is_primary) ?? product.images?.[0];
  const isOutOfStock = product.status === "out_of_stock";

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;
      const enter = () => gsap.to(card, { y: -5, duration: 0.22, ease: "power2.out" });
      const leave = () => gsap.to(card, { y: 0, duration: 0.22, ease: "power2.out" });
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
    addItem({ product_id: product.id, quantity: 1, product });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setWishlisted((v) => !v);
  };

  return (
    <div
      ref={cardRef}
      className="neumorphic-raised bg-background rounded-3xl p-3 sm:p-4 flex flex-col gap-3 cursor-pointer group transition-shadow duration-200"
    >
      <Link to={`/products/${product.slug}`} className="contents">
        {/* Image container */}
        <div className="relative w-full aspect-square neumorphic-inset bg-white rounded-2xl overflow-hidden p-3 flex items-center justify-center">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt_text ?? product.name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-400 group-hover:scale-108"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}

          <StatusBadge status={product.status} discount_price={product.discount_price} price={product.price} />

          {/* New badge */}
          {product.status === "in_stock" && !product.discount_price && (
            <div className="absolute top-2 right-2">
              <span className="bg-green-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-lg">NEW</span>
            </div>
          )}

          {/* Quick actions overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="glass-card p-1.5 rounded-xl text-foreground/80 text-xs flex items-center gap-1 font-medium">
              <Eye className="h-3.5 w-3.5" /> Quick View
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 px-1">
          <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
            {product.brand}
          </span>
          <h4 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
            {product.name}
          </h4>

          {/* Rating (static) */}
          <div className="flex items-center gap-1 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-muted-foreground/40"}`}
              />
            ))}
            <span className="text-[10px] text-muted-foreground ml-0.5">(4.0)</span>
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between gap-2 mt-1.5">
            <div>
              {product.discount_price ? (
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-base sm:text-lg font-extrabold text-foreground">
                    {formatPrice(product.discount_price)}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-base sm:text-lg font-extrabold text-foreground">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="block text-[10px] text-green-600 dark:text-green-400 font-medium">EMI available</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleWishlist}
                aria-label="Wishlist"
                className={`neumorphic-raised bg-background p-2 rounded-xl transition-all hover:scale-110 active:scale-95 ${
                  wishlisted ? "text-red-500" : "text-muted-foreground hover:text-red-400"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-red-500" : ""}`} />
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                aria-label="Add to cart"
                className="neumorphic-raised bg-background p-2 rounded-xl text-primary hover:scale-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
              >
                <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
