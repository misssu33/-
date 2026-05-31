"use client";

import { Button } from "@/shared/ui/button/Button";
import { useBatchQueue } from "../hooks/use-batch-queue";

export function StartBatchButton() {
  const { startBatch, isStarting, error, fileCount, activeBatch } = useBatchQueue();

  return (
    <div>
      <Button
        type="button"
        disabled={isStarting || fileCount === 0}
        onClick={() => void startBatch()}
      >
        {isStarting ? "큐 등록 중…" : `배치 변환 시작 (${fileCount})`}
      </Button>
      {activeBatch && (
        <p className="mt-2 text-xs text-zinc-500">
          상태: {activeBatch.status} · {activeBatch.progress}%
        </p>
      )}
      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
