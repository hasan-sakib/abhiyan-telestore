import { cn } from "@/lib/utils";

export function Icon({
  name,
  className,
  filled,
  size = 20,
}: {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}) {
  return (
    <span
      className={cn("material-symbols-outlined select-none leading-none", className)}
      style={{
        fontSize: size,
        fontVariationSettings: filled
          ? '"FILL" 1, "wght" 500, "GRAD" 0, "opsz" 24'
          : '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24',
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
