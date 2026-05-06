import { Package, ShoppingBag, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/hooks/useProducts";
import type { AdminStats } from "@/types";

function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin", "stats"],
    queryFn: () => apiFetch<AdminStats>("/admin/stats"),
  });
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Products"
            value={stats?.total_products ?? 0}
            icon={<Package className="h-4 w-4" />}
          />
          <StatCard
            title="Total Orders"
            value={stats?.total_orders ?? 0}
            icon={<ShoppingBag className="h-4 w-4" />}
          />
          <StatCard
            title="Total Revenue"
            value={formatPrice(stats?.total_revenue ?? 0)}
            icon={<DollarSign className="h-4 w-4" />}
          />
          <StatCard
            title="Pending Orders"
            value={stats?.pending_orders ?? 0}
            icon={<Clock className="h-4 w-4" />}
            description="Awaiting confirmation"
          />
        </div>
      )}
    </div>
  );
}
