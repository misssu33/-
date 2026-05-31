"use client";

import { useSearchParams } from "next/navigation";
import { OnboardingOverlay } from "./OnboardingOverlay";

/** URL ?tour=1 일 때 온보딩 강제 표시 */
export function OnboardingGate() {
  const params = useSearchParams();
  const forceTour = params.get("tour") === "1";
  return <OnboardingOverlay forceOpen={forceTour} />;
}
