import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_COLORS } from "@/lib/constants";
import { useOrder } from "@/hooks/useOrders";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useOrder(Number(id));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Order not found.</p>
        <Button asChild variant="outline"><Link to="/orders">Back to Orders</Link></Button>
      </div>
    );
  }

  const statusColor = ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] ?? "";

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-1 gap-1">
        <Link to="/orders"><ChevronLeft className="h-4 w-4" /> Back to Orders</Link>
      </Button>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <Badge className={statusColor} variant="outline">
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
          year: "numeric", month: "long", day: "numeric",
        })}
      </p>

      <Card className="mb-4">
        <CardHeader><CardTitle className="text-base">Items</CardTitle></CardHeader>
        <CardContent className="divide-y p-0">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between items-center px-6 py-3 text-sm">
              <div>
                <p className="font-medium">{item.product_name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <span>{formatPrice(item.unit_price * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center px-6 py-3 font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total_amount)}</span>
          </div>
        </CardContent>
      </Card>

      {order.shipping_address && (
        <Card>
          <CardHeader><CardTitle className="text-base">Shipping Address</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-0.5 text-muted-foreground">
            <p>{(order.shipping_address as Record<string, string>).full_name}</p>
            <p>{(order.shipping_address as Record<string, string>).address_line1}</p>
            {(order.shipping_address as Record<string, string>).address_line2 && (
              <p>{(order.shipping_address as Record<string, string>).address_line2}</p>
            )}
            <p>
              {(order.shipping_address as Record<string, string>).city},{" "}
              {(order.shipping_address as Record<string, string>).postal_code}
            </p>
            <p>{(order.shipping_address as Record<string, string>).country}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
