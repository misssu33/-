# @motiondot/queue

BullMQ 큐·잡 정의와 Redis 연결을 공유합니다. Next.js API는 job을 enqueue하고,
`apps/motiondot-worker`는 동일한 큐 이름으로 consume합니다.
