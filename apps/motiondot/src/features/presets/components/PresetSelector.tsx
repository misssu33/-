"use client";

import { listPresetGroups } from "@motiondot/presets";
import { useConverterStore } from "@/stores/converter-store";
import { categoryLabel } from "../lib/preset-labels";
import { PresetCard } from "./PresetCard";
import { PresetDetailPanel } from "./PresetDetailPanel";
import { CustomPresetFields } from "./CustomPresetFields";
import { usePresetSelection } from "../hooks/use-preset-selection";

export function PresetSelector() {
  const groups = listPresetGroups();
  const presetId = useConverterStore((s) => s.presetId);
  const setPresetId = useConverterStore((s) => s.setPresetId);
  const { preset } = usePresetSelection();

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-zinc-200">SNS 프리셋</p>

      {groups.map((group) => (
        <section key={group.category}>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
            {categoryLabel(group.category)}
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {group.presets.map((p) => (
              <PresetCard
                key={p.id}
                preset={p}
                selected={presetId === p.id}
                onSelect={() => setPresetId(p.id)}
              />
            ))}
          </div>
        </section>
      ))}

      {presetId === "custom" && <CustomPresetFields />}
      <PresetDetailPanel preset={preset} />
    </div>
  );
}
