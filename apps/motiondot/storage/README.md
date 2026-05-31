# storage (runtime)

런타임 파일 시스템 루트입니다. Git에는 `.gitkeep`만 포함하고 실제 파일은 `.gitignore` 처리합니다.

| Bucket | Purpose |
|--------|---------|
| `temp/` | ffmpeg 중간 산출물, jobId별 격리 |
| `uploads/` | 사용자 업로드 원본, batchId별 격리 |
| `output/` | 최종 GIF/MP4/WebP |
| `previews/` | 저해상도 미리보기 |

경로 규칙: `@motiondot/shared` → `StoragePathManager`
