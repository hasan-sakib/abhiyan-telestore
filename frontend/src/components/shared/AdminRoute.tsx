import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);

  if (!user?.is_superuser) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
