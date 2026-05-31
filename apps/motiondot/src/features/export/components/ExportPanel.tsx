"use client";

import { Button } from "@/shared/ui/button/Button";
import { useConverterStore } from "@/stores/converter-store";

export function ExportPanel() {
  const { presetId, format, jobId } = useConverterStore();

  async function handleExport() {
    if (!jobId) return;
    await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, presetId, format }),
    });
  }

  return (
    <div className="rounded-lg border border-zinc-800 p-4">
      <h3 className="text-sm font-medium">Export</h3>
      <p className="mt-1 text-xs text-zinc-500">
        {format.toUpperCase()} · {presetId}
      </p>
      <Button className="mt-3" onClick={() => void handleExport()}>
        배치보내기
      </Button>
    </div>
  );
}
