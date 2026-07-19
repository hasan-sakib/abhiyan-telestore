import { useRef } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";

export function ImageUploadList({
  value, onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useImageUpload();

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    upload(file, {
      onSuccess: (data) => onChange([...value, data.url]),
      onError: (e: Error) => toast.error(e.message),
    });
  };

  const removeAt = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div className="flex flex-wrap gap-2">
      {value.map((url, idx) => (
        <div key={`${url}-${idx}`} className="relative h-20 w-20 rounded-md border border-input overflow-hidden bg-muted shrink-0">
          <img src={url} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => removeAt(idx)}
            aria-label="Remove image"
            className="absolute top-0.5 right-0.5 h-5 w-5 inline-flex items-center justify-center rounded-full bg-background/90 border border-input hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        type="button"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
        className="h-20 w-20 rounded-md border border-dashed border-input flex flex-col items-center justify-center gap-1 bg-muted/50 hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50 shrink-0"
      >
        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
        <span className="text-[10px] font-medium">{isPending ? "Uploading" : "Add Image"}</span>
      </button>
    </div>
  );
}
