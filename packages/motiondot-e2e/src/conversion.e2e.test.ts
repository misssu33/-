import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { access, stat } from "node:fs/promises";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  BatchOrchestrator,
  closeRedisConnection,
  enqueueBatch,
} from "@motiondot/queue";
import { probeMedia } from "@motiondot/ffmpeg";
import { createStoragePathManager } from "@motiondot/shared";
import { seedUploadFixture } from "./helpers/fixtures";
import { waitForBatchComplete } from "./helpers/wait-batch";
import { startConversionWorkers } from "./helpers/workers";
import { runDirectConversion } from "./helpers/direct-conversion";
import { runBatchPipelineWithoutQueue } from "./helpers/batch-pipeline";
import {
  teardownRedis,
  tryRealRedis,
  useMockRedis,
  useRealRedis,
} from "./helpers/redis";
import { shutdownFfmpegThreadPool } from "@motiondot/worker/threads/ffmpeg-thread-pool";

const execFileAsync = promisify(execFile);

let storageRoot = "";
const ffmpegPath = process.env.FFMPEG_PATH ?? "ffmpeg";
const ffprobePath = process.env.FFPROBE_PATH ?? "ffprobe";
let ffmpegOk = false;

async function assertConvertedOutput(
  storageRootPath: string,
  batchId: string,
  fileId: string,
  outputPath: string,
): Promise<void> {
  const paths = createStoragePathManager(storageRootPath);
  const expectedOutput = join(paths.outputDir(batchId), `${fileId}.mp4`);
  assert.equal(outputPath, expectedOutput);

  await access(outputPath);
  const fileStat = await stat(outputPath);
  assert.ok(fileStat.size > 500, "output file should have content");

  const probe = await probeMedia(outputPath, ffprobePath);
  assert.ok(
    (probe.width ?? 0) > 0 && (probe.height ?? 0) > 0,
    "output should be a probeable video stream",
  );
}

describe("MotionDot conversion E2E", { timeout: 180_000 }, () => {
  before(async () => {
    process.env.MOTIONDOT_INLINE_FFMPEG = "1";
    try {
      await execFileAsync(ffmpegPath, ["-version"], { timeout: 10_000 });
      ffmpegOk = true;
    } catch {
      ffmpegOk = false;
    }
  });

  after(async () => {
    await shutdownFfmpegThreadPool().catch(() => undefined);
    await closeRedisConnection().catch(() => undefined);
    teardownRedis();
    if (storageRoot) {
      await rm(storageRoot, { recursive: true, force: true });
    }
  });

  describe("pipeline (mock Redis + worker processor)", () => {
    before(async () => {
      if (!ffmpegOk) return;
      storageRoot = await mkdtemp(join(tmpdir(), "motiondot-e2e-"));
      process.env.MOTIONDOT_STORAGE_ROOT = storageRoot;
      useMockRedis();
    });

    it("fixture → conversion.processor → output MP4", async (t) => {
      if (!ffmpegOk) {
        t.skip("ffmpeg not available");
        return;
      }

      const fixture = await seedUploadFixture(storageRoot, ffmpegPath);
      const payload = BatchOrchestrator.buildPayload({
        batchId: fixture.batchId,
        presetId: "tiktok",
        outputFormat: "mp4",
        files: [
          {
            id: fixture.fileId,
            originalName: fixture.originalName,
            storagePath: fixture.sourcePath,
          },
        ],
      });

      const workerConfig = {
        concurrency: 1,
        threadPoolSize: 1,
        storageRoot,
        ffmpegPath,
        ffprobePath,
      };

      const outputPath = await runDirectConversion(
        payload,
        payload.items[0],
        workerConfig,
      );

      const batch = await waitForBatchComplete(fixture.batchId);
      assert.equal(batch.status, "completed");
      assert.equal(batch.completedItems, 1);

      const item = batch.items[0];
      assert.equal(item.status, "completed");
      assert.equal(item.outputPath, outputPath);
      await assertConvertedOutput(
        storageRoot,
        fixture.batchId,
        fixture.fileId,
        outputPath,
      );
    });

    it("batch init → conversion.processor (fan-out) → output MP4", async (t) => {
      if (!ffmpegOk) {
        t.skip("ffmpeg not available");
        return;
      }

      const fixture = await seedUploadFixture(storageRoot, ffmpegPath);
      const payload = BatchOrchestrator.buildPayload({
        batchId: fixture.batchId,
        presetId: "tiktok",
        outputFormat: "mp4",
        files: [
          {
            id: fixture.fileId,
            originalName: fixture.originalName,
            storagePath: fixture.sourcePath,
          },
        ],
      });

      const workerConfig = {
        concurrency: 1,
        threadPoolSize: 1,
        storageRoot,
        ffmpegPath,
        ffprobePath,
      };

      const outputs = await runBatchPipelineWithoutQueue(payload, workerConfig);
      const batch = await waitForBatchComplete(fixture.batchId);
      assert.equal(batch.status, "completed");
      await assertConvertedOutput(
        storageRoot,
        fixture.batchId,
        fixture.fileId,
        outputs[0]!,
      );
    });
  });

  describe("queue (BullMQ + Redis)", () => {
    let redisUrl: string | null = null;

    before(async () => {
      if (!ffmpegOk) return;
      redisUrl = await tryRealRedis();
      if (!redisUrl) return;

      storageRoot = await mkdtemp(join(tmpdir(), "motiondot-e2e-queue-"));
      process.env.MOTIONDOT_STORAGE_ROOT = storageRoot;
      useRealRedis(redisUrl);
    });

    it("upload → enqueueBatch → workers → output MP4", async (t) => {
      if (!ffmpegOk) {
        t.skip("ffmpeg not available");
        return;
      }
      if (!redisUrl) {
        t.skip("Redis not reachable — set REDIS_URL or start redis-server");
        return;
      }

      const fixture = await seedUploadFixture(storageRoot, ffmpegPath);
      const payload = BatchOrchestrator.buildPayload({
        batchId: fixture.batchId,
        presetId: "tiktok",
        outputFormat: "mp4",
        files: [
          {
            id: fixture.fileId,
            originalName: fixture.originalName,
            storagePath: fixture.sourcePath,
          },
        ],
      });

      const workerConfig = {
        concurrency: 1,
        threadPoolSize: 1,
        storageRoot,
        ffmpegPath,
        ffprobePath,
      };

      const handles = startConversionWorkers(workerConfig);

      try {
        await enqueueBatch(payload);
        const batch = await waitForBatchComplete(fixture.batchId, {
          timeoutMs: 120_000,
        });

        assert.equal(batch.completedItems, 1);
        assert.equal(batch.failedItems, 0);

        const item = batch.items[0];
        assert.equal(item.status, "completed");
        assert.ok(item.outputPath);
        await assertConvertedOutput(
          storageRoot,
          fixture.batchId,
          fixture.fileId,
          item.outputPath!,
        );
      } finally {
        await handles.close();
      }
    });
  });
});
