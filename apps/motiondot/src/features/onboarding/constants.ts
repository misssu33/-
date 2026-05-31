/** localStorage 키 — 온보딩 완료 여부 */
export const ONBOARDING_STORAGE_KEY = "motiondot:onboarding:v1";

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  /** 단순 시각 요소 (이모지/기호) */
  visual: string;
}

/** 제품 소개 슬라이드 */
export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "welcome",
    title: "MotionDot에 오신 것을 환영합니다",
    description:
      "SNS·커머스용 GIF, MP4, WebP를 한 번에 배치 변환합니다. TikTok, Reels, Threads, 쿠팡 프리셋을 지원합니다.",
    visual: "◎",
  },
  {
    id: "upload",
    title: "여러 영상을 한꺼번에 업로드",
    description:
      "드래그앤드롭으로 최대 50개까지 올리면 배치 ID가 자동 생성됩니다. worker thread ffmpeg가 파일별로 병렬 처리합니다.",
    visual: "↑",
  },
  {
    id: "preset",
    title: "플랫폼 프리셋 선택",
    description:
      "해상도·비율·길이 제한이 프리셋에 맞춰 적용됩니다. 커스텀 프리셋으로 세부 값을 조정할 수 있습니다.",
    visual: "◫",
  },
  {
    id: "preview",
    title: "Fast 프리뷰 & 최종 Export",
    description:
      "저해상도 프리뷰로 결과를 빠르게 확인한 뒤, ZIP 패키지로 최종 파일을 내려받으세요.",
    visual: "▶",
  },
  {
    id: "templates",
    title: "광고 템플릿 (선택)",
    description:
      "Remotion 기반 광고 모션 템플릿으로 브랜드 영상을 구성할 수 있습니다. 변환 파이프라인과 별도 메뉴에서 이용합니다.",
    visual: "✦",
  },
];
