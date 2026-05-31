"use client";

import type { AdCompositionPlan } from "@motiondot/shared";

export function TemplatePlanPreview({ plan }: { plan?: AdCompositionPlan }) {
  if (!plan) {
    return (
      <div className="flex aspect-[9/16] max-w-xs items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 text-xs text-zinc-500">
        「플랜 생성」 후 Remotion 시퀀스 미리보기
      </div>
    );
  }

  return (
    <div className="max-w-xs space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-xs">
      <p className="font-medium text-zinc-200">
        {plan.width}×{plan.height} · {plan.fps}fps · {plan.durationInFrames}f
      </p>
      <ul className="space-y-1 text-zinc-500">
        {plan.scenes.map((s) => (
          <li key={s.id}>
            {s.id} · {s.component} · {s.durationInFrames}f
          </li>
        ))}
      </ul>
      <p className="text-zinc-600">
        Remotion Studio: <code className="text-zinc-400">pnpm --filter @motiondot/remotion studio</code>
      </p>
    </div>
  );
}
