import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingCart, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

interface AdminStats {
  total_products: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
}

const cards = [
  { key: "total_products", label: "Total Products", icon: Package },
  { key: "total_orders", label: "Total Orders", icon: ShoppingCart },
  { key: "total_revenue", label: "Total Revenue", icon: DollarSign, isCurrency: true },
  { key: "pending_orders", label: "Pending Orders", icon: Clock },
] as const;

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => apiFetch<AdminStats>("/api/v1/admin/stats"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user?.full_name?.split(" ")[0] ?? "Admin"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Quick overview of your store activity.
        </p>
      </div>

      {error && (
        <Card>
          <CardContent className="p-4 text-sm text-destructive">
            Failed to load stats: {(error as Error).message}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ key, label, icon: Icon, isCurrency }) => {
          const value = data?.[key as keyof AdminStats];
          return (
            <Card key={key}>
              <CardHeader className="flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {isLoading || value === undefined
                    ? "—"
                    : isCurrency
                      ? new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(Number(value))
                      : Number(value).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
