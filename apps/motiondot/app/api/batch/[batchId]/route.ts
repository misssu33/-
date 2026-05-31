import { NextResponse } from "next/server";
import { getBatchQueueStatus } from "@/features/batch/services/batch-queue-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ batchId: string }> },
) {
  const { batchId } = await context.params;
  const batch = await getBatchQueueStatus(batchId);

  if (!batch) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(batch);
}
