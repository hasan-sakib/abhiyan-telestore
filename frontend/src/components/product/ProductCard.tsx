import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ShoppingCart, Heart, Star } from "lucide-react";
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
      <div className="absolute inset-0 bg-background/70 flex items-center justify-center rounded-lg backdrop-blur-sm">
        <Badge variant="destructive" className="text-xs font-semibold px-3 py-1">Out of Stock</Badge>
      </div>
    );
  }
  if (status === "upcoming") {
    return (
      <div className="absolute top-2 left-2">
        <span className="inline-block bg-primary/15 text-primary border border-primary/20 text-[10px] font-semibold px-2 py-0.5 rounded">
          Coming Soon
        </span>
      </div>
    );
  }
  if (discount_price) {
    const pct = Math.round((1 - discount_price / price) * 100);
    return (
      <div className="absolute top-2 left-2">
        <span className="price-discount-badge">-{pct}%</span>
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
      className="card-surface rounded-xl p-3 flex flex-col gap-3 cursor-pointer group"
    >
      <Link to={`/products/${product.slug}`} className="contents">
        {/* Image container */}
        <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden p-3 flex items-center justify-center">
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

          <StatusBadge status={product.status} discount_price={product.discount_price} price={product.price} />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 px-0.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            {product.brand}
          </span>
          <h4 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug font-display">
            {product.name}
          </h4>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30 fill-muted-foreground/10"}`}
              />
            ))}
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <div>
              {product.discount_price ? (
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="price-main">{formatPrice(product.discount_price)}</span>
                  <span className="price-original">{formatPrice(product.price)}</span>
                </div>
              ) : (
                <span className="price-main">{formatPrice(product.price)}</span>
              )}
              <span className="block text-[10px] text-primary/70 font-medium mt-0.5">EMI available</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleWishlist}
                aria-label="Wishlist"
                className={`p-1.5 rounded-md transition-colors ${
                  wishlisted ? "text-destructive" : "text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-destructive" : ""}`} />
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                aria-label="Add to cart"
                className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
