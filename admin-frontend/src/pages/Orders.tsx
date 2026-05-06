import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

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

const variantFor = (s: OrderStatus): "default" | "success" | "warning" | "destructive" | "secondary" => {
  if (s === "delivered") return "success";
  if (s === "cancelled") return "destructive";
  if (s === "pending") return "warning";
  return "secondary";
};

export default function Orders() {
  const qc = useQueryClient();
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
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Track and manage customer orders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                      <TableCell><Badge variant={variantFor(o.status)} className="capitalize">{o.status}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(o.created_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted disabled:opacity-50"
                            disabled={next.length === 0}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {next.length === 0 && (
                              <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
                            )}
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

          {data && data.total > data.page_size && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Page {data.page} of {Math.max(1, Math.ceil(data.total / data.page_size))}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page * data.page_size >= data.total}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
