import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, ShoppingCart, User, Menu, X, Heart,
  ChevronDown, Zap, Tag,
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
import { useCategories } from "@/hooks/useCategories";
import { pickCategoryIcon } from "@/lib/categoryIcons";
import { useLogout } from "@/hooks/useAuth";

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
  const { data: categoriesData } = useCategories();
  const categoryLinks = (categoriesData ?? []).filter((c) => !c.parent_id);

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
    <header className="sticky top-0 z-40 w-full">
      {/* Promo bar — above nav, inverted colors */}
      <div className="bg-foreground text-background text-center text-xs py-2 font-medium tracking-wide hidden md:flex items-center justify-center gap-6">
        <span className="flex items-center gap-1.5 text-background/80"><Zap className="h-3 w-3" /> Free delivery on orders over ৳5000</span>
        <span className="text-background/30">•</span>
        <span className="text-background/80">EMI available on all products</span>
        <span className="text-background/30">•</span>
        <span className="flex items-center gap-1.5 text-background/80"><Tag className="h-3 w-3" /> Use code <strong className="text-background">ABIYAN10</strong> for 10% off</span>
      </div>

      {/* Main nav row */}
      <div
        className={`w-full transition-all duration-200 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-background border-b border-border"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-3.5">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
          >
            <span className="inline-block w-2 h-6 bg-primary rounded-sm" />
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight font-display">
              <span className="text-primary">Abiyan</span>
              <span className="text-foreground"> Telestore</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/5"
              >
                {link.label}
                {link.badge && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-white text-[9px] font-bold px-1 rounded-full leading-4">
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
              className="relative flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/5"
            >
              Categories
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />

              {/* Mega menu dropdown */}
              {megaOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-popover border border-border rounded-lg p-2 shadow-lg">
                  <div className="grid grid-cols-2 gap-0.5">
                    {categoryLinks.map((cat) => {
                      const Icon = pickCategoryIcon(cat.name);
                      return (
                        <Link
                          key={cat.id}
                          to={`/products?category_id=${cat.id}`}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-muted transition-colors group"
                        >
                          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-sm font-medium text-foreground">{cat.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-border">
                    <Link
                      to="/products"
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-semibold text-primary"
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
              className="hidden md:flex items-center gap-2 w-48 lg:w-60 border border-border rounded-md bg-background px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all"
            >
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search devices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
              />
            </form>

            <DarkModeToggle />

            {/* Wishlist */}
            <button
              type="button"
              aria-label="Wishlist"
              onClick={() => navigate("/products")}
              className="hidden sm:flex border border-border rounded-md p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
            >
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open cart"
              className="relative border border-border rounded-md p-2 text-primary hover:bg-primary/5 transition-colors"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 flex items-center justify-center text-[10px]">
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
                    className="border border-border rounded-md p-2 text-primary hover:bg-primary/5 transition-colors"
                  >
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-border shadow-lg">
                  <div className="px-3 py-2 border-b border-border">
                    <div className="text-sm font-semibold text-foreground">{user?.full_name}</div>
                    <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                  </div>
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="mt-1">
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
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
                className="hidden sm:inline-flex bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
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
              className="lg:hidden border border-border rounded-md p-2 text-foreground hover:bg-muted transition-colors"
            >
              {mobileOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3">
              <form
                onSubmit={submitSearch}
                className="flex items-center gap-2 border border-border rounded-md px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all"
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
                    className="py-2.5 px-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="ml-2 bg-destructive text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
                <div className="mt-1 pt-1 border-t border-border">
                  <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider label-overline">Categories</p>
                  {categoryLinks.map((cat) => {
                    const Icon = pickCategoryIcon(cat.name);
                    return (
                      <Link
                        key={cat.id}
                        to={`/products?category_id=${cat.id}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 py-2.5 px-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        {cat.name}
                      </Link>
                    );
                  })}
                </div>
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 py-2.5 px-3 text-sm font-semibold text-primary-foreground bg-primary rounded-md text-center transition-colors hover:bg-primary/90"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
