import Link from "next/link";
import { siteConfig } from "@/shared/config/site";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-zinc-800 p-4">
        <p className="text-lg font-semibold text-brand">{siteConfig.name}</p>
        <nav className="mt-6 flex flex-col gap-2 text-sm text-zinc-400">
          <Link href={siteConfig.links.converter}>Converter</Link>
          <Link href={siteConfig.links.batch}>Batch Queue</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
