import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { shippingAddressSchema, type ShippingAddressInput } from "@/lib/validators";
import { useCartStore } from "@/store/cartStore";
import { useCreateOrder } from "@/hooks/useOrders";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const navigate = useNavigate();
  const total = totalPrice();

  const { register, handleSubmit, formState: { errors } } = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
  });

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const onSubmit = (address: ShippingAddressInput) => {
    const orderItems = items.map((i) => ({ product_id: i.product_id, quantity: i.quantity }));
    createOrder(
      { items: orderItems, shipping_address: address },
      {
        onSuccess: (order) => {
          clearCart();
          navigate(`/orders/${order.id}`);
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-2xl font-bold mb-6 font-display">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader><CardTitle className="text-base">Shipping Address</CardTitle></CardHeader>
            <CardContent>
              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" {...register("full_name")} />
                  {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address_line1">Address</Label>
                  <Input id="address_line1" placeholder="Street address" {...register("address_line1")} />
                  {errors.address_line1 && <p className="text-xs text-destructive">{errors.address_line1.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address_line2">Apartment, suite, etc. (optional)</Label>
                  <Input id="address_line2" {...register("address_line2")} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} />
                    {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input id="postal_code" {...register("postal_code")} />
                    {errors.postal_code && <p className="text-xs text-destructive">{errors.postal_code.message}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" defaultValue="Bangladesh" {...register("country")} />
                  {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" {...register("phone")} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader><CardTitle className="text-base">Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span>{formatPrice((item.product?.discount_price ?? item.product?.price ?? 0) * item.quantity)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button
                form="checkout-form"
                type="submit"
                className="w-full"
                size="lg"
                disabled={isPending}
              >
                {isPending ? "Placing Order..." : `Place Order — ${formatPrice(total)}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
