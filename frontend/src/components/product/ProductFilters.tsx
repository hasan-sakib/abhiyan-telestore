import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

export interface FilterState {
  search: string;
  category_id: string;
  min_price: string;
  max_price: string;
  in_stock: boolean;
  featured: boolean;
}

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.items ?? [];

  const set = (key: keyof FilterState, value: string | boolean) =>
    onChange({ ...filters, [key]: value });

  const clearAll = () =>
    onChange({ search: "", category_id: "", min_price: "", max_price: "", in_stock: false, featured: false });

  const hasFilters = filters.search || filters.category_id || filters.min_price ||
    filters.max_price || filters.in_stock || filters.featured;

  return (
    <aside className="space-y-5 w-full">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm">Filters</h2>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={clearAll}>
            <X className="h-3 w-3" /> Clear all
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="search" className="text-xs text-muted-foreground">Search</Label>
        <Input
          id="search"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Category</Label>
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant={filters.category_id === "" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => set("category_id", "")}
          >
            All
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={filters.category_id === String(cat.id) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => set("category_id", String(cat.id))}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Price Range</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Min"
            type="number"
            min="0"
            value={filters.min_price}
            onChange={(e) => set("min_price", e.target.value)}
            className="h-8 text-sm"
          />
          <Input
            placeholder="Max"
            type="number"
            min="0"
            value={filters.max_price}
            onChange={(e) => set("max_price", e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.in_stock}
            onChange={(e) => set("in_stock", e.target.checked)}
            className="rounded border-input"
          />
          <span className="text-sm">In Stock Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="rounded border-input"
          />
          <span className="text-sm">Featured Only</span>
        </label>
      </div>
    </aside>
  );
}
