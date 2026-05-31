"use client";

import { useCallback, useEffect, useState } from "react";
import { ONBOARDING_STORAGE_KEY } from "../constants";

function readCompleted(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === "done";
}

/** 온보딩 완료·재시작 상태 (localStorage) */
export function useOnboarding() {
  const [isComplete, setIsComplete] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const done = readCompleted();
    setIsComplete(done);
    if (!done) setIsOpen(true);
  }, []);

  const complete = useCallback(() => {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "done");
    setIsComplete(true);
    setIsOpen(false);
    setSlideIndex(0);
  }, []);

  const skip = useCallback(() => {
    complete();
  }, [complete]);

  const restart = useCallback(() => {
    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setIsComplete(false);
    setSlideIndex(0);
    setIsOpen(true);
  }, []);

  const open = useCallback(() => {
    setSlideIndex(0);
    setIsOpen(true);
  }, []);

  return {
    isComplete,
    isOpen,
    slideIndex,
    setSlideIndex,
    complete,
    skip,
    restart,
    open,
    setIsOpen,
  };
}
