import { progressChannel } from "@motiondot/queue";
import { getRedisConnection } from "@motiondot/queue";

/**
 * SSE Response — Redis subscribe → 클라이언트 스트림
 */
export function createProgressStream(jobId: string): Response {
  const encoder = new TextEncoder();
  const channel = progressChannel();
  const redis = getRedisConnection().duplicate();

  const stream = new ReadableStream({
    start(controller) {
      void redis.subscribe(channel);
      redis.on("message", (_ch, payload) => {
        try {
          const event = JSON.parse(payload) as { jobId: string };
          if (event.jobId !== jobId) return;
          controller.enqueue(
            encoder.encode(`data: ${payload}\n\n`),
          );
        } catch {
          /* ignore malformed */
        }
      });
    },
    cancel() {
      void redis.unsubscribe(channel);
      void redis.quit();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
