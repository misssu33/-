"use client";

import type { PlatformPreset } from "@motiondot/presets";
import { cn } from "@/shared/lib/cn";

interface PresetCardProps {
  preset: PlatformPreset;
  selected: boolean;
  onSelect: () => void;
}

export function PresetCard({ preset, selected, onSelect }: PresetCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "rounded-lg border px-3 py-2.5 text-left text-sm transition",
        selected
          ? "border-brand bg-brand/10 ring-1 ring-brand/40"
          : "border-zinc-800 hover:border-zinc-600",
      )}
    >
      <span className="font-medium">{preset.label}</span>
      <span className="mt-0.5 block text-xs text-zinc-500">{preset.description}</span>
      <span className="mt-1.5 inline-block rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] uppercase text-zinc-400">
        {preset.defaultFormat}
      </span>
    </button>
  );
}
