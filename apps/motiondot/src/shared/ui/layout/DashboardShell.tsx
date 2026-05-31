import Link from "next/link";
import { siteConfig } from "@/shared/config/site";
import { DashboardNav } from "./DashboardNav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 p-4">
        <Link href={siteConfig.links.converter} className="text-lg font-semibold text-brand">
          {siteConfig.name}
        </Link>
        <p className="mt-1 text-[10px] leading-snug text-zinc-600">
          {siteConfig.tagline}
        </p>
        <DashboardNav />
      </aside>
      <main className="flex-1 overflow-x-hidden p-6">{children}</main>
    </div>
  );
}
