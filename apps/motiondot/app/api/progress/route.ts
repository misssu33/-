import { createProgressStream } from "@/features/progress/services/progress-sse";

/** SSE — Redis progress 채널 구독 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  if (!jobId) {
    return new Response("jobId required", { status: 400 });
  }
  return createProgressStream(jobId);
}
