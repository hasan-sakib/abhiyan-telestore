import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "./CartItem";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

export function CartDrawer() {
  const { items, isDrawerOpen, setDrawerOpen, totalPrice } = useCartStore();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const drawer = drawerRef.current;
    const overlay = overlayRef.current;
    if (!drawer || !overlay) return;

    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(drawer, { x: "100%" }, { x: "0%", duration: 0.3, ease: "power2.out" });
    } else {
      gsap.to(drawer, { x: "100%", duration: 0.25, ease: "power2.in" });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => { document.body.style.overflow = ""; },
      });
    }
  }, [isDrawerOpen]);

  const handleCheckout = () => {
    setDrawerOpen(false);
    navigate("/checkout");
  };

  const total = totalPrice();

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-black/50 opacity-0"
        style={{ pointerEvents: isDrawerOpen ? "auto" : "none" }}
        onClick={() => setDrawerOpen(false)}
      />

      <div
        ref={drawerRef}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-background border-l shadow-xl translate-x-full flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Your Cart ({items.length})</h2>
          <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)} aria-label="Close cart">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <Button variant="outline" onClick={() => { setDrawerOpen(false); navigate("/products"); }}>
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <CartItem key={item.product_id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
            <Separator />
            <Button className="w-full" onClick={handleCheckout}>
              Checkout — {formatPrice(total)}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
