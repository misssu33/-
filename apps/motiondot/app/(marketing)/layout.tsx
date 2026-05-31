import { MarketingHeader } from "@/shared/ui/layout/MarketingHeader";

/** 마케팅/랜딩 라우트 그룹 — 공개 페이지 */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      {children}
    </div>
  );
}
