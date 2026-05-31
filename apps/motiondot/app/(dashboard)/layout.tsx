import { DashboardShell } from "@/shared/ui/layout/DashboardShell";

/** 변환기 대시보드 레이아웃 */
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DashboardShell>{children}</DashboardShell>;
}
