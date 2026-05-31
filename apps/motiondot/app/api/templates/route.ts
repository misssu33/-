import { NextResponse } from "next/server";
import { listTemplates } from "@/features/templates/services/template-engine-service";

export async function GET() {
  return NextResponse.json({ templates: listTemplates() });
}
