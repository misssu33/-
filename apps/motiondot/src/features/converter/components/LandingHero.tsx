import Link from "next/link";
import { siteConfig } from "@/shared/config/site";
import { Button } from "@/shared/ui/button/Button";

export function LandingHero() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight">{siteConfig.name}</h1>
      <p className="mt-4 max-w-lg text-zinc-400">{siteConfig.description}</p>
      <Link href={siteConfig.links.converter} className="mt-8">
        <Button>시작하기</Button>
      </Link>
    </section>
  );
}
