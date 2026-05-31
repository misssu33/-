"use client";

import { UploadDropzone } from "@/features/upload";
import { PresetSelector } from "@/features/presets";
import { PreviewExportPanel } from "@/features/delivery";
import { BatchProgressLive } from "@/features/progress";
import { StartBatchButton } from "@/features/batch";
import { FormatSelector } from "@/features/converter/components/FormatSelector";
import { usePreviewExport } from "@/features/delivery/hooks/use-preview-export";
import { WorkflowStepper } from "./WorkflowStepper";
import { WorkflowGuideCard } from "./WorkflowGuideCard";
import { useWorkflowStep } from "../hooks/use-workflow-step";
import { WORKFLOW_STEPS } from "../constants";
import type { WorkflowStepId } from "../constants";

const STEP_ORDER: WorkflowStepId[] = [
  "upload",
  "configure",
  "convert",
  "deliver",
  "complete",
];

function stepReached(current: WorkflowStepId, target: WorkflowStepId): boolean {
  return STEP_ORDER.indexOf(current) >= STEP_ORDER.indexOf(target);
}

/** 변환기 메인 플로우 — 단계 표시 + 단계별 패널 배치 */
export function ConverterFlowShell() {
  const { delivery } = usePreviewExport();
  const { currentStep } = useWorkflowStep(delivery);

  const showConfigure = stepReached(currentStep, "configure");
  const showConvert = stepReached(currentStep, "convert");
  const showDeliver = stepReached(currentStep, "deliver");

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="space-y-3 sm:space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            변환 작업
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500 sm:text-sm">
            업로드 → 프리셋 → 배치 변환 → 프리뷰·Export까지 한 화면에서 진행합니다.
          </p>
        </div>
        <WorkflowStepper currentStep={currentStep} />
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,20rem)] lg:gap-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6 sm:space-y-8">
          <section
            id="step-upload"
            className="scroll-mt-20 space-y-4 rounded-xl border border-zinc-800/80 p-4 sm:scroll-mt-6 sm:p-5"
          >
            <SectionTitle
              step={1}
              title={WORKFLOW_STEPS[0].label}
              active={currentStep === "upload"}
              done={currentStep !== "upload"}
            />
            <UploadDropzone />
          </section>

          {showConfigure && (
            <section
              id="step-configure"
              className="scroll-mt-20 space-y-4 rounded-xl border border-zinc-800/80 p-4 sm:scroll-mt-6 sm:p-5"
            >
            <SectionTitle
              step={2}
              title={WORKFLOW_STEPS[1].label}
              active={currentStep === "configure"}
              done={stepReached(currentStep, "convert")}
            />
              <PresetSelector />
              <FormatSelector />
            </section>
          )}

          {showConvert && (
            <section
              id="step-convert"
              className="scroll-mt-20 space-y-4 rounded-xl border border-zinc-800/80 p-4 sm:scroll-mt-6 sm:p-5"
            >
              <SectionTitle
                step={3}
                title={WORKFLOW_STEPS[2].label}
                active={currentStep === "convert"}
                done={stepReached(currentStep, "deliver")}
              />
              <StartBatchButton />
            </section>
          )}

          {showDeliver && (
            <section
              id="step-deliver"
              className="scroll-mt-20 space-y-4 rounded-xl border border-zinc-800/80 p-4 sm:scroll-mt-6 sm:p-5"
            >
              <SectionTitle
                step={4}
                title={WORKFLOW_STEPS[3].label}
                active={stepReached(currentStep, "deliver")}
                done={currentStep === "complete"}
              />
              <PreviewExportPanel />
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <WorkflowGuideCard currentStep={currentStep} />
          <BatchProgressLive />
        </aside>
      </div>
    </div>
  );
}

function SectionTitle({
  step,
  title,
  active,
  done,
}: {
  step: number;
  title: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={
          active
            ? "flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground"
            : done
              ? "flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/20 text-xs text-emerald-400"
              : "flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-500"
        }
      >
        {done && !active ? "✓" : step}
      </span>
      <h2 className="text-sm font-semibold text-zinc-200">{title}</h2>
    </div>
  );
}
