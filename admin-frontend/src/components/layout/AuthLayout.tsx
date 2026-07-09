import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex flex-1 min-h-0">
        <aside className="hidden lg:flex w-1/2 bg-muted items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-transparent to-secondary/20" />
          <div className="flex flex-col items-center gap-3 relative">
            <h1 className="text-6xl font-bold text-primary tracking-tighter">ABIYAN</h1>
            <span className="label-caps text-muted-foreground">Systems Controller</span>
            <span className="text-sm text-muted-foreground mt-4">Admin Console</span>
          </div>
        </aside>
        <main className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </main>
      </div>
      <footer className="flex items-center justify-between border-t border-border px-6 py-4 label-caps text-muted-foreground">
        <span>Abiyan Telestore Admin · {new Date().getFullYear()}</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-primary transition-colors">GitHub</a>
          <a href="#" className="hover:text-primary transition-colors">X</a>
          <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}
