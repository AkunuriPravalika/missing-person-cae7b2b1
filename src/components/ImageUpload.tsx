import { useCallback, useRef, useState } from "react";
import { Upload, X, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelected: (dataUrl: string) => void;
  currentImage?: string | null;
  label?: string;
  className?: string;
}

export default function ImageUpload({
  onImageSelected,
  currentImage,
  label = "Upload Image",
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) onImageSelected(e.target.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative cursor-pointer rounded border-2 border-dashed transition-all overflow-hidden",
          "flex flex-col items-center justify-center min-h-[200px]",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50"
        )}
      >
        {currentImage ? (
          <>
            <img
              src={currentImage}
              alt="Selected"
              className="w-full h-full object-cover max-h-[300px]"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageSelected("");
              }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive/80 flex items-center justify-center hover:bg-destructive transition-colors"
            >
              <X className="w-4 h-4 text-destructive-foreground" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                Drop image here or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG up to 10MB
              </p>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    </div>
  );
}
