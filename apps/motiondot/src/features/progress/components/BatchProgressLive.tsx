"use client";

import { ProgressBar } from "@/shared/ui/progress/ProgressBar";
import { useBatchProgress } from "../hooks/use-batch-progress";
import { cn } from "@/shared/lib/cn";

const STATUS_LABEL: Record<string, string> = {
  queued: "대기",
  processing: "변환 중",
  completed: "완료",
  failed: "실패",
};

export function BatchProgressLive({ batchId }: { batchId?: string }) {
  const { activeBatch, batchPercent, itemProgress, isLive } =
    useBatchProgress(batchId);

  if (!activeBatch) {
    return (
      <p className="text-sm text-zinc-500">배치를 시작하면 실시간 진행률이 표시됩니다.</p>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-zinc-800 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">배치 진행률</span>
        <span className="text-zinc-500">
          {isLive && (
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          )}
          {STATUS_LABEL[activeBatch.status] ?? activeBatch.status} · {batchPercent}%
        </span>
      </div>
      <ProgressBar value={batchPercent} />

      <ul className="max-h-48 space-y-2 overflow-y-auto text-sm">
        {activeBatch.items.map((item) => {
          const live = itemProgress[item.itemId] ?? item.progress;
          return (
            <li key={item.itemId} className="space-y-1">
              <div className="flex justify-between gap-2 text-xs">
                <span className="truncate text-zinc-300">{item.originalName}</span>
                <span className="shrink-0 text-zinc-500">{live}%</span>
              </div>
              <ProgressBar
                value={live}
                className={cn(
                  "h-1",
                  item.status === "failed" && "opacity-60",
                )}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
