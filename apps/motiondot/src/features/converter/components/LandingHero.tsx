import Link from "next/link";
import { siteConfig } from "@/shared/config/site";
import { Button } from "@/shared/ui/button/Button";

export function LandingHero() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-brand">
        SNS · 커머스 배치 변환
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        {siteConfig.name}
      </h1>
      <p className="mt-4 max-w-lg text-zinc-400">{siteConfig.description}</p>
      <p className="mt-2 text-sm text-zinc-500">{siteConfig.tagline}</p>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Link href={siteConfig.links.welcome}>
          <Button>시작 가이드 보기</Button>
        </Link>
        <Link href={siteConfig.links.converter}>
          <Button variant="ghost">바로 변환하기</Button>
        </Link>
      </div>

      <ol className="mt-16 grid max-w-2xl gap-3 text-left text-sm text-zinc-500 sm:grid-cols-4">
        {["업로드", "프리셋", "배치 변환", "Export"].map((label, i) => (
          <li
            key={label}
            className="rounded-lg border border-zinc-800/80 px-3 py-2 text-center"
          >
            <span className="text-xs font-semibold text-zinc-600">{i + 1}</span>
            <p className="mt-1 font-medium text-zinc-400">{label}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
