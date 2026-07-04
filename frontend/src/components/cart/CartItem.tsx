import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const primaryImage = item.product?.images?.find((i) => i.is_primary) ?? item.product?.images?.[0];
  const price = item.product?.discount_price ?? item.product?.price ?? 0;

  return (
    <div className="flex gap-3 py-3">
      <div className="h-16 w-16 shrink-0 rounded-md overflow-hidden bg-muted border border-border">
        {primaryImage ? (
          <img src={primaryImage.url} alt={item.product?.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium line-clamp-1">{item.product?.name}</p>
        <p className="text-xs text-muted-foreground">{item.product?.brand}</p>
        <p className="text-sm font-bold mt-0.5">{formatPrice(price * item.quantity)}</p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={() => removeItem(item.product_id)}
          aria-label="Remove item"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-6 text-center text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
