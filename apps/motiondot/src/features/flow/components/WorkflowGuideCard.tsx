"use client";

import { WORKFLOW_STEPS } from "../constants";
import type { WorkflowStepId } from "../constants";
import { cn } from "@/shared/lib/cn";

export function WorkflowGuideCard({
  currentStep,
  className,
}: {
  currentStep: WorkflowStepId;
  className?: string;
}) {
  const step = WORKFLOW_STEPS.find((s) => s.id === currentStep) ?? WORKFLOW_STEPS[0];
  const index = WORKFLOW_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <aside
      className={cn(
        "rounded-xl border border-brand/20 bg-gradient-to-br from-brand/10 to-transparent p-4",
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-brand">
        단계 {index + 1} · {step.label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">{step.hint}</p>
    </aside>
  );
}
