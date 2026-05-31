"use client";

import { useEffect, useState } from "react";
import type { ProgressPhase } from "@motiondot/shared";
import { useProgressStore } from "@/stores/progress-store";

export function useJobProgress(jobId?: string) {
  const event = useProgressStore((s) =>
    jobId ? s.byJobId[jobId] : undefined,
  );
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState<ProgressPhase | undefined>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    if (!jobId) return;
    const es = new EventSource(`/api/progress?jobId=${jobId}`);
    es.onmessage = (msg) => {
      const data = JSON.parse(msg.data) as {
        percent: number;
        phase: ProgressPhase;
        message?: string;
      };
      setPercent(data.percent);
      setPhase(data.phase);
      setMessage(data.message);
    };
    return () => es.close();
  }, [jobId]);

  return {
    percent: event?.percent ?? percent,
    phase: event?.phase ?? phase,
    message: event?.message ?? message,
  };
}
