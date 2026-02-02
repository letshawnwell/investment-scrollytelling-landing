'use client';

import { useEffect, useState } from "react";

const tags = ["前瞻", "專業", "可信", "掌握趨勢"];
const tagsEn = ["Foresight", "Expertise", "Trustworthy", "Trend Mastery"];

export default function CircleTaglines() {
  const [active, setActive] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % tags.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY < 50);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex flex-col items-center justify-center px-6 text-center">
      {tags.map((tag, idx) => {
        const isActive = idx === active;
        return (
          <div
            key={tag}
            className="absolute flex flex-col items-center gap-2"
            style={{
              transition: "opacity 0.8s ease, transform 0.8s ease",
              opacity: isActive ? 1 : 0,
              transform: isActive
                ? "translateY(0) scale(1)"
                : "translateY(12px) scale(0.96)"
            }}
          >
            <span className="text-3xl font-semibold tracking-[0.2em] text-white/90 md:text-4xl">
              {tag}
            </span>
            <span className="text-sm uppercase tracking-[0.3em] text-white/70 md:text-base">
              {tagsEn[idx]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
