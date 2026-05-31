"use client";

import { useCallback, useState } from "react";
import type { BatchJobMeta } from "@motiondot/shared";
import { useBatchStore } from "@/stores/batch-store";
import { useConverterStore } from "@/stores/converter-store";
import { useProgressStore } from "@/stores/progress-store";

export function useBatchQueue() {
  const batchId = useBatchStore((s) => s.batchId);
  const uploadedFiles = useBatchStore((s) => s.uploadedFiles);
  const activeBatch = useBatchStore((s) => s.activeBatch);
  const setBatchId = useBatchStore((s) => s.setBatchId);
  const setActiveBatch = useBatchStore((s) => s.setActiveBatch);
  const setProgressBatch = useProgressStore((s) => s.setActiveBatch);
  const { presetId, format } = useConverterStore();

  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startBatch = useCallback(async () => {
    if (!batchId || uploadedFiles.length === 0) {
      setError("먼저 비디오를 업로드하세요.");
      return null;
    }

    setIsStarting(true);
    setError(null);

    try {
      const res = await fetch("/api/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId,
          presetId,
          outputFormat: format,
          files: uploadedFiles,
        }),
      });

      const payload = (await res.json()) as BatchJobMeta | { error: string };
      if (!res.ok) {
        throw new Error("error" in payload ? payload.error : "Batch start failed");
      }

      const batch = payload as BatchJobMeta;
      setActiveBatch(batch);
      setProgressBatch(batch);
      return batch;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Batch start failed";
      setError(message);
      return null;
    } finally {
      setIsStarting(false);
    }
  }, [
    batchId,
    uploadedFiles,
    presetId,
    format,
    setActiveBatch,
    setProgressBatch,
  ]);

  return {
    startBatch,
    isStarting,
    error,
    activeBatch,
    batchId,
    fileCount: uploadedFiles.length,
    setBatchId,
  };
}
