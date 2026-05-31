import { NextResponse } from "next/server";
import { getPreset, resolvePreset } from "@motiondot/presets";
import type { PresetId } from "@motiondot/shared";

export async function GET(
  request: Request,
  context: { params: Promise<{ presetId: string }> },
) {
  const { presetId } = await context.params;
  const { searchParams } = new URL(request.url);

  try {
    const base = getPreset(presetId as PresetId);
    const width = searchParams.get("width");
    const height = searchParams.get("height");

    const preset =
      width || height
        ? resolvePreset(presetId as PresetId, {
            width: width ? Number(width) : undefined,
            height: height ? Number(height) : undefined,
          })
        : base;

    return NextResponse.json(preset);
  } catch {
    return NextResponse.json({ error: "Unknown preset" }, { status: 404 });
  }
}
