"use client";

import { ProgressBar } from "@/shared/ui/progress/ProgressBar";
import { useJobProgress } from "../hooks/use-job-progress";

export function JobProgressCard({ jobId }: { jobId?: string }) {
  const { percent, phase, message } = useJobProgress(jobId);

  return (
    <div className="rounded-lg border border-zinc-800 p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        {phase ?? "waiting"}
      </p>
      <ProgressBar value={percent} className="mt-2" />
      {message && <p className="mt-2 text-xs text-zinc-400">{message}</p>}
    </div>
  );
}
