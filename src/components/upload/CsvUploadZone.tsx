"use client";

import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

interface CsvUploadZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

export function CsvUploadZone({
  file,
  onFileChange,
  disabled = false,
}: CsvUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (nextFile: File | null) => {
      if (!nextFile) {
        onFileChange(null);
        return;
      }

      if (!nextFile.name.toLowerCase().endsWith(".csv")) {
        onFileChange(null);
        return;
      }

      if (nextFile.size > MAX_FILE_SIZE_BYTES) {
        onFileChange(null);
        return;
      }

      onFileChange(nextFile);
    },
    [onFileChange],
  );

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-border bg-card",
        disabled && "pointer-events-none opacity-50",
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFile(event.dataTransfer.files[0] ?? null);
      }}
    >
      <Upload className="h-8 w-8 text-muted-foreground" />
      <div>
        <p className="font-medium">
          {file ? file.name : "Drop a CSV file here"}
        </p>
        <p className="text-sm text-muted-foreground">
          CSV only, up to 5 MB
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
      >
        Choose file
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
      />
    </div>
  );
}
