import type { ProgressEvent } from "@motiondot/shared";
import { REDIS_KEY_PREFIX } from "@motiondot/shared";
import { getRedisConnection } from "../redis/connection";

const channel = `${REDIS_KEY_PREFIX}progress`;

/** 워커 → API SSE 브리지용 Redis pub */
export async function publishProgress(event: ProgressEvent): Promise<void> {
  const redis = getRedisConnection();
  await redis.publish(channel, JSON.stringify(event));
}

export function progressChannel(): string {
  return channel;
}
