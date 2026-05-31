import { NextResponse } from "next/server";
import { listPresetGroups, listPresets } from "@motiondot/presets";

export async function GET() {
  return NextResponse.json({
    presets: listPresets(),
    groups: listPresetGroups(),
  });
}
