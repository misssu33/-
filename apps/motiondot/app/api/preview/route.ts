import { NextResponse } from "next/server";
import { requestPreview } from "@/features/preview/services/preview-service";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await requestPreview(body);
  return NextResponse.json(result);
}
