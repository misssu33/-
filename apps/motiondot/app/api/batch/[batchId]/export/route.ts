import { NextResponse } from "next/server";
import type {
  ExportFormat,
  PresetId,
  PresetOverrides,
  SourceMediaMeta,
} from "@motiondot/shared";
import {
  getDeliveryStatus,
  startBatchExport,
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
  return NextResponse.json(delivery.export);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ batchId: string }> },
) {
  try {
    const { batchId } = await context.params;
    const body = (await request.json()) as {
      files: SourceMediaMeta[];
      presetId: PresetId;
      outputFormat: ExportFormat;
      presetOverrides?: PresetOverrides;
    };

    const result = await startBatchExport({
      batchId,
      files: body.files ?? [],
      presetId: body.presetId,
      outputFormat: body.outputFormat,
      presetOverrides: body.presetOverrides,
    });
    const exp = (await getDeliveryStatus(batchId))?.export;
    return NextResponse.json({ ...result, export: exp }, { status: 202 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Export enqueue failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
