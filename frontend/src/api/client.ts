import createClient from "openapi-fetch";
import { useAuthStore } from "@/store/authStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiClient = createClient<any>({ baseUrl: BASE_URL });

apiClient.use({
  onRequest({ request }) {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },

  async onResponse({ response, request }) {
    if (response.status !== 401) return response;

    const { refreshToken, setAuth, logout, user } = useAuthStore.getState();
    if (!refreshToken) {
      logout();
      return response;
    }

    const refreshRes = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!refreshRes.ok) {
      logout();
      return response;
    }

    const data = await refreshRes.json();
    setAuth(user!, data.access_token, data.refresh_token);

    // Retry original request with new token
    const retryRequest = request.clone();
    retryRequest.headers.set("Authorization", `Bearer ${data.access_token}`);
    return fetch(retryRequest);
  },
});

export { BASE_URL };
