import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import type { Product, PaginatedResponse } from "@/types";

interface ProductFilters {
  page?: number;
  page_size?: number;
  category_id?: number;
  category_slug?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  brand?: string;
  is_featured?: boolean;
  in_stock?: boolean;
  status?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function useProducts(filters: ProductFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
  });
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ["products", filters],
    queryFn: () => apiFetch(`/api/v1/products/?${params}`),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(slug: string) {
  return useQuery<Product>({
    queryKey: ["product", "slug", slug],
    queryFn: () => apiFetch(`/api/v1/products/${slug}`),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductById(id: number | undefined) {
  return useQuery<Product>({
    queryKey: ["product", "id", id],
    queryFn: () => apiFetch(`/api/v1/products/by-id/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) =>
      apiFetch<Product>("/api/v1/products/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      apiFetch<Product>(`/api/v1/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(`/api/v1/products/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
