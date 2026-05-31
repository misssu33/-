import { Suspense } from "react";
import { OnboardingGate } from "@/features/onboarding";
import { ConverterFlowShell } from "@/features/flow";

export default function ConverterPage() {
  return (
    <>
      <Suspense fallback={null}>
        <OnboardingGate />
      </Suspense>
      <ConverterFlowShell />
    </>
  );
}
