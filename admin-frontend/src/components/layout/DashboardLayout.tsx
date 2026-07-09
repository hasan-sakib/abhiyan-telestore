import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Icon } from "@/components/ui/icon";
import { useAuthStore } from "@/stores/authStore";

export function DashboardLayout() {
  const user = useAuthStore((s) => s.user);
  const role = user?.is_superuser
    ? "Superuser"
    : user?.is_admin
      ? "Admin"
      : "Member";
  const initial = user?.full_name?.[0]?.toUpperCase() ?? "A";

  return (
    <div className="bg-background text-foreground min-h-screen flex">
      <Sidebar />

      <main className="grow flex flex-col min-w-0">
        <header className="sticky top-0 w-full z-30 flex justify-between items-center px-6 py-4 border-b border-border bg-background">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight">
              Abiyan Telestore
            </h2>
            <div className="hidden lg:flex border border-border bg-muted px-4 py-2 rounded-full items-center gap-2">
              <Icon name="search" size={18} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search analytics..."
                className="bg-transparent border-none focus:outline-none text-sm w-64 placeholder:text-muted-foreground text-foreground"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-2 border border-border rounded-full text-primary hover:bg-muted transition-colors"
              aria-label="Notifications"
            >
              <Icon name="notifications" size={20} />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground">
                  {user?.full_name ?? "Admin"}
                </p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-border bg-muted flex items-center justify-center text-primary font-bold">
                {initial}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6 flex-1">
          <Outlet />
        </div>

        <footer className="w-full px-6 py-12 flex flex-col items-center gap-4 border-t border-border mt-8 bg-background">
          <h4 className="text-2xl font-semibold text-secondary">Abiyan Telestore</h4>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="text-muted-foreground text-sm hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-muted-foreground text-sm hover:text-primary transition-colors" href="#">
              Terms of Service
            </a>
            <a className="text-muted-foreground text-sm hover:text-primary transition-colors" href="#">
              Shipping Info
            </a>
            <a className="text-muted-foreground text-sm hover:text-primary transition-colors" href="#">
              Contact Us
            </a>
          </div>
          <p className="text-xs text-primary">
            © {new Date().getFullYear()} Abiyan Telestore. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
