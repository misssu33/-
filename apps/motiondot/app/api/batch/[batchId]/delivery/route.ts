import { NextResponse } from "next/server";
import { getDeliveryStatus } from "@/features/delivery/services/delivery-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ batchId: string }> },
) {
  const { batchId } = await context.params;
  const delivery = await getDeliveryStatus(batchId);

  if (!delivery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(delivery);
}
