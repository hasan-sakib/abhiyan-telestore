import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, ArrowRight, Clock } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function useCountdown(targetMs: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, targetMs - Date.now()));
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((_) => {
        const next = Math.max(0, targetMs - Date.now());
        if (next === 0) clearInterval(id);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1_000);
  return { h, m, s, done: remaining === 0 };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-muted rounded-md px-2.5 py-2 min-w-10 text-center">
        <span className="countdown-digit text-lg sm:text-xl font-bold text-foreground tabular-nums">
          {pad(value)}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
}

const SALE_END = Date.now() + 8 * 3_600_000 + 27 * 60_000 + 45_000;

export function FlashSaleSection() {
  const { data, isLoading } = useProducts({ is_featured: true, page_size: 4, sort_by: "price", sort_order: "asc" });
  const discountProducts = (data?.items ?? []).filter((p) => p.discount_price);
  const { h, m, s } = useCountdown(SALE_END);

  if (!isLoading && discountProducts.length === 0) return null;

  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="border border-border rounded-xl px-5 sm:px-7 py-4 sm:py-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 text-destructive p-2.5 rounded-lg shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight font-display">
                Flash Sale
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Limited time offers — don't miss out!</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-medium uppercase tracking-wide">Ends in</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CountdownUnit value={h} label="Hrs" />
              <span className="text-lg font-semibold text-muted-foreground mb-4">:</span>
              <CountdownUnit value={m} label="Min" />
              <span className="text-lg font-semibold text-muted-foreground mb-4">:</span>
              <CountdownUnit value={s} label="Sec" />
            </div>
          </div>

          <Link
            to="/products?featured=true"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline whitespace-nowrap"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-border rounded-xl p-4 flex flex-col gap-3">
                <Skeleton className="w-full aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {discountProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-5 flex justify-center sm:hidden">
          <Link
            to="/products?featured=true"
            className="flex items-center gap-2 bg-foreground text-background font-semibold py-2.5 px-8 rounded-md text-sm hover:bg-foreground/90 transition-colors"
          >
            View All Deals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
