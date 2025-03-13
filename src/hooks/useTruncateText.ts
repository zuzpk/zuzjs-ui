"use client"
import { useEffect, useRef } from "react";

const useTruncateText = (lines: number) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    const maxHeight = lineHeight * lines;

    while (el.scrollHeight > maxHeight) {
      el.textContent = el.textContent?.trim().slice(0, -1) + "…";
    }
  }, [lines]);

  return ref;
};

export default useTruncateText