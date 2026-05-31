import { Queue } from "bullmq";
import { QUEUE_NAMES } from "@motiondot/shared";
import { getBullMQConnection } from "../redis/connection";

export function createCleanupQueue(): Queue {
  return new Queue(QUEUE_NAMES.CLEANUP, {
    connection: getBullMQConnection(),
  });
}
