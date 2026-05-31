import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { resolveStorageRoot } from "@motiondot/shared";

describe("resolveStorageRoot", () => {
  it("uses explicit absolute path", () => {
    const root = resolveStorageRoot("/tmp/motiondot-test-storage");
    assert.equal(root, "/tmp/motiondot-test-storage");
  });

  it("discovers apps/motiondot/storage from monorepo root", () => {
    const monorepoRoot = resolve(import.meta.dirname, "../../..");
    const expected = resolve(monorepoRoot, "apps/motiondot/storage");
    if (!existsSync(expected)) {
      return;
    }
    const prev = process.env.MOTIONDOT_STORAGE_ROOT;
    delete process.env.MOTIONDOT_STORAGE_ROOT;
    const cwd = process.cwd();
    try {
      process.chdir(monorepoRoot);
      assert.equal(resolveStorageRoot(), expected);
    } finally {
      process.chdir(cwd);
      if (prev) process.env.MOTIONDOT_STORAGE_ROOT = prev;
    }
  });
});
