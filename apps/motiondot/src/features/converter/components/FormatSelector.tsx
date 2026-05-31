"use client";

import type { ExportFormat } from "@motiondot/shared";
import { useConverterStore } from "@/stores/converter-store";
import { cn } from "@/shared/lib/cn";

const FORMATS: ExportFormat[] = ["mp4", "gif", "webp"];

export function FormatSelector() {
  const { format, setFormat } = useConverterStore();

  return (
    <div className="flex flex-wrap gap-2">
      {FORMATS.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => setFormat(f)}
          className={cn(
            "min-h-[2.75rem] min-w-[4.5rem] flex-1 rounded-md border px-3 py-2 text-sm uppercase sm:min-h-0 sm:flex-none sm:py-1.5",
            format === f ? "border-brand text-brand" : "border-zinc-800",
          )}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
