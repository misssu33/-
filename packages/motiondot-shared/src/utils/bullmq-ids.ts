/**
 * BullMQ custom jobId 규칙 — `:` 사용 금지 (Redis 키 구분자와 충돌)
 * @see https://docs.bullmq.io/guide/jobs/job-ids
 */

/** 배치·아이템·단계별 jobId 조합 (`batchId__suffix`) */
export function composeBullJobId(batchId: string, suffix: string): string {
  return `${batchId}__${suffix}`;
}
