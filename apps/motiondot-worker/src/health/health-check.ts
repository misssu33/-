import { getRedisConnection } from "@motiondot/queue";

export async function workerHealthCheck(): Promise<{ redis: boolean }> {
  try {
    const pong = await getRedisConnection().ping();
    return { redis: pong === "PONG" };
  } catch {
    return { redis: false };
  }
}
