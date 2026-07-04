import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

const TABS = [
  { to: "/",        label: "Home",     icon: Home },
  { to: "/products",label: "Products", icon: LayoutGrid },
  { to: "/cart",    label: "Cart",     icon: ShoppingCart, cartBadge: true },
  { to: "/orders",  label: "Account",  icon: User, authTo: "/login" },
];

export function MobileNav() {
  const location = useLocation();
  const { totalItems, setDrawerOpen } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const count = totalItems();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {TABS.map(({ to, label, icon: Icon, cartBadge, authTo }) => {
          const href = authTo && !isAuthenticated ? authTo : to;
          const isActive =
            to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

          if (cartBadge) {
            return (
              <button
                key={label}
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex flex-col items-center gap-0.5 px-4 py-1.5 relative"
                aria-label={label}
              >
                <div className="relative">
                  <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold min-w-4 h-4 px-0.5 rounded-full flex items-center justify-center">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={label}
              to={href}
              className="flex flex-col items-center gap-0.5 px-4 py-1.5"
            >
              <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
