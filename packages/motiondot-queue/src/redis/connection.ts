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
