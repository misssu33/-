import { NextResponse } from "next/server";
import { startExport } from "@/features/export/services/export-service";
import type {
  ExportFormat,
  PresetId,
  PresetOverrides,
  SourceMediaMeta,
} from "@motiondot/shared";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      batchId: string;
      presetId: PresetId;
      format: ExportFormat;
      files: SourceMediaMeta[];
      presetOverrides?: PresetOverrides;
    };
    const result = await startExport(body);
    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Export enqueue failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
