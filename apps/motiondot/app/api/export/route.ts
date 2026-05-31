import { NextResponse } from "next/server";
import { startExport } from "@/features/export/services/export-service";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await startExport(body);
  return NextResponse.json(result, { status: 202 });
}
