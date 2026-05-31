import { create } from "zustand";
import type { AdCompositionPlan, AdTemplateId, AdTemplateProps } from "@motiondot/shared";
import type { PresetId } from "@motiondot/shared";

interface TemplateState {
  templateId: AdTemplateId;
  presetId: PresetId;
  props: Partial<AdTemplateProps>;
  plan?: AdCompositionPlan;
  setTemplateId: (id: AdTemplateId) => void;
  setPresetId: (id: PresetId) => void;
  patchProps: (patch: Partial<AdTemplateProps>) => void;
  setPlan: (plan: AdCompositionPlan | undefined) => void;
}

export const useTemplateStore = create<TemplateState>((set) => ({
  templateId: "product_hero",
  presetId: "tiktok",
  props: {},
  setTemplateId: (templateId) => set({ templateId, plan: undefined }),
  setPresetId: (presetId) => set({ presetId, plan: undefined }),
  patchProps: (patch) =>
    set((s) => ({ props: { ...s.props, ...patch }, plan: undefined })),
  setPlan: (plan) => set({ plan }),
}));
