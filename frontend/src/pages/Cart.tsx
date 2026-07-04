import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/components/cart/CartItem";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

export default function Cart() {
  const { items, clearCart, totalPrice } = useCartStore();
  const navigate = useNavigate();
  const total = totalPrice();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products to get started.</p>
        <Button asChild><Link to="/products">Browse Products</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-display">Shopping Cart ({items.length})</h1>
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => clearCart()}>
          Clear all
        </Button>
      </div>

      <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
        {items.map((item) => (
          <div key={item.product_id} className="px-4">
            <CartItem item={item} />
          </div>
        ))}
      </div>

      <div className="mt-6 border border-border rounded-xl p-5 bg-card space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
