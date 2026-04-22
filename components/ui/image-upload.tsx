"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
  className?: string;
  aspectRatio?: "square" | "wide" | "tall";
  maxSize?: number; // in MB
}

export function ImageUpload({ 
  value, 
  onChange, 
  disabled = false, 
  className = "",
  aspectRatio = "square",
  maxSize = 2
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClass = {
    square: "aspect-square",
    wide: "aspect-video",
    tall: "aspect-[3/4]"
  }[aspectRatio];

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemove() {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className={`relative ${aspectRatioClass} w-32 h-32 border rounded-md overflow-hidden bg-muted`}>
        {value ? (
          <>
            <img
              src={value}
              alt="Uploaded image"
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={handleRemove}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground text-center px-2">
              No image
            </span>
          </div>
        )}
      </div>

      {!disabled && (
        <div className="flex flex-col space-y-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : value ? "Change" : "Upload"}
          </Button>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, or GIF (max {maxSize}MB)
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
