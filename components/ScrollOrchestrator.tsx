'use client';

import { MutableRefObject, useEffect } from "react";
import { SectionId } from "../data/content";

const accentBySection: Record<SectionId, string> = {
  about: "#38bdf8",
  services: "#a855f7",
  market: "#22d3ee",
  testimonials: "#f59e0b",
  contact: "#34d399"
};

type ScrollOrchestratorProps = {
  scrollRef: MutableRefObject<number>;
  onSectionChange: (id: SectionId) => void;
};

export default function ScrollOrchestrator({
  scrollRef,
  onSectionChange
}: ScrollOrchestratorProps) {
  useEffect(() => {
    const startColor = { r: 0, g: 0, b: 0 };
    const endColor = { r: 10, g: 25, b: 47 }; // #0a192f

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const update = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      const rawProgress =
        maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const clamped = Math.min(1, Math.max(0, rawProgress));

      // 將捲動進度提供給 3D 場景
      scrollRef.current = clamped;

      // 依照進度插值背景顏色
      const r = Math.round(lerp(startColor.r, endColor.r, clamped));
      const g = Math.round(lerp(startColor.g, endColor.g, clamped));
      const b = Math.round(lerp(startColor.b, endColor.b, clamped));
      document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    };

    // 初始呼叫一次，確保一載入就正確
    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scrollRef]);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section]")
    );
    if (!sections.length) return;

    let currentId: SectionId | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const topEntry = visible[0];
        if (!topEntry) return;
        const nextId = topEntry.target.getAttribute("data-section") as
          | SectionId
          | null;
        if (nextId && nextId !== currentId) {
          currentId = nextId;
          onSectionChange(nextId);
          const accent = accentBySection[nextId];
          document.documentElement.style.setProperty(
            "--accent-color",
            accent
          );
        }
      },
      { threshold: [0.35, 0.55, 0.75] }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [onSectionChange]);

  return null;
}

