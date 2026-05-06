import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryGrid() {
  const { data, isLoading } = useCategories();
  const categories = data?.items?.filter((c) => !c.parent_id) ?? [];

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))
            : categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category_id=${cat.id}`}
                  className="group relative flex flex-col items-center justify-center h-24 rounded-lg border bg-card hover:border-primary hover:bg-primary/5 transition-colors text-center p-3"
                >
                  {cat.image_url && (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="h-8 w-8 object-contain mb-1.5"
                    />
                  )}
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
