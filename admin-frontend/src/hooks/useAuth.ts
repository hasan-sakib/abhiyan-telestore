import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuthStore, type AuthUser } from "@/stores/authStore";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const tokens = await apiFetch<TokenResponse>("/api/v1/auth/login", {
        method: "POST",
        body: data,
        auth: false,
      });
      useAuthStore.setState({ accessToken: tokens.access_token });
      const user = await apiFetch<AuthUser>("/api/v1/users/me");
      if (!user.is_admin && !user.is_superuser) {
        useAuthStore.getState().logout();
        throw new ApiError(403, "This account is not authorized for the admin dashboard.");
      }
      return { tokens, user };
    },
    onSuccess: ({ tokens, user }) => {
      setAuth(user, tokens.access_token, tokens.refresh_token);
      toast.success(`Welcome back, ${user.full_name}!`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSignup() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (data: { full_name: string; email: string; password: string }) => {
      const tokens = await apiFetch<TokenResponse>("/api/v1/auth/register", {
        method: "POST",
        body: data,
        auth: false,
      });
      useAuthStore.setState({ accessToken: tokens.access_token });
      const user = await apiFetch<AuthUser>("/api/v1/users/me");
      if (!user.is_admin && !user.is_superuser) {
        useAuthStore.getState().logout();
        throw new ApiError(
          403,
          "Account created, but admin access requires an existing superuser to promote you.",
        );
      }
      return { tokens, user };
    },
    onSuccess: ({ tokens, user }) => {
      setAuth(user, tokens.access_token, tokens.refresh_token);
      toast.success("Admin account ready.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  return () => {
    logout();
    toast.success("Signed out.");
  };
}
