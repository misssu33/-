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
  const activeStep = WORKFLOW_STEPS[currentIndex];

  return (
    <nav aria-label="작업 진행 단계" className="w-full space-y-2">
      {activeStep && (
        <p className="text-center text-xs text-zinc-500 md:hidden">
          <span className="font-medium text-zinc-300">
            {currentIndex + 1}/{WORKFLOW_STEPS.length}
          </span>
          {" · "}
          {activeStep.label}
        </p>
      )}

      <ol
        className={cn(
          "flex items-center gap-2 overflow-x-auto overscroll-x-contain pb-1",
          "snap-x snap-mandatory [-webkit-overflow-scrolling:touch]",
          "md:gap-2 md:overflow-visible md:pb-0",
        )}
      >
        {WORKFLOW_STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = step.id === currentStep;
          const isUpcoming = index > currentIndex;

          return (
            <li
              key={step.id}
              className={cn(
                "flex shrink-0 snap-center items-center md:flex-1",
                index < WORKFLOW_STEPS.length - 1 && "md:min-w-0",
              )}
            >
              <div className="flex min-w-[2.75rem] flex-col items-center gap-1 md:w-full">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-colors md:h-8 md:w-8 md:text-xs",
                    isDone && "bg-emerald-600/20 text-emerald-400",
                    isActive && "bg-brand text-brand-foreground",
                    isUpcoming && "bg-zinc-800 text-zinc-500",
                  )}
                >
                  {isDone ? "✓" : step.shortLabel}
                </span>
                <span
                  className={cn(
                    "hidden max-w-[4.5rem] truncate text-center text-[10px] font-medium uppercase tracking-wide sm:block md:max-w-none",
                    isActive ? "text-zinc-200" : "text-zinc-600",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < WORKFLOW_STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-1 hidden h-px min-w-[0.75rem] flex-1 md:block md:min-w-0",
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
