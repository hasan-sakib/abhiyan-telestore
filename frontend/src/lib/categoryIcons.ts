import {
  Smartphone, Tablet, Watch, Headphones,
  Plug, Laptop, Camera, Speaker, Tag,
  type LucideIcon,
} from "lucide-react";

export function pickCategoryIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("phone")) return Smartphone;
  if (n.includes("laptop")) return Laptop;
  if (n.includes("tablet")) return Tablet;
  if (n.includes("watch") || n.includes("wear")) return Watch;
  if (n.includes("headphone") || n.includes("audio") || n.includes("earbud")) return Headphones;
  if (n.includes("speaker")) return Speaker;
  if (n.includes("camera")) return Camera;
  if (n.includes("power") || n.includes("charger") || n.includes("cable") || n.includes("access")) return Plug;
  return Tag;
}
