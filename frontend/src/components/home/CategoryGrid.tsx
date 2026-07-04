import { Link } from "react-router-dom";
import {
  Smartphone, Tablet, Watch, Headphones,
  Plug, Laptop, Camera, Speaker, Tag,
  type LucideIcon,
} from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_CATEGORIES: Array<{ name: string; slug?: string; id?: number }> = [
  { name: "Smartphones" },
  { name: "Laptops" },
  { name: "Tablets" },
  { name: "Smart Watch" },
  { name: "Audio" },
  { name: "Accessories" },
  { name: "Cameras" },
];

function pickIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("phone"))   return Smartphone;
  if (n.includes("laptop"))  return Laptop;
  if (n.includes("tablet"))  return Tablet;
  if (n.includes("watch") || n.includes("wear")) return Watch;
  if (n.includes("headphone") || n.includes("audio") || n.includes("earbud")) return Headphones;
  if (n.includes("speaker")) return Speaker;
  if (n.includes("camera"))  return Camera;
  if (n.includes("power") || n.includes("charger") || n.includes("cable") || n.includes("access")) return Plug;
  return Tag;
}

export function CategoryGrid() {
  const { data, isLoading } = useCategories();
  const apiCategories = data?.items?.filter((c) => !c.parent_id) ?? [];
  const useFallback = !isLoading && apiCategories.length === 0;
  const categories = useFallback ? FALLBACK_CATEGORIES : apiCategories;

  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <p className="label-overline mb-1">Browse by</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              Top Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-primary hover:underline hidden sm:block"
          >
            All Products →
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {isLoading
            ? Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              ))
            : categories.map((cat, idx) => {
                const Icon = pickIcon(cat.name);
                const href =
                  "id" in cat && cat.id
                    ? `/products?category_id=${cat.id}`
                    : `/products?category=${encodeURIComponent(
                        (cat.slug ?? cat.name).toLowerCase()
                      )}`;

                return (
                  <Link
                    key={`${cat.name}-${idx}`}
                    to={href}
                    className="flex flex-col items-center gap-2.5 group"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-border bg-card flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-200">
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground text-center group-hover:text-foreground transition-colors leading-tight">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}
