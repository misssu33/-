import { UploadDropzone } from "@/features/upload";
import { PresetSelector } from "@/features/presets";
import { PreviewExportPanel } from "@/features/delivery";
import { BatchProgressLive } from "@/features/progress";
import { StartBatchButton } from "@/features/batch";
import { FormatSelector } from "./FormatSelector";

/** 변환기 메인 — feature 컴포넌트만 조합 */
export function ConverterWorkspace() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <UploadDropzone />
        <PresetSelector />
        <FormatSelector />
        <StartBatchButton />
        <PreviewExportPanel />
      </div>
      <div className="space-y-6">
        <BatchProgressLive />
      </div>
    </div>
  );
}
