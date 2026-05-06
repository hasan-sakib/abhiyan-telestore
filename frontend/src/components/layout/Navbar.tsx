import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DarkModeToggle } from "@/components/shared/DarkModeToggle";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useLogout } from "@/hooks/useAuth";

const NAV_LINKS = [
  { to: "/products", label: "Phones" },
  { to: "/products?category=accessories", label: "Accessories" },
  { to: "/orders", label: "Support" },
  { to: "/products?featured=true", label: "Brands" },
];

export function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const { totalItems, setDrawerOpen } = useCartStore();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const itemCount = totalItems();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-4 lg:gap-8 min-w-0">
          <Link
            to="/"
            className="font-extrabold text-xl sm:text-2xl lg:text-3xl text-primary tracking-tight whitespace-nowrap"
          >
            Abiyan Telestore
          </Link>
          <nav className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold transition-colors pb-1 ${
                  i === 0
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <form
            onSubmit={submitSearch}
            className="hidden md:flex neumorphic-inset bg-background px-4 py-2 rounded-full items-center gap-2"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search devices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-32 lg:w-56 placeholder:text-muted-foreground"
            />
          </form>

          <DarkModeToggle />

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open cart"
            className="relative neumorphic-raised bg-background p-2 sm:p-2.5 rounded-full text-primary hover:scale-105 active:scale-95 transition-transform"
          >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px]">
                {itemCount > 99 ? "99+" : itemCount}
              </Badge>
            )}
          </button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="User menu"
                  className="neumorphic-raised bg-background p-2 sm:p-2.5 rounded-full text-primary hover:scale-105 active:scale-95 transition-transform"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user?.full_name}
                </div>
                <div className="px-2 pb-1.5 text-xs text-muted-foreground">
                  {user?.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  Order History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden neumorphic-raised bg-background p-2 sm:p-2.5 rounded-full text-primary"
          >
            {mobileOpen ? (
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3">
            <form
              onSubmit={submitSearch}
              className="md:hidden neumorphic-inset bg-background px-4 py-2 rounded-full flex items-center gap-2"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search devices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
              />
            </form>
            <nav className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
