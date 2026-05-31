import { NextResponse } from "next/server";
import { requestPreview } from "@/features/preview/services/preview-service";
import type { SourceMediaMeta } from "@motiondot/shared";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      batchId: string;
      files: SourceMediaMeta[];
    };
    const result = await requestPreview(body);
    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Preview enqueue failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
