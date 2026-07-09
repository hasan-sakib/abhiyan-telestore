import { NavLink } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/themeStore";
import { useLogout } from "@/hooks/useAuth";

const items = [
  { to: "/", icon: "dashboard", label: "Dashboard", end: true },
  { to: "/items", icon: "inventory_2", label: "Inventory" },
  { to: "/categories", icon: "category", label: "Categories" },
  { to: "/orders", icon: "receipt_long", label: "Orders" },
  { to: "/admin", icon: "group", label: "Customers" },
];

export function Sidebar() {
  const logout = useLogout();
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-card border-r border-border p-6 sticky top-0 z-40">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold text-secondary tracking-tight">ABIYAN</h1>
        <p className="text-xs label-caps text-muted-foreground mt-1">Systems Controller</p>
      </div>

      <nav className="grow space-y-1 overflow-y-auto">
        {items.map(({ to, icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-bold"
                  : "text-muted-foreground hover:bg-muted hover:text-primary",
              )
            }
          >
            <Icon name={icon} size={20} />
            <span className="text-sm font-semibold">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-border pt-4 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
              isActive
                ? "text-secondary font-bold"
                : "text-muted-foreground hover:bg-muted hover:text-primary",
            )
          }
        >
          <Icon name="settings" size={20} />
          <span className="text-sm font-semibold">Settings</span>
        </NavLink>

        <button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
        >
          <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} size={20} />
          <span className="text-sm font-semibold">
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </span>
        </button>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-destructive transition-colors hover:bg-destructive/10"
        >
          <Icon name="logout" size={20} />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
