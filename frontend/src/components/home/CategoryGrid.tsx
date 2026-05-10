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

type GradientKey = "blue" | "purple" | "indigo" | "green" | "pink" | "orange" | "red" | "teal" | "default";

const ICON_CONFIG: Record<GradientKey, { gradient: string; bg: string; text: string }> = {
  blue:    { gradient: "from-blue-500 to-cyan-400",    bg: "bg-blue-50 dark:bg-blue-950/30",   text: "text-blue-500" },
  purple:  { gradient: "from-purple-500 to-violet-400", bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-500" },
  indigo:  { gradient: "from-indigo-500 to-blue-400",  bg: "bg-indigo-50 dark:bg-indigo-950/30", text: "text-indigo-500" },
  green:   { gradient: "from-green-500 to-emerald-400", bg: "bg-green-50 dark:bg-green-950/30",  text: "text-green-500" },
  pink:    { gradient: "from-pink-500 to-rose-400",    bg: "bg-pink-50 dark:bg-pink-950/30",   text: "text-pink-500" },
  orange:  { gradient: "from-orange-500 to-amber-400", bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-500" },
  red:     { gradient: "from-red-500 to-orange-400",   bg: "bg-red-50 dark:bg-red-950/30",    text: "text-red-500" },
  teal:    { gradient: "from-teal-500 to-cyan-400",    bg: "bg-teal-50 dark:bg-teal-950/30",   text: "text-teal-500" },
  default: { gradient: "from-primary to-violet-500",   bg: "bg-primary/5",                     text: "text-primary" },
};

function pickConfig(name: string): { icon: LucideIcon; color: GradientKey } {
  const n = name.toLowerCase();
  if (n.includes("phone"))   return { icon: Smartphone, color: "blue" };
  if (n.includes("laptop"))  return { icon: Laptop,     color: "purple" };
  if (n.includes("tablet"))  return { icon: Tablet,     color: "indigo" };
  if (n.includes("watch") || n.includes("wear")) return { icon: Watch, color: "green" };
  if (n.includes("headphone") || n.includes("audio") || n.includes("earbud")) return { icon: Headphones, color: "pink" };
  if (n.includes("speaker")) return { icon: Speaker,   color: "orange" };
  if (n.includes("camera"))  return { icon: Camera,    color: "red" };
  if (n.includes("power") || n.includes("charger") || n.includes("cable") || n.includes("access")) return { icon: Plug, color: "orange" };
  return { icon: Tag, color: "default" };
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
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Browse by</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
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
                  <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              ))
            : categories.map((cat, idx) => {
                const { icon: Icon, color } = pickConfig(cat.name);
                const cfg = ICON_CONFIG[color];
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
                    <div
                      className={`
                        w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center
                        neumorphic-raised transition-all duration-300 ${cfg.bg}
                        group-hover:scale-110 group-hover:shadow-lg relative overflow-hidden
                      `}
                    >
                      {/* Gradient background on hover */}
                      <div className={`absolute inset-0 bg-linear-to-br ${cfg.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
                      <Icon className={`h-7 w-7 sm:h-8 sm:w-8 ${cfg.text} group-hover:text-white transition-colors duration-300 relative z-10`} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-foreground text-center group-hover:text-primary transition-colors leading-tight">
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
