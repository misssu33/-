export type WorkflowStepId =
  | "upload"
  | "configure"
  | "convert"
  | "deliver"
  | "complete";

export interface WorkflowStepDef {
  id: WorkflowStepId;
  label: string;
  shortLabel: string;
  hint: string;
}

/** 메인 사용자 플로우 단계 정의 */
export const WORKFLOW_STEPS: WorkflowStepDef[] = [
  {
    id: "upload",
    label: "업로드",
    shortLabel: "1",
    hint: "변환할 비디오를 드래그하거나 선택하세요.",
  },
  {
    id: "configure",
    label: "설정",
    shortLabel: "2",
    hint: "SNS 프리셋과 출력 포맷(GIF/MP4/WebP)을 고르세요.",
  },
  {
    id: "convert",
    label: "변환",
    shortLabel: "3",
    hint: "「배치 변환 시작」을 누르면 큐에 등록되고 실시간 진행률이 표시됩니다.",
  },
  {
    id: "deliver",
    label: "전달",
    shortLabel: "4",
    hint: "Fast 프리뷰로 확인한 뒤 최종 Export와 ZIP을 받으세요.",
  },
  {
    id: "complete",
    label: "완료",
    shortLabel: "5",
    hint: "ZIP을 다운로드해 채널에 업로드하면 됩니다.",
  },
];
