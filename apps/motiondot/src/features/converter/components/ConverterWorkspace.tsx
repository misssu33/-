import { UploadDropzone } from "@/features/upload";
import { PresetSelector } from "@/features/presets";
import { PreviewPlayer } from "@/features/preview";
import { ExportPanel } from "@/features/export";
import { JobProgressCard } from "@/features/progress";
import { FormatSelector } from "./FormatSelector";

/** 변환기 메인 — feature 컴포넌트만 조합 */
export function ConverterWorkspace() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <UploadDropzone />
        <PresetSelector />
        <FormatSelector />
        <ExportPanel />
      </div>
      <div className="space-y-6">
        <PreviewPlayer />
        <JobProgressCard />
      </div>
    </div>
  );
}
