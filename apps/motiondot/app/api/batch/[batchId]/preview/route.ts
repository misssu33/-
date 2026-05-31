import { NextResponse } from "next/server";
import type { SourceMediaMeta } from "@motiondot/shared";
import {
  getDeliveryStatus,
  startBatchPreview,
} from "@/features/delivery/services/delivery-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ batchId: string }> },
) {
  const { batchId } = await context.params;
  const delivery = await getDeliveryStatus(batchId);
  if (!delivery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(delivery.preview);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ batchId: string }> },
) {
  try {
    const { batchId } = await context.params;
    const body = (await request.json()) as { files: SourceMediaMeta[] };
    const result = await startBatchPreview({
      batchId,
      files: body.files ?? [],
    });
    const preview = (await getDeliveryStatus(batchId))?.preview;
    return NextResponse.json({ ...result, preview }, { status: 202 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Preview enqueue failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
