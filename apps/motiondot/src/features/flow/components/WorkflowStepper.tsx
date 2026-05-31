"use client";

import { WORKFLOW_STEPS } from "../constants";
import type { WorkflowStepId } from "../constants";
import { cn } from "@/shared/lib/cn";

export function WorkflowStepper({
  currentStep,
}: {
  currentStep: WorkflowStepId;
}) {
  const currentIndex = WORKFLOW_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="작업 진행 단계" className="w-full">
      <ol className="flex items-center gap-1 sm:gap-2">
        {WORKFLOW_STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = step.id === currentStep;
          const isUpcoming = index > currentIndex;

          return (
            <li key={step.id} className="flex flex-1 items-center">
              <div className="flex w-full flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    isDone && "bg-emerald-600/20 text-emerald-400",
                    isActive && "bg-brand text-brand-foreground",
                    isUpcoming && "bg-zinc-800 text-zinc-500",
                  )}
                >
                  {isDone ? "✓" : step.shortLabel}
                </span>
                <span
                  className={cn(
                    "hidden text-center text-[10px] font-medium uppercase tracking-wide sm:block",
                    isActive ? "text-zinc-200" : "text-zinc-600",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < WORKFLOW_STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-px flex-1 sm:mx-2",
                    index < currentIndex ? "bg-emerald-600/40" : "bg-zinc-800",
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
