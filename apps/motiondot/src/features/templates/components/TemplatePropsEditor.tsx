"use client";

import { useTemplateStore } from "@/stores/template-store";

const FIELDS = [
  { key: "headline", label: "헤드라인" },
  { key: "subheadline", label: "서브 헤드라인" },
  { key: "price", label: "가격" },
  { key: "ctaText", label: "CTA" },
  { key: "brandName", label: "브랜드명" },
  { key: "mediaSrc", label: "미디어 URL" },
  { key: "accentColor", label: "강조 색상" },
] as const;

export function TemplatePropsEditor() {
  const props = useTemplateStore((s) => s.props);
  const patchProps = useTemplateStore((s) => s.patchProps);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {FIELDS.map(({ key, label }) => (
        <label key={key} className="space-y-1 text-sm">
          <span className="text-xs text-zinc-500">{label}</span>
          <input
            type="text"
            value={(props[key] as string) ?? ""}
            onChange={(e) => patchProps({ [key]: e.target.value })}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5"
          />
        </label>
      ))}
    </div>
  );
}
