"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/cn";
import { DASHBOARD_NAV_ITEMS } from "./dashboard-nav-config";

/** 모바일 하단 탭 네비게이션 */
export function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="dashboard-mobile-nav fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md md:hidden"
      aria-label="주요 메뉴"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-[3rem] flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition-colors",
                  active
                    ? "text-brand"
                    : "text-zinc-500 active:bg-zinc-800/60",
                )}
              >
                <span
                  className={cn(
                    "h-1 w-1 rounded-full",
                    active ? "bg-brand" : "bg-transparent",
                  )}
                  aria-hidden
                />
                {item.mobileLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
