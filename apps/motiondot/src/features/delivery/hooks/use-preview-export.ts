"use client";

import { useCallback, useEffect, useState } from "react";
import type { DeliverySnapshot, ExportManifest, PreviewManifest } from "@motiondot/shared";
import { useBatchStore } from "@/stores/batch-store";
import { useConverterStore } from "@/stores/converter-store";

export function usePreviewExport() {
  const batchId = useBatchStore((s) => s.batchId);
  const uploadedFiles = useBatchStore((s) => s.uploadedFiles);
  const { presetId, format, presetOverrides } = useConverterStore();

  const [delivery, setDelivery] = useState<DeliverySnapshot | null>(null);
  const [isPreviewStarting, setIsPreviewStarting] = useState(false);
  const [isExportStarting, setIsExportStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!batchId) return;
    const res = await fetch(`/api/batch/${batchId}/delivery`);
    if (res.status === 404) {
      setDelivery(null);
      return;
    }
    if (!res.ok) return;
    const snap = (await res.json()) as DeliverySnapshot;
    setDelivery(snap);
  }, [batchId]);

  useEffect(() => {
    void refresh();
    if (!batchId) return;

    const timer = setInterval(() => {
      void refresh();
    }, 2500);

    return () => clearInterval(timer);
  }, [batchId, refresh]);

  const startPreview = useCallback(async () => {
    if (!batchId || uploadedFiles.length === 0) {
      setError("먼저 비디오를 업로드하세요.");
      return;
    }
    setIsPreviewStarting(true);
    setError(null);
    try {
      const res = await fetch(`/api/batch/${batchId}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: uploadedFiles }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? "Preview failed");
      }
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setIsPreviewStarting(false);
    }
  }, [batchId, uploadedFiles, refresh]);

  const startExport = useCallback(async () => {
    if (!batchId || uploadedFiles.length === 0) {
      setError("먼저 비디오를 업로드하세요.");
      return;
    }
    setIsExportStarting(true);
    setError(null);
    try {
      const res = await fetch(`/api/batch/${batchId}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: uploadedFiles,
          presetId,
          outputFormat: format,
          presetOverrides:
            presetId === "custom" ? presetOverrides : undefined,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? "Export failed");
      }
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsExportStarting(false);
    }
  }, [
    batchId,
    uploadedFiles,
    presetId,
    format,
    presetOverrides,
    refresh,
  ]);

  return {
    batchId,
    delivery,
    preview: delivery?.preview as PreviewManifest | undefined,
    exportManifest: delivery?.export as ExportManifest | undefined,
    startPreview,
    startExport,
    isPreviewStarting,
    isExportStarting,
    error,
    refresh,
  };
}
