import { NextResponse } from "next/server";
import { handleUpload } from "@/features/upload/services/upload-handler";

/** 업로드 파이프라인 진입 — multipart → storage/uploads */
export async function POST(request: Request) {
  try {
    const result = await handleUpload(request);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
