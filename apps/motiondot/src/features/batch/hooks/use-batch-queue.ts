"use client";

import { useCallback, useEffect, useState } from "react";
import type { BatchJobMeta } from "@motiondot/shared";
import { useBatchStore } from "@/stores/batch-store";
import { useConverterStore } from "@/stores/converter-store";

export function useBatchQueue() {
  const batchId = useBatchStore((s) => s.batchId);
  const uploadedFiles = useBatchStore((s) => s.uploadedFiles);
  const activeBatch = useBatchStore((s) => s.activeBatch);
  const setActiveBatch = useBatchStore((s) => s.setActiveBatch);
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

      setActiveBatch(payload as BatchJobMeta);
      return payload as BatchJobMeta;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Batch start failed";
      setError(message);
      return null;
    } finally {
      setIsStarting(false);
    }
  }, [batchId, uploadedFiles, presetId, format, setActiveBatch]);

  const refreshBatch = useCallback(async () => {
    if (!batchId) return;
    const res = await fetch(`/api/batch/${batchId}`);
    if (!res.ok) return;
    const data = (await res.json()) as BatchJobMeta;
    setActiveBatch(data);
  }, [batchId, setActiveBatch]);

  useEffect(() => {
    if (!batchId || !activeBatch) return;
    if (activeBatch.status === "completed" || activeBatch.status === "failed") {
      return;
    }

    const interval = setInterval(() => {
      void refreshBatch();
    }, 2000);

    return () => clearInterval(interval);
  }, [batchId, activeBatch, refreshBatch]);

  useEffect(() => {
    if (!batchId) return;
    const es = new EventSource(`/api/progress?jobId=${batchId}`);
    es.onmessage = () => {
      void refreshBatch();
    };
    return () => es.close();
  }, [batchId, refreshBatch]);

  return {
    startBatch,
    refreshBatch,
    isStarting,
    error,
    activeBatch,
    batchId,
    fileCount: uploadedFiles.length,
  };
}
