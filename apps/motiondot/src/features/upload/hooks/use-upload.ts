"use client";

import { useCallback, useState } from "react";
import type { UploadResult } from "../types";
import { validateVideoFiles } from "../lib/validate-video-files";
import { useBatchStore } from "@/stores/batch-store";

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const setBatchId = useBatchStore((s) => s.setBatchId);
  const setUploadedFiles = useBatchStore((s) => s.setUploadedFiles);
  const uploadedFiles = useBatchStore((s) => s.uploadedFiles);
  const batchId = useBatchStore((s) => s.batchId);

  const upload = useCallback(
    async (files: File[]): Promise<UploadResult | null> => {
      setError(null);
      setProgress(0);

      const validationErrors = validateVideoFiles(files);
      if (validationErrors.length > 0) {
        setError(validationErrors.map((e) => `${e.fileName}: ${e.message}`).join("\n"));
        return null;
      }

      setIsUploading(true);
      try {
        const form = new FormData();
        files.forEach((f) => form.append("files", f));

        const res = await fetch("/api/upload", { method: "POST", body: form });
        const payload = (await res.json()) as UploadResult | { error: string };

        if (!res.ok) {
          const message =
            "error" in payload ? payload.error : "Upload failed";
          throw new Error(message);
        }

        const data = payload as UploadResult;
        setBatchId(data.batchId);
        setUploadedFiles(data.files);
        setProgress(100);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [setBatchId, setUploadedFiles],
  );

  const reset = useCallback(() => {
    setError(null);
    setProgress(0);
    useBatchStore.getState().clearBatch();
  }, []);

  return {
    upload,
    isUploading,
    error,
    progress,
    uploadedFiles,
    batchId,
    reset,
  };
}
