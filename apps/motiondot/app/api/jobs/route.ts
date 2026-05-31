import { NextResponse } from "next/server";
import { createBatchJob } from "@/features/jobs/services/job-service";

export async function POST(request: Request) {
  const body = await request.json();
  const job = await createBatchJob(body);
  return NextResponse.json(job, { status: 201 });
}
