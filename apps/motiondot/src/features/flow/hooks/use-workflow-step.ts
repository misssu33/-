"use client";

import { useMemo } from "react";
import type { DeliverySnapshot } from "@motiondot/shared";
import { useBatchStore } from "@/stores/batch-store";
import type { WorkflowStepId } from "../constants";

/** 배치·전달 상태로 현재 플로우 단계 추론 */
export function useWorkflowStep(delivery?: DeliverySnapshot | null): {
  currentStep: WorkflowStepId;
  stepIndex: number;
} {
  const uploadedFiles = useBatchStore((s) => s.uploadedFiles);
  const activeBatch = useBatchStore((s) => s.activeBatch);

  return useMemo(() => {
    if (delivery?.export.status === "ready") {
      return { currentStep: "complete", stepIndex: 4 };
    }

    if (
      delivery?.preview.status === "ready" ||
      delivery?.export.status === "processing" ||
      delivery?.export.status === "queued" ||
      delivery?.preview.status === "processing" ||
      delivery?.preview.status === "queued"
    ) {
      return { currentStep: "deliver", stepIndex: 3 };
    }

    if (activeBatch?.status === "completed") {
      return { currentStep: "deliver", stepIndex: 3 };
    }

    if (
      activeBatch?.status === "processing" ||
      activeBatch?.status === "queued"
    ) {
      return { currentStep: "convert", stepIndex: 2 };
    }

    if (uploadedFiles.length > 0) {
      return { currentStep: "configure", stepIndex: 1 };
    }

    return { currentStep: "upload", stepIndex: 0 };
  }, [uploadedFiles.length, activeBatch, delivery]);
}
