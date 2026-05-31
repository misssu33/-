import { Queue } from "bullmq";
import { QUEUE_NAMES } from "@motiondot/shared";
import { getBullMQConnection } from "../redis/connection";

export function createPreviewQueue(): Queue {
  return new Queue(QUEUE_NAMES.PREVIEW, {
    connection: getBullMQConnection(),
  });
}
