"use client";

/** 프리뷰 URL 또는 Remotion Player 래퍼 */
export function PreviewPlayer({ src }: { src?: string }) {
  if (!src) {
    return (
      <div className="flex aspect-[9/16] max-w-sm items-center justify-center rounded-lg bg-zinc-900 text-xs text-zinc-500">
        미리보기 대기 중
      </div>
    );
  }
  return (
    <video
      src={src}
      controls
      className="max-w-sm rounded-lg"
      playsInline
    />
  );
}
