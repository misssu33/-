import Link from "next/link";
import { siteConfig } from "@/shared/config/site";
import { DashboardNav } from "./DashboardNav";
import { DashboardMobileNav } from "./DashboardMobileNav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-zinc-800 p-4 md:flex">
        <Link
          href={siteConfig.links.converter}
          className="text-lg font-semibold text-brand"
        >
          {siteConfig.name}
        </Link>
        <p className="mt-1 text-[10px] leading-snug text-zinc-600">
          {siteConfig.tagline}
        </p>
        <DashboardNav />
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 px-4 py-3 backdrop-blur-md md:hidden">
          <Link href={siteConfig.links.converter} className="font-semibold text-brand">
            {siteConfig.name}
          </Link>
          <span className="text-[10px] text-zinc-600">{siteConfig.tagline}</span>
        </header>

        <main className="dashboard-main flex-1 overflow-x-hidden px-4 py-4 sm:px-6 sm:py-6">
          {children}
        </main>
      </div>

      <DashboardMobileNav />
    </div>
  );
}
