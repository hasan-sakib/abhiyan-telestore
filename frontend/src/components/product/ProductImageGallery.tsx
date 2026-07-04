import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
  const [selected, setSelected] = useState(sorted.find((i) => i.is_primary) ?? sorted[0]);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
        No image available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border">
        <img
          src={selected?.url}
          alt={selected?.alt_text ?? productName}
          className="w-full h-full object-cover"
        />
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelected(img)}
              className={cn(
                "h-16 w-16 shrink-0 rounded-md overflow-hidden border-2 transition-colors",
                selected?.id === img.id ? "border-primary" : "border-transparent hover:border-muted-foreground"
              )}
            >
              <img
                src={img.url}
                alt={img.alt_text ?? productName}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
