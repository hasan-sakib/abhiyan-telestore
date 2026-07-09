import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { apiFetch } from "@/lib/api";
import { formatDate, formatPrice, iconButtonTrigger, orderStatusVariant, type OrderStatus } from "@/lib/utils";

interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  total_amount: number;
  shipping_address: { full_name?: string; city?: string; phone?: string };
  created_at: string;
}

interface OrderList {
  items: Order[];
  total: number;
  page: number;
  page_size: number;
}

const transitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export default function Orders() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);

  const params = new URLSearchParams({ page: String(page), page_size: "20" });
  if (filter !== "all") params.set("status", filter);

  const { data, isLoading } = useQuery({
    queryKey: ["orders", page, filter],
    queryFn: () => apiFetch<OrderList>(`/api/v1/orders/admin/all?${params}`),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      apiFetch(`/api/v1/orders/${id}/status`, { method: "PATCH", body: { status } }),
    onSuccess: () => { toast.success("Order updated"); qc.invalidateQueries({ queryKey: ["orders"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const filters: (OrderStatus | "all")[] = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Track and manage customer orders" />
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => { setFilter(f); setPage(1); }}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Placed</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Loading…</TableCell></TableRow>}
                {!isLoading && data?.items.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">No orders.</TableCell></TableRow>
                )}
                {data?.items.map((o) => {
                  const next = transitions[o.status];
                  return (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">#{o.id}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {o.shipping_address.full_name ?? `User #${o.user_id}`}
                      </TableCell>
                      <TableCell>{formatPrice(o.total_amount)}</TableCell>
                      <TableCell><Badge variant={orderStatusVariant(o.status)} className="capitalize">{o.status}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(o.created_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger className={iconButtonTrigger}>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => navigate(`/orders/${o.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            {next.map((s) => (
                              <DropdownMenuItem
                                key={s}
                                variant={s === "cancelled" ? "destructive" : "default"}
                                onSelect={() => updateMutation.mutate({ id: o.id, status: s })}
                                className="capitalize"
                              >
                                Mark as {s}
                              </DropdownMenuItem>
                            ))}
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
    </div>
  );
}
