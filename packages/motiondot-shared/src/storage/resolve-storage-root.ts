import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { ENV_KEYS } from "../constants/index";

/**
 * 웹·워커가 동일한 디렉터리를 보도록 storage 루트를 절대 경로로 통일.
 * cwd가 apps/motiondot / apps/motiondot-worker / monorepo 루트일 때 후보를 탐색합니다.
 */
export function resolveStorageRoot(explicit?: string): string {
  const configured = explicit ?? process.env[ENV_KEYS.STORAGE_ROOT];
  if (configured) {
    return resolve(configured);
  }

  const cwd = process.cwd();
  const candidates = [
    resolve(cwd, "storage"),
    resolve(cwd, "apps/motiondot/storage"),
    resolve(cwd, "../motiondot/storage"),
  ];

  for (const dir of candidates) {
    if (existsSync(dir)) {
      return dir;
    }
  }

  return resolve(cwd, "storage");
}
