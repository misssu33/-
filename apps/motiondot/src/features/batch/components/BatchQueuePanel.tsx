"use client";

import { ProgressBar } from "@/shared/ui/progress/ProgressBar";
import { useBatchStore } from "@/stores/batch-store";
import { useJobProgress } from "@/features/progress/hooks/use-job-progress";

export function BatchQueuePanel() {
  const jobs = useBatchStore((s) => s.jobs);
  const activeJobId = jobs[0]?.jobId;
  const { percent, phase } = useJobProgress(activeJobId);

  return (
    <div>
      <h1 className="text-xl font-semibold">Batch Queue</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {jobs.length} jobs · {phase ?? "idle"}
      </p>
      <ProgressBar value={percent} className="mt-4 max-w-md" />
      <ul className="mt-6 space-y-2 text-sm">
        {jobs.map((j) => (
          <li
            key={j.jobId}
            className="rounded border border-zinc-800 px-3 py-2"
          >
            {j.jobId.slice(0, 8)} — {j.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
