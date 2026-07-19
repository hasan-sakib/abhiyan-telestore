import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, MoreHorizontal, Search, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Pagination } from "@/components/shared/Pagination";
import { ImageUploadList } from "@/components/shared/ImageUploadList";
import { apiFetch } from "@/lib/api";
import { formatPrice, iconButtonTrigger } from "@/lib/utils";

type ProductStatus = "in_stock" | "out_of_stock" | "discontinued";

interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  status: ProductStatus;
  is_featured: boolean;
  brand: string | null;
  model: string | null;
  category_id: number | null;
  images: ProductImage[];
}

interface ProductList {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
}

const statusLabels: Record<ProductStatus, { label: string; variant: "success" | "warning" | "destructive" }> = {
  in_stock: { label: "In stock", variant: "success" },
  out_of_stock: { label: "Out of stock", variant: "warning" },
  discontinued: { label: "Discontinued", variant: "destructive" },
};

export default function Items() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const params = new URLSearchParams({ page: String(page), page_size: "20" });
  if (search) params.set("search", search);

  const { data, isLoading } = useQuery({
    queryKey: ["products", page, search],
    queryFn: () => apiFetch<ProductList>(`/api/v1/products/?${params}`),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["products"] });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/v1/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Product deleted");
      setDeleting(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Items"
        description="Products available in the storefront catalog"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        }
      />
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Loading…</TableCell></TableRow>}
                {!isLoading && data?.items.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">No products yet. Add your first item.</TableCell></TableRow>
                )}
                {data?.items.map((p) => {
                  const cover = p.images.find((i) => i.is_primary) ?? p.images[0];
                  const s = statusLabels[p.status];
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                            {cover
                              ? <img src={cover.url} alt={p.name} className="h-full w-full object-cover" />
                              : <ImageIcon className="h-4 w-4 text-muted-foreground" />}
                          </div>
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.slug}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{p.brand ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{formatPrice(p.discount_price ?? p.price)}</span>
                          {p.discount_price && (
                            <span className="text-xs text-muted-foreground line-through">{formatPrice(p.price)}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{p.stock_quantity}</TableCell>
                      <TableCell><Badge variant={s.variant}>{s.label}</Badge></TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger className={iconButtonTrigger}>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => setEditing(p)}>Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(p)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {data && (
            <Pagination page={page} pageSize={data.page_size} total={data.total} onPageChange={setPage} />
          )}
        </CardContent>
      </Card>

      {createOpen && (
        <ProductDialog
          mode="create"
          onClose={() => setCreateOpen(false)}
          onSaved={() => { setCreateOpen(false); invalidate(); }}
        />
      )}
      {editing && (
        <ProductDialog
          mode="edit"
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); invalidate(); }}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        title={`Delete ${deleting?.name}?`}
        description="This permanently removes the product."
        confirmLabel="Delete"
        confirmVariant="destructive"
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  discount_price: string;
  stock_quantity: string;
  brand: string;
  model: string;
  status: ProductStatus;
  is_featured: boolean;
  image_urls: string[];
}

function toFormState(p?: Product): ProductFormState {
  return {
    name: p?.name ?? "",
    description: p?.description ?? "",
    price: p ? String(p.price) : "",
    discount_price: p?.discount_price != null ? String(p.discount_price) : "",
    stock_quantity: p ? String(p.stock_quantity) : "0",
    brand: p?.brand ?? "",
    model: p?.model ?? "",
    status: p?.status ?? "in_stock",
    is_featured: p?.is_featured ?? false,
    image_urls: p?.images.map((i) => i.url) ?? [],
  };
}

function ProductDialog({
  mode, product, onClose, onSaved,
}: {
  mode: "create" | "edit";
  product?: Product;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [state, setState] = useState<ProductFormState>(() => toFormState(product));

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: state.name,
        description: state.description || null,
        price: Number(state.price),
        discount_price: state.discount_price ? Number(state.discount_price) : null,
        stock_quantity: Number(state.stock_quantity),
        brand: state.brand || null,
        model: state.model || null,
        status: state.status,
        is_featured: state.is_featured,
        image_urls: state.image_urls,
      };
      if (mode === "create") {
        return apiFetch("/api/v1/products/", { method: "POST", body: payload });
      }
      return apiFetch(`/api/v1/products/${product!.id}`, { method: "PUT", body: payload });
    },
    onSuccess: () => {
      toast.success(mode === "create" ? "Product created" : "Product updated");
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const set = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Item" : "Edit Item"}</DialogTitle>
          <DialogDescription>Fields marked with * are required.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name *</Label>
            <Input value={state.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Brand</Label>
            <Input value={state.brand} onChange={(e) => set("brand", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Model</Label>
            <Input value={state.model} onChange={(e) => set("model", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Price (BDT) *</Label>
            <Input type="number" min={0} step="0.01" value={state.price} onChange={(e) => set("price", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Discount price</Label>
            <Input type="number" min={0} step="0.01" value={state.discount_price} onChange={(e) => set("discount_price", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Stock quantity</Label>
            <Input type="number" min={0} value={state.stock_quantity} onChange={(e) => set("stock_quantity", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={state.status}
              onChange={(e) => set("status", e.target.value as ProductStatus)}
            >
              <option value="in_stock">In stock</option>
              <option value="out_of_stock">Out of stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={state.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Images</Label>
            <ImageUploadList value={state.image_urls} onChange={(urls) => set("image_urls", urls)} />
          </div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <Checkbox checked={state.is_featured} onChange={(e) => set("is_featured", (e.target as HTMLInputElement).checked)} />
            Featured on storefront
          </label>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : mode === "create" ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
