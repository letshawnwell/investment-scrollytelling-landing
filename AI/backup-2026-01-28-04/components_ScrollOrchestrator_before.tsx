'use client';

import { MutableRefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ScrollOrchestratorProps = {
  scrollRef: MutableRefObject<number>;
};

// 僅在瀏覽器端註冊 ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollOrchestrator({
  scrollRef
}: ScrollOrchestratorProps) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-based background color transition
      gsap.to(document.body, {
        backgroundColor: "#0a192f",
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });

      // Global scroll progress feeding into 3D scene
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollRef.current = self.progress;
        }
      });
    });

    return () => {
      // 交給 gsap.context 自己清除這個 effect 中建立的 ScrollTriggers
      ctx.revert();
    };
  }, [scrollRef]);

  return null;
}

