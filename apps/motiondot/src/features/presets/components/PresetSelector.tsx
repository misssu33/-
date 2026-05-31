"use client";

import { listPresets } from "@motiondot/presets";
import { useConverterStore } from "@/stores/converter-store";
import { cn } from "@/shared/lib/cn";

export function PresetSelector() {
  const presets = listPresets();
  const { presetId, setPresetId } = useConverterStore();

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {presets.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => setPresetId(p.id)}
          className={cn(
            "rounded-lg border px-3 py-2 text-left text-sm transition",
            presetId === p.id
              ? "border-brand bg-brand/10"
              : "border-zinc-800 hover:border-zinc-600",
          )}
        >
          <span className="font-medium">{p.label}</span>
          <span className="mt-0.5 block text-xs text-zinc-500">
            {p.width}×{p.height}
          </span>
        </button>
      ))}
    </div>
  );
}
