import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Tag, ShoppingBag, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DarkModeToggle } from "@/components/shared/DarkModeToggle";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package, end: false },
  { to: "/admin/categories", label: "Categories", icon: Tag, end: false },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, end: false },
];

export function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r bg-card flex flex-col shrink-0">
        <div className="h-16 flex items-center px-4 border-b font-semibold text-sm">
          Admin Panel
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t space-y-2">
          <DarkModeToggle />
          <Separator />
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
            <NavLink to="/">
              <ChevronLeft className="h-4 w-4" />
              Back to Store
            </NavLink>
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
