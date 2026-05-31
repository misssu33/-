import Redis from "ioredis";
import RedisMock from "ioredis-mock";
import {
  resetBatchStateStore,
  resetTestRedisConnection,
  setTestRedisConnection,
} from "@motiondot/queue";

/** BatchStateStore용 인메모리 Redis (BullMQ 미사용 테스트) */
export function useMockRedis(): void {
  resetBatchStateStore();
  setTestRedisConnection(new RedisMock() as unknown as Redis);
}

export async function tryRealRedis(): Promise<string | null> {
  const url = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";
  const probe = new Redis(url, {
    maxRetriesPerRequest: 1,
    connectTimeout: 2_000,
    lazyConnect: true,
    retryStrategy: () => null,
  });

  probe.on("error", () => undefined);

  try {
    await probe.connect();
    await probe.ping();
    probe.disconnect();
    return url;
  } catch {
    probe.disconnect();
    return null;
  }
}

export function useRealRedis(url: string): void {
  process.env.REDIS_URL = url;
  resetBatchStateStore();
  resetTestRedisConnection();
  setTestRedisConnection(new Redis(url, { maxRetriesPerRequest: null }));
}

export function teardownRedis(): void {
  resetBatchStateStore();
  resetTestRedisConnection();
}
