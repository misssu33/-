import { NextResponse } from "next/server";
import { startBatchQueue } from "@/features/batch/services/batch-queue-service";
import type { ExportFormat, PresetId, PresetOverrides } from "@motiondot/shared";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      batchId: string;
      presetId: PresetId;
      outputFormat: ExportFormat;
      presetOverrides?: PresetOverrides;
      files: {
        id: string;
        originalName: string;
        storagePath: string;
        mimeType: string;
        sizeBytes: number;
      }[];
    };

    const batch = await startBatchQueue({
      batchId: body.batchId,
      presetId: body.presetId,
      outputFormat: body.outputFormat,
      presetOverrides: body.presetOverrides,
      files: body.files,
    });

    return NextResponse.json(batch, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Batch enqueue failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
