"use client";

import { listAdTemplates } from "@motiondot/templates";
import { AD_TEMPLATE_CATEGORY_LABELS } from "@motiondot/templates";
import { useTemplateStore } from "@/stores/template-store";
import { useConverterStore } from "@/stores/converter-store";
import { Button } from "@/shared/ui/button/Button";
import { TemplateCard } from "./TemplateCard";
import { TemplatePropsEditor } from "./TemplatePropsEditor";
import { TemplatePlanPreview } from "./TemplatePlanPreview";
import { useTemplateEngine } from "../hooks/use-template-engine";

export function TemplateWorkspace() {
  const templates = listAdTemplates();
  const templateId = useTemplateStore((s) => s.templateId);
  const setTemplateId = useTemplateStore((s) => s.setTemplateId);
  const presetId = useConverterStore((s) => s.presetId);
  const setPresetId = useTemplateStore((s) => s.setPresetId);

  const { plan, buildPlan, isBuilding, error, issues } = useTemplateEngine();

  const categories = [...new Set(templates.map((t) => t.category))];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">광고 모션 템플릿</h1>
          <p className="mt-1 text-sm text-zinc-500">
            템플릿 선택 → 카피 입력 → Remotion 컴포지션 플랜 생성
          </p>
        </div>

        {categories.map((cat) => (
          <section key={cat}>
            <h2 className="mb-2 text-xs font-medium uppercase text-zinc-500">
              {AD_TEMPLATE_CATEGORY_LABELS[cat]}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {templates
                .filter((t) => t.category === cat)
                .map((t) => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    selected={templateId === t.id}
                    onSelect={() => {
                      setTemplateId(t.id);
                      setPresetId(t.recommendedPresets[0] ?? presetId);
                    }}
                  />
                ))}
            </div>
          </section>
        ))}

        <TemplatePropsEditor />

        <Button
          type="button"
          disabled={isBuilding}
          onClick={() => void buildPlan()}
        >
          {isBuilding ? "생성 중…" : "플랜 생성"}
        </Button>

        {error && <p className="text-xs text-red-400">{error}</p>}
        {issues.length > 0 && (
          <ul className="text-xs text-red-400">
            {issues.map((i) => (
              <li key={i.field}>{i.message}</li>
            ))}
          </ul>
        )}
      </div>

      <TemplatePlanPreview plan={plan} />
    </div>
  );
}
