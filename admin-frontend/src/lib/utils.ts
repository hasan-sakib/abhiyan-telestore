import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export function orderStatusVariant(
  status: OrderStatus,
): "default" | "success" | "warning" | "destructive" | "secondary" {
  if (status === "delivered") return "success";
  if (status === "cancelled") return "destructive";
  if (status === "pending") return "warning";
  return "secondary";
}

export const iconButtonTrigger = "h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted";
