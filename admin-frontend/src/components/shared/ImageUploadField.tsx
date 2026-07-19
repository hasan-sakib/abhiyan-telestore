import { useRef } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useImageUpload } from "@/hooks/useImageUpload";

export function ImageUploadField({
  value, onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useImageUpload();

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    upload(file, {
      onSuccess: (data) => onChange(data.url),
      onError: (e: Error) => toast.error(e.message),
    });
  };

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className="relative h-20 w-20 rounded-md border border-input overflow-hidden bg-muted shrink-0">
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove image"
            className="absolute top-0.5 right-0.5 h-5 w-5 inline-flex items-center justify-center rounded-full bg-background/90 border border-input hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div className="h-20 w-20 rounded-md border border-dashed border-input flex items-center justify-center bg-muted/50 shrink-0">
          <ImagePlus className="h-5 w-5 text-muted-foreground" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        {isPending ? "Uploading..." : value ? "Replace" : "Upload"}
      </Button>
    </div>
  );
}
