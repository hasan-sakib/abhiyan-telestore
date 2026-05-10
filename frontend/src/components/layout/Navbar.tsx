import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, ShoppingCart, User, Menu, X, Heart,
  ChevronDown, Smartphone, Laptop, Tablet, Watch,
  Headphones, Plug, Zap, Tag,
} from "lucide-react";
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

const CATEGORY_LINKS = [
  { to: "/products?category=smartphones", label: "Smartphones", icon: Smartphone, color: "text-blue-500" },
  { to: "/products?category=laptops", label: "Laptops", icon: Laptop, color: "text-purple-500" },
  { to: "/products?category=tablets", label: "Tablets", icon: Tablet, color: "text-indigo-500" },
  { to: "/products?category=smartwatch", label: "Smart Watch", icon: Watch, color: "text-green-500" },
  { to: "/products?category=audio", label: "Audio", icon: Headphones, color: "text-pink-500" },
  { to: "/products?category=accessories", label: "Accessories", icon: Plug, color: "text-orange-500" },
];

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products?featured=true", label: "Offers", badge: "Hot" },
  { to: "/products?status=upcoming", label: "Upcoming" },
];

export function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const { totalItems, setDrawerOpen } = useCartStore();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const itemCount = totalItems();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "glass-panel shadow-lg"
          : "bg-background/80 backdrop-blur-md border-b border-border/40"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-3.5">

        {/* Logo */}
        <Link
          to="/"
          className="font-extrabold text-xl sm:text-2xl tracking-tight whitespace-nowrap text-gradient-primary flex-shrink-0"
        >
          Abiyan<span className="text-foreground"> Telestore</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
            >
              {link.label}
              {link.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full leading-4">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          {/* Categories mega menu trigger */}
          <button
            type="button"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
            className="relative flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
          >
            Categories
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />

            {/* Mega menu dropdown */}
            {megaOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 glass-card rounded-2xl p-3 shadow-xl border border-border/50">
                <div className="grid grid-cols-2 gap-1">
                  {CATEGORY_LINKS.map(({ to, label, icon: Icon, color }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-colors group"
                    >
                      <Icon className={`h-4 w-4 ${color} group-hover:scale-110 transition-transform`} />
                      <span className="text-sm font-medium text-foreground">{label}</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-border/50">
                  <Link
                    to="/products"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary/5 transition-colors text-sm font-semibold text-primary"
                  >
                    <Tag className="h-4 w-4" /> View All Products
                  </Link>
                </div>
              </div>
            )}
          </button>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Search bar desktop */}
          <form
            onSubmit={submitSearch}
            className="hidden md:flex neumorphic-inset bg-background px-4 py-2 rounded-full items-center gap-2 w-48 lg:w-64 focus-within:ring-2 focus-within:ring-primary/30 transition-all"
          >
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search devices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground shrink-0"
            />
          </form>

          <DarkModeToggle />

          {/* Wishlist */}
          <button
            type="button"
            aria-label="Wishlist"
            onClick={() => navigate("/products")}
            className="hidden sm:flex neumorphic-raised bg-background p-2 sm:p-2.5 rounded-full text-muted-foreground hover:text-red-500 hover:scale-105 active:scale-95 transition-all"
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open cart"
            className="relative neumorphic-raised bg-background p-2 sm:p-2.5 rounded-full text-primary hover:scale-105 active:scale-95 transition-transform"
          >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] animate-pulse-soft">
                {itemCount > 99 ? "99+" : itemCount}
              </Badge>
            )}
          </button>

          {/* User menu */}
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
              <DropdownMenuContent align="end" className="w-56 glass-card border-border/50">
                <div className="px-3 py-2 border-b border-border/50">
                  <div className="text-sm font-semibold text-foreground">{user?.full_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                </div>
                <DropdownMenuItem onClick={() => navigate("/orders")} className="mt-1">
                  Order History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              className="hidden sm:inline-flex bg-gradient-primary text-white border-0 hover:opacity-90 hover:scale-105 transition-all shadow-md"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          )}

          {/* Mobile menu toggle */}
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

      {/* Top promo bar */}
      <div className="bg-gradient-primary text-white text-center text-xs py-1.5 font-medium tracking-wide hidden md:flex items-center justify-center gap-6">
        <span className="flex items-center gap-1.5"><Zap className="h-3 w-3" /> Free delivery on orders over ৳5000</span>
        <span>•</span>
        <span>EMI available on all products</span>
        <span>•</span>
        <span className="flex items-center gap-1.5"><Tag className="h-3 w-3" /> Use code <strong>ABIYAN10</strong> for 10% off</span>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/50 bg-background/98 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3">
            <form
              onSubmit={submitSearch}
              className="neumorphic-inset bg-background px-4 py-2.5 rounded-full flex items-center gap-2"
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

            <nav className="flex flex-col gap-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 px-3 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                >
                  {link.label}
                  {link.badge && (
                    <span className="ml-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="mt-1 pt-1 border-t border-border/50">
                <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</p>
                {CATEGORY_LINKS.map(({ to, label, icon: Icon, color }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                  >
                    <Icon className={`h-4 w-4 ${color}`} />
                    {label}
                  </Link>
                ))}
              </div>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 py-2.5 px-3 text-sm font-semibold text-primary bg-primary/10 rounded-xl text-center transition-colors"
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
