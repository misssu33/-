"use client";

/** 클라이언트 전역 Provider (Zustand는 store 단위, 여기는 theme 등 확장) */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
