"use client";

import { useCallback, useState } from "react";
import type { UploadResult } from "../types";
import { useBatchStore } from "@/stores/batch-store";

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const setBatchId = useBatchStore((s) => s.setBatchId);

  const upload = useCallback(
    async (files: FileList): Promise<UploadResult | null> => {
      setIsUploading(true);
      try {
        const form = new FormData();
        Array.from(files).forEach((f) => form.append("files", f));
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) throw new Error("Upload failed");
        const data = (await res.json()) as UploadResult;
        setBatchId(data.batchId);
        return data;
      } finally {
        setIsUploading(false);
      }
    },
    [setBatchId],
  );

  return { upload, isUploading };
}
