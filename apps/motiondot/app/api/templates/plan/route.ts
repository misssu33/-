import { NextResponse } from "next/server";
import { buildPlan } from "@/features/templates/services/template-engine-service";
import type { AdTemplateId, AdTemplateProps, PresetId } from "@motiondot/shared";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      templateId: AdTemplateId;
      presetId: PresetId;
      props?: Partial<AdTemplateProps>;
    };

    const { plan, issues } = buildPlan(body);
    if (issues.length > 0) {
      return NextResponse.json({ issues }, { status: 400 });
    }

    return NextResponse.json({ plan });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Plan build failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
