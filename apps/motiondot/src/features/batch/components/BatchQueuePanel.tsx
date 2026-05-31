"use client";

import { BatchProgressLive } from "@/features/progress";
import { useBatchQueue } from "../hooks/use-batch-queue";
import { StartBatchButton } from "./StartBatchButton";
import { cn } from "@/shared/lib/cn";

const STATUS_LABEL: Record<string, string> = {
  queued: "대기",
  processing: "처리 중",
  completed: "완료",
  failed: "실패",
  cancelled: "취소",
  preview_ready: "미리보기 준비",
};

export function BatchQueuePanel() {
  const { activeBatch, batchId } = useBatchQueue();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Batch Queue</h1>
        <p className="mt-1 text-sm text-zinc-500">
          BullMQ 배치 오케스트레이션 · worker thread ffmpeg
        </p>
      </div>

      <StartBatchButton />

      <BatchProgressLive batchId={batchId} />

      {batchId && (
        <p className="text-xs text-zinc-600">
          Batch ID: <code className="text-zinc-400">{batchId.slice(0, 8)}…</code>
        </p>
      )}

      {activeBatch && (
        <>
          <ul className="space-y-2 text-sm">
            {activeBatch.items.map((item) => (
              <li
                key={item.itemId}
                className={cn(
                  "rounded border px-3 py-2",
                  item.status === "completed" && "border-emerald-800/50",
                  item.status === "failed" && "border-red-800/50",
                  item.status === "processing" && "border-brand/50",
                  item.status === "queued" && "border-zinc-800",
                )}
              >
                <div className="flex justify-between gap-2">
                  <span className="truncate font-medium">{item.originalName}</span>
                  <span className="shrink-0 text-xs text-zinc-500">
                    {STATUS_LABEL[item.status] ?? item.status}
                  </span>
                </div>
                {item.errorMessage && (
                  <p className="mt-1 text-xs text-red-400">{item.errorMessage}</p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {!activeBatch && (
        <p className="text-sm text-zinc-600">
          업로드 후 「배치 변환 시작」을 누르면 conversion 큐에 파일별 잡이 등록됩니다.
        </p>
      )}
    </div>
  );
}
