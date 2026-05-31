"use client";

import type { AdTemplateDefinition } from "@motiondot/templates";
import { cn } from "@/shared/lib/cn";

export function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: AdTemplateDefinition;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "rounded-lg border px-3 py-2.5 text-left text-sm transition",
        selected ? "border-brand bg-brand/10" : "border-zinc-800 hover:border-zinc-600",
      )}
    >
      <span className="font-medium">{template.label}</span>
      <span className="mt-0.5 block text-xs text-zinc-500">{template.description}</span>
      <span className="mt-1 text-[10px] text-zinc-600">{template.durationSec}s</span>
    </button>
  );
}
