import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/hooks/useProducts";
import type { Order, PaginatedResponse } from "@/types";

export function useMyOrders(params: { page?: number; page_size?: number } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.page_size) qs.set("page_size", String(params.page_size));
  return useQuery<PaginatedResponse<Order>>({
    queryKey: ["orders", "mine", params],
    queryFn: () => apiFetch(`/api/v1/orders/?${qs}`),
  });
}

export function useOrder(id: number) {
  return useQuery<Order>({
    queryKey: ["order", id],
    queryFn: () => apiFetch(`/api/v1/orders/${id}`),
    enabled: !!id,
  });
}

export function useAllOrders(params: { page?: number; page_size?: number; status?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.page_size) qs.set("page_size", String(params.page_size));
  if (params.status) qs.set("status", params.status);
  return useQuery<PaginatedResponse<Order>>({
    queryKey: ["orders", "all", params],
    queryFn: () => apiFetch(`/api/v1/orders/admin/all?${qs}`),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) =>
      apiFetch<Order>("/api/v1/orders/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiFetch<Order>(`/api/v1/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}
