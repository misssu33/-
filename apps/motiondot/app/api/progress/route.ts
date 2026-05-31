import { createProgressStream } from "@/features/progress/services/progress-sse";

/**
 * SSE 실시간 배치 진행률
 * - ?batchId= (필수) 배치 전체
 * - ?batchId=&itemId= 특정 파일만
 * - ?jobId= (레거시) batchId와 동일 처리
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const batchId = searchParams.get("batchId") ?? searchParams.get("jobId");
  const itemId = searchParams.get("itemId") ?? undefined;

  if (!batchId) {
    return new Response("batchId required", { status: 400 });
  }

  return createProgressStream(batchId, itemId);
}
