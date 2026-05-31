import Link from "next/link";
import { siteConfig } from "@/shared/config/site";

export function MarketingHeader() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-4">
      <Link href={siteConfig.links.home} className="text-lg font-semibold text-brand">
        {siteConfig.name}
      </Link>
      <nav className="flex items-center gap-4 text-sm text-zinc-400">
        <Link href={siteConfig.links.welcome} className="hover:text-zinc-200">
          시작 가이드
        </Link>
        <Link
          href={siteConfig.links.converter}
          className="rounded-lg bg-brand px-3 py-1.5 text-brand-foreground hover:opacity-90"
        >
          변환기
        </Link>
      </nav>
    </header>
  );
}
