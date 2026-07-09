import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

interface AdminStats {
  total_products: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
}

interface ProductRow {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  category?: { name: string } | null;
  images?: { image_url: string }[];
}

interface ProductList {
  items: ProductRow[];
  total: number;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n);

const stockStatus = (stock: number): { label: string; variant: "destructive" | "warning" | "success" } => {
  if (stock <= 0) return { label: "Out of Stock", variant: "destructive" };
  if (stock < 10) return { label: "Low Stock", variant: "warning" };
  return { label: "In Stock", variant: "success" };
};

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => apiFetch<AdminStats>("/api/v1/admin/stats"),
  });

  const { data: products } = useQuery({
    queryKey: ["admin", "dashboard", "products"],
    queryFn: () =>
      apiFetch<ProductList>(
        "/api/v1/products/?page=1&page_size=5&sort_by=created_at&sort_order=desc",
      ),
  });

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Sales"
          value={stats ? formatCurrency(stats.total_revenue) : "—"}
          icon="payments"
          tone="secondary"
          footer={
            <span className="flex items-center gap-1">
              <Icon name="trending_up" size={16} /> +12.5% this month
            </span>
          }
        />
        <StatCard
          label="Active Orders"
          value={stats ? stats.pending_orders.toLocaleString() : "—"}
          icon="local_shipping"
          tone="tertiary"
          footer={`${stats?.pending_orders ?? 0} pending shipment`}
        />
        <StatCard
          label="Total Products"
          value={stats ? stats.total_products.toLocaleString() : "—"}
          icon="inventory_2"
          tone="primary"
          footer={
            <span className="flex items-center gap-1">
              <Icon name="group" size={16} /> Live catalog
            </span>
          }
        />
      </section>

      <Card className="overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Recent Inventory</h3>
          <button
            type="button"
            onClick={() => navigate("/items")}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:bg-secondary/90 transition-colors"
          >
            <Icon name="add" size={16} />
            Add New Product
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="p-4 text-sm font-semibold text-muted-foreground">Product</th>
                <th className="p-4 text-sm font-semibold text-muted-foreground">SKU</th>
                <th className="p-4 text-sm font-semibold text-muted-foreground">Price</th>
                <th className="p-4 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="p-4 text-sm font-semibold text-muted-foreground">Stock</th>
                <th className="p-4 text-sm font-semibold text-muted-foreground text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(products?.items ?? []).slice(0, 5).map((p) => {
                const s = stockStatus(p.stock);
                return (
                  <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 border border-border rounded-lg p-1 overflow-hidden flex items-center justify-center bg-muted">
                          {p.images?.[0]?.image_url ? (
                            <img
                              src={p.images[0].image_url}
                              alt={p.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <Icon name="image" size={20} className="text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{p.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.category?.name ?? "Uncategorised"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-mono text-muted-foreground">
                      ABI-{String(p.id).padStart(5, "0")}
                    </td>
                    <td className="p-4 text-sm font-bold text-foreground">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="p-4">
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </td>
                    <td className="p-4 text-sm">{p.stock} units</td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigate("/items")}
                        className="p-2 rounded-md text-primary hover:bg-muted transition-colors"
                      >
                        <Icon name="edit" size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {(products?.items ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center text-sm text-muted-foreground"
                  >
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <button
        type="button"
        onClick={() => navigate("/items")}
        aria-label="Add new product"
        className="fixed bottom-8 right-8 w-14 h-14 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-secondary/90 transition-colors z-50"
      >
        <Icon name="add" size={24} filled />
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
  footer,
}: {
  label: string;
  value: string;
  icon: string;
  tone: "primary" | "secondary" | "tertiary";
  footer: React.ReactNode;
}) {
  const toneIconBg =
    tone === "secondary"
      ? "bg-secondary/10 text-secondary"
      : tone === "tertiary"
        ? "bg-accent/10 text-accent"
        : "bg-primary/10 text-primary";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <h3 className="text-2xl font-semibold text-foreground mt-1">{value}</h3>
          </div>
          <div className={cn("p-2 rounded-lg", toneIconBg)}>
            <Icon name={icon} size={20} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">{footer}</p>
      </CardContent>
    </Card>
  );
}
