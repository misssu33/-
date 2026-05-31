"use client";

import { useUpload } from "../hooks/use-upload";
import { Button } from "@/shared/ui/button/Button";

export function UploadDropzone() {
  const { upload, isUploading } = useUpload();

  return (
    <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center">
      <p className="text-sm text-zinc-400">GIF / MP4 / WebP 소스 업로드</p>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        className="mt-4 block w-full text-sm"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) void upload(files);
        }}
      />
      {isUploading && <p className="mt-2 text-xs text-zinc-500">업로드 중…</p>}
      <Button className="mt-4" disabled>
        배치에 추가 (다음 단계)
      </Button>
    </div>
  );
}
