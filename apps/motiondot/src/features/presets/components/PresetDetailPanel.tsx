"use client";

import type { PlatformPreset } from "@motiondot/presets";

export function PresetDetailPanel({ preset }: { preset: PlatformPreset }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm">
      <p className="font-medium">{preset.label}</p>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-zinc-400">
        <div>
          <dt>해상도</dt>
          <dd className="text-zinc-200">
            {preset.width}×{preset.height} ({preset.aspectRatio})
          </dd>
        </div>
        <div>
          <dt>FPS</dt>
          <dd className="text-zinc-200">{preset.fps}</dd>
        </div>
        <div>
          <dt>최대 길이</dt>
          <dd className="text-zinc-200">{preset.maxDurationSec}초</dd>
        </div>
        <div>
          <dt>권장 포맷</dt>
          <dd className="text-zinc-200">{preset.recommendedFormats.join(", ")}</dd>
        </div>
        <div className="col-span-2">
          <dt>용량 가이드</dt>
          <dd className="text-zinc-200">≤ {preset.constraints.maxFileSizeMb}MB</dd>
        </div>
      </dl>
    </div>
  );
}
