import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/ui/icon";
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

const stockStatus = (stock: number) => {
  if (stock <= 0)
    return {
      label: "Out of Stock",
      pillBg: "bg-error-container",
      pillFg: "text-on-error-container",
    };
  if (stock < 10)
    return {
      label: "Low Stock",
      pillBg: "bg-tertiary-container",
      pillFg: "text-on-tertiary-container",
    };
  return {
    label: "In Stock",
    pillBg: "bg-secondary-fixed",
    pillFg: "text-on-secondary-fixed-variant",
  };
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
    <div className="space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Sales"
          value={stats ? formatCurrency(stats.total_revenue) : "—"}
          icon="payments"
          tone="secondary"
          path="M0 15 Q 10 5, 20 12 T 40 8 T 60 15 T 80 5 T 100 10"
          footer={
            <span className="flex items-center gap-1">
              <Icon name="trending_up" size={14} /> +12.5% this month
            </span>
          }
        />
        <StatCard
          label="Active Orders"
          value={stats ? stats.pending_orders.toLocaleString() : "—"}
          icon="local_shipping"
          tone="tertiary"
          path="M0 10 Q 20 18, 40 10 T 80 12 T 100 5"
          footer={`${stats?.pending_orders ?? 0} pending shipment`}
        />
        <StatCard
          label="Total Products"
          value={stats ? stats.total_products.toLocaleString() : "—"}
          icon="inventory_2"
          tone="primary"
          path="M0 5 Q 30 5, 50 15 T 100 8"
          footer={
            <span className="flex items-center gap-1">
              <Icon name="group" size={14} /> Live catalog
            </span>
          }
        />
      </section>

      <section className="neu-raised rounded-xl overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-outline-variant/30">
          <h3 className="text-xl font-semibold text-on-surface">Recent Inventory</h3>
          <button
            type="button"
            onClick={() => navigate("/items")}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-lg text-sm font-semibold neu-button hover:scale-105 transition-all"
          >
            <Icon name="add" size={18} />
            Add New Product
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="p-4 text-sm font-semibold text-on-surface-variant">Product</th>
                <th className="p-4 text-sm font-semibold text-on-surface-variant">SKU</th>
                <th className="p-4 text-sm font-semibold text-on-surface-variant">Price</th>
                <th className="p-4 text-sm font-semibold text-on-surface-variant">Status</th>
                <th className="p-4 text-sm font-semibold text-on-surface-variant">Stock</th>
                <th className="p-4 text-sm font-semibold text-on-surface-variant text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {(products?.items ?? []).slice(0, 5).map((p) => {
                const s = stockStatus(p.stock);
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-surface-container-lowest transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 neu-inset rounded-lg p-1 overflow-hidden flex items-center justify-center">
                          {p.images?.[0]?.image_url ? (
                            <img
                              src={p.images[0].image_url}
                              alt={p.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <Icon name="image" size={20} className="text-on-surface-variant" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{p.name}</p>
                          <p className="text-xs text-on-surface-variant">
                            {p.category?.name ?? "Uncategorised"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-mono text-outline">
                      ABI-{String(p.id).padStart(5, "0")}
                    </td>
                    <td className="p-4 text-sm font-bold text-on-surface">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold",
                          s.pillBg,
                          s.pillFg,
                        )}
                      >
                        {s.label}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{p.stock} units</td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigate("/items")}
                        className="p-2 neu-raised rounded-lg text-primary hover:text-secondary transition-colors group-hover:scale-110"
                      >
                        <Icon name="edit" size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {(products?.items ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center text-sm text-on-surface-variant"
                  >
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <button
        type="button"
        onClick={() => navigate("/items")}
        aria-label="Add new product"
        className="fixed bottom-8 right-8 w-14 h-14 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(70,72,212,0.4)] hover:scale-110 active:scale-95 transition-all z-50"
      >
        <Icon name="add" size={28} filled />
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
  path,
  footer,
}: {
  label: string;
  value: string;
  icon: string;
  tone: "primary" | "secondary" | "tertiary";
  path: string;
  footer: React.ReactNode;
}) {
  const toneIconBg =
    tone === "secondary"
      ? "bg-secondary-fixed text-secondary"
      : tone === "tertiary"
        ? "bg-tertiary-fixed text-tertiary"
        : "bg-primary-container text-primary";

  const toneStroke =
    tone === "secondary"
      ? "stroke-secondary"
      : tone === "tertiary"
        ? "stroke-tertiary"
        : "stroke-primary";

  const toneFooter =
    tone === "secondary"
      ? "text-on-secondary-fixed-variant"
      : tone === "tertiary"
        ? "text-on-tertiary-fixed-variant"
        : "text-on-primary-fixed-variant";

  return (
    <div className="neu-raised p-4 rounded-xl hover:scale-[1.02] transition-transform">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
            {label}
          </p>
          <h3 className="text-2xl font-semibold text-on-surface mt-1">{value}</h3>
        </div>
        <div className={cn("p-2 rounded-lg", toneIconBg)}>
          <Icon name={icon} size={22} />
        </div>
      </div>
      <div className="h-12 w-full opacity-40">
        <svg
          className={cn("w-full h-full fill-none stroke-2", toneStroke)}
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
        >
          <path d={path} />
        </svg>
      </div>
      <p className={cn("text-xs mt-2 flex items-center gap-1", toneFooter)}>{footer}</p>
    </div>
  );
}
