"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/shared/config/site";
import { cn } from "@/shared/lib/cn";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";

const NAV_ITEMS = [
  { href: siteConfig.links.converter, label: "변환 작업", short: "Converter" },
  { href: siteConfig.links.batch, label: "배치 큐", short: "Batch" },
  { href: siteConfig.links.templates, label: "광고 템플릿", short: "Templates" },
  { href: siteConfig.links.welcome, label: "가이드", short: "Guide" },
] as const;

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { restart } = useOnboarding();

  return (
    <nav className="mt-6 flex flex-col gap-1 text-sm">
      {NAV_ITEMS.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-2 transition-colors",
              active
                ? "bg-brand/15 font-medium text-brand"
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200",
            )}
          >
            <span className="hidden sm:inline">{item.label}</span>
            <span className="sm:hidden">{item.short}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => {
          restart();
          if (pathname !== siteConfig.links.converter) {
            router.push(`${siteConfig.links.converter}?tour=1`);
          }
        }}
        className="mt-4 rounded-lg px-3 py-2 text-left text-zinc-500 transition-colors hover:bg-zinc-800/50 hover:text-zinc-300"
      >
        온보딩 다시 보기
      </button>
    </nav>
  );
}
