"use client";

import type { SourceMediaMeta } from "@motiondot/shared";
import { formatFileSize } from "../lib/format-file-size";
import { cn } from "@/shared/lib/cn";

interface UploadFileListProps {
  files: SourceMediaMeta[];
  className?: string;
}

/** 업로드 완료된 비디오 목록 */
export function UploadFileList({ files, className }: UploadFileListProps) {
  if (files.length === 0) return null;

  return (
    <ul className={cn("space-y-2", className)}>
      {files.map((file) => (
        <li
          key={file.id}
          className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm"
        >
          <span className="truncate pr-3 font-medium text-zinc-200">
            {file.originalName}
          </span>
          <span className="shrink-0 text-xs text-zinc-500">
            {formatFileSize(file.sizeBytes)}
          </span>
        </li>
      ))}
    </ul>
  );
}
