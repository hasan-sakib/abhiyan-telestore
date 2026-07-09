import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/PageHeader";
import { apiFetch } from "@/lib/api";
import { formatDate, formatPrice, orderStatusVariant, type OrderStatus } from "@/lib/utils";

interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  total_amount: number;
  shipping_address: ShippingAddress;
  created_at: string;
  items: OrderItem[];
}

const transitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => apiFetch<Order>(`/api/v1/orders/${id}`),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (status: OrderStatus) =>
      apiFetch(`/api/v1/orders/${id}/status`, { method: "PATCH", body: { status } }),
    onSuccess: () => {
      toast.success("Order updated");
      qc.invalidateQueries({ queryKey: ["order", id] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return <div className="text-center text-muted-foreground py-12">Loading…</div>;
  }

  if (!order) {
    return <div className="text-center text-muted-foreground py-12">Order not found.</div>;
  }

  const next = transitions[order.status];
  const address = order.shipping_address;

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => navigate("/orders")} className="w-fit">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <PageHeader
        title={
          <span className="flex items-center gap-3">
            Order #{order.id}
            <Badge variant={orderStatusVariant(order.status)} className="capitalize">{order.status}</Badge>
          </span>
        }
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={next.length === 0}>
                Update Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {next.map((s) => (
                <DropdownMenuItem
                  key={s}
                  variant={s === "cancelled" ? "destructive" : "default"}
                  onSelect={() => updateMutation.mutate(s)}
                  className="capitalize"
                >
                  Mark as {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>Placed on {formatDate(order.created_at)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatPrice(item.unit_price)}</TableCell>
                      <TableCell className="text-right">{formatPrice(item.unit_price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end items-baseline gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">{formatPrice(order.total_amount)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
            <CardDescription>Customer #{order.user_id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{address.full_name}</p>
            <p className="text-muted-foreground">{address.phone}</p>
            <p>{address.address_line1}</p>
            {address.address_line2 && <p>{address.address_line2}</p>}
            <p>
              {address.city}
              {address.state ? `, ${address.state}` : ""} {address.postal_code}
            </p>
            <p>{address.country}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
