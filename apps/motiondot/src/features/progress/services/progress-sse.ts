import type { ProgressEvent } from "@motiondot/shared";
import { progressChannel, getBatchStateStore } from "@motiondot/queue";
import { getRedisConnection } from "@motiondot/queue";
import { matchesProgressFilter } from "../lib/matches-progress-filter";

const HEARTBEAT_MS = 15_000;

function sseLine(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

/** SSE — 초기 스냅샷 + Redis pub/sub 실시간 이벤트 */
export async function createProgressStream(
  batchId: string,
  itemId?: string,
): Promise<Response> {
  const encoder = new TextEncoder();
  const channel = progressChannel();
  const redis = getRedisConnection().duplicate();
  const filter = { batchId, itemId };
  let cleanup: (() => void) | undefined;

  const stream = new ReadableStream({
    async start(controller) {
      const snapshot = await getBatchStateStore().getBatch(batchId);
      if (snapshot) {
        controller.enqueue(
          encoder.encode(sseLine({ type: "snapshot", batch: snapshot })),
        );
      }

      await redis.subscribe(channel);

      const onMessage = (_ch: string, payload: string) => {
        try {
          const event = JSON.parse(payload) as ProgressEvent;
          if (!matchesProgressFilter(event, filter)) return;
          controller.enqueue(encoder.encode(sseLine({ type: "event", event })));
        } catch {
          /* ignore */
        }
      };

      redis.on("message", onMessage);

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`: ping\n\n`));
      }, HEARTBEAT_MS);

      cleanup = () => {
        clearInterval(heartbeat);
        redis.off("message", onMessage);
        void redis.unsubscribe(channel);
        void redis.quit();
      };
    },
    cancel() {
      cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
