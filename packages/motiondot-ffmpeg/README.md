# @motiondot/ffmpeg

ffmpeg 변환 유틸 — 파일당 하나의 책임, 작은 모듈.

## Modules

| Path | Role |
|------|------|
| `conversion/convert.ts` | `convertMedia()` — 실행 진입점 |
| `conversion/build-args.ts` | 포맷별 인자 조립 |
| `conversion/output-path.ts` | 출력 경로 헬퍼 |
| `formats/*` | MP4 / GIF / WebP 인자 빌더 |
| `probe/probe-media.ts` | ffprobe 메타 조회 |
| `client/*` | ffmpeg / ffprobe spawn |
| `utils/*` | 경로, 진행률 파싱 |

## Usage

```ts
import { convertMedia, probeMedia, buildConversionOutputPath } from "@motiondot/ffmpeg";

const probe = await probeMedia("/path/video.mp4");
const output = buildConversionOutputPath("./out", "item-1", "mp4");

await convertMedia({
  sourcePath: "/path/video.mp4",
  outputPath: output,
  presetId: "tiktok",
  format: "mp4",
  onStderr: (chunk) => console.log(chunk),
});
```
