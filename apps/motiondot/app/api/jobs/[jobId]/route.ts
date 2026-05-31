import { NextResponse } from "next/server";
import { getJobMeta } from "@/features/jobs/services/job-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await context.params;
  const meta = await getJobMeta(jobId);
  if (!meta) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(meta);
}
