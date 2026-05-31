"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button/Button";
import { cn } from "@/shared/lib/cn";
import { ONBOARDING_SLIDES } from "../constants";
import { useOnboarding } from "../hooks/use-onboarding";
import { siteConfig } from "@/shared/config/site";

/** 첫 방문·재시작 시 전체 화면 온보딩 */
export function OnboardingOverlay({ forceOpen = false }: { forceOpen?: boolean }) {
  const router = useRouter();
  const {
    isOpen,
    slideIndex,
    setSlideIndex,
    complete,
    skip,
    setIsOpen,
    isComplete,
  } = useOnboarding();

  const visible = forceOpen || isOpen;
  const slide = ONBOARDING_SLIDES[slideIndex];
  const isLast = slideIndex >= ONBOARDING_SLIDES.length - 1;

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen, setIsOpen]);

  if (!visible || !slide) return null;

  function goNext() {
    if (isLast) {
      complete();
      router.push(siteConfig.links.converter);
      return;
    }
    setSlideIndex(slideIndex + 1);
  }

  function goBack() {
    if (slideIndex > 0) setSlideIndex(slideIndex - 1);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <div className="flex items-center justify-center">
          <span
            className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand/15 text-4xl text-brand"
            aria-hidden
          >
            {slide.visual}
          </span>
        </div>

        <h2 id="onboarding-title" className="mt-6 text-center text-xl font-semibold">
          {slide.title}
        </h2>
        <p className="mt-3 text-center text-sm leading-relaxed text-zinc-400">
          {slide.description}
        </p>

        <div className="mt-8 flex justify-center gap-1.5">
          {ONBOARDING_SLIDES.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === slideIndex ? "w-6 bg-brand" : "w-1.5 bg-zinc-700",
              )}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {slideIndex > 0 && (
            <Button type="button" variant="ghost" onClick={goBack}>
              이전
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={skip}>
            건너뛰기
          </Button>
          <Button type="button" onClick={goNext}>
            {isLast ? "변환기로 이동" : "다음"}
          </Button>
        </div>
      </div>
    </div>
  );
}
