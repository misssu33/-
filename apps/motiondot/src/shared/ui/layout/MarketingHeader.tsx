import Link from "next/link";
import { siteConfig } from "@/shared/config/site";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-zinc-800/80 bg-zinc-950/90 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4">
      <Link
        href={siteConfig.links.home}
        className="shrink-0 text-lg font-semibold text-brand"
      >
        {siteConfig.name}
      </Link>
      <nav className="flex shrink-0 items-center gap-2 text-sm text-zinc-400 sm:gap-4">
        <Link
          href={siteConfig.links.welcome}
          className="whitespace-nowrap hover:text-zinc-200"
        >
          <span className="sm:hidden">가이드</span>
          <span className="hidden sm:inline">시작 가이드</span>
        </Link>
        <Link
          href={siteConfig.links.converter}
          className="whitespace-nowrap rounded-lg bg-brand px-2.5 py-1.5 text-xs text-brand-foreground hover:opacity-90 sm:px-3 sm:text-sm"
        >
          변환기
        </Link>
      </nav>
    </header>
  );
}
