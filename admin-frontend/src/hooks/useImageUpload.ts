import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "@/lib/api";

export function useImageUpload() {
  return useMutation({
    mutationFn: (file: File) => uploadFile<{ url: string }>("/api/v1/upload/image", file),
  });
}
