import { Queue } from "bullmq";
import { QUEUE_NAMES } from "@motiondot/shared";
import { getBullMQConnection } from "../redis/connection";

export function createBatchQueue(): Queue {
  return new Queue(QUEUE_NAMES.BATCH, {
    connection: getBullMQConnection(),
    defaultJobOptions: {
      attempts: 2,
      backoff: { type: "fixed", delay: 3000 },
      removeOnComplete: 50,
      removeOnFail: 200,
    },
  });
}
