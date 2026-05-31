"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button/Button";
import { siteConfig } from "@/shared/config/site";
import { ONBOARDING_SLIDES } from "../constants";
import { useOnboarding } from "../hooks/use-onboarding";

/** 전체 페이지 온보딩 — 랜딩에서 진입 */
export function WelcomePage() {
  const router = useRouter();
  const { complete } = useOnboarding();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-center text-sm font-medium uppercase tracking-widest text-brand">
        시작 가이드
      </p>
      <h1 className="mt-4 text-center text-2xl font-bold tracking-tight sm:text-3xl">
        {siteConfig.name}로 SNS 영상을 배치 변환하세요
      </h1>
      <p className="mt-4 text-center text-zinc-400">{siteConfig.description}</p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {ONBOARDING_SLIDES.slice(0, 4).map((slide) => (
          <li
            key={slide.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
          >
            <span className="text-2xl text-brand">{slide.visual}</span>
            <h2 className="mt-3 text-sm font-semibold">{slide.title}</h2>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
              {slide.description}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={() => router.push(`${siteConfig.links.converter}?tour=1`)}
        >
          슬라이드 투어 시작
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            complete();
            router.push(siteConfig.links.converter);
          }}
        >
          바로 변환기로
        </Button>
        <Link
          href={siteConfig.links.home}
          className="text-xs text-zinc-600 underline hover:text-zinc-400"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
