import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { BASE_URL } from "@/api/client";
import { toast } from "@/hooks/useToast";

export function useUploadImage() {
  return useMutation({
    mutationFn: async (formData: FormData): Promise<string> => {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`${BASE_URL}/api/v1/upload/image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url as string;
    },
    onError: () => toast({ title: "Image upload failed", variant: "destructive" }),
  });
}
