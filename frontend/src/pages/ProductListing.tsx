import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters, type FilterState } from "@/components/product/ProductFilters";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("created_at:desc");

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("search") ?? "",
    category_id: searchParams.get("category_id") ?? "",
    min_price: searchParams.get("min_price") ?? "",
    max_price: searchParams.get("max_price") ?? "",
    in_stock: searchParams.get("in_stock") === "true",
    featured: searchParams.get("featured") === "true",
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const queryParams = {
    search: debouncedSearch || undefined,
    category_id: filters.category_id ? Number(filters.category_id) : undefined,
    min_price: filters.min_price ? Number(filters.min_price) : undefined,
    max_price: filters.max_price ? Number(filters.max_price) : undefined,
    in_stock: filters.in_stock || undefined,
    is_featured: filters.featured || undefined,
    page,
    page_size: PAGE_SIZE,
    sort_by: sortBy.split(":")[0],
    sort_order: sortBy.split(":")[1] as "asc" | "desc",
  };

  const { data, isLoading } = useProducts(queryParams);
  const products = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    setPage(1);
    const p: Record<string, string> = {};
    if (filters.search) p.search = filters.search;
    if (filters.category_id) p.category_id = filters.category_id;
    if (filters.min_price) p.min_price = filters.min_price;
    if (filters.max_price) p.max_price = filters.max_price;
    if (filters.in_stock) p.in_stock = "true";
    if (filters.featured) p.featured = "true";
    setSearchParams(p, { replace: true });
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          {!isLoading && (
            <p className="text-sm text-muted-foreground mt-0.5">{total} product{total !== 1 ? "s" : ""} found</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 md:hidden"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at:desc">Newest First</SelectItem>
              <SelectItem value="price:asc">Price: Low to High</SelectItem>
              <SelectItem value="price:desc">Price: High to Low</SelectItem>
              <SelectItem value="name:asc">Name A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-8">
        <div className={cn("w-56 shrink-0 hidden md:block", showFilters && "!block")}>
          <ProductFilters filters={filters} onChange={setFilters} />
        </div>

        <div className="flex-1 min-w-0">
          <ProductGrid products={products} isLoading={isLoading} />

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
