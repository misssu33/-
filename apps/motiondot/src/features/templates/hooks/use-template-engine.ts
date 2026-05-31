"use client";

import { useCallback, useState } from "react";
import type { AdCompositionPlan } from "@motiondot/shared";
import { useTemplateStore } from "@/stores/template-store";

export function useTemplateEngine() {
  const templateId = useTemplateStore((s) => s.templateId);
  const presetId = useTemplateStore((s) => s.presetId);
  const props = useTemplateStore((s) => s.props);
  const plan = useTemplateStore((s) => s.plan);
  const setPlan = useTemplateStore((s) => s.setPlan);

  const [isBuilding, setIsBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<{ field: string; message: string }[]>([]);

  const buildPlan = useCallback(async (): Promise<AdCompositionPlan | null> => {
    setIsBuilding(true);
    setError(null);
    setIssues([]);

    try {
      const res = await fetch("/api/templates/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, presetId, props }),
      });

      const payload = (await res.json()) as
        | { plan: AdCompositionPlan }
        | { issues: { field: string; message: string }[] }
        | { error: string };

      if (!res.ok) {
        if ("issues" in payload) {
          setIssues(payload.issues);
          return null;
        }
        throw new Error("error" in payload ? payload.error : "Build failed");
      }

      const built = (payload as { plan: AdCompositionPlan }).plan;
      setPlan(built);
      return built;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Build failed");
      return null;
    } finally {
      setIsBuilding(false);
    }
  }, [templateId, presetId, props, setPlan]);

  return {
    templateId,
    presetId,
    props,
    plan,
    buildPlan,
    isBuilding,
    error,
    issues,
  };
}
