# src/

Next.js `app/`는 라우팅만 담당하고, 모든 UI·비즈니스 로직은 이 디렉터리에 둡니다.

## features/

기능 단위 모듈. 각 폴더에 `README.md`로 역할을 설명합니다.

- `upload/` — 업로드 파이프라인
- `preview/` — 미리보기(Remotion/ffmpeg)
- `export/` — 최종 export 큐
- `batch/` — 배치 큐 UI
- `presets/` — SNS 프리셋 선택 UI
- `progress/` — SSE 실시간 진행률
- `converter/` — 워크스페이스 조립
- `jobs/` — 작업 생성·조회

## shared/

feature 간 공용 UI·유틸·설정.

## stores/

Zustand 전역 상태.

## providers/

클라이언트 Provider.
