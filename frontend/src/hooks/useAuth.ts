import { useMutation } from "@tanstack/react-query";
import { useAuthStore, type AuthUser } from "@/store/authStore";
import { toast } from "@/hooks/useToast";
import { BASE_URL } from "@/api/client";
import { apiFetch } from "@/hooks/useProducts";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

async function authFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const tokens = await authFetch<TokenResponse>("/api/v1/auth/login", data);
      const me = await fetch(`${BASE_URL}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }).then((r) => r.json());
      return { tokens, user: me };
    },
    onSuccess: ({ tokens, user }) => {
      setAuth(user, tokens.access_token, tokens.refresh_token);
      toast({ title: `Welcome back, ${user.full_name}!`, variant: "success" });
    },
    onError: (err: Error) => toast({ title: err.message, variant: "destructive" }),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (data: { email: string; password: string; full_name: string }) => {
      const tokens = await authFetch<TokenResponse>("/api/v1/auth/register", data);
      const me = await fetch(`${BASE_URL}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }).then((r) => r.json());
      return { tokens, user: me };
    },
    onSuccess: ({ tokens, user }) => {
      setAuth(user, tokens.access_token, tokens.refresh_token);
      toast({ title: "Account created! Welcome to Abiyan Telestore.", variant: "success" });
    },
    onError: (err: Error) => toast({ title: err.message, variant: "destructive" }),
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  return useMutation({
    mutationFn: async () => {
      logout();
    },
    onSuccess: () => toast({ title: "Signed out." }),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      authFetch<void>("/api/v1/auth/forgot-password", data),
    onSuccess: () => toast({ title: "Reset email sent — check your inbox.", variant: "success" }),
    onError: (err: Error) => toast({ title: err.message, variant: "destructive" }),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; new_password: string }) =>
      authFetch<void>("/api/v1/auth/reset-password", data),
    onSuccess: () => toast({ title: "Password updated! Please log in.", variant: "success" }),
    onError: (err: Error) => toast({ title: err.message, variant: "destructive" }),
  });
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (data: { full_name: string; email: string }) =>
      apiFetch<AuthUser>("/api/v1/users/me", { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: (user) => {
      setUser(user);
      toast({ title: "Profile updated.", variant: "success" });
    },
    onError: (err: Error) => toast({ title: err.message, variant: "destructive" }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { current_password: string; new_password: string }) =>
      apiFetch<void>("/api/v1/users/me/change-password", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => toast({ title: "Password changed.", variant: "success" }),
    onError: (err: Error) => toast({ title: err.message, variant: "destructive" }),
  });
}
