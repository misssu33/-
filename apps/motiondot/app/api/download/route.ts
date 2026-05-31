import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { basename } from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { assertInsideStorageRoot } from "@motiondot/delivery";
import { getDeliveryStateStore } from "@motiondot/queue";
import { resolveStorageRoot } from "@motiondot/shared";

const MIME: Record<string, string> = {
  mp4: "video/mp4",
  gif: "image/gif",
  webp: "image/webp",
  zip: "application/zip",
  preview: "video/mp4",
};

function contentTypeFor(path: string, kind: string): string {
  if (kind === "zip") return MIME.zip;
  const ext = path.split(".").pop()?.toLowerCase() ?? "mp4";
  return MIME[ext] ?? MIME.mp4;
}

/** storage 루트 안의 프리뷰·export·ZIP 스트리밍 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const batchId = searchParams.get("batchId");
  const kind = searchParams.get("kind");
  const itemId = searchParams.get("itemId");

  if (!batchId || !kind) {
    return NextResponse.json(
      { error: "batchId and kind are required" },
      { status: 400 },
    );
  }

  if (kind !== "zip" && !itemId) {
    return NextResponse.json(
      { error: "itemId is required for preview/export" },
      { status: 400 },
    );
  }

  const snapshot = await getDeliveryStateStore().getSnapshot(batchId);
  if (!snapshot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let diskPath: string | undefined;
  let downloadName: string;

  if (kind === "zip") {
    diskPath = snapshot.export.zipPath;
    downloadName = `motiondot-${batchId}.zip`;
  } else if (kind === "preview") {
    const file = snapshot.preview.files.find((f) => f.itemId === itemId);
    diskPath = file?.path;
    downloadName = file?.originalName ?? `${itemId}.mp4`;
  } else if (kind === "export") {
    const file = snapshot.export.files.find((f) => f.itemId === itemId);
    diskPath = file?.path;
    downloadName = basename(file?.path ?? `${itemId}.${snapshot.export.format}`);
  } else {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  }

  if (!diskPath) {
    return NextResponse.json({ error: "File not ready" }, { status: 404 });
  }

  const storageRoot = resolveStorageRoot();

  let safePath: string;
  try {
    safePath = assertInsideStorageRoot(storageRoot, diskPath);
  } catch {
    return NextResponse.json({ error: "Forbidden path" }, { status: 403 });
  }

  try {
    const info = await stat(safePath);
    if (!info.isFile()) {
      return NextResponse.json({ error: "Not a file" }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }

  const stream = createReadStream(safePath);
  const webStream = Readable.toWeb(stream) as ReadableStream;

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": contentTypeFor(safePath, kind),
      "Content-Disposition": `attachment; filename="${downloadName.replace(/"/g, "")}"`,
    },
  });
}
