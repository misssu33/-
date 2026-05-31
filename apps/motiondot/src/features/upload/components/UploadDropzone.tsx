"use client";

import { useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useUpload } from "../hooks/use-upload";
import { UploadFileList } from "./UploadFileList";
import {
  UPLOAD_CONFIG,
  VIDEO_DROPZONE_ACCEPT,
} from "../constants";
import { ProgressBar } from "@/shared/ui/progress/ProgressBar";
import { Button } from "@/shared/ui/button/Button";
import { cn } from "@/shared/lib/cn";

function rejectionMessage(rejections: readonly FileRejection[]): string {
  return rejections
    .flatMap(({ file, errors }) =>
      errors.map((e) => `${file.name}: ${e.message}`),
    )
    .join("\n");
}

export function UploadDropzone() {
  const {
    upload,
    isUploading,
    error,
    progress,
    uploadedFiles,
    batchId,
    reset,
  } = useUpload();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      void upload(acceptedFiles);
    },
    [upload],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: VIDEO_DROPZONE_ACCEPT,
    multiple: true,
    maxFiles: UPLOAD_CONFIG.maxFiles,
    maxSize: UPLOAD_CONFIG.maxSizeBytes,
    disabled: isUploading,
    noClick: false,
    noKeyboard: false,
  });

  const rejectError =
    fileRejections.length > 0 ? rejectionMessage(fileRejections) : null;

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10",
          isDragActive && !isDragReject && "border-brand bg-brand/5",
          isDragReject && "border-red-500/80 bg-red-500/5",
          !isDragActive &&
            !isDragReject &&
            "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/30",
          isUploading && "pointer-events-none opacity-60",
        )}
      >
        <input {...getInputProps()} />

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-2xl">
          {isDragActive ? "↓" : "▶"}
        </div>

        <p className="mt-4 text-sm font-medium text-zinc-200">
          {isDragActive
            ? "여기에 비디오를 놓으세요"
            : "비디오를 드래그하거나 클릭하여 선택"}
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          MP4, MOV, WebM, MKV · 최대 {UPLOAD_CONFIG.maxFiles}개 · 파일당{" "}
          {UPLOAD_CONFIG.maxSizeBytes / (1024 * 1024)}MB
        </p>
      </div>

      {isUploading && (
        <div>
          <p className="mb-2 text-xs text-zinc-500">업로드 중…</p>
          <ProgressBar value={progress || 30} />
        </div>
      )}

      {(error || rejectError) && (
        <p className="whitespace-pre-line rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error ?? rejectError}
        </p>
      )}

      {uploadedFiles.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              업로드 완료 ({uploadedFiles.length})
            </p>
            {batchId && (
              <Button variant="ghost" type="button" onClick={reset}>
                초기화
              </Button>
            )}
          </div>
          <UploadFileList files={uploadedFiles} />
        </div>
      )}
    </div>
  );
}
