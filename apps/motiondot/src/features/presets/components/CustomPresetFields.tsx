"use client";

import type { PresetOverrides } from "@motiondot/shared";
import { useConverterStore } from "@/stores/converter-store";

export function CustomPresetFields() {
  const overrides = useConverterStore((s) => s.presetOverrides);
  const setOverrides = useConverterStore((s) => s.setPresetOverrides);

  function patch(partial: PresetOverrides) {
    setOverrides({ ...overrides, ...partial });
  }

  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg border border-zinc-800 p-3 text-sm">
      <label className="space-y-1">
        <span className="text-xs text-zinc-500">너비 (px)</span>
        <input
          type="number"
          min={320}
          max={4096}
          value={overrides?.width ?? 1080}
          onChange={(e) => patch({ width: Number(e.target.value) })}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1"
        />
      </label>
      <label className="space-y-1">
        <span className="text-xs text-zinc-500">높이 (px)</span>
        <input
          type="number"
          min={320}
          max={4096}
          value={overrides?.height ?? 1080}
          onChange={(e) => patch({ height: Number(e.target.value) })}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1"
        />
      </label>
      <label className="space-y-1">
        <span className="text-xs text-zinc-500">최대 길이 (초)</span>
        <input
          type="number"
          min={1}
          max={600}
          value={overrides?.maxDurationSec ?? 120}
          onChange={(e) => patch({ maxDurationSec: Number(e.target.value) })}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1"
        />
      </label>
      <label className="space-y-1">
        <span className="text-xs text-zinc-500">FPS</span>
        <input
          type="number"
          min={1}
          max={60}
          value={overrides?.fps ?? 30}
          onChange={(e) => patch({ fps: Number(e.target.value) })}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1"
        />
      </label>
    </div>
  );
}
