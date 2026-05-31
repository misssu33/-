import { Redis } from "ioredis";
import type { ConnectionOptions } from "bullmq";
import { ENV_KEYS } from "@motiondot/shared";

let sharedConnection: Redis | null = null;

function redisUrl(): string {
  return process.env[ENV_KEYS.REDIS_URL] ?? "redis://127.0.0.1:6379";
}

/** BullMQ Queue/Worker용 연결 옵션 (타입 충돌 방지) */
export function getBullMQConnection(): ConnectionOptions {
  return { url: redisUrl(), maxRetriesPerRequest: null };
}

/** pub/sub·일반 명령용 Redis 클라이언트 */
export function getRedisConnection(): Redis {
  if (!sharedConnection) {
    sharedConnection = new Redis(redisUrl(), { maxRetriesPerRequest: null });
  }
  return sharedConnection;
}

export async function closeRedisConnection(): Promise<void> {
  if (sharedConnection) {
    await sharedConnection.quit();
    sharedConnection = null;
  }
}

/** E2E·단위 테스트 — Redis 클라이언트 주입 (BullMQ는 별도 실 Redis 필요) */
export function setTestRedisConnection(redis: Redis): void {
  sharedConnection = redis;
}

export function resetTestRedisConnection(): void {
  sharedConnection = null;
}
