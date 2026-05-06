import { Link } from "react-router-dom";
import {
  Smartphone,
  Tablet,
  Watch,
  Headphones,
  Plug,
  Laptop,
  Camera,
  Speaker,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_CATEGORIES: Array<{ name: string; slug?: string; id?: number }> = [
  { name: "Smartphones" },
  { name: "Tablets" },
  { name: "Wearables" },
  { name: "Audio" },
  { name: "Power" },
];

function pickIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("phone")) return Smartphone;
  if (n.includes("tablet")) return Tablet;
  if (n.includes("watch") || n.includes("wear")) return Watch;
  if (n.includes("headphone") || n.includes("audio") || n.includes("earbud"))
    return Headphones;
  if (n.includes("speaker")) return Speaker;
  if (n.includes("laptop") || n.includes("computer")) return Laptop;
  if (n.includes("camera")) return Camera;
  if (n.includes("power") || n.includes("charger") || n.includes("cable"))
    return Plug;
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
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 sm:mb-8 text-foreground">
          Explore Collections
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
                  <Skeleton className="h-3 w-16" />
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
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 neumorphic-raised bg-background rounded-full flex items-center justify-center text-primary group-hover:neumorphic-inset transition-all duration-300">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-foreground text-center">
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
