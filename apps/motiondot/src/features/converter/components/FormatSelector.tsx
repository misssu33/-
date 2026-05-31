"use client";

import type { ExportFormat } from "@motiondot/shared";
import { useConverterStore } from "@/stores/converter-store";
import { cn } from "@/shared/lib/cn";

const FORMATS: ExportFormat[] = ["mp4", "gif", "webp"];

export function FormatSelector() {
  const { format, setFormat } = useConverterStore();

  return (
    <div className="flex gap-2">
      {FORMATS.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => setFormat(f)}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm uppercase",
            format === f ? "border-brand text-brand" : "border-zinc-800",
          )}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
