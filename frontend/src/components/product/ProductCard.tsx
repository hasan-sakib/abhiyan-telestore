import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const primaryImage = product.images?.find((i) => i.is_primary) ?? product.images?.[0];

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;
    const enter = () => gsap.to(card, { scale: 1.02, y: -4, duration: 0.2, ease: "power2.out" });
    const leave = () => gsap.to(card, { scale: 1, y: 0, duration: 0.2, ease: "power2.out" });
    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);
    return () => {
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
    };
  }, { scope: cardRef });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      product_id: product.id,
      quantity: 1,
      product,
    });
  };

  return (
    <Card ref={cardRef} className="overflow-hidden cursor-pointer group">
      <Link to={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt_text ?? product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
          {product.status === "out_of_stock" && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
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
                {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
          <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
          <div className="flex items-center justify-between gap-2">
            <div>
              {product.discount_price ? (
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base">{formatPrice(product.discount_price)}</span>
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
                </div>
              ) : (
                <span className="font-bold text-base">{formatPrice(product.price)}</span>
              )}
            </div>
            <Button
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleAddToCart}
              disabled={product.status === "out_of_stock"}
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
