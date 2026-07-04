import { useState, useEffect } from "react";
import { Bell, Calendar, ArrowRight, Rocket } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function MiniCountdown({ launchMs }: { launchMs: number }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, launchMs - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(0, launchMs - Date.now())), 1000);
    return () => clearInterval(id);
  }, [launchMs]);
  const d = Math.floor(remaining / 86_400_000);
  const h = Math.floor((remaining % 86_400_000) / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Calendar className="h-3 w-3" />
      <span className="font-medium tabular-nums">
        {d}d {pad(h)}h {pad(m)}m
      </span>
    </div>
  );
}

const LAUNCH_BASE = Date.now() + 7 * 86_400_000;

export function UpcomingProducts() {
  const { data, isLoading } = useProducts({ status: "upcoming", page_size: 4 });
  const products = data?.items ?? [];
  const [notified, setNotified] = useState<Set<number>>(new Set());

  if (!isLoading && products.length === 0) return null;

  const handleNotify = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setNotified((prev) => new Set([...prev, id]));
  };

  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <p className="label-overline mb-1">Coming Soon</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display flex items-center gap-2">
              Upcoming Launches <Rocket className="h-5 w-5 text-primary" />
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-border rounded-xl p-4 flex flex-col gap-3">
                <Skeleton className="w-full aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, idx) => {
              const primaryImage = product.images?.find((i) => i.is_primary) ?? product.images?.[0];
              const hasNotified = notified.has(product.id);
              const launchMs = LAUNCH_BASE + idx * 2 * 86_400_000;

              return (
                <div
                  key={product.id}
                  className="border border-border bg-card rounded-xl p-3 flex flex-col gap-3 group"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden p-3 flex items-center justify-center">
                    {primaryImage ? (
                      <img
                        src={primaryImage.url}
                        alt={primaryImage.alt_text ?? product.name}
                        className="w-full h-full object-contain mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Rocket className="h-10 w-10 text-muted-foreground/20" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="inline-block bg-primary/15 text-primary border border-primary/20 text-[9px] font-semibold px-2 py-0.5 rounded">
                        SOON
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-1 px-0.5">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{product.brand}</span>
                    <h4 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug font-display">{product.name}</h4>
                    <span className="text-sm font-semibold text-foreground price-main">
                      {formatPrice(product.price)}
                    </span>
                    <MiniCountdown launchMs={launchMs} />
                  </div>

                  {/* Notify button */}
                  <button
                    type="button"
                    onClick={(e) => handleNotify(product.id, e)}
                    className={`mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-colors ${
                      hasNotified
                        ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    <Bell className="h-3.5 w-3.5" />
                    {hasNotified ? "Notified!" : "Notify Me"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/products?status=upcoming"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            See all upcoming products <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
