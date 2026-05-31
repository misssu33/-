import { createWriteStream } from "node:fs";
import { stat } from "node:fs/promises";
import { basename } from "node:path";
import archiver from "archiver";

/** export 파일들을 ZIP으로 묶기 */
export async function createExportBundle(input: {
  files: { path: string; name: string }[];
  zipPath: string;
}): Promise<{ zipPath: string; sizeBytes: number }> {
  await new Promise<void>((resolve, reject) => {
    const output = createWriteStream(input.zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve());
    archive.on("error", reject);
    archive.pipe(output);

    for (const file of input.files) {
      archive.file(file.path, { name: file.name });
    }

    void archive.finalize();
  });

  const info = await stat(input.zipPath);
  return { zipPath: input.zipPath, sizeBytes: info.size };
}

export function safeZipEntryName(originalName: string, itemId: string, ext: string): string {
  const base = basename(originalName).replace(/\.[^.]+$/, "");
  const safe = base.replace(/[^\w.-]+/g, "_").slice(0, 60);
  return `${safe || itemId}.${ext}`;
}
