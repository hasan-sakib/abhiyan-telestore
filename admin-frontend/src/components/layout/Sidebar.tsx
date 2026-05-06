import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Users, ShoppingCart, FolderTree, Settings, Store } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/items", icon: Package, label: "Items" },
  { to: "/categories", icon: FolderTree, label: "Categories" },
  { to: "/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/admin", icon: Users, label: "Admin" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("w-60 shrink-0 border-r bg-card flex flex-col", className)}>
      <div className="flex items-center gap-2 px-5 h-16 border-b">
        <Store className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold tracking-tight">Telestore</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t text-xs text-muted-foreground">
        Abiyan Telestore Admin
      </div>
    </aside>
  );
}
