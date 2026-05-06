import { Outlet } from "react-router-dom";
import { Store } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 min-h-0">
        <aside className="hidden lg:flex w-1/2 bg-muted items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Store className="h-16 w-16 text-primary" strokeWidth={2} />
            <span className="text-3xl font-semibold text-primary tracking-tight">Telestore</span>
            <span className="text-sm text-muted-foreground">Admin Console</span>
          </div>
        </aside>
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </main>
      </div>
      <footer className="flex items-center justify-between border-t px-6 py-4 text-xs text-muted-foreground">
        <span>Abiyan Telestore Admin · {new Date().getFullYear()}</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-foreground">GitHub</a>
          <a href="#" className="hover:text-foreground">X</a>
          <a href="#" className="hover:text-foreground">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}
