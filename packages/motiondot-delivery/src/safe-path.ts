import { resolve, relative, isAbsolute } from "node:path";

/** storage 루트 밖으로 나가는 경로 차단 */
export function assertInsideStorageRoot(
  storageRoot: string,
  targetPath: string,
): string {
  const root = resolve(storageRoot);
  const target = resolve(targetPath);
  const rel = relative(root, target);
  if (rel.startsWith("..") || isAbsolute(rel)) {
    throw new Error("Path escapes storage root");
  }
  return target;
}
