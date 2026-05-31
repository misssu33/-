"use client";

import { Button } from "@/shared/ui/button/Button";
import { PreviewPlayer } from "@/features/preview/components/PreviewPlayer";
import { usePreviewExport } from "../hooks/use-preview-export";

const PHASE_LABEL: Record<string, string> = {
  idle: "대기",
  queued: "큐 대기",
  processing: "처리 중",
  ready: "완료",
  failed: "실패",
};

/** 배치 프리뷰·최종 export·ZIP 다운로드 */
export function PreviewExportPanel() {
  const {
    batchId,
    preview,
    exportManifest,
    startPreview,
    startExport,
    isPreviewStarting,
    isExportStarting,
    error,
  } = usePreviewExport();

  const firstPreviewUrl = preview?.files[0]?.url;

  return (
    <div className="space-y-4 rounded-lg border border-zinc-800 p-4">
      <h3 className="text-sm font-medium">미리보기 · Export</h3>
      {!batchId && (
        <p className="text-xs text-zinc-500">업로드 후 배치 ID가 생성됩니다.</p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={!batchId || isPreviewStarting}
          onClick={() => void startPreview()}
        >
          {isPreviewStarting ? "프리뷰 생성 중…" : "Fast 프리뷰 생성"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={!batchId || isExportStarting}
          onClick={() => void startExport()}
        >
          {isExportStarting ? "Export 중…" : "최종 Export · ZIP"}
        </Button>
      </div>

      {preview && preview.status !== "idle" && (
        <p className="text-xs text-zinc-500">
          프리뷰: {PHASE_LABEL[preview.status] ?? preview.status}
          {preview.files.length > 0 && ` · ${preview.files.length}개`}
        </p>
      )}

      {exportManifest && exportManifest.status !== "idle" && (
        <p className="text-xs text-zinc-500">
          Export: {PHASE_LABEL[exportManifest.status] ?? exportManifest.status}
          {exportManifest.zipUrl && exportManifest.status === "ready" && (
            <>
              {" · "}
              <a
                href={exportManifest.zipUrl}
                className="text-emerald-400 underline"
              >
                ZIP 다운로드
              </a>
            </>
          )}
        </p>
      )}

      {preview?.status === "ready" && preview.files.length > 1 && (
        <ul className="max-h-24 space-y-1 overflow-y-auto text-xs text-zinc-400">
          {preview.files.map((f) => (
            <li key={f.itemId}>
              <a href={f.url} className="hover:text-zinc-200">
                {f.originalName}
              </a>
            </li>
          ))}
        </ul>
      )}

      <PreviewPlayer src={firstPreviewUrl} />

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
